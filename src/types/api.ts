import { IProduct, IBrand, ICategory, IApiResponseCollection } from "@/interfaces";

export type ProductsResponse = IApiResponseCollection<IProduct>;
export type BrandsResponse = IApiResponseCollection<IBrand>;
export type CategoriesResponse = IApiResponseCollection<ICategory>;

export type SingleBrandResponse = {
  data: IBrand;
}
export type SingleCategoryResponse = {
  data: ICategory;
}

export type SingleProductResponse = {
  data: IProduct;
}

export type ApiProductsParams = {
 
  page?: number;
  limit?: number;
  sort?: "-price" | "-createdAt" | "-quantity" | "-ratingsAverage";
  price?: Map<"gte" | "lte", number>;
  categories?: string[];
  brands?: string[];
  keyword?: string;
  fields?: string[];
}

