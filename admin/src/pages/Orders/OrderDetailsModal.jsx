import React from "react";
import { Modal } from "@Component/Modal";

const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "-";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const customerEmail = order.email || order.user?.email || "-";
    const customerName = order.shippingAddress?.name || order.user?.name || "-";
    const initial = customerName?.trim()?.charAt(0)?.toUpperCase() || "?";

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Order #${order._id?.slice(-6).toUpperCase()}`}
        >
            <div className="order-details">
                <div className="order-details__row">
                    <span className={`badge badge--status badge--status-${order.status?.toLowerCase()}`}>
                        {order.status}
                    </span>
                    <span className={`badge badge--payment badge--${order.paymentStatus === 'paid' ? 'success' : 'danger'}`}>
                        Payment: {order.paymentStatus}
                    </span>
                    <span className="order-details__date">{formatDate(order.createdAt)}</span>
                </div>

                <div className="order-details__customer">
                    <div className="order-details__avatar">{initial}</div>
                    <div className="order-details__customer-info">
                        <div className="order-details__customer-name">{customerName}</div>
                        <div className="order-details__customer-links">
                            {customerEmail !== "-" && (
                                <a href={`mailto:${customerEmail}`} className="order-details__link">
                                    ✉️ {customerEmail}
                                </a>
                            )}
                            {order.shippingAddress?.phone && (
                                <a href={`tel:${order.shippingAddress.phone}`} className="order-details__link">
                                    📞 {order.shippingAddress.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="order-details__section">
                    <h3>📍 Shipping Address</h3>
                    <p className="order-details__address">
                        {order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}
                    </p>
                </div>

                <div className="order-details__section">
                    <h3>🛒 Items</h3>
                    <table className="order-details__items">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, idx) => (
                                <tr key={item.product?._id || item.product || idx}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatMoney(item.price)}</td>
                                    <td>{formatMoney(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="order-details__totals">
                    <div><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
                    {order.coupon?.code && (
                        <div>
                            <span>Coupon ({order.coupon.code})</span>
                            <span>-{formatMoney(order.coupon.discount_amount)}</span>
                        </div>
                    )}
                    <div className="order-details__totals--grand">
                        <span>Total</span><span>{formatMoney(order.totalAmount)}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OrderDetailsModal;
