export interface IUserAttributes {
  id?: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  phone?: string;
  role?: 'admin' | 'user' | 'vendor';
  isAdmin?: boolean;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdById?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
