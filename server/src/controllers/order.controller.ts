import { Request, Response } from "express";
import db from "../models";
import { v4 as uuidv4 } from "uuid";

export const createOrder = async (req: Request, res: Response) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { items, customerName, customerEmail, shippingAddress, billingAddress, paymentMethod, total, notes } = req.body;
    const userId = (req as any).user.id;

    const order = await db.Order.create({
      userId,
      customerName,
      customerEmail,
      shippingAddress,
      billingAddress,
      paymentMethod,
      total,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    }, { transaction });

    for (const item of items) {
      await db.OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await db.Order.findByPk(req.params.id, {
      include: [{ model: db.OrderItem, as: 'items' }]
    });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await db.Order.findAll({
      where: { userId },
      include: [{ model: db.OrderItem, as: 'items' }]
    });
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { rows, count } = await db.Order.findAndCountAll({
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

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await db.Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    await order.update({ status });
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await db.Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    await order.update({ status: 'cancelled' });
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
