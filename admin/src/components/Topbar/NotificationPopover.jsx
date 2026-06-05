import React from 'react';
import { Link } from 'react-router-dom';
import { Popover } from '@Component/Popover';

const NOTIFICATIONS = [
  {
    id: 1,
    message: "New order received #1234",
    time: "2 min ago",
    link: "/admin/orders",
    type: "order"
  },
  {
    id: 2,
    message: "New customer registered",
    time: "15 min ago",
    link: "/admin/profile",
    type: "user"
  },
  {
    id: 3,
    message: "Product 'iPhone 15' is low on stock",
    time: "1 hour ago",
    link: "/admin/products",
    type: "stock"
  },
  {
    id: 4,
    message: "Monthly sales report is ready",
    time: "3 hours ago",
    link: "/admin/dashboard",
    type: "report"
  }
];

export const NotificationPopover = () => {
  const trigger = (
    <button className="st-topbar__icon-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span className="st-topbar__icon-badge"></span>
    </button>
  );

  return (
    <div className="st-notifications-popover-container">
      <Popover label={trigger} hoverType="div">
        <div className="st-notifications-popover">
          <div className="st-notifications-popover__header">
            <h3>Notifications</h3>
            <button className="st-notifications-popover__mark-read">Mark all as read</button>
          </div>
          <div className="st-notifications-popover__list">
            {NOTIFICATIONS.map((item) => (
              <Link 
                key={item.id} 
                to={item.link} 
                className="st-notifications-popover__item"
              >
                <div className="st-notifications-popover__item-content">
                  <p className="st-notifications-popover__item-msg">{item.message}</p>
                  <span className="st-notifications-popover__item-time">{item.time}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="st-notifications-popover__footer">
            <Link to="/admin/dashboard">View all notifications</Link>
          </div>
        </div>
      </Popover>
    </div>
  );
};
