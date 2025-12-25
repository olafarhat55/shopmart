import { ICartData, ICartProduct, ICartResponse, IProduct } from "@/interfaces";
import { apiService } from "@/service/apiService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clear } from "console";

type StateType = {
  isFetching: boolean;
  firstFetching: boolean;
  cart: ICartData;
};
const initialState: StateType = {
  isFetching: false,
  firstFetching: true,
  cart: {
    _id: "",
    cartOwner: "",
    products: [],
    createdAt: "",
    updatedAt: "",
    __v: 0,
    totalCartPrice: 0,
  },
};


// functions
export const findProductInCart = (state: StateType, productId: string) : ICartProduct | undefined => {
  const productInCart : ICartProduct | undefined =  state.cart?.products?.find((item) => item?.product?._id === productId);
  return productInCart;
}

// fetch data from api
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response: ICartResponse = await apiService.fetchUserCart();
  return response.data;
});

// create slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: initialState,
  },
  reducers: {
    updateQuantity: (state, action) => {
      const { id, count } = action.payload;
      const productInCart = state.cart.cart.products.find(
        (item) => item?._id === id
      );

      if (productInCart) {
        const difference = count - productInCart.count;
        productInCart.count = count;
        state.cart.cart.totalCartPrice += productInCart.price * difference;
        apiService.updateQuantityProduct(
          productInCart.product._id,
          productInCart.count
        );
      } else {
        console.warn("Product not found in cart for id:", id);
      }
    },
    increment: (state, action) => {
      const id = action.payload;
      const productInCart = state.cart.cart.products.find(
        (item) => item?._id === id
      );

      if (productInCart) {
        const newCount = productInCart.count + 1;
        cartSlice.caseReducers.updateQuantity(state, {
          payload: { id, count: newCount },
          type: "cart/updateQuantity",
        });
      }
    },
    decrement: (state, action) => {
      const id = action.payload;
      const productInCart = state.cart.cart.products.find(
        (item) => item?._id === id
      );

      if (productInCart) {
        const newCount = productInCart.count - 1;
        cartSlice.caseReducers.updateQuantity(state, {
          payload: { id, count: newCount },
          type: "cart/updateQuantity",
        });
      }
    },
    deleteProduct: (state, action) => {
      const id = action.payload;
      const productInCart = state.cart.cart.products.find(
        (item) => item?._id === id
      );

      if (productInCart) {
        state.cart.cart.totalCartPrice -= productInCart.price * productInCart.count;
        state.cart.cart.products = state.cart.cart.products.filter(
          (item) => item?._id !== id
        );

        apiService.deleteProductFromCart(productInCart.product._id);
      } else {
        console.warn("Product not found in cart for id:", id);
      }
    },
    addProduct: (state, action) => {
      const productId = action.payload;
      state.cart.cart.products.push({
        count: 1,
        _id: "xyz",
        product: {_id: productId} as IProduct,
        price: 0,
      });
    },
    clearCartSlice: (state) => {
      state.cart = initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.cart.isFetching = true;
    })
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cart.cart = action.payload;
      state.cart.isFetching = false;
      state.cart.firstFetching = false;
      console.log("Cart data fetched successfully.");
    });
  },
});


export const cartReducer = cartSlice.reducer;
export const {
  increment,
  decrement,
  updateQuantity,
  addProduct,
  deleteProduct,
  clearCartSlice,
} = cartSlice.actions;
