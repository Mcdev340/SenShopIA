export interface MetaData {
  title: string;
  description: string;
  keywords?: string[];
  robots?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  alternateLanguages?: Record<string, string>;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternateLanguages?: Record<string, string>;
  images?: {
    url: string;
    title?: string;
    caption?: string;
  }[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface SeoConfig {
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  twitterHandle?: string;
  facebookAppId?: string;
  googleSiteVerification?: string;
  analyticsId?: string;
}

export interface SeoAnalysis {
  url: string;
  title: {
    value: string;
    length: number;
    issues: string[];
  };
  description: {
    value: string;
    length: number;
    issues: string[];
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    issues: string[];
  };
  images: {
    count: number;
    withAlt: number;
    withoutAlt: number;
    issues: string[];
  };
  keywords: {
    words: string[];
    density: number;
    issues: string[];
  };
  links: {
    internal: number;
    external: number;
    broken: number;
    issues: string[];
  };
  performance: {
    score: number;
    issues: string[];
  };
  mobile: {
    score: number;
    issues: string[];
  };
}

export interface RobotsConfig {
  userAgent: string[];
  disallow: string[];
  allow: string[];
  sitemap: string[];
  crawlDelay: number;
  rules: {
    userAgent: string;
    disallow: string[];
    allow: string[];
  }[];
}

export interface SEOOptimization {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  structure: {
    h1: string;
    h2: string[];
    h3: string[];
  };
  images: {
    url: string;
    alt: string;
    title?: string;
  }[];
  internalLinks: {
    url: string;
    text: string;
  }[];
  externalLinks: {
    url: string;
    text: string;
    rel?: string;
  }[];
  structuredData: StructuredData[];
}