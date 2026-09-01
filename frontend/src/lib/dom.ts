/**
 * Vérifie si le code s'exécute côté client
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

// ============ SCROLL ============

export const scrollToElement = (
  element: string | HTMLElement,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
): void => {
  if (!isClient()) return;

  const el = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;

  if (el) {
    el.scrollIntoView(options);
  }
};

export const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  if (!isClient()) return;
  window.scrollTo({ top: 0, behavior });
};

export const scrollToBottom = (behavior: ScrollBehavior = 'smooth'): void => {
  if (!isClient()) return;
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
};

export const getScrollPosition = (): { x: number; y: number } => {
  if (!isClient()) return { x: 0, y: 0 };
  return {
    x: window.scrollX,
    y: window.scrollY,
  };
};

export const isElementVisible = (
  element: HTMLElement,
  partially: boolean = false
): boolean => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;

  if (partially) {
    return (
      rect.bottom > 0 &&
      rect.top < viewHeight &&
      rect.right > 0 &&
      rect.left < viewWidth
    );
  }

  return (
    rect.top >= 0 &&
    rect.bottom <= viewHeight &&
    rect.left >= 0 &&
    rect.right <= viewWidth
  );
};

// ============ CLIPBOARD ============

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!isClient()) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
};

export const copyHTMLToClipboard = async (html: string): Promise<boolean> => {
  if (!isClient()) return false;

  try {
    const blob = new Blob([html], { type: 'text/html' });
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([html.replace(/<[^>]*>/g, '')], { type: 'text/plain' }),
      }),
    ]);
    return true;
  } catch {
    return false;
  }
};

export const readFromClipboard = async (): Promise<string> => {
  if (!isClient()) return '';
  try {
    return await navigator.clipboard.readText();
  } catch {
    return '';
  }
};

// ============ ELEMENT ============

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes?: Record<string, string>,
  children?: (HTMLElement | string)[]
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  if (children) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }
  return element;
};

export const removeElement = (element: HTMLElement): void => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

export const replaceElement = (oldElement: HTMLElement, newElement: HTMLElement): void => {
  if (oldElement && oldElement.parentNode) {
    oldElement.parentNode.replaceChild(newElement, oldElement);
  }
};

// ============ CLASSES ============

export const addClass = (element: HTMLElement, className: string): void => {
  if (element) {
    element.classList.add(className);
  }
};

export const removeClass = (element: HTMLElement, className: string): void => {
  if (element) {
    element.classList.remove(className);
  }
};

export const toggleClass = (element: HTMLElement, className: string): void => {
  if (element) {
    element.classList.toggle(className);
  }
};

export const hasClass = (element: HTMLElement, className: string): boolean => {
  if (!element) return false;
  return element.classList.contains(className);
};

// ============ DIMENSIONS ============

export const getElementDimensions = (element: HTMLElement): {
  width: number;
  height: number;
  top: number;
  left: number;
} => {
  if (!element) return { width: 0, height: 0, top: 0, left: 0 };
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
  };
};

export const isElementOverflowing = (element: HTMLElement): boolean => {
  if (!element) return false;
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
};

// ============ EVENTS ============

export const addEventListener = (
  element: HTMLElement | Window | Document,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): void => {
  if (element) {
    element.addEventListener(event, handler, options);
  }
};

export const removeEventListener = (
  element: HTMLElement | Window | Document,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions
): void => {
  if (element) {
    element.removeEventListener(event, handler, options);
  }
};

export const onDOMReady = (callback: () => void): void => {
  if (typeof document === 'undefined') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

export const onPageLoad = (callback: () => void): void => {
  if (typeof window === 'undefined') return;

  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
};

// ============ MEDIA ============

export const matchMedia = (query: string): boolean => {
  if (!isClient()) return false;
  return window.matchMedia(query).matches;
};

export const addMediaListener = (
  query: string,
  callback: (matches: boolean) => void
): (() => void) => {
  if (!isClient()) return () => {};

  const media = window.matchMedia(query);
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  media.addEventListener('change', handler);
  
  callback(media.matches);

  return () => media.removeEventListener('change', handler);
};

// ============ VIEWPORT ============

export const getViewportSize = (): { width: number; height: number } => {
  if (!isClient()) return { width: 0, height: 0 };
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
};

export const isMobile = (): boolean => {
  if (!isClient()) return false;
  return window.innerWidth < 768;
};

export const isTablet = (): boolean => {
  if (!isClient()) return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = (): boolean => {
  if (!isClient()) return false;
  return window.innerWidth >= 1024;
};

// ============ FOCUS ============

export const focusElement = (element: HTMLElement | string): void => {
  if (!isClient()) return;

  const el = typeof element === 'string'
    ? document.querySelector<HTMLElement>(element)
    : element;

  if (el) {
    el.focus();
  }
};

export const focusFirstError = (container: HTMLElement): void => {
  if (!isClient() || !container) return;

  const errorElement = container.querySelector('[data-error]') as HTMLElement;
  if (errorElement) {
    errorElement.focus();
  }
};

// ============ EXPORT ============

export default {
  isClient,
  scrollToElement,
  scrollToTop,
  scrollToBottom,
  getScrollPosition,
  isElementVisible,
  copyToClipboard,
  copyHTMLToClipboard,
  readFromClipboard,
  createElement,
  removeElement,
  replaceElement,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  getElementDimensions,
  isElementOverflowing,
  addEventListener,
  removeEventListener,
  onDOMReady,
  onPageLoad,
  matchMedia,
  addMediaListener,
  getViewportSize,
  isMobile,
  isTablet,
  isDesktop,
  focusElement,
  focusFirstError,
};