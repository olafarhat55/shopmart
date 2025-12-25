import { IShippingAddress } from "./address";
import { IProduct } from "./product";



export interface IOrderUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  
}

export interface IOrderCartItem {
  count: number;
  _id: string;
  product: IProduct;
  price: number;
}

export interface IOrder {
  shippingAddress: IShippingAddress;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: IOrderUser;
  cartItems: IOrderCartItem[];
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  id?: number | string;

}

export type OrdersResponse = IOrder[];

export type SingleOrderResponse = {
  data: IOrder;
};