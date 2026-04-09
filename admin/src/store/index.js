import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import { showNotification } from './slices/notificaionSlices';

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    showNotification: showNotification
  },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
