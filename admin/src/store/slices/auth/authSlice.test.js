import { describe, test, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
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
  // ✅ FORGOT PASSWORD
  // -------------------------
  test('forgotPassword success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'If an account exists for this email, a password reset link has been sent',
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(forgotPassword({ email: 'a@test.com' }));

    const state = store.getState().auth;

    expect(state.message).toBe('If an account exists for this email, a password reset link has been sent');
    expect(state.error).toBe(null);
  });

  test('forgotPassword fail', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'invalid email',
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(forgotPassword({ email: 'not-an-email' }));

    const state = store.getState().auth;

    expect(state.error).toBe('invalid email');
  });

  // -------------------------
  // ✅ RESET PASSWORD
  // -------------------------
  test('resetPassword success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'Password has been reset successfully. You can now sign in.',
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(resetPassword({ email: 'a@test.com', token: 'tok', new_password: 'newpass1' }));

    const state = store.getState().auth;

    expect(state.message).toBe('Password has been reset successfully. You can now sign in.');
    expect(state.error).toBe(null);
  });

  test('resetPassword fail', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'This reset link is invalid or has expired. Please request a new one.',
      }),
    });

    const store = configureStore({
      reducer: { auth: reducer },
    });

    await store.dispatch(resetPassword({ email: 'a@test.com', token: 'bad', new_password: 'newpass1' }));

    const state = store.getState().auth;

    expect(state.error).toBe('This reset link is invalid or has expired. Please request a new one.');
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