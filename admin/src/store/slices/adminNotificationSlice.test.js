import { describe, test, expect } from 'vitest';
import reducer, { notificationReceived, markAllRead } from './adminNotificationSlice';

const initialState = { items: [], unreadCount: 0 };

describe('adminNotificationSlice', () => {
  test('notificationReceived adds an unread item to the front of the list', () => {
    const state = reducer(initialState, notificationReceived({
      type: 'order',
      message: 'New order from Jane — $42.00',
      link: '/admin/orders',
    }));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].message).toBe('New order from Jane — $42.00');
    expect(state.items[0].read).toBe(false);
    expect(state.unreadCount).toBe(1);
  });

  test('newest notification goes to the front', () => {
    let state = reducer(initialState, notificationReceived({ message: 'first' }));
    state = reducer(state, notificationReceived({ message: 'second' }));

    expect(state.items[0].message).toBe('second');
    expect(state.items[1].message).toBe('first');
    expect(state.unreadCount).toBe(2);
  });

  test('ignores a payload with no message', () => {
    const state = reducer(initialState, notificationReceived({ type: 'order' }));
    expect(state.items).toHaveLength(0);
    expect(state.unreadCount).toBe(0);
  });

  test('defaults type to "info" when not provided', () => {
    const state = reducer(initialState, notificationReceived({ message: 'hi' }));
    expect(state.items[0].type).toBe('info');
  });

  test('caps the feed at 30 items, dropping the oldest', () => {
    let state = initialState;
    for (let i = 0; i < 35; i++) {
      state = reducer(state, notificationReceived({ message: `msg ${i}` }));
    }

    expect(state.items).toHaveLength(30);
    expect(state.items[0].message).toBe('msg 34'); // newest kept
    expect(state.items[29].message).toBe('msg 5'); // oldest 5 dropped
  });

  test('markAllRead marks every item read and zeroes the unread count', () => {
    let state = reducer(initialState, notificationReceived({ message: 'a' }));
    state = reducer(state, notificationReceived({ message: 'b' }));
    expect(state.unreadCount).toBe(2);

    state = reducer(state, markAllRead());

    expect(state.unreadCount).toBe(0);
    expect(state.items.every((item) => item.read)).toBe(true);
  });
});
