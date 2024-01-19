import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: Product;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const useCart = create<CartState>()(
  persist(
    set => ({
      items: [],
      addItem: product =>
        set(state => ({
          items: [...state.items, { product }],
        })),
      removeItem: productId =>
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
