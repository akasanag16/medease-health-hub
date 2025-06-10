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
  created_at: string;
}

export const useSimpleNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching notifications:', error);
        } else if (mounted) {
          const typedNotifications: Notification[] = (data || []).map(item => ({
            id: item.id,
            title: item.title,
            message: item.message,
            type: ['info', 'warning', 'success', 'error'].includes(item.type) ? item.type as any : 'info',
            priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority as any : 'medium',
            is_read: item.is_read,
            created_at: item.created_at
          }));
          
          setNotifications(typedNotifications);
          setUnreadCount(typedNotifications.filter(n => !n.is_read).length);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    // Simple real-time subscription
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (!mounted) return;
          
          const newNotification = payload.new as any;
          const typedNotification: Notification = {
            id: newNotification.id,
            title: newNotification.title,
            message: newNotification.message,
            type: ['info', 'warning', 'success', 'error'].includes(newNotification.type) ? newNotification.type : 'info',
            priority: ['low', 'medium', 'high'].includes(newNotification.priority) ? newNotification.priority : 'medium',
            is_read: newNotification.is_read,
            created_at: newNotification.created_at
          };
          
          setNotifications(prev => [typedNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for high priority notifications
          if (typedNotification.priority === 'high') {
            toast({
              title: typedNotification.title,
              description: typedNotification.message,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (!error) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    refetch: () => {} // Simple placeholder
  };
};
