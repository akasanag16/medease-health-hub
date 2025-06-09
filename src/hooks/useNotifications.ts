
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Setup realtime subscription with proper cleanup
      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user?.id}`
          },
          (payload) => {
            console.log('New notification received:', payload);
            const newNotification = payload.new as any;
            const typedNotification: Notification = {
              id: newNotification.id,
              title: newNotification.title,
              message: newNotification.message,
              type: ['info', 'warning', 'success', 'error'].includes(newNotification.type) ? newNotification.type : 'info',
              priority: ['low', 'medium', 'high'].includes(newNotification.priority) ? newNotification.priority : 'medium',
              is_read: newNotification.is_read,
              related_table: newNotification.related_table,
              related_id: newNotification.related_id,
              created_at: newNotification.created_at,
              read_at: newNotification.read_at
            };
            
            setNotifications(prev => [typedNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast for high priority notifications
            if (typedNotification.priority === 'high') {
              toast({
                title: typedNotification.title,
                description: typedNotification.message,
                duration: 10000,
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user?.id}`
          },
          (payload) => {
            console.log('Notification updated:', payload);
            const updatedNotification = payload.new as any;
            const typedNotification: Notification = {
              id: updatedNotification.id,
              title: updatedNotification.title,
              message: updatedNotification.message,
              type: ['info', 'warning', 'success', 'error'].includes(updatedNotification.type) ? updatedNotification.type : 'info',
              priority: ['low', 'medium', 'high'].includes(updatedNotification.priority) ? updatedNotification.priority : 'medium',
              is_read: updatedNotification.is_read,
              related_table: updatedNotification.related_table,
              related_id: updatedNotification.related_id,
              created_at: updatedNotification.created_at,
              read_at: updatedNotification.read_at
            };
            
            setNotifications(prev => 
              prev.map(n => n.id === typedNotification.id ? typedNotification : n)
            );
            if (typedNotification.is_read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        )
        .subscribe();

      // Cleanup function
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, toast]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive"
        });
      } else {
        // Type-safe mapping to ensure correct types
        const typedNotifications: Notification[] = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: ['info', 'warning', 'success', 'error'].includes(item.type) ? item.type as 'info' | 'warning' | 'success' | 'error' : 'info',
          priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority as 'low' | 'medium' | 'high' : 'medium',
          is_read: item.is_read,
          related_table: item.related_table,
          related_id: item.related_id,
          created_at: item.created_at,
          read_at: item.read_at
        }));
        
        setNotifications(typedNotifications);
        setUnreadCount(typedNotifications.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetchNotifications: fetchNotifications
  };
};
