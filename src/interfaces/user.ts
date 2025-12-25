import { IShippingAddress } from "./address";

export interface IUserData {
  role: string;
  active: boolean;
  wishlist: string[];
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  addresses: IShippingAddress[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  passwordResetCode?: string;
  passwordResetExpires?: string;
  resetCodeVerified?: boolean;
}
