import { Product, Category, Order, User } from '@/types';

// Mock data for offline functionality
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Diamond Engagement Ring',
    description: 'A timeless diamond engagement ring featuring a brilliant cut center stone set in 18k white gold.',
    price: 2500.00,
    category: 'Rings',
    subcategory: 'Engagement Rings',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
    ],
    sku: 'RING-001',
    weight: 2.5,
    dimensions: { length: 1.8, width: 1.8, height: 0.8 },
    materials: ['18k White Gold', 'Diamond'],
    gemstones: ['Diamond'],
    featured: true,
    onSale: false,
    rating: 4.8,
    reviewCount: 24,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Pearl Drop Earrings',
    description: 'Elegant pearl drop earrings perfect for special occasions.',
    price: 450.00,
    category: 'Earrings',
    subcategory: 'Pearl Earrings',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'
    ],
    sku: 'EARR-001',
    weight: 1.2,
    dimensions: { length: 2.5, width: 0.8, height: 0.8 },
    materials: ['14k Gold', 'Pearl'],
    gemstones: ['Pearl'],
    featured: true,
    onSale: true,
    salePrice: 380.00,
    rating: 4.6,
    reviewCount: 18,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    name: 'Diamond Tennis Bracelet',
    description: 'Sparkling diamond tennis bracelet with brilliant cut diamonds.',
    price: 1800.00,
    category: 'Bracelets',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'
    ],
    sku: 'BRAC-001',
    weight: 3.2,
    dimensions: { length: 7.0, width: 0.5, height: 0.3 },
    materials: ['14k White Gold', 'Diamond'],
    gemstones: ['Diamond'],
    featured: false,
    onSale: false,
    rating: 4.7,
    reviewCount: 31,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    name: 'Emerald Pendant Necklace',
    description: 'Stunning emerald pendant necklace set in 18k yellow gold.',
    price: 1200.00,
    category: 'Necklaces',
    subcategory: 'Diamond Necklaces',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
    ],
    sku: 'NECK-001',
    weight: 4.1,
    dimensions: { length: 2.2, width: 1.5, height: 0.6 },
    materials: ['18k Yellow Gold', 'Emerald'],
    gemstones: ['Emerald'],
    featured: true,
    onSale: false,
    rating: 4.9,
    reviewCount: 15,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    name: 'Wedding Band Set',
    description: 'Matching wedding band set for couples.',
    price: 800.00,
    category: 'Rings',
    subcategory: 'Wedding Rings',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'
    ],
    sku: 'WED-001',
    weight: 2.8,
    dimensions: { length: 1.5, width: 1.5, height: 0.4 },
    materials: ['14k White Gold'],
    gemstones: [],
    featured: false,
    onSale: true,
    salePrice: 650.00,
    rating: 4.5,
    reviewCount: 42,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Rings',
    description: 'Beautiful rings for every occasion',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Necklaces',
    description: 'Elegant necklaces and pendants',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'Earrings',
    description: 'Stunning earrings for all styles',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '4',
    name: 'Bracelets',
    description: 'Charming bracelets and bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  }
];

export const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo',
  surname: 'User',
  phone: '+1234567890',
  role: 'user',
  isAdmin: false,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  },
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z'
};

// Mock API functions for offline functionality
export const mockApi = {
  // Simulate API delay
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Products
  getProducts: async (filters?: any) => {
    await mockApi.delay();
    let products = [...mockProducts];
    
    if (filters?.search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters?.featured) {
      products = products.filter(p => p.featured);
    }
    
    if (filters?.onSale) {
      products = products.filter(p => p.onSale);
    }
    
    return {
      data: products,
      pagination: {
        page: 1,
        limit: 12,
        total: products.length,
        totalPages: 1
      }
    };
  },

  getProductById: async (id: string) => {
    await mockApi.delay();
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return { data: product };
  },

  getFeaturedProducts: async () => {
    await mockApi.delay();
    const featured = mockProducts.filter(p => p.featured);
    return { data: featured };
  },

  // Categories
  getCategories: async () => {
    await mockApi.delay();
    return { data: mockCategories };
  },

  // User
  getCurrentUser: async () => {
    await mockApi.delay();
    return { data: mockUser };
  },

  // Auth
  login: async (email: string, password: string) => {
    await mockApi.delay();
    if (email === 'admin@samahjewelry.com' && password === 'admin123') {
      return {
        success: true,
        data: {
          user: { ...mockUser, role: 'admin', isAdmin: true, email },
          accessToken: 'mock-jwt-token'
        }
      };
    }
    if (email === 'demo@example.com' && password === 'user123') {
      return {
        success: true,
        data: {
          user: mockUser,
          accessToken: 'mock-jwt-token'
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData: any) => {
    await mockApi.delay();
    return {
      success: true,
      data: {
        user: { ...mockUser, ...userData },
        accessToken: 'mock-jwt-token'
      }
    };
  }
};
