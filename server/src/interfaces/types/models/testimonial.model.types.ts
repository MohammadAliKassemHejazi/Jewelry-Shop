export interface ITestimonialAttributes {
  id?: string;
  name: string;
  text: string;
  rating: number;
  image?: string;
  location?: string;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
