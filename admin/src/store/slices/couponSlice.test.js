import { describe, test, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  clearError,
  clearMessage,
  setPage,
  setLimit,
} from './couponSlice';

vi.mock('@utils/api', () => ({
  apiClient: vi.fn(),
}));

import { apiClient } from '@utils/api';

const buildStore = () => configureStore({ reducer: { coupon: reducer } });

describe('couponSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('createCoupon.fulfilled prepends the new coupon to the list', async () => {
    apiClient.mockResolvedValueOnce({ message: 'Coupon created successfully', data: { _id: 'c1', code: 'NEW10' } });
    const store = buildStore();

    await store.dispatch(createCoupon({ code: 'NEW10' }));

    const state = store.getState().coupon;
    expect(state.coupons[0].code).toBe('NEW10');
    expect(state.message).toBe('Coupon created successfully');
    expect(state.loading).toBe(false);
  });

  test('getCoupons.fulfilled stores the page of coupons and the total count', async () => {
    apiClient.mockResolvedValueOnce({
      data: { data: [{ _id: 'c1' }, { _id: 'c2' }], total: 25 },
    });
    const store = buildStore();

    await store.dispatch(getCoupons({ page: 1, limit: 10 }));

    const state = store.getState().coupon;
    expect(state.coupons).toHaveLength(2);
    expect(state.pagination.total).toBe(25);
  });

  test('getCoupons.rejected surfaces the error without crashing', async () => {
    apiClient.mockRejectedValueOnce(new Error('Network error'));
    const store = buildStore();

    await store.dispatch(getCoupons());

    const state = store.getState().coupon;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  test('updateCoupon.fulfilled replaces the matching coupon in place', async () => {
    apiClient
      .mockResolvedValueOnce({ data: { data: [{ _id: 'c1', discount_value: 10 }], total: 1 } })
      .mockResolvedValueOnce({ message: 'updated', data: { _id: 'c1', discount_value: 25 } });
    const store = buildStore();

    await store.dispatch(getCoupons());
    await store.dispatch(updateCoupon({ id: 'c1', couponData: { discount_value: 25 } }));

    expect(store.getState().coupon.coupons[0].discount_value).toBe(25);
  });

  test('deleteCoupon.fulfilled removes the coupon from the list', async () => {
    apiClient
      .mockResolvedValueOnce({ data: { data: [{ _id: 'c1' }, { _id: 'c2' }], total: 2 } })
      .mockResolvedValueOnce({ message: 'deleted', data: { _id: 'c1' } });
    const store = buildStore();

    await store.dispatch(getCoupons());
    await store.dispatch(deleteCoupon('c1'));

    const remaining = store.getState().coupon.coupons;
    expect(remaining).toHaveLength(1);
    expect(remaining[0]._id).toBe('c2');
  });

  test('getCouponById.fulfilled sets currentCoupon', async () => {
    apiClient.mockResolvedValueOnce({ data: { _id: 'c1', code: 'SOLO' } });
    const store = buildStore();

    await store.dispatch(getCouponById('c1'));

    expect(store.getState().coupon.currentCoupon.code).toBe('SOLO');
  });

  test('clearError and clearMessage reset their respective fields', () => {
    const state = reducer(
      { coupons: [], currentCoupon: null, loading: false, error: 'boom', message: 'done', pagination: { page: 1, limit: 10, total: 0 } },
      clearError()
    );
    expect(state.error).toBeNull();

    const state2 = reducer(state, clearMessage());
    expect(state2.message).toBeNull();
  });

  test('setLimit changes the page size and resets to page 1', () => {
    let state = reducer(undefined, setPage(3));
    expect(state.pagination.page).toBe(3);

    state = reducer(state, setLimit(25));
    expect(state.pagination.limit).toBe(25);
    expect(state.pagination.page).toBe(1);
  });
});
