import { useUIStore } from "@/store";

export function useToast() {
  const { success, error, warning, info, addToast, removeToast, clearToasts } =
    useUIStore();

  return {
    success,
    error,
    warning,
    info,
    addToast,
    removeToast,
    clearToasts,
  };
}
