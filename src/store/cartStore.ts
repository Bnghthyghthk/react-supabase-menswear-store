import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string, size: string, color: string) => boolean;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product: Product, quantity: number, size: string, color: string) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { items: updatedItems };
      }

      const newItem: CartItem = {
        product,
        quantity,
        size,
        color,
      };

      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (productId: string, size: string, color: string) => {
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.size === size &&
            item.color === color
          )
      ),
    }));
  },

  updateQuantity: (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId, size, color);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.product._id === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  isInCart: (productId: string, size: string, color: string) => {
    return get().items.some(
      (item) =>
        item.product._id === productId &&
        item.size === size &&
        item.color === color
    );
  },
}));