import { Router } from "express";
import { body, param, query } from "express-validator";
import { adminController } from "../controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All admin routes require authentication
router.use(authMiddleware);

// Validation middleware
const validateUserId = [
  param('id').isUUID().withMessage('Valid user ID is required'),
];

const validateUserRoleUpdate = [
  body('role').isIn(['admin', 'user', 'vendor']).withMessage('Role must be admin, user, or vendor'),
  body('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),
];

// Dashboard routes
router.get('/dashboard/stats', adminController.getDashboardStats);

// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:id', validateUserId, adminController.getUserById);
router.put('/users/:id/role', validateUserId, validateUserRoleUpdate, adminController.updateUserRole);
router.delete('/users/:id', validateUserId, adminController.deleteUser);
router.patch('/users/:id/toggle-status', validateUserId, adminController.toggleUserStatus);

// Analytics routes
router.get('/activity', adminController.getRecentActivity);
router.get('/sales-report', adminController.getSalesReport);
router.get('/top-products', adminController.getTopProducts);

export default router;
