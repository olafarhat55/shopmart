import { IProduct } from "@/interfaces";
import { apiService } from "@/service/apiService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type StateType = {
  isFetching: boolean;
  firstFetching: boolean;
  products: IProduct[];
};
const initialState: StateType = {
  isFetching: false,
  firstFetching: true,
  products: [],
};

export const findInWishList = (state: StateType, productId: string) : boolean => {
  return state?.products?.some((item) => item._id === productId);
}

// fetch data from api
export const fetchWishList = createAsyncThunk("cart/fetchWishList", async () => {
  const response = await apiService.fetchWishList();
  if(response?.status === "success") {
    return response.data;
  }
});

const wishListSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishList: initialState,
  },
  reducers: {
    toggleWishList: (state, action : {payload : IProduct, type: string}) => {
      const product : IProduct = action.payload;

      if (!findInWishList(state.wishList, product._id)) {
        state.wishList.products.push(product);
        apiService.addToWishList(product._id);
      } else {
        state.wishList.products = state.wishList.products.filter(
          (p) => p._id !== product._id
        );
        apiService.deleteFromWishList(product._id);
      }
    },
    clearWishListSlice: (state) => {
      state.wishList = initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishList.pending, (state) => {
      state.wishList.isFetching = true;
    })
    builder.addCase(fetchWishList.rejected, (state) => {
      state.wishList.isFetching = false;
      state.wishList.firstFetching = false;
      console.error("Failed to fetch wishlist data.");
    });
    builder.addCase(fetchWishList.fulfilled, (state, action : {payload : IProduct[], type: string}) => {
      state.wishList.products = action.payload;
      state.wishList.isFetching = false;
      state.wishList.firstFetching = false;
      console.log("Wishlist data fetched successfully.");
    });
  },
});

export const wishListReducer = wishListSlice.reducer;
export const {
  toggleWishList,
  clearWishListSlice
} = wishListSlice.actions;
