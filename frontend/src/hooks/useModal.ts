import { useUIStore } from "@/store";

export function useModal() {
  const {
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    getModalData,
    getActiveModal,
  } = useUIStore();

  return {
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    getModalData,
    getActiveModal,
  };
}
