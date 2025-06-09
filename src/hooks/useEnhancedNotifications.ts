import { useRealTimeManager } from './useRealTimeManager';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  related_table: string | null;
  related_id: string | null;
  created_at: string;
  read_at: string | null;
}

export const useEnhancedNotifications = () => {
  const { data, stats, loading } = useRealTimeManager();
  const { user } = useAuth();

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    notifications: data.notifications,
    loading,
    unreadCount: stats.unreadNotifications,
    markAsRead,
    markAllAsRead,
    refetchNotifications: () => {} // Will be handled by centralized manager
  };
};
