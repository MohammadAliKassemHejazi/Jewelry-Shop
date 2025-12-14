export interface IOrderItemAttributes {
  id?: string;
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}