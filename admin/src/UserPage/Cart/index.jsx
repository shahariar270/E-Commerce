import React from 'react'

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeFromCart } from '../../store/slices/cartSlice';

export const Cart = () => {
  const dispatch = useDispatch();
  const { data: cart, loading, error } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cart || !cart.items?.length) return <div>Cart is empty</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.items.map(item => (
          <li key={item.product_id}>
            {item.name} - Qty: {item.quantity} - Subtotal: ${item.subtotal}
            <button onClick={() => handleRemove(item.product_id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>Total: ${cart.total_price}</div>
    </div>
  );
};
