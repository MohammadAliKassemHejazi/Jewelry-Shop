import httpClient from '@/utils/httpClient';
import { 
  Product, 
  ProductCreateRequest, 
  Order, 
  OrderCreateRequest, 
  Article, 
  ArticleCreateRequest,
  Category,
  SubCategory,
  Testimonial,
  User,
  DashboardStats,
  ProductFilters,
  ApiResponse,
  PaginatedResponse
} from '@/types';

// Products API
export const productsApi = {
  // Get all products with filters and pagination
  getAll: async (filters?: ProductFilters, page = 1, limit = 12): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.subcategory && { subcategory: filters.subcategory }),
      ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
      ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      ...(filters?.materials && { materials: filters.materials.join(',') }),
      ...(filters?.gemstones && { gemstones: filters.gemstones.join(',') }),
      ...(filters?.onSale && { onSale: filters.onSale.toString() }),
      ...(filters?.featured && { featured: filters.featured.toString() }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
    });

    const response = await httpClient.get(`/api/products?${params}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get featured products
  getFeatured: async (limit = 6): Promise<Product[]> => {
    const response = await httpClient.get(`/api/products/featured?limit=${limit}`);
    return response.data.data || [];
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await httpClient.get(`/api/products/${id}`);
    return response.data.data;
  },

  // Create product (admin only)
  create: async (product: ProductCreateRequest): Promise<Product> => {
    const response = await httpClient.post('/api/products', product);
    return response.data.data;
  },

  // Update product (admin only)
  update: async (id: string, product: Partial<ProductCreateRequest>): Promise<Product> => {
    const response = await httpClient.put(`/api/products/${id}`, product);
    return response.data.data;
  },

  // Delete product (admin only)
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/products/${id}`);
  },

  // Get products by category
  getByCategory: async (category: string, limit = 12): Promise<Product[]> => {
    const response = await httpClient.get(`/api/products/category/${category}?limit=${limit}`);
    return response.data.data || [];
  },

  // Search products
  search: async (query: string, filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams({
      q: query,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
      ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
    });

    const response = await httpClient.get(`/api/products/search?${params}`);
    return response.data.data || [];
  },
};

// Orders API
export const ordersApi = {
  // Get all orders (admin only)
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Order>> => {
    const response = await httpClient.get(`/api/orders/admin/all?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get user orders
  getUserOrders: async (): Promise<Order[]> => {
    const response = await httpClient.get('/api/orders');
    return response.data.data || [];
  },

  // Get order by ID
  getById: async (id: string): Promise<Order> => {
    const response = await httpClient.get(`/api/orders/${id}`);
    return response.data.data;
  },

  // Create order
  create: async (order: OrderCreateRequest): Promise<Order> => {
    const response = await httpClient.post('/api/orders', order);
    return response.data.data;
  },

  // Update order status (admin only)
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await httpClient.put(`/api/orders/${id}/status`, { status });
    return response.data.data;
  },

  // Cancel order
  cancel: async (id: string): Promise<Order> => {
    const response = await httpClient.put(`/api/orders/${id}/cancel`);
    return response.data.data;
  },
};

// Articles API
export const articlesApi = {
  // Get all articles
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Article>> => {
    const response = await httpClient.get(`/api/articles?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get published articles
  getPublished: async (page = 1, limit = 10): Promise<PaginatedResponse<Article>> => {
    const response = await httpClient.get(`/api/articles/published?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get article by ID
  getById: async (id: string): Promise<Article> => {
    const response = await httpClient.get(`/api/articles/${id}`);
    return response.data.data;
  },

  // Get articles by author
  getByAuthor: async (): Promise<Article[]> => {
    const response = await httpClient.get('/api/articles/author');
    return response.data.data || [];
  },

  // Create article
  create: async (article: ArticleCreateRequest): Promise<Article> => {
    const response = await httpClient.post('/api/articles', article);
    return response.data.data;
  },

  // Update article
  update: async (id: string, article: Partial<ArticleCreateRequest>): Promise<Article> => {
    const response = await httpClient.put(`/api/articles/${id}`, article);
    return response.data.data;
  },

  // Delete article
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/articles/${id}`);
  },

  // Search articles
  search: async (query: string): Promise<Article[]> => {
    const response = await httpClient.get(`/api/articles/search?q=${encodeURIComponent(query)}`);
    return response.data.data || [];
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await httpClient.get('/api/categories');
    return response.data.data || [];
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await httpClient.get(`/api/categories/${id}`);
    return response.data.data;
  },

  // Get category tree
  getTree: async (): Promise<Category[]> => {
    const response = await httpClient.get('/api/categories/tree');
    return response.data.data || [];
  },

  // Create category (admin only)
  create: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    const response = await httpClient.post('/api/categories', category);
    return response.data.data;
  },

  // Update category (admin only)
  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await httpClient.put(`/api/categories/${id}`, category);
    return response.data.data;
  },

  // Delete category (admin only)
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/categories/${id}`);
  },
};

// Cart API
export const cartApi = {
  // Get user cart
  get: async (): Promise<any> => {
    const response = await httpClient.get('/api/cart');
    return response.data.data;
  },

  // Add item to cart
  addItem: async (productId: string, quantity: number): Promise<any> => {
    const response = await httpClient.post('/api/cart/add', { productId, quantity });
    return response.data.data;
  },

  // Update cart item quantity
  updateItem: async (itemId: string, quantity: number): Promise<any> => {
    const response = await httpClient.put(`/api/cart/items/${itemId}`, { quantity });
    return response.data.data;
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<any> => {
    const response = await httpClient.delete(`/api/cart/items/${itemId}`);
    return response.data.data;
  },

  // Clear cart
  clear: async (): Promise<void> => {
    await httpClient.delete('/api/cart/clear');
  },

  // Get cart item count
  getItemCount: async (): Promise<number> => {
    const response = await httpClient.get('/api/cart/count');
    return response.data.data.count;
  },
};

// Payment API
export const paymentApi = {
  // Create payment intent
  createIntent: async (orderId: string, amount: number, paymentMethod: string): Promise<any> => {
    const response = await httpClient.post('/api/payments/create-intent', {
      orderId,
      amount,
      paymentMethod,
    });
    return response.data.data;
  },

  // Confirm payment
  confirm: async (paymentIntentId: string): Promise<any> => {
    const response = await httpClient.post('/api/payments/confirm', { paymentIntentId });
    return response.data.data;
  },

  // Get payment status
  getStatus: async (paymentId: string): Promise<any> => {
    const response = await httpClient.get(`/api/payments/${paymentId}`);
    return response.data.data;
  },

  // Refund payment
  refund: async (paymentId: string, amount?: number, reason?: string): Promise<any> => {
    const response = await httpClient.post('/api/payments/refund', {
      paymentId,
      amount,
      reason,
    });
    return response.data.data;
  },

  // Get payment history
  getHistory: async (page = 1, limit = 10): Promise<any> => {
    const response = await httpClient.get(`/api/payments/history?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },
};

