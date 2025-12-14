export interface ICartItemAttributes {
  id?: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  addedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}