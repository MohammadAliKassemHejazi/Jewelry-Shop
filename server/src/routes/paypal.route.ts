import { Router } from "express";
import { body, param } from "express-validator";
import paypalController from "../controllers/paypal.controller";

const router = Router();

// Validation middleware
const validateCreateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Items array is required with at least one item'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be a positive integer'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Item price must be a positive number'),
  body('returnUrl').isURL().withMessage('Valid return URL is required'),
  body('cancelUrl').isURL().withMessage('Valid cancel URL is required'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
];

const validateRefund = [
  body('amount').optional().isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
  body('reason').optional().isString().withMessage('Refund reason must be a string'),
];

const validateOrderId = [
  param('orderId').notEmpty().withMessage('Order ID is required'),
];

const validateCaptureId = [
  param('captureId').notEmpty().withMessage('Capture ID is required'),
];

// PayPal routes
router.post('/orders', validateCreateOrder, paypalController.createPayPalOrder);
router.post('/orders/:orderId/capture', validateOrderId, paypalController.capturePayPalOrder);
router.get('/orders/:orderId', validateOrderId, paypalController.getPayPalOrderDetails);
router.post('/refunds/:captureId', validateCaptureId, validateRefund, paypalController.refundPayPalOrder);
router.post('/webhooks', paypalController.handlePayPalWebhook);

export default router;
