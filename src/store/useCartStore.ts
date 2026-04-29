import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  size: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: Omit<CartItem, 'quantity'>) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id && i.size === item.size);

          if (existingItem) {
            // 同商品同尺寸，增加數量
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          } else {
            // 新增商品或同商品不同尺寸，數量預設為 1
            return {
              items: [...state.items, { ...item, quantity: 1 }],
            };
          }
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set(() => ({
          items: [],
        }));
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      version: 1,
    }
  )
);
