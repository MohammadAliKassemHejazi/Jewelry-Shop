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

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreateRequest {
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>('/orders');
    return response.data.data || [];
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  async createOrder(order: OrderCreateRequest): Promise<Order | null> {
    try {
      const response = await api.post<ApiResponse<Order>>('/orders', order);
      return response.data.data || null;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
      return response.data.data || null;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async getUserOrders(): Promise<Order[]> {
    try {
      const response = await api.get<ApiResponse<Order[]>>('/orders/user/orders');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }
};

export default orderService;

