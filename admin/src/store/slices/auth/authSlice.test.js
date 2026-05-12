import { describe, test, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  logout,
  clearError,
  clearMessage,
} from './authSlice';

// ✅ helper mock
vi.mock('@utils/helper', () => ({
  authRoute: 'http://test-api/',
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  removeCookie: vi.fn(),
}));

import { getCookie, setCookie, removeCookie } from '@utils/helper';

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  // -------------------------
  // ✅ Reducer tests
  // -------------------------
  test('should return initial state', () => {
    const state = reducer(undefined, { type: '' });

    expect(state).toMatchObject({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  });

  test('clearError should reset error', () => {
    const state = reducer(
      { error: 'error' },
      clearError()
    );

    expect(state.error).toBe(null);
  });

  test('clearMessage should reset message', () => {
    const state = reducer(
      { message: 'hello' },
      clearMessage()
    );

    expect(state.message).toBe(null);
  });

  // -------------------------
  // ✅ LOGIN TEST
  // -------------------------
  test('loginUser success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'abc123',
        message: 'Login success',
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(loginUser({ email: 'a', password: 'b' }));

    const state = store.getState().auth;

    expect(setCookie).toHaveBeenCalledWith('token', 'abc123');
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('abc123');
    expect(state.message).toBe('Login success');
  });

  test('loginUser fail', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Invalid credentials',
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(loginUser({ email: 'a', password: 'b' }));

    const state = store.getState().auth;

    expect(state.error).toBe('Invalid credentials');
    expect(state.isAuthenticated).toBe(false);
  });

  // -------------------------
  // ✅ REGISTER TEST
  // -------------------------
  test('registerUser success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'Registered',
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(registerUser({ name: 'test' }));

    const state = store.getState().auth;

    expect(state.message).toBe('Registered');
  });

  // -------------------------
  // ✅ GET PROFILE
  // -------------------------
  test('getProfile success', async () => {
    getCookie.mockReturnValue('token123');

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { name: 'Shahariar' },
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(getProfile());

    const state = store.getState().auth;

    expect(state.user.name).toBe('Shahariar');
  });

  test('getProfile no token', async () => {
    getCookie.mockReturnValue(null);

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(getProfile());

    const state = store.getState().auth;

    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBe(null);
  });

  // -------------------------
  // ✅ UPDATE PROFILE
  // -------------------------
  test('updateProfile success', async () => {
    getCookie.mockReturnValue('token123');

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { name: 'Updated' },
        message: 'Updated successfully',
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(updateProfile({ first_name: 'New' }));

    const state = store.getState().auth;

    expect(state.user.name).toBe('Updated');
    expect(state.message).toBe('Updated successfully');
  });

  // -------------------------
  // ✅ LOGOUT
  // -------------------------
  test('logout clears state', async () => {
    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(logout());

    const state = store.getState().auth;

    expect(removeCookie).toHaveBeenCalledWith('token');
    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });
});