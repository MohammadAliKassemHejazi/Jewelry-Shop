// Product interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  subCategoryId?: string;
  stock: number;
  image: string;
  images?: string[];
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  materials?: string[];
  gemstones?: string[];
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
  onSale?: boolean;
  salePrice?: number;
  rating?: number;
  reviewCount?: number;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  subCategoryId?: string;
  stock: number;
  image: string;
  images?: string[];
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  materials?: string[];
  gemstones?: string[];
  featured?: boolean;
  onSale?: boolean;
  salePrice?: number;
}

// User interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  role?: string;
  isAdmin?: boolean;
  avatar?: string;
  address?: Address;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Order interfaces
export interface OrderItem {
  productId: string;
  product: Product;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateRequest {
  customerName: string;
  customerEmail: string;
  items: Omit<OrderItem, 'product'>[];
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  notes?: string;
}

// Article interfaces
export interface Article {
  id: string;
  title: string;
  text: string;
  excerpt?: string;
  author: User;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  likeCount?: number;
}

export interface ArticleCreateRequest {
  title: string;
  text: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  published?: boolean;
}

// Category interfaces
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

// Cart interfaces
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// Testimonial interfaces
export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  image?: string;
  location?: string;
  verified: boolean;
  createdAt: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  };
}

// Dashboard interfaces
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  topProducts: Product[];
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}

// Search and filter interfaces
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  gemstones?: string[];
  onSale?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}
