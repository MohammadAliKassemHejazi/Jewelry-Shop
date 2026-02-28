"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useFavorites } from '@/contexts/FavoritesContext';
import { cartApi } from '@/services/api';
import Link from 'next/link';
import { toast } from 'sonner';

interface EnhancedProductCardProps {
  product: Product;
  showQuickActions?: boolean;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({ 
  product, 
  showQuickActions = true 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await cartApi.addItem(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    const isFav = isFavorite(product.id);
    toast.success(isFav ? 'Added to favorites' : 'Removed from favorites');
  };

  const isFav = isFavorite(product.id);

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-transparent hover:border-primary/20 bg-white">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <Badge variant="default" className="text-xs">
                Featured
              </Badge>
            )}
            {product.onSale && product.salePrice && (
              <Badge variant="destructive" className="text-xs">
                Sale
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="secondary" className="text-xs">
                Low Stock
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="outline" className="text-xs bg-red-100 text-red-800">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 rounded-full"
                onClick={handleToggleFavorite}
              >
                <Heart 
                  className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 rounded-full"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.rating?.toFixed(1) || '4.5'}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.onSale && product.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {product.stock} in stock
            </div>
          </div>

          {/* Materials and Gemstones */}
          {(product.materials?.length || product.gemstones?.length) && (
            <div className="flex flex-wrap gap-1">
              {product.materials?.slice(0, 2).map((material, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {material}
                </Badge>
              ))}
              {product.gemstones?.slice(0, 2).map((gemstone, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {gemstone}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-none uppercase tracking-wider text-xs border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFavorite}
              className={`rounded-none border-gray-200 hover:border-primary transition-all duration-300 ${isFav ? 'text-primary border-primary' : 'text-gray-400 hover:text-primary'}`}
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-current text-primary' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedProductCard;
