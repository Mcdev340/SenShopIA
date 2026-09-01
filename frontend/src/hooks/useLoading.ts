import { useUIStore } from "@/store";

export function useLoading() {
  const {
    setGlobalLoading,
    setLoading,
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    isAnyLoading,
    clearLoadingStates,
  } = useUIStore();

  return {
    setGlobalLoading,
    setLoading,
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    isAnyLoading,
    clearLoadingStates,
  };
}
