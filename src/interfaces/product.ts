import { IBrand } from "./brand";
import { ICategory } from "./category";
import { ISubcategory } from "./subcategory";

export interface IProduct {
  sold: number;
  images: string[];
  subcategory: ISubcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  category: ICategory;
  brand: IBrand;
  ratingsAverage: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  id: string;
}
