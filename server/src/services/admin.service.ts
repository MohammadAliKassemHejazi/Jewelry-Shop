import { Op } from "sequelize";
import db from "../models";
import { CustomError } from "../utils/customError";

interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
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

export class AdminService {
  // Get dashboard statistics
  async getDashboardStats(period: string = "30d"): Promise<any> {
    try {
      const dateFilter = this.getDateFilter(period);
      
      const [
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers,
        pendingOrders,
        lowStockProducts,
        recentOrders,
        topProducts
      ] = await Promise.all([
        db.Order.count({ where: dateFilter }),
        this.getTotalRevenue(dateFilter),
        db.Product.count({ where: { isActive: true } }),
        db.User.count({ where: { role: 'user' } }),
        db.Order.count({ where: { ...dateFilter, status: 'pending' } }),
        db.Product.count({ where: { isActive: true, stock: { [Op.lt]: 10 } } }),
        this.getRecentOrders(5),
        this.getTopProducts(5)
      ]);

      const monthlyRevenue = await this.getMonthlyRevenue(period);

      return {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers,
        pendingOrders,
        lowStockProducts,
        recentOrders,
        topProducts,
        monthlyRevenue
      };
    } catch (error) {
      throw new CustomError("Failed to fetch dashboard statistics", "FETCH_DASHBOARD_STATS_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get all users with pagination
  async getUsers(filters: UserFilters, page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${filters.search}%` } },
          { email: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      if (filters.role) {
        whereClause.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      const { count, rows } = await db.User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
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
      throw new CustomError("Failed to fetch users", "FETCH_USERS_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<any> {
    try {
      const user = await db.User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Order,
            as: 'orders',
            limit: 5,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      return user;
    } catch (error) {
      throw new CustomError("Failed to fetch user", "FETCH_USER_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Update user role
  async updateUserRole(id: string, role: string, isAdmin: boolean): Promise<any> {
    try {
      const user = await db.User.findByPk(id);
      
      if (!user) {
        throw new CustomError("User not found", "USER_NOT_FOUND", 404);
      }

      await user.update({ role, isAdmin });

      return user;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update user role", "UPDATE_USER_ROLE_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      const user = await db.User.findByPk(id);
      
      if (!user) {
        throw new CustomError("User not found", "USER_NOT_FOUND", 404);
      }

      // Soft delete by setting isActive to false
      await user.update({ isActive: false });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete user", "DELETE_USER_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Toggle user status
  async toggleUserStatus(id: string): Promise<any> {
    try {
      const user = await db.User.findByPk(id);
      
      if (!user) {
        throw new CustomError("User not found", "USER_NOT_FOUND", 404);
      }

      await user.update({ isActive: !user.isActive });

      return user;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to toggle user status", "TOGGLE_USER_STATUS_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<any[]> {
    try {
      const activities = await db.Log.findAll({
        order: [['createdAt', 'DESC']],
        limit
      });

      return activities;
    } catch (error) {
      throw new CustomError("Failed to fetch recent activity", "FETCH_RECENT_ACTIVITY_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get sales report
  async getSalesReport(startDate?: string, endDate?: string, period: string = "30d"): Promise<any> {
    try {
      const dateFilter = startDate && endDate 
        ? { createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] } }
        : this.getDateFilter(period);

      const orders = await db.Order.findAll({
        where: dateFilter,
        include: [
          {
            model: db.OrderItem,
            as: 'items',
            include: [
              {
                model: db.Product,
                as: 'product',
                attributes: ['id', 'name', 'price']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        orders
      };
    } catch (error) {
      throw new CustomError("Failed to fetch sales report", "FETCH_SALES_REPORT_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Get top products
  async getTopProducts(limit: number = 10): Promise<any[]> {
    try {
      const products = await db.Product.findAll({
        where: { isActive: true },
        include: [
          {
            model: db.OrderItem,
            as: 'orderItems',
            attributes: [],
            required: false
          }
        ],
        attributes: [
          'id',
          'name',
          'price',
          'stock',
          'rating',
          'reviewCount',
          [db.sequelize.fn('COUNT', db.sequelize.col('orderItems.id')), 'salesCount']
        ],
        group: ['Product.id'],
        order: [[db.sequelize.literal('salesCount'), 'DESC']],
        limit
      });

      return products;
    } catch (error) {
      throw new CustomError("Failed to fetch top products", "FETCH_TOP_PRODUCTS_ERROR", 500, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Helper methods
  private getDateFilter(period: string): any {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { createdAt: { [Op.gte]: startDate } };
  }

  private async getTotalRevenue(dateFilter: any): Promise<number> {
    const result = await db.Order.findOne({
      where: dateFilter,
      attributes: [
        [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalRevenue']
      ],
      raw: true
    });

    return parseFloat(result?.totalRevenue || '0');
  }

  private async getRecentOrders(limit: number): Promise<any[]> {
    return await db.Order.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: db.OrderItem,
          as: 'items',
          limit: 3
        }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });
  }

  private async getMonthlyRevenue(period: string): Promise<any[]> {
    const dateFilter = this.getDateFilter(period);
    
    const monthlyData = await db.Order.findAll({
      where: dateFilter,
      attributes: [
        [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('createdAt')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('total')), 'revenue']
      ],
      group: [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    return monthlyData.map((item: any) => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: parseFloat(item.revenue || '0')
    }));
  }
}

export const adminService = new AdminService();
