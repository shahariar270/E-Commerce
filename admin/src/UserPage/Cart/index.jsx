import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, updateCart, removeFromCart } from "@Store/slices/cartSlice";
import Button from "@Component/Buttons";
import "./styles.scss";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total_quantity, total_price } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleQuantityChange = (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    dispatch(updateCart({ product_id: item?.product_id?._id, quantity: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="st-cart">
      <div className="st-cart__header">
        <h2>Shopping Cart ({total_quantity} Items)</h2>
      </div>

      <div className="st-cart__layout">
        <div className="st-cart__items">
          {items?.length === 0 ? (
            <div className="st-cart__empty">
              <p>Your cart is empty.</p>
              <Button label="Continue Shopping" onClick={() => navigate("/")} />
            </div>
          ) : (
            items?.map((item) => (
              <div className="st-cart__item" key={item._id}>
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
                      <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                    </div>
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
          <div className="st-cart__summary-row st-cart__summary-total">
            <span>Total:</span>
            <strong>${total_price?.toFixed(2)}</strong>
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
