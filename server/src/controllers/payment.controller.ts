import { Request, Response } from "express";
import db from "../models";

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    // Mock Stripe implementation
    const payment = await db.Payment.create({
      orderId,
      amount,
      paymentMethod,
      status: 'pending',
      transactionId: 'mock_tx_' + Date.now()
    });
    res.json({ success: true, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;
    const payment = await db.Payment.findByPk(paymentIntentId);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    await payment.update({ status: 'completed' });

    const order = await db.Order.findByPk(payment.orderId);
    if (order) await order.update({ paymentStatus: 'paid' });

    res.json({ success: true, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const payment = await db.Payment.findByPk(req.params.paymentId);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.json({ success: true, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, amount, reason } = req.body;
    const payment = await db.Payment.findByPk(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    await payment.update({ status: 'refunded' });

    const order = await db.Order.findByPk(payment.orderId);
    if (order) await order.update({ paymentStatus: 'refunded' });

    res.json({ success: true, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await db.Payment.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