// Admin API
export const adminApi = {
  // Get dashboard stats (admin only)
  getStats: async (period = "30d"): Promise<DashboardStats> => {
    const response = await httpClient.get(`/api/admin/dashboard/stats?period=${period}`);
    return response.data.data;
  },

  // Get all users (admin only)
  getUsers: async (page = 1, limit = 20, filters?: any): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.role && { role: filters.role }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
    });

    const response = await httpClient.get(`/api/admin/users?${params}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get user by ID (admin only)
  getUserById: async (id: string): Promise<User> => {
    const response = await httpClient.get(`/api/admin/users/${id}`);
    return response.data.data;
  },

  // Update user role (admin only)
  updateUserRole: async (id: string, role: string): Promise<User> => {
    const response = await httpClient.put(`/api/admin/users/${id}/role`, { role });
    return response.data.data;
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/admin/users/${id}`);
  },

  // Toggle user status (admin only)
  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await httpClient.put(`/api/admin/users/${id}/toggle-status`);
    return response.data.data;
  },

  // Get recent activity (admin only)
  getRecentActivity: async (limit = 20): Promise<any[]> => {
    const response = await httpClient.get(`/api/admin/activity?limit=${limit}`);
    return response.data.data || [];
  },

  // Get sales report (admin only)
  getSalesReport: async (startDate?: string, endDate?: string, groupBy = "day"): Promise<any[]> => {
    const params = new URLSearchParams({
      groupBy,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const response = await httpClient.get(`/api/admin/reports/sales?${params}`);
    return response.data.data || [];
  },

  // Get top products (admin only)
  getTopProducts: async (limit = 10): Promise<any[]> => {
    const response = await httpClient.get(`/api/admin/products/top?limit=${limit}`);
    return response.data.data || [];
  },
};

// Users API
export const usersApi = {
  // Get all users (admin only)
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<User>> => {
    const response = await httpClient.get(`/api/users?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await httpClient.get(`/api/users/${id}`);
    return response.data.data;
  },

  // Update user
  update: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await httpClient.put(`/api/users/${id}`, user);
    return response.data.data;
  },

  // Delete user (admin only)
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/users/${id}`);
  },
};

// Testimonials API
export const testimonialsApi = {
  getVerified: async (limit = 3): Promise<Testimonial[]> => {
    const response = await httpClient.get(`/api/testimonials/verified?limit=${limit}`);
    return response.data.data || [];
  },

  create: async (testimonial: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await httpClient.post('/api/testimonials', testimonial);
    return response.data.data;
  },
};

// Newsletter API
export const newsletterApi = {
  subscribe: async (email: string): Promise<any> => {
    const response = await httpClient.post('/api/newsletter/subscribe', { email });
    return response.data;
  },

  unsubscribe: async (email: string): Promise<any> => {
    const response = await httpClient.post('/api/newsletter/unsubscribe', { email });
    return response.data;
  },
};

// Favorites API
export const favoritesApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await httpClient.get('/api/favorites');
    return response.data.data || [];
  },

  add: async (productId: string): Promise<any> => {
    const response = await httpClient.post('/api/favorites', { productId });
    return response.data;
  },

  remove: async (productId: string): Promise<any> => {
    const response = await httpClient.delete(`/api/favorites/${productId}`);
    return response.data;
  },

  clear: async (): Promise<any> => {
    const response = await httpClient.delete('/api/favorites');
    return response.data;
  },
};
