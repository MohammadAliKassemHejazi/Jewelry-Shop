export interface IProductImageAttributes {
  id?: string;
  productId?: string; 
  imageUrl: string;
  isPrimary?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
