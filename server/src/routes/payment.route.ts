import { Router } from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  refundPayment,
  getPaymentHistory
} from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/history', getPaymentHistory);
router.post('/refund', refundPayment);
router.get('/:paymentId', getPaymentStatus);

export default router;
