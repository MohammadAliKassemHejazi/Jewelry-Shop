export interface IPaymentAttributes {
  id?: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}