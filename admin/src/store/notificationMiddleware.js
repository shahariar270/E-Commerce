import { showNotification } from './slices/notificationSlice';

export const notificationMiddleware = store => next => action => {
  const result = next(action);

  // Handle fulfilled async thunk actions
  if (action.type.endsWith('/fulfilled')) {
    const message = action.payload?.message || 'Operation successful!';
    store.dispatch(showNotification({
      message,
      timeout: 4000,
      type: 'success'
    }));
  }

  if (action.type.endsWith('/rejected')) {
    const message = action.error?.message || 'Something went wrong!';
    store.dispatch(showNotification({
      message,
      timeout: 4000,
      type: 'error'
    }));
  }

  return result;
};
