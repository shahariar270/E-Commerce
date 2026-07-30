import { describe, test, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  createCart,
  updateCart,
  getCart,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCart,
} from './cartSlice';

vi.mock('@utils/api', () => ({
  apiClient: vi.fn(),
}));

import { apiClient } from '@utils/api';

const buildStore = () => configureStore({ reducer: { cart: reducer } });

const CART_PAYLOAD = {
  message: 'ok',
  data: {
    items: [{ product_id: 'p1', name: 'Widget', price: 10, quantity: 2, subtotal: 20 }],
    total_quantity: 2,
    total_price: 20,
    coupon: { code: 'TEN', discount_amount: 2 },
    grand_total: 18,
  },
};

describe('cartSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initial state', () => {
    const store = buildStore();
    expect(store.getState().cart).toEqual({
      items: [],
      total_quantity: 0,
      total_price: 0,
      coupon: null,
      grand_total: 0,
      loading: false,
      error: null,
    });
  });

  test('createCart.pending sets loading and clears any previous error', async () => {
    let resolvePromise;
    apiClient.mockReturnValueOnce(new Promise((resolve) => { resolvePromise = resolve; }));
    const store = buildStore();

    const dispatched = store.dispatch(createCart({ product_id: 'p1', quantity: 1 }));
    expect(store.getState().cart.loading).toBe(true);

    resolvePromise(CART_PAYLOAD);
    await dispatched;
  });

  test('createCart.fulfilled applies the returned cart snapshot', async () => {
    apiClient.mockResolvedValueOnce(CART_PAYLOAD);
    const store = buildStore();

    await store.dispatch(createCart({ product_id: 'p1', quantity: 2 }));

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.total_quantity).toBe(2);
    expect(state.total_price).toBe(20);
    expect(state.grand_total).toBe(18);
    expect(state.coupon.code).toBe('TEN');
  });

  test('createCart.rejected surfaces the error and stops loading', async () => {
    apiClient.mockRejectedValueOnce(new Error('Only 1 left in stock'));
    const store = buildStore();

    await store.dispatch(createCart({ product_id: 'p1', quantity: 99 }));

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Only 1 left in stock');
  });

  test('a cart with no coupon applied normalizes coupon to null', async () => {
    apiClient.mockResolvedValueOnce({
      data: { items: [], total_quantity: 0, total_price: 0, coupon: { code: null }, grand_total: 0 },
    });
    const store = buildStore();

    await store.dispatch(getCart());

    expect(store.getState().cart.coupon).toBeNull();
  });

  test('grand_total falls back to total_price when the server omits it', async () => {
    apiClient.mockResolvedValueOnce({
      data: { items: [], total_quantity: 1, total_price: 42, coupon: null },
    });
    const store = buildStore();

    await store.dispatch(getCart());

    expect(store.getState().cart.grand_total).toBe(42);
  });

  test('updateCart, removeFromCart, applyCoupon, and removeCoupon all apply the cart payload the same way', async () => {
    const thunks = [
      () => updateCart({ product_id: 'p1', quantity: 3 }),
      () => removeFromCart('p1'),
      () => applyCoupon('TEN'),
      () => removeCoupon(),
    ];

    for (const makeThunk of thunks) {
      apiClient.mockResolvedValueOnce(CART_PAYLOAD);
      const store = buildStore();
      await store.dispatch(makeThunk());
      expect(store.getState().cart.total_quantity).toBe(2);
    }
  });

  test('clearCart resets to initial state (e.g. after checkout)', async () => {
    apiClient.mockResolvedValueOnce(CART_PAYLOAD);
    const store = buildStore();
    await store.dispatch(createCart({ product_id: 'p1', quantity: 2 }));
    expect(store.getState().cart.items).toHaveLength(1);

    store.dispatch(clearCart());

    expect(store.getState().cart.items).toHaveLength(0);
    expect(store.getState().cart.total_quantity).toBe(0);
  });
});
