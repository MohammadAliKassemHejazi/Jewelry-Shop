import { Router } from "express";
import {
  getVerifiedTestimonials,
  createTestimonial
} from "../controllers/testimonial.controller";

const router = Router();

router.get('/verified', getVerifiedTestimonials);
router.post('/', createTestimonial);

export default router;
