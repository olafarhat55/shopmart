import { notFound } from "next/navigation";
import { apiService } from "@/service/apiService";
import ProductDetailsClient from "./productDetailsClient";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let product = null;
  try {
    const response = await apiService.fetchProductById(id);
    if (!response?.data) return notFound();
    product = response.data;
  } catch {
    return notFound();
  }

  return <ProductDetailsClient product={product} />;
}
