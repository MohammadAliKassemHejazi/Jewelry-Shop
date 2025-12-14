import { Op } from "sequelize";
import db from "../models";
import { CustomError } from "../utils/customError";
import { IProductAttributes } from "../interfaces/types/models/product.model.types";

interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  gemstones?: string[];
  onSale?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ProductsService {
  // Get all products with filters and pagination
  async getAllProducts(filters: ProductFilters, page: number = 1, limit: number = 12): Promise<PaginatedResult<IProductAttributes>> {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = { isActive: true };

      // Apply filters
      if (filters.category) {
        whereClause.categoryId = filters.category;
      }

      if (filters.subcategory) {
        whereClause.subcategoryId = filters.subcategory;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        whereClause.price = {};
        if (filters.minPrice !== undefined) {
          whereClause.price[Op.gte] = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          whereClause.price[Op.lte] = filters.maxPrice;
        }
      }

      if (filters.materials && filters.materials.length > 0) {
        whereClause.materials = {
          [Op.overlap]: filters.materials
        };
      }

      if (filters.gemstones && filters.gemstones.length > 0) {
        whereClause.gemstones = {
          [Op.overlap]: filters.gemstones
        };
      }

      if (filters.onSale !== undefined) {
        whereClause.onSale = filters.onSale;
      }

      if (filters.featured !== undefined) {
        whereClause.featured = filters.featured;
      }

      if (filters.search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${filters.search}%` } },
          { description: { [Op.iLike]: `%${filters.search}%` } },
          { tags: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      // Build order clause
      const orderClause: any[] = [];
      if (filters.sortBy) {
        const direction = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
        orderClause.push([filters.sortBy, direction]);
      } else {
        orderClause.push(['createdAt', 'DESC']);
      }

      const { count, rows } = await db.Product.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: db.Category,
            as: 'category',
            attributes: ['id', 'name']
          },
          {
            model: db.SubCategory,
            as: 'subcategory',
            attributes: ['id', 'name']
          },
          {
            model: db.ProductImage,
            as: 'productImages',
            attributes: ['id', 'imageUrl', 'isPrimary']
          }
        ],
        order: orderClause,
        limit,
        offset,
        distinct: true
      });

      const totalPages = Math.ceil(count / limit);

      return {
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages
        }
      };
    } catch (error) {
      throw new CustomError("Failed to fetch products", "FETCH_PRODUCTS_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 6): Promise<IProductAttributes[]> {
    try {
      const products = await db.Product.findAll({
        where: {
          isActive: true,
          featured: true
        },
        include: [
          {
            model: db.Category,
            as: 'category',
            attributes: ['id', 'name']
          },
          {
            model: db.SubCategory,
            as: 'subcategory',
            attributes: ['id', 'name']
          },
          {
            model: db.ProductImage,
            as: 'productImages',
            attributes: ['id', 'imageUrl', 'isPrimary']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit
      });

      return products;
    } catch (error) {
      throw new CustomError("Failed to fetch featured products", "FETCH_FEATURED_PRODUCTS_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<IProductAttributes | null> {
    try {
      const product = await db.Product.findOne({
        where: { id, isActive: true },
        include: [
          {
            model: db.Category,
            as: 'category',
            attributes: ['id', 'name']
          },
          {
            model: db.SubCategory,
            as: 'subcategory',
            attributes: ['id', 'name']
          },
          {
            model: db.ProductImage,
            as: 'productImages',
            attributes: ['id', 'imageUrl', 'isPrimary']
          },
          {
            model: db.SizeItem,
            as: 'sizes',
            attributes: ['id', 'size', 'price', 'stock']
          }
        ]
      });

      return product;
    } catch (error) {
      throw new CustomError("Failed to fetch product", "FETCH_PRODUCT_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Create product
  async createProduct(productData: Partial<IProductAttributes>): Promise<IProductAttributes> {
    try {
      // Generate SKU if not provided
      if (!productData.sku) {
        productData.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      const product = await db.Product.create(productData as any);

      return product;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        throw new CustomError("Product with this SKU already exists", "DUPLICATE_SKU", 400);
      }
      throw new CustomError("Failed to create product", "CREATE_PRODUCT_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Update product
  async updateProduct(id: string, updateData: Partial<IProductAttributes>): Promise<IProductAttributes> {
    try {
      const product = await db.Product.findByPk(id);
      
      if (!product) {
        throw new CustomError("Product not found", "PRODUCT_NOT_FOUND", 404);
      }

      await product.update(updateData);
      
      return product;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update product", "UPDATE_PRODUCT_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      const product = await db.Product.findByPk(id);
      
      if (!product) {
        throw new CustomError("Product not found", "PRODUCT_NOT_FOUND", 404);
      }

      // Soft delete by setting isActive to false
      await product.update({ isActive: false });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete product", "DELETE_PRODUCT_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId: string, limit: number = 12): Promise<IProductAttributes[]> {
    try {
      const products = await db.Product.findAll({
        where: {
          categoryId,
          isActive: true
        },
        include: [
          {
            model: db.Category,
            as: 'category',
            attributes: ['id', 'name']
          },
          {
            model: db.SubCategory,
            as: 'subcategory',
            attributes: ['id', 'name']
          },
          {
            model: db.ProductImage,
            as: 'productImages',
            attributes: ['id', 'imageUrl', 'isPrimary']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit
      });

      return products;
    } catch (error) {
      throw new CustomError("Failed to fetch products by category", "FETCH_PRODUCTS_BY_CATEGORY_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Search products
  async searchProducts(filters: ProductFilters): Promise<IProductAttributes[]> {
    try {
      const whereClause: any = { isActive: true };

      if (filters.search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${filters.search}%` } },
          { description: { [Op.iLike]: `%${filters.search}%` } },
          { tags: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      if (filters.category) {
        whereClause.categoryId = filters.category;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        whereClause.price = {};
        if (filters.minPrice !== undefined) {
          whereClause.price[Op.gte] = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          whereClause.price[Op.lte] = filters.maxPrice;
        }
      }

      const orderClause: any[] = [];
      if (filters.sortBy) {
        const direction = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
        orderClause.push([filters.sortBy, direction]);
      } else {
        orderClause.push(['createdAt', 'DESC']);
      }

      const products = await db.Product.findAll({
        where: whereClause,
        include: [
          {
            model: db.Category,
            as: 'category',
            attributes: ['id', 'name']
          },
          {
            model: db.SubCategory,
            as: 'subcategory',
            attributes: ['id', 'name']
          },
          {
            model: db.ProductImage,
            as: 'productImages',
            attributes: ['id', 'imageUrl', 'isPrimary']
          }
        ],
        order: orderClause,
        limit: 50 // Limit search results
      });

      return products;
    } catch (error) {
      throw new CustomError("Failed to search products", "SEARCH_PRODUCTS_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get product statistics
  async getProductStats(): Promise<any> {
    try {
      const totalProducts = await db.Product.count({ where: { isActive: true } });
      const featuredProducts = await db.Product.count({ where: { isActive: true, featured: true } });
      const onSaleProducts = await db.Product.count({ where: { isActive: true, onSale: true } });
      const lowStockProducts = await db.Product.count({ where: { isActive: true, stock: { [Op.lt]: 10 } } });

      return {
        totalProducts,
        featuredProducts,
        onSaleProducts,
        lowStockProducts
      };
    } catch (error) {
      throw new CustomError("Failed to fetch product statistics", "FETCH_PRODUCT_STATS_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }
}

export const productsService = new ProductsService();
