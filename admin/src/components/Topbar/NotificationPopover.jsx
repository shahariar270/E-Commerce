import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Popover } from '@Component/Popover';
import { markAllRead } from '@Store/slices/adminNotificationSlice';

const timeAgo = (isoString) => {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export const NotificationPopover = () => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((state) => state.adminNotifications);

  const trigger = (
    <button className="st-topbar__icon-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      {unreadCount > 0 && <span className="st-topbar__icon-badge"></span>}
    </button>
  );

  return (
    <div className="st-notifications-popover-container">
      <Popover label={trigger} hoverType="div">
        <div className="st-notifications-popover">
          <div className="st-notifications-popover__header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="st-notifications-popover__mark-read"
                onClick={() => dispatch(markAllRead())}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="st-notifications-popover__list">
            {items.length === 0 && (
              <p className="st-notifications-popover__item-msg">No notifications yet</p>
            )}
            {items.map((item) => (
              <Link
                key={item.id}
                to={item.link || '/admin/dashboard'}
                className="st-notifications-popover__item"
              >
                <div className="st-notifications-popover__item-content">
                  <p className="st-notifications-popover__item-msg">{item.message}</p>
                  <span className="st-notifications-popover__item-time">{timeAgo(item.time)}</span>
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
