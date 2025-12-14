"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Product } from '@/types';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<Product[]>('favorites', []);

  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev; // Already in favorites
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some(p => p.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
