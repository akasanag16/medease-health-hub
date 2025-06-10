
import { useSimpleNotifications } from './useSimpleNotifications';

export const useEnhancedNotifications = () => {
  const { notifications, loading, unreadCount, markAsRead } = useSimpleNotifications();

  const markAllAsRead = async () => {
    // For now, just mark visible notifications as read one by one
    const unreadNotifications = notifications.filter(n => !n.is_read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
    return true;
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetchNotifications: () => {}
  };
};
