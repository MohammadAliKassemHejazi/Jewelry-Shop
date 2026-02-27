import { Request, Response } from "express";
import db from "../models";
import { Op } from "sequelize";

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await db.Article.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: db.User, as: 'author', attributes: ['id', 'name', 'surname'] }]
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

export const getPublishedArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await db.Article.findAndCountAll({
      where: { published: true },
      limit,
      offset,
      order: [['publishedAt', 'DESC']],
      include: [{ model: db.User, as: 'author', attributes: ['id', 'name', 'surname'] }]
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

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const article = await db.Article.findByPk(req.params.id, {
      include: [{ model: db.User, as: 'author', attributes: ['id', 'name', 'surname'] }]
    });
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    await article.increment('viewCount');

    res.json({ success: true, data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArticlesByAuthor = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user.id;
    const articles = await db.Article.findAll({
      where: { authorId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: articles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user.id;
    const article = await db.Article.create({ ...req.body, authorId });
    res.status(201).json({ success: true, data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const article = await db.Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    await article.update(req.body);
    res.json({ success: true, data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const article = await db.Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    await article.destroy();
    res.json({ success: true, message: "Article deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchArticles = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const articles = await db.Article.findAll({
      where: {
        published: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { text: { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: [{ model: db.User, as: 'author', attributes: ['id', 'name', 'surname'] }]
    });
    res.json({ success: true, data: articles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
