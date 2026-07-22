import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, updateCart, removeFromCart, applyCoupon, removeCoupon } from "@Store/slices/cartSlice";
import Button from "@Component/Buttons";
import SEO from "@Component/SEO";
import "./styles.scss";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total_quantity, total_price, coupon, grand_total, loading } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleQuantityChange = (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    const availableStock = item?.product_id?.stock;
    if (newQty < 1) return;
    if (typeof availableStock === 'number' && newQty > availableStock) return;
    dispatch(updateCart({ product_id: item?.product_id?._id, quantity: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    dispatch(applyCoupon(couponCode.trim())).unwrap().then(() => setCouponCode("")).catch(() => {});
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  return (
    <div className="st-cart eshop-container">
      <SEO title="Shopping Cart" description="Review the items in your cart before checkout." noindex />
      <h1 className="st-cart__title">Shopping Cart ({total_quantity} Items)</h1>

      <div className="st-cart__layout">
        <div className="st-cart__items">
          {items?.length === 0 ? (
            <div className="st-cart__empty">
              <p>Your cart is empty.</p>
              <Button label="Continue Shopping" onClick={() => navigate("/products")} />
            </div>
          ) : (
            items?.map((item) => (
              <div className="st-cart__item" key={item.product_id?._id}>
                <div className="st-cart__image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="st-cart__placeholder" />
                  )}
                </div>

                <div className="st-cart__details">
                  <h4>{item.name}</h4>
                  <span className="st-cart__price">
                    ${item.subtotal?.toFixed(2)}
                  </span>

                  <div className="st-cart__actions">
                    <div className="st-cart__qty">
                      <button onClick={() => handleQuantityChange(item, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        disabled={typeof item?.product_id?.stock === 'number' && item.quantity >= item.product_id.stock}
                      >
                        +
                      </button>
                    </div>
                    {typeof item?.product_id?.stock === 'number' && item.quantity >= item.product_id.stock && (
                      <span className="st-cart__stock-limit">Max available in stock</span>
                    )}
                    <button
                      className="st-cart__remove"
                      onClick={() => handleRemove(item?.product_id?._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="st-cart__summary">
          <h3>Order Summary</h3>
          <div className="st-cart__summary-row">
            <span>Items:</span>
            <span>{total_quantity}</span>
          </div>
          <div className="st-cart__summary-row">
            <span>Subtotal:</span>
            <span>${total_price?.toFixed(2)}</span>
          </div>

          {coupon?.code ? (
            <>
              <div className="st-cart__summary-row st-cart__summary-discount">
                <span>Discount ({coupon.code}):</span>
                <span>-${coupon.discount_amount?.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="st-cart__coupon-remove"
                onClick={handleRemoveCoupon}
                disabled={loading}
              >
                Remove coupon
              </button>
            </>
          ) : (
            <form className="st-cart__coupon" onSubmit={handleApplyCoupon}>
              <input
                type="text"
                className="st-cart__coupon-input"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <button type="submit" className="st-cart__coupon-apply" disabled={loading || !couponCode.trim()}>
                Apply
              </button>
            </form>
          )}

          <div className="st-cart__summary-row st-cart__summary-total">
            <span>Total:</span>
            <strong>${(grand_total ?? total_price)?.toFixed(2)}</strong>
          </div>
          <Button
            label="Checkout"
            variant="primary"
            onClick={() => navigate("/checkout")}
            disabled={!items?.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
