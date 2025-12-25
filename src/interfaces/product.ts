import { IBrand } from "./brand";
import { ICategory } from "./category";
import { ISubcategory } from "./subcategory";

export interface IProduct {
  /* ================= IDs ================= */
  _id: string;
  id?: string;

  /* ================= Basic info ================= */
  title: string;
  slug: string;
  description?: string;

  /* ================= Pricing ================= */
  price: number;
  priceAfterDiscount?: number;

  /* ================= Stock ================= */
  quantity: number;
  sold?: number;

  /* ================= Images ================= */
  imageCover: string;
  images?: string[];

  /* ================= Relations ================= */
  category: ICategory;
  brand?: IBrand | null;
  subcategory?: ISubcategory[];

  /* ================= Ratings ================= */
  ratingsAverage?: number;
  ratingsQuantity?: number;

  /* ================= Dates ================= */
  createdAt?: string;
  updatedAt?: string;
}
