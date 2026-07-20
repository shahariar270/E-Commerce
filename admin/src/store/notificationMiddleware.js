import { showNotification } from './slices/notificationSlice';

export const notificationMiddleware = store => next => action => {
  const result = next(action);

  const isThunkSettled = action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected');
  if (!isThunkSettled) return result;

  // Every read (GET) thunk in this app is named "get..." by convention
  // (getProducts, getCart, getProfile, ...) — only mutating thunks
  // (create/update/delete/remove/upload/...) should surface a toast.
  const [, thunkName] = action.type.split('/');
  if (/^get/i.test(thunkName)) return result;

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
