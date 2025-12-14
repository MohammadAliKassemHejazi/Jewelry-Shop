"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Search, Filter, Eye } from 'lucide-react';
import { productsApi, categoriesApi } from '@/services/api';
import { Product, ProductCreateRequest, Category } from '@/types';
import { toast } from 'sonner';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<ProductCreateRequest>>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    subCategoryId: '',
    stock: 0,
    image: '',
    images: [],
    sku: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    materials: [],
    gemstones: [],
    featured: false,
    onSale: false,
    salePrice: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll({}, 1, 100);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await productsApi.create(formData as ProductCreateRequest);
      toast.success('Product created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      await productsApi.update(editingProduct.id, formData);
      toast.success('Product updated successfully');
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productsApi.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      subCategoryId: '',
      stock: 0,
      image: '',
      images: [],
      sku: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      materials: [],
      gemstones: [],
      featured: false,
      onSale: false,
      salePrice: 0,
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      stock: product.stock,
      image: product.image,
      images: product.images || [],
      sku: product.sku || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
      materials: product.materials || [],
      gemstones: product.gemstones || [],
      featured: product.featured || false,
      onSale: product.onSale || false,
      salePrice: product.salePrice || 0,
    });
    setIsEditDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your catalog
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              formData={formData} 
              setFormData={setFormData} 
              categories={categories}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProduct}>
                Create Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Manage your product inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${product.price}</div>
                      {product.onSale && product.salePrice && (
                        <div className="text-sm text-green-600">Sale: ${product.salePrice}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                      {product.stock} in stock
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {product.featured && <Badge variant="outline">Featured</Badge>}
                      {product.onSale && <Badge variant="outline">On Sale</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            formData={formData} 
            setFormData={setFormData} 
            categories={categories}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Product Form Component
const ProductForm: React.FC<{
  formData: Partial<ProductCreateRequest>;
  setFormData: (data: Partial<ProductCreateRequest>) => void;
  categories: Category[];
}> = ({ formData, setFormData, categories }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku || ''}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Enter SKU"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock || 0}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (g)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight || 0}
            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId || ''}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured || false}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="onSale"
            checked={formData.onSale || false}
            onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="onSale">On Sale</Label>
        </div>
      </div>

      {formData.onSale && (
        <div>
          <Label htmlFor="salePrice">Sale Price</Label>
          <Input
            id="salePrice"
            type="number"
            value={formData.salePrice || 0}
            onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>
      )}
    </div>
  );
};

export default AdminProducts;