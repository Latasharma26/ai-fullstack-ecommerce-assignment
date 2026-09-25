import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopai_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
    }
    return [];
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart to localStorage:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      return { success: false, message: `"${product.name}" is currently out of stock.` };
    }

    let result = { success: true, message: `Added ${product.name} to cart.` };

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const existingItem = prevCart[existingIndex];
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
          result = {
            success: false,
            message: `Cannot add more. Maximum available stock for "${product.name}" is ${product.stock}.`,
          };
          return prevCart;
        }

        const updated = [...prevCart];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        result = { success: true, message: `Updated quantity for ${product.name}.` };
        return updated;
      } else {
        if (quantity > product.stock) {
          result = {
            success: false,
            message: `Cannot add ${quantity} units. Only ${product.stock} units available.`,
          };
          return prevCart;
        }

        return [...prevCart, { product, quantity }];
      }
    });

    return result;
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            // Clamp between 1 and product.stock
            const clampedQuantity = Math.max(1, Math.min(quantity, item.product.stock));
            return { ...item, quantity: clampedQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
