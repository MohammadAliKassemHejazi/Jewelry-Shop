export interface ICartAttributes {
  id?: string;
  userId: string;
  total: number;
  itemCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}