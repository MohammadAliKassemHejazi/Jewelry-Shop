"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AnimatedSection from "@/components/AnimatedSection";
import ProductCard from "@/components/ProductCard";
import ImageZoom from "@/components/ImageZoom";
import { productsApi } from "@/services/api";
import { Product } from "@/types";
import { ShoppingCart, Heart, Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fallback dummy data
  const dummyProduct: Product = {
    id: id || "1",
    name: "Rose Gold Diamond Ring",
    description: "Exquisite rose gold ring featuring a brilliant cut diamond. Crafted with precision and attention to detail, this piece represents timeless elegance and sophistication. The rose gold setting complements the diamond's natural brilliance, creating a stunning piece perfect for engagements or special occasions.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"
    ],
    categoryId: "Rings",
    stock: 10,
    materials: ["18K Rose Gold", "Diamond"],
    gemstones: ["Diamond (1.2 ct)"],
    featured: true,
    rating: 4.8,
    reviewCount: 24,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const dummyRelatedProducts: Product[] = [
    {
      id: "2",
      name: "Pearl Drop Earrings",
      description: "Classic pearl drop earrings for any occasion",
      price: 299,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300",
      categoryId: "Earrings",
      stock: 15,
      materials: ["Sterling Silver", "Pearl"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      name: "Elegant Gold Necklace",
      description: "Timeless gold necklace with intricate design",
      price: 899,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300",
      categoryId: "Necklaces",
      stock: 8,
      materials: ["Gold"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      name: "Diamond Tennis Bracelet",
      description: "Sparkling diamond tennis bracelet",
      price: 1599,
      image: "https://images.unsplash.com/photo-1617038220319-276d7f6b5b5e?w=300",
      categoryId: "Bracelets",
      stock: 5,
      materials: ["White Gold", "Diamond"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const [productResponse, relatedResponse] = await Promise.allSettled([
          productsApi.getById(id),
          productsApi.getByCategory("Rings", 4)
        ]);

        // Handle product response
        if (productResponse.status === 'fulfilled') {
          setProduct(productResponse.value);
        } else {
          console.warn('Failed to fetch product, using dummy data:', productResponse.reason);
          setProduct(dummyProduct);
        }

        // Handle related products response
        if (relatedResponse.status === 'fulfilled') {
          setRelatedProducts(relatedResponse.value.filter(p => p.id !== id));
        } else {
          console.warn('Failed to fetch related products, using dummy data:', relatedResponse.reason);
          setRelatedProducts(dummyRelatedProducts);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        setProduct(dummyProduct);
        setRelatedProducts(dummyRelatedProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // TODO: Implement add to cart functionality with Redux
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuantityChange = (change: number) => {
    if (!product) return;
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-200 h-96 rounded-lg"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-200 h-20 w-20 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                <div className="bg-gray-200 h-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOnSale = product.onSale && product.salePrice;
  const displayPrice = isOnSale ? product.salePrice! : product.price;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-lightgrey py-4">
        <AnimatedSection className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm font-poppins">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors duration-300">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/shop" className="text-gray-600 hover:text-primary transition-colors duration-300">Shop</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </AnimatedSection>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <AnimatedSection>
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <ImageZoom
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection delay={200}>
            <div className="space-y-6">
              <div>
                {product.categoryId && (
                  <Badge variant="outline" className="mb-2">
                    {product.categoryId}
                  </Badge>
                )}
                <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="font-poppins text-3xl font-bold text-gray-900">
                    ${displayPrice.toLocaleString()}
                  </span>
                  {isOnSale && (
                    <>
                      <span className="font-poppins text-xl text-gray-500 line-through">
                        ${product.price.toLocaleString()}
                      </span>
                      <Badge className="bg-red-500 text-white">
                        Save ${(product.price - displayPrice).toLocaleString()}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-poppins text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Specifications */}
                <div className="space-y-2">
                  <h3 className="font-playfair text-lg font-semibold text-gray-900">Specifications</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.materials && (
                      <div>
                        <span className="font-medium text-gray-700">Materials:</span>
                        <span className="text-gray-600 ml-2">{product.materials.join(', ')}</span>
                      </div>
                    )}
                    {product.gemstones && (
                      <div>
                        <span className="font-medium text-gray-700">Gemstones:</span>
                        <span className="text-gray-600 ml-2">{product.gemstones.join(', ')}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className="text-gray-600 ml-2">{product.stock} available</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">SKU:</span>
                      <span className="text-gray-600 ml-2">{product.sku || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-poppins font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          if (value >= 1 && value <= product.stock) {
                            setQuantity(value);
                          }
                        }}
                        className="w-16 h-8 text-center border-0 focus:ring-0"
                        min="1"
                        max={product.stock}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white font-poppins h-12"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleWishlist}
                      className="h-12 w-12 p-0"
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>2 Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    <span>30 Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <AnimatedSection delay={400} className="mt-16">
            <div className="text-center mb-8">
              <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
                You Might Also Like
              </h2>
              <p className="font-poppins text-gray-600">
                Discover more beautiful pieces from our collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <AnimatedSection key={relatedProduct.id} delay={index * 100}>
                  <ProductCard product={relatedProduct} />
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;