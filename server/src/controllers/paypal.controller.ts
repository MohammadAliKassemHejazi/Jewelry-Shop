import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../utils/customError";
import { paypalService } from "../services/paypal.service";

// Create PayPal order
export const createPayPalOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Validation failed", "VALIDATION_ERROR", 400, { errors: errors.array() });
    }

    const {
      items,
      currency = 'USD',
      returnUrl,
      cancelUrl
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new CustomError("Items are required", "MISSING_ITEMS", 400);
    }

    if (!returnUrl || !cancelUrl) {
      throw new CustomError("Return URL and Cancel URL are required", "MISSING_URLS", 400);
    }

    const order = await paypalService.createOrder({
      items,
      currency,
      returnUrl,
      cancelUrl
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        links: order.links
      },
      message: "PayPal order created successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Capture PayPal order
export const capturePayPalOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      throw new CustomError("Order ID is required", "MISSING_ORDER_ID", 400);
    }

    const order = await paypalService.captureOrder(orderId);

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        purchaseUnits: order.purchase_units
      },
      message: "PayPal order captured successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get PayPal order details
export const getPayPalOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      throw new CustomError("Order ID is required", "MISSING_ORDER_ID", 400);
    }

    const order = await paypalService.getOrderDetails(orderId);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Refund PayPal order
export const refundPayPalOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { captureId } = req.params;
    const { amount, reason } = req.body;

    if (!captureId) {
      throw new CustomError("Capture ID is required", "MISSING_CAPTURE_ID", 400);
    }

    const refund = await paypalService.refundOrder(captureId, amount, reason);

    res.status(200).json({
      success: true,
      data: refund,
      message: "PayPal refund processed successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Handle PayPal webhook
export const handlePayPalWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    
    if (!webhookId) {
      throw new CustomError("PayPal webhook ID not configured", "MISSING_WEBHOOK_ID", 500);
    }

    const isValid = await paypalService.verifyWebhook(req.headers, JSON.stringify(req.body), webhookId);

    if (!isValid) {
      throw new CustomError("Invalid webhook signature", "INVALID_WEBHOOK", 400);
    }

    const { event_type, resource } = req.body;

    // Handle different webhook events
    switch (event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Handle successful payment
        console.log('Payment captured:', resource);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        // Handle denied payment
        console.log('Payment denied:', resource);
        break;
      case 'PAYMENT.CAPTURE.REFUNDED':
        // Handle refund
        console.log('Payment refunded:', resource);
        break;
      default:
        console.log('Unhandled webhook event:', event_type);
    }

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully"
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalOrderDetails,
  refundPayPalOrder,
  handlePayPalWebhook
};
