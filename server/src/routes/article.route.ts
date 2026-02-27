import { Router } from "express";
import {
  getAllArticles,
  getPublishedArticles,
  getArticleById,
  getArticlesByAuthor,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles
} from "../controllers/article.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get('/published', getPublishedArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);

// Protected routes
router.get('/', authMiddleware, getAllArticles);
router.get('/author/me', authMiddleware, getArticlesByAuthor);
router.post('/', authMiddleware, createArticle);
router.put('/:id', authMiddleware, updateArticle);
router.delete('/:id', authMiddleware, deleteArticle);

export default router;
