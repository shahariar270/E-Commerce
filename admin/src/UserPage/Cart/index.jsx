import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, updateCart, removeFromCart } from "@Store/slices/cartSlice";
import './styles.scss';
import Button from "@Component/Buttons";
import Input from "@Component/Input";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartData = useSelector(state => state.cart.data);
  console.log({ cartData });

  useEffect(() => {
    dispatch(getCart());
  }, []);

  const handleQuantityChange = (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    dispatch(updateCart({ product_id: item._id, quantity: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleApplyPromo = () => {
    // promo logic placeholder
  };

  const items = cartData;
  const subtotal = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const tax = +(subtotal * 0.067).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <div className="st-form-inner st-gap-4">
      <div className="cart__header">
        <h2>Shopping Cart ({items.length} Items)</h2>
        <p className="cart__subtitle">Review your curated selection before finalization.</p>
      </div>

      <div className="cart__layout">
        <div className="cart__items">

          {items.length === 0 && (
            <div className="cart__empty">
              <p>Your cart is empty.</p>
              <Button
                label="Continue Shopping"
                variant="secondary"
                onClick={handleContinueShopping}
                type="button"
              />
            </div>
          )}

          {items.map((item) => (
            <div className="cart__item" key={item._id}>
              <div className="cart__item-image">
                {item.image
                  ? <img src={item.image} alt={item.product_name} />
                  : <div className="cart__item-image-placeholder" />
                }
              </div>

              <div className="cart__item-details">
                <div className="cart__item-top">
                  <div>
                    <h4 className="cart__item-name">{item.product_name}</h4>
                    <p className="cart__item-meta">
                      Product name: {item.sku || '—'} • {item.variant || ''}
                    </p>
                  </div>
                  <span className="cart__item-price">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>

                <div className="cart__item-actions">
                  <div className="cart__qty">
                    <button
                      className="cart__qty-btn"
                      onClick={() => handleQuantityChange(item, -1)}
                      type="button"
                    >−</button>
                    <span className="cart__qty-value">{item.quantity || 1}</span>
                    <button
                      className="cart__qty-btn"
                      onClick={() => handleQuantityChange(item, 1)}
                      type="button"
                    >+</button>
                  </div>
                  <button
                    className="cart__remove"
                    onClick={() => handleRemove(item._id)}
                    type="button"
                  >
                    <span className="cart__remove-icon">🗑</span> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="cart__footer-action">
            <button
              className="cart__continue"
              onClick={handleContinueShopping}
              type="button"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        <div className="cart__summary">
          <h3 className="cart__summary-title">Order Summary</h3>

          <div className="cart__summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart__summary-row">
            <span>Shipping</span>
            <a className="cart__summary-link" href="#">Calculated at next step</a>
          </div>
          <div className="cart__summary-row">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="cart__summary-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <div className="cart__promo">
            <label className="cart__promo-label">PROMO CODE</label>
            <div className="cart__promo-row">
              {/* <Input
                name="promo_code"
                placeholder="Enter code"
                className="cart__promo-input"
              /> */}
              <Button
                label="APPLY"
                variant="secondary"
                type="button"
                onClick={handleApplyPromo}
              />
            </div>
          </div>

          <Button
            label="Proceed to Checkout"
            variant="primary"
            type="button"
            onClick={handleCheckout}
            disabled={items.length === 0}
          />

          <p className="cart__secure-note">SECURE CHECKOUT POWERED BY CURATED PAY</p>

          <div className="cart__guarantee">
            <span className="cart__guarantee-icon">🛡</span>
            <div>
              <strong>Authenticity Guaranteed</strong>
              <p>Every item is hand-inspected by our curators.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;