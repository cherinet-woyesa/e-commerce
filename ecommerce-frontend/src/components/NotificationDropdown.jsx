import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { FiBell, FiShoppingBag, FiTag, FiTruck } from 'react-icons/fi';

const NotificationDropdown = ({ isOpen, onClose }) => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped',
      time: '2 hours ago',
      icon: <FiTruck className="text-blue-500" />,
      link: '/orders/12345'
    },
    {
      id: 2,
      type: 'sale',
      title: 'Flash Sale',
      message: 'Up to 50% off on selected items',
      time: '5 hours ago',
      icon: <FiTag className="text-red-500" />,
      link: '/flash-sale'
    },
    {
      id: 3,
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order #12340 has been delivered',
      time: '1 day ago',
      icon: <FiShoppingBag className="text-green-500" />,
      link: '/orders/12340'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <span className="text-sm text-gray-500">{notifications.length} new</span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <FiBell className="mx-auto text-gray-300 text-4xl mb-2" />
            <p className="text-gray-500">No new notifications</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.link}
                className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <div className="p-2 bg-gray-50 rounded-full">
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/notifications"
              className="block w-full py-2 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={onClose}
            >
              View All Notifications
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown; 