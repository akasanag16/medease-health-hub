
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RealTimeData {
  appointments: any[];
  medications: any[];
  labResults: any[];
  moodLogs: any[];
  notifications: any[];
}

export const useRealTimeData = () => {
  const [data, setData] = useState<RealTimeData>({
    appointments: [],
    medications: [],
    labResults: [],
    moodLogs: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Initial data fetch
    fetchAllData();

    // Set up a single real-time subscription for all tables
    const channel = supabase
      .channel(`realtime-data-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments', filter: `user_id=eq.${user.id}` },
        () => fetchAppointments()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medications', filter: `user_id=eq.${user.id}` },
        () => fetchMedications()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lab_results', filter: `user_id=eq.${user.id}` },
        () => fetchLabResults()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mood_logs', filter: `user_id=eq.${user.id}` },
        () => fetchMoodLogs()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAppointments(),
      fetchMedications(),
      fetchLabResults(),
      fetchMoodLogs(),
      fetchNotifications()
    ]);
    setLoading(false);
  };

  const fetchAppointments = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: true });
    
    setData(prev => ({ ...prev, appointments: data || [] }));
  };

  const fetchMedications = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('name');
    
    setData(prev => ({ ...prev, medications: data || [] }));
  };

  const fetchLabResults = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('lab_results')
      .select('*')
      .eq('user_id', user.id)
      .order('test_date', { ascending: false });
    
    setData(prev => ({ ...prev, labResults: data || [] }));
  };

  const fetchMoodLogs = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false });
    
    setData(prev => ({ ...prev, moodLogs: data || [] }));
  };

  const fetchNotifications = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setData(prev => ({ ...prev, notifications: data || [] }));
  };

  return { data, loading, refetch: fetchAllData };
};
