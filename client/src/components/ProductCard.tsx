
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Product } from "@/types";
import { ShoppingCart, Heart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ product, viewMode = "grid" }: ProductCardProps) => {
  const isListMode = viewMode === "list";
  const isOnSale = product.onSale && product.salePrice;
  const displayPrice = isOnSale ? product.salePrice! : product.price;

  if (isListMode) {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {isOnSale && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
              {product.featured && (
                <Badge className="absolute top-2 right-2 bg-primary text-white">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  {product.categoryId && (
                    <p className="text-sm text-primary font-poppins font-medium mb-1 capitalize">
                      {product.categoryId}
                    </p>
                  )}
                  <h3 className="font-playfair text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="font-poppins text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-poppins text-lg font-bold text-gray-900">
                    ${displayPrice.toLocaleString()}
                  </p>
                  {isOnSale && (
                    <p className="font-poppins text-sm text-gray-500 line-through">
                      ${product.price.toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/product/${product.id}`}>View Details</Link>
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary-dark text-white">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 border-gray-200 overflow-hidden transform hover:-translate-y-2">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOnSale && (
              <Badge className="bg-red-500 text-white">
                Sale
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-primary text-white">
                Featured
              </Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          {product.categoryId && (
            <p className="text-sm text-primary font-poppins font-medium mb-2 capitalize transform group-hover:scale-105 transition-transform duration-300">
              {product.categoryId}
            </p>
          )}
          <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          
          <p className="font-poppins text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="font-poppins text-lg font-bold text-gray-900">
                ${displayPrice.toLocaleString()}
              </p>
              {isOnSale && (
                <p className="font-poppins text-sm text-gray-500 line-through">
                  ${product.price.toLocaleString()}
                </p>
              )}
            </div>
            
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <Button asChild className="w-full bg-primary hover:bg-primary-dark text-white font-poppins transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <Link href={`/product/${product.id}`}>View Details</Link>
            </Button>
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white font-poppins transform hover:scale-105 transition-all duration-300 hover:shadow-md">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
