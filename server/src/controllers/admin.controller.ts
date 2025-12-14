import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../utils/customError";
import { adminService } from "../services";

// Get dashboard statistics
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { period = "30d" } = req.query;
    const stats = await adminService.getDashboardStats(period as string);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get all users with pagination
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive
    } = req.query;

    const filters = {
      search: search as string,
      role: role as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
    };

    const result = await adminService.getUsers(
      filters,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError("User ID is required", "MISSING_USER_ID", 400);
    }

    const user = await adminService.getUserById(id);

    if (!user) {
      throw new CustomError("User not found", "USER_NOT_FOUND", 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update user role
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role, isAdmin } = req.body;

    if (!id) {
      throw new CustomError("User ID is required", "MISSING_USER_ID", 400);
    }

    if (!role) {
      throw new CustomError("Role is required", "MISSING_ROLE", 400);
    }

    const user = await adminService.updateUserRole(id, role, isAdmin);

    res.status(200).json({
      success: true,
      data: user,
      message: "User role updated successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError("User ID is required", "MISSING_USER_ID", 400);
    }

    await adminService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Toggle user status
export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError("User ID is required", "MISSING_USER_ID", 400);
    }

    const user = await adminService.toggleUserStatus(id);

    res.status(200).json({
      success: true,
      data: user,
      message: "User status updated successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get recent activity
export const getRecentActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 10 } = req.query;
    const activities = await adminService.getRecentActivity(parseInt(limit as string));

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

// Get sales report
export const getSalesReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      startDate,
      endDate,
      period = "30d"
    } = req.query;

    const report = await adminService.getSalesReport(
      startDate as string,
      endDate as string,
      period as string
    );

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// Get top products
export const getTopProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 10 } = req.query;
    const products = await adminService.getTopProducts(parseInt(limit as string));

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  toggleUserStatus,
  getRecentActivity,
  getSalesReport,
  getTopProducts
};
