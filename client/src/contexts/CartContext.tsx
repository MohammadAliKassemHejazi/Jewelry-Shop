"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '@/services/api';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      // In a real app with auth, we should check if user is logged in
      // For now, we assume the API handles session/guest cart
      const cartData = await cartApi.get();
      if (cartData) {
        setItems(cartData.items || []);
        setCartCount(cartData.totalItems || 0);
        setCartTotal(cartData.totalAmount || 0);
      } else {
         // Reset if no cart returned (e.g. empty)
        setItems([]);
        setCartCount(0);
        setCartTotal(0);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Don't show toast on every mount failure (silent fail for guest usually)
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      await cartApi.addItem(productId, quantity);
      await refreshCart(); // Refresh state from server
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setIsLoading(true);
      await cartApi.removeItem(itemId);
      await refreshCart();
      toast.success('Product removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove product');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      if (quantity < 1) {
        await removeFromCart(itemId);
        return;
      }
      await cartApi.updateItem(itemId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await cartApi.clear();
      await refreshCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      cartCount,
      cartTotal,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
