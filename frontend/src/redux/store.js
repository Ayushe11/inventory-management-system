import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import customerReducer from './slices/customerSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    customers: customerReducer,
    orders: orderReducer
  }
});

export default store;
