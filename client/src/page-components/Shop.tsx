"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import ProductCard from "@/components/ProductCard";
import EnhancedProductCard from "@/components/EnhancedProductCard";
import { productsApi, categoriesApi } from "@/services/api";
import { Product, Category, ProductFilters } from "@/types";
import { Search, Filter, Grid, List } from "lucide-react";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fallback dummy data
  const dummyProducts: Product[] = [
    {
      id: "1",
      name: "Rose Gold Diamond Ring",
      description: "Elegant rose gold ring with brilliant diamond",
      price: 1299,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
      category: "Rings",
      stock: 10,
      materials: ["Rose Gold", "Diamond"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Pearl Drop Earrings",
      description: "Classic pearl drop earrings for any occasion",
      price: 299,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
      category: "Earrings",
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
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
      category: "Necklaces",
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
      image: "https://images.unsplash.com/photo-1617038220319-276d7f6b5b5e?w=400",
      category: "Bracelets",
      stock: 5,
      materials: ["White Gold", "Diamond"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "5",
      name: "Emerald Engagement Ring",
      description: "Stunning emerald engagement ring",
      price: 2299,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
      category: "Rings",
      stock: 3,
      materials: ["Platinum", "Emerald"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "6",
      name: "Sapphire Stud Earrings",
      description: "Beautiful sapphire stud earrings",
      price: 799,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
      category: "Earrings",
      stock: 12,
      materials: ["White Gold", "Sapphire"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const dummyCategories: Category[] = [
    { id: "1", name: "Rings", description: "Beautiful rings for every occasion", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "2", name: "Earrings", description: "Elegant earrings to complement your style", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "3", name: "Necklaces", description: "Stunning necklaces for any outfit", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "4", name: "Bracelets", description: "Charming bracelets to complete your look", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories and products in parallel
        const [categoriesResponse, productsResponse] = await Promise.allSettled([
          categoriesApi.getAll(),
          productsApi.getAll({ 
            category: selectedCategory === "all" ? undefined : selectedCategory,
            search: searchTerm || undefined,
            sortBy: sortBy as any,
            sortOrder
          }, currentPage, 12)
        ]);

        // Handle categories response
        if (categoriesResponse.status === 'fulfilled') {
          setCategories(categoriesResponse.value);
        } else {
          console.warn('Failed to fetch categories, using dummy data:', categoriesResponse.reason);
          setCategories(dummyCategories);
        }

        // Handle products response
        if (productsResponse.status === 'fulfilled') {
          setProducts(productsResponse.value.data);
          setTotalPages(productsResponse.value.pagination.totalPages);
        } else {
          console.warn('Failed to fetch products, using dummy data:', productsResponse.reason);
          setProducts(dummyProducts);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products');
        setProducts(dummyProducts);
        setCategories(dummyCategories);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchTerm, sortBy, sortOrder, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    const [sort, order] = value.split('-');
    setSortBy(sort);
    setSortOrder(order as "asc" | "desc");
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== "all" && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-lightgrey py-8">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Collection
            </h1>
            <p className="font-poppins text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of exquisite jewelry pieces, each crafted with precision and passion
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-playfair text-xl font-semibold">Filters</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? 'Hide' : 'Show'}
                  </Button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Search */}
                  <div>
                    <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name.toLowerCase()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                        <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                        <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                        <SelectItem value="createdAt-desc">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="font-poppins text-gray-600">
                  {loading ? 'Loading...' : `${filteredProducts.length} products found`}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <p className="text-gray-600">Showing sample products below</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found matching your criteria</p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {filteredProducts.map((product, index) => (
                  <AnimatedSection key={product.id} delay={index * 100}>
                    {viewMode === "grid" ? (
                      <EnhancedProductCard product={product} />
                    ) : (
                      <ProductCard product={product} viewMode={viewMode} />
                    )}
                  </AnimatedSection>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;