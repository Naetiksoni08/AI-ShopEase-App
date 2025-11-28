import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cart/cartSlice'
import authReducer from './Auth/authSlice';
import productReducer from './Product/productslice'
import reviewReducer from './Review/reviewslice'



export const store = configureStore({
    reducer: {
      auth:authReducer,
      cart: cartReducer,
      product: productReducer,
      review: reviewReducer,
    },
  });

  export default store;

  