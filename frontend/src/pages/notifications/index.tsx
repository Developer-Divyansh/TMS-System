import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../components/auth';
import { Button } from '../../components/common';
import api from '../../services/api';
import { Notification } from '../../types';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch notifications
        const notificationsResponse = await api.get('/api/notifications');
        setNotifications(notificationsResponse.data.data.notifications || []);

        // Fetch unread count
        const unreadCountResponse = await api.get('/api/notifications/unread-count');
        setUnreadCount(unreadCountResponse.data.data.count || 0);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shift_reminder':
        return '📅';
      case 'schedule_change':
        return '🔄';
      case 'timesheet_status':
        return '⏰';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'shift_reminder':
        return 'bg-blue-100 text-blue-800';
      case 'schedule_change':
        return 'bg-yellow-100 text-yellow-800';
      case 'timesheet_status':
        return 'bg-green-100 text-green-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔔 Notifications</h1>
            <p className="mt-2 text-gray-600">
              Stay updated with the latest information
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              onClick={handleMarkAllAsRead} 
              variant="outline"
              className="w-full sm:w-auto h-11"
            >
              ✓ Mark All as Read
            </Button>
          )}
        </div>

        {/* Unread Count Banner */}
        {unreadCount > 0 && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-5 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-blue-500 text-2xl">🔔</span>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-semibold text-blue-900">
                  You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-blue-700 mt-1">Click "Mark as Read" to clear them</p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`${
                    !notification.isRead 
                      ? 'bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  } transition-all duration-200`}
                >
                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 pt-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <span className="text-3xl">
                              {getNotificationIcon(notification.type)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <p className={`text-base font-semibold ${
                              notification.isRead ? 'text-gray-900' : 'text-blue-900'
                            }`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getNotificationTypeColor(notification.type)}`}>
                                {notification.type.replace('_', ' ').toUpperCase()}
                              </span>
                              {!notification.isRead && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white animate-pulse">
                                  NEW
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(notification.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col sm:flex-row gap-2">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-9 whitespace-nowrap"
                          >
                            ✓ Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(notification.id)}
                          className="h-9 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-gray-400 text-5xl">🔔</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for new notifications.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NotificationsPage;