"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import type { ICartProduct } from "@/interfaces";
import { apiService } from "@/service/apiService";
import { Spinner } from "../ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "@/redux/store";
import {
  addProduct,
  decrement,
  deleteProduct,
  fetchCart,
  findProductInCart,
  increment,
} from "@/redux/slices/cartSlice";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CART_KEY = "cart_v1";

export default function AddToCartButton({
  id,
  productsCount,
}: {
  id: string;
  productsCount?: number;
  onCartChange?: (items: { id: string; qty: number }[]) => void;
}) {
  const inStock = (productsCount ?? 0) > 0;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qty, setQty] = useState<number>(0);

  const { authProcess } = useAuth();

  const { isAuthenticated } = useAuth();

  const router = useRouter();

  const productInCart:
    | ICartProduct
    | undefined = useSelector((state: StoreType) =>
    findProductInCart(state.cart.cart, id)
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items: { id: string; qty: number }[] = raw ? JSON.parse(raw) : [];
      const existing = items.find((i) => i.id === id);
      setQty(existing?.qty ?? 0);
    } catch {
      setQty(0);
    }
  }, [id]);

  const addToCart = async () => {
    console.log("here");
    console.log("authorized", isAuthenticated);

    if (!id || !inStock) return;

    setIsLoading(true);
    const response = await apiService.postProductToCart(id);

    if (response?.status === "success") {
      dispatch(addProduct(id));
      setIsLoading(false);
      toast.success("Product added to cart successfully.", {
        action: {
          label: "Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 4000,
      });
      dispatch(fetchCart());
      return;
    }
    toast.error("Failed to add product to cart. Please try again.", {duration: 4000});
    setIsLoading(false);
    setQty(1);
  };

  return (
    <>
      {!productInCart ? (
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            className="flex-1 w-full rounded-xl shadow-md flex items-center gap-2 justify-center"
            // onClick={() => {authProcess(() => addToCart(setIsLoading));}}
            onClick={() => {
              authProcess(() => addToCart());
            }}
            disabled={!inStock || isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Add to cart
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-secondary rounded-xl">
          {/* left: trash when qty === 1, otherwise minus */}
          <Button
            aria-label={
              productInCart?.count === 1
                ? "Remove from cart"
                : "Decrease quantity"
            }
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              productInCart?.count === 1
                ? dispatch(deleteProduct(productInCart!._id))
                : dispatch(decrement(productInCart!._id));
            }}
            disabled={isLoading}
            className="h-10 w-10 rounded-xl flex items-center justify-center duration-300 hover:bg-primary/5 bg-transparent hover:rounded-full transition disabled:opacity-50"
          >
            {productInCart?.count === 1 ? (
              <Trash2 className="h-4 w-4 text-destructive" />
            ) : (
              <Minus className="h-4 w-4 text-primary" />
            )}
          </Button>

          {/* center: productInCart?.count */}
          <div className="flex justify-center text-lg font-semibold">
            <div>{isLoading ? <Spinner /> : productInCart?.count}</div>
          </div>

          {/* right: plus */}
          <Button
            aria-label="Increase quantity"
            onClick={() => dispatch(increment(productInCart!._id))}
            disabled={productInCart?.count >= (productsCount ?? 1) || isLoading}
            className="h-10 w-10 rounded-xl flex items-center justify-center duration-300 hover:bg-primary/5 bg-transparent hover:rounded-full transition disabled:opacity-50"
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>

          {/* action: view cart */}
        </div>
      )}
    </>
  );
}
