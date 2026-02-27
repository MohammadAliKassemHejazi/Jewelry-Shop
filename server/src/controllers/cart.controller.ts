import { Request, Response } from "express";
import db from "../models";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let cart = await db.Cart.findOne({
      where: { userId },
      include: [{ model: db.CartItem, as: 'items', include: ['product'] }]
    });

    if (!cart) {
      cart = await db.Cart.create({ userId, total: 0, itemCount: 0 });
    }

    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;

    let cart = await db.Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await db.Cart.create({ userId, total: 0, itemCount: 0 });
    }

    let cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (cartItem) {
      await cartItem.update({ quantity: cartItem.quantity + quantity });
    } else {
      await db.CartItem.create({ cartId: cart.id, productId, quantity });
    }

    res.json({ success: true, message: "Item added to cart" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const cartItem = await db.CartItem.findByPk(req.params.itemId);
    if (!cartItem) return res.status(404).json({ success: false, message: "Item not found" });

    await cartItem.update({ quantity });
    res.json({ success: true, data: cartItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = await db.CartItem.findByPk(req.params.itemId);
    if (!cartItem) return res.status(404).json({ success: false, message: "Item not found" });

    await cartItem.destroy();
    res.json({ success: true, message: "Item removed" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const cart = await db.Cart.findOne({ where: { userId } });
    if (cart) {
      await db.CartItem.destroy({ where: { cartId: cart.id } });
    }
    res.json({ success: true, message: "Cart cleared" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCartItemCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const cart = await db.Cart.findOne({ where: { userId } });
    let count = 0;
    if (cart) {
      count = await db.CartItem.sum('quantity', { where: { cartId: cart.id } }) || 0;
    }
    res.json({ success: true, data: { count } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
