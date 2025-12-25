import { ILogin, IRegister } from "@/interfaces";
import { IShippingAddress } from "@/interfaces";
import {
  ApiProductsParams,
  CategoriesResponse,
  ProductsResponse,
  SingleProductResponse,
} from "@/types";

function buildProductsQuery(params: ApiProductsParams) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.sort) searchParams.set("sort", params.sort);

  // Handle price Map
  if (params.price) {
    params.price.forEach((value, key) => {
      searchParams.set(`price[${key}]`, value.toString());
    });
  }

  // Handle arrays
  if (params.categories && params.categories.length > 0) {
    params.categories.forEach((cat) => searchParams.append("category", cat));
  }
  if (params.brands && params.brands.length > 0) {
    params.brands.forEach((brand) => searchParams.append("brand", brand));
  }
  if (params.fields && params.fields.length > 0) {
    searchParams.set("fields", params.fields.join(","));
  }

  if (params.keyword) searchParams.set("keyword", params.keyword);

  return searchParams.toString();
}

const TOKEN_KEY = "auth_token";

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    }
  }

  getAuthToken(): string | null {
    if (this.token) return this.token;
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  // Replace getHeader implementation to always return a HeadersInit-compatible object
  getHeader(): HeadersInit {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // use Authorization header when token exists (and ensure value is a string)
    if (token) {
      headers["token"] = `${token}`;
    }

    return headers;
  }

  // AUTH end points
  async login(data: ILogin) {
    const response = await fetch(this.baseUrl + `/auth/signin`, {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify(data),
    }).then((res) => res.json());

    return response;
  }

  async register(data: IRegister) {
    const response = await fetch(this.baseUrl + `/auth/signup`, {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;
  }

  async verify() {
    const response = await fetch(this.baseUrl + `/auth/verifyToken`, {
      method: "GET",
      headers: this.getHeader(),
    }).then((res) => res.json());

    return response;
  }

  async sendOtp(email: string) {
    const response = await fetch(this.baseUrl + `/auth/forgotPasswords`, {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify({ email }),
    }).then((res) => res.json());

    return response;
  }

  async verifyOtp(opt: string) {
    const response = await fetch(this.baseUrl + `/auth/verifyResetCode`, {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify({ resetCode: opt }),
    }).then((res) => res.json());

    return response;
  }

  async resetPassword(email: string, newPassword: string) {
    const response = await fetch(this.baseUrl + `/auth/resetPassword`, {
      method: "PUT",
      headers: this.getHeader(),
      body: JSON.stringify({ email, newPassword }),
    }).then((res) => res.json());

    return response;
  }

  async getUserInfo(userId: string) {
    const response = await fetch(this.baseUrl + `/users/` + userId, {
      headers: this.getHeader(),
    }).then((res) => res.json());
    return response;
  }

  async updateUserInfo(data: Partial<IRegister>) {
    const response = await fetch(this.baseUrl + `/users/updateMe`, {
      method: "PUT",
      headers: this.getHeader(),
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;
  }

  async changeUserPassword(data: {
    currentPassword: string;
    password: string;
    rePassword: string;
  }) {
    const response = await fetch(this.baseUrl + `/users/changeMyPassword`, {
      method: "PUT",
      headers: this.getHeader(),
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;
  }

  // PRODUCT end points
  async fetchProducts(params: ApiProductsParams): Promise<ProductsResponse> {
    const searchParams = buildProductsQuery(params);
    console.log(searchParams);

    const response: ProductsResponse = await fetch(
      this.baseUrl +
        "/products" +
        (searchParams.length > 0 ? `?${searchParams}` : ""),
      {
        next: {
          revalidate: 60,
        },
      }
    ).then((res) => res.json());

    return response;
  }

  async fetchProductById(id: string): Promise<SingleProductResponse> {
    const response: SingleProductResponse = await fetch(
      this.baseUrl + `/products/${id}`
    ).then((res) => res.json());

    return response;
  }

  // CATEGORY end points
  async fetchCategories(): Promise<CategoriesResponse> {
    const response: CategoriesResponse = await fetch(
      this.baseUrl + "/categories",
      { next: { revalidate: 3600 } }
    ).then((res) => res.json());
    return response;
  }

  // BRAND end points
  async fetchBrands() {
    const response = await fetch(this.baseUrl + "/brands").then((res) =>
      res.json()
    );
    return response;
  }

  // CART end points
  async postProductToCart(productId: string) {
    const response = await fetch(this.baseUrl + `/cart`, {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify({ productId }),
    }).then((res) => res.json());

    return response;
  }

  async fetchUserCart() {
    const response = await fetch(this.baseUrl + `/cart`, {
      headers: this.getHeader(),
    }).then((res) => res.json());

    return response;
  }

  async deleteProductFromCart(productId: string) {
    const response = await fetch(this.baseUrl + `/cart/${productId}`, {
      method: "DELETE",
      headers: this.getHeader(),
    }).then((res) => res.json());
  }

  async updateQuantityProduct(productId: string, count: number) {
    const response = await fetch(this.baseUrl + `/cart/${productId}`, {
      method: "PUT",
      headers: this.getHeader(),
      body: JSON.stringify({ count }),
    }).then((res) => res.json());
  }

  // ORDER end points
  async checkoutSession(cartId: string, shippingAddress: IShippingAddress) {
    const response = await fetch(
      this.baseUrl +
        `/orders/checkout-session/${cartId}?url=${process.env.NEXT_PUBLIC_BASE_URL}`,
      {
        method: "POST",
        headers: this.getHeader(),
        body: JSON.stringify({ shippingAddress }),
      }
    ).then((res) => res.json());
    return response;
  }

  async checkoutOnDelivery(cartId: string, shippingAddress: IShippingAddress) {
    const response = await fetch(this.baseUrl + `/orders/${cartId}`, {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify({ shippingAddress }),
    }).then((res) => res.json());
    return response;
  }

  async getUserOrderes(userId: string) {
    const response = await fetch(this.baseUrl + `/orders/user/` + userId, {
      headers: this.getHeader(),
    }).then((res) => res.json());

    return response;
  }

  // ADDRESS end points
  async addAddress(data: IShippingAddress) {
    const response = await fetch(this.baseUrl + `/addresses`, {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;
  }

  async getAddresses() {
    const response = await fetch(this.baseUrl + `/addresses`, {
      headers: this.getHeader(),
    }).then((res) => res.json());

    return response;
  }

  async deleteAddress(addressId: string) {
    const response = await fetch(this.baseUrl + `/addresses/${addressId}`, {
      method: "DELETE",
      headers: this.getHeader(),
    }).then((res) => res.json());
    return response;
  }

  async updateAddress(addressId: string, data: IShippingAddress) {
    const response = await fetch(this.baseUrl + `/addresses/${addressId}`, {
      method: "PUT",
      headers: this.getHeader(),
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;
  }

  // WISHLIST end points
  async fetchWishList() {
    const response = await fetch(this.baseUrl + `/wishlist`, {
      headers: this.getHeader(),
    }).then((res) => res.json());
    return response;
  }

  async addToWishList(productId: string) {
    const response = await fetch(this.baseUrl + `/wishlist`, {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify({ productId }),
    }).then((res) => res.json());
    return response;
  }

  async deleteFromWishList(productId: string) {
    const response = await fetch(this.baseUrl + `/wishlist/${productId}`, {
      method: "DELETE",
      headers: this.getHeader(),
    }).then((res) => res.json());
    return response;
  }
}

export const apiService = new ApiService(
  process.env.NEXT_PUBLIC_API_URL || "https://ecommerce.routemisr.com/api/v1"
);
