import { Request, Response } from "express";
import db from "../models";

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const favorites = await db.Favorite.findAll({
      where: { userId },
      include: [{ model: db.Product, as: 'product' }]
    });
    res.json({ success: true, data: favorites.map((f: any) => f.product) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.body;

    const favorite = await db.Favorite.findOne({ where: { userId, productId } });
    if (!favorite) {
      await db.Favorite.create({ userId, productId });
    }
    res.json({ success: true, message: "Added to favorites" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const productId = req.params.productId;

    await db.Favorite.destroy({ where: { userId, productId } });
    res.json({ success: true, message: "Removed from favorites" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await db.Favorite.destroy({ where: { userId } });
    res.json({ success: true, message: "Favorites cleared" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
