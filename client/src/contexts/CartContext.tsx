"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Product } from '@/types';

interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart', []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          addedAt: new Date().toISOString(),
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const getCartItem = (productId: string) => {
    return items.find(item => item.productId === productId);
  };

  const value: CartContextType = {
    items,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
