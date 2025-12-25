import { IProduct } from "./product";

export interface ICartResponse {
  status: string; // e.g. "success"
  numOfCartItems: number;
  cartId: string;
  data: ICartData;
}

export interface ICartData {
  _id: string;
  cartOwner: string;
  products: ICartProduct[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
  totalCartPrice: number;
}

export interface ICartProduct {
  count: number;
  _id: string;
  product: IProduct;
  price: number;
}