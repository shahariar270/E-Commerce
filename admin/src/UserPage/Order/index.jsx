import { getUserOrders } from "@Store/slices/orderSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss"

const Order = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector(state => state.order);

    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        dispatch(getUserOrders());
    }, [dispatch]);

    const toggleCard = (id) => {
        setOpenId(prev => (prev === id ? null : id));
    };

    return (
        <div className="st-page">
            <div className="st-page__header">
                <div className="st-page__title">
                    <h2>Your Orders</h2>
                    <p>Manage customer orders and track deliveries</p>
                </div>
            </div>

            <div className="st-order">
                <div className="st-order__list">
                    {orders?.map(order => {
                        const isOpen = openId === order._id;

                        return (
                            <div
                                className={`st-order__items ${isOpen ? "active" : ""}`}
                                key={order._id}
                            >

                                {/* Header (Clickable) */}
                                <div
                                    className="st-order__header"
                                    onClick={() => toggleCard(order._id)}
                                >
                                    <span className="st-order__id">
                                        Order ID: {order._id}
                                    </span>

                                    <div className="st-order__header-right">
                                        <span className={`st-order__status st-order__status--${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                        <span className="st-order__toggle">
                                            {isOpen ? "▲" : "▼"}
                                        </span>
                                    </div>
                                </div>

                                {/* Collapsible Content */}
                                {isOpen && (
                                    <div className="st-order__body">

                                        <div className="st-order__products">
                                            {order.items.map(item => (
                                                <div className="st-order__product" key={item._id}>
                                                    <div>
                                                        <h4>{item.name}</h4>
                                                        <p>Qty: {item.quantity}</p>
                                                    </div>
                                                    <div>
                                                        <p>৳ {item.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="st-order__footer">
                                            <div>
                                                <p>Total: ৳ {order.totalAmount}</p>
                                                <p>Payment: {order.paymentStatus}</p>
                                            </div>
                                            <div>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Order;