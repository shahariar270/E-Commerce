import { showNotification } from './slices/notificationSlice';

/**
 * Middleware to automatically dispatch notifications for async thunk actions
 * Listens to all fulfilled and rejected actions
 */
export const notificationMiddleware = store => next => action => {
  const result = next(action);

  // Handle fulfilled async thunk actions
  if (action.type.endsWith('/fulfilled')) {
    const message = action.payload?.message || 'Operation successful!';
    store.dispatch(showNotification({
      message,
      delay: 2000,
      type: 'success'
    }));
  }

  // Handle rejected async thunk actions
  if (action.type.endsWith('/rejected')) {
    const message = action.error?.message || 'Something went wrong!';
    store.dispatch(showNotification({
      message,
      delay: 3000,
      type: 'error'
    }));
  }

  return result;
};
