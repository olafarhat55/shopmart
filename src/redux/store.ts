import {configureStore} from '@reduxjs/toolkit';
import {cartReducer} from './slices/cartSlice';
import { wishListReducer } from './slices/wishListSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishListReducer,
  }
});


export type StoreType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch