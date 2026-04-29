import { create } from 'zustand';

interface UIStore {
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,

  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
    })),

  openCart: () =>
    set(() => ({
      isCartOpen: true,
    })),

  closeCart: () =>
    set(() => ({
      isCartOpen: false,
    })),
}));
