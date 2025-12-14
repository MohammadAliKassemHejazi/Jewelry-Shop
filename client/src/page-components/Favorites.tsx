"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import Link from 'next/link';

const Favorites: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h1>
          <p className="text-gray-600 mb-8">Start adding items to your favorites</p>
          <Link href="/shop">
            <Button>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">{favorites.length} item{favorites.length !== 1 ? 's' : ''} in your favorites</p>
        </div>
        <Button variant="outline" onClick={clearFavorites}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <EnhancedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
