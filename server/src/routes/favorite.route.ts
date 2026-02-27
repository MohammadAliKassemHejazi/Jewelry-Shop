import { Router } from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites
} from "../controllers/favorite.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:productId', removeFavorite);
router.delete('/', clearFavorites);

export default router;
