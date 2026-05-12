import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice'
import dashboardReducer from './slices/dashboardSlice'
import commentReducer from './slices/commentSlice'
import { logger } from 'redux-logger';
import notificationReducer from './slices/notificationSlice';
import { notificationMiddleware } from './notificationMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    notification: notificationReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
    comment: commentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      notificationMiddleware,
      import.meta.env.MODE === 'development' ? logger : []
    )
});

export default store;
