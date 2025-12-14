import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data.data || [];
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async createProduct(product: ProductCreateRequest): Promise<Product | null> {
    try {
      const response = await api.post<ApiResponse<Product>>('/products', product);
      return response.data.data || null;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, updates: Partial<ProductCreateRequest>): Promise<Product | null> {
    try {
      const response = await api.put<ApiResponse<Product>>(`/products/${id}`, updates);
      return response.data.data || null;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

export default productService;

