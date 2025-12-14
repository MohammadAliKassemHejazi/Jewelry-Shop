import { Router } from "express";
import { body, param, query } from "express-validator";
import { productsController } from "../controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Validation middleware
const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('categoryId').isUUID().withMessage('Valid category ID is required'),
  body('storeId').isUUID().withMessage('Valid store ID is required'),
  body('ownerId').isUUID().withMessage('Valid owner ID is required'),
];

const validateProductUpdate = [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Product description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

const validateProductId = [
  param('id').isUUID().withMessage('Valid product ID is required'),
];

const validateCategoryId = [
  param('category').isUUID().withMessage('Valid category ID is required'),
];

const validateSearchQuery = [
  query('q').notEmpty().withMessage('Search query is required'),
];

// Public routes
router.get('/', productsController.getAllProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/search', validateSearchQuery, productsController.searchProducts);
router.get('/category/:category', validateCategoryId, productsController.getProductsByCategory);
router.get('/:id', validateProductId, productsController.getProductById);

// Protected routes (admin only)
router.post('/', authMiddleware, validateProduct, productsController.createProduct);
router.put('/:id', authMiddleware, validateProductId, validateProductUpdate, productsController.updateProduct);
router.delete('/:id', authMiddleware, validateProductId, productsController.deleteProduct);
router.get('/admin/stats', authMiddleware, productsController.getProductStats);

export default router;
