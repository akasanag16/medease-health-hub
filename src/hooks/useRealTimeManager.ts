
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RealTimeData {
  appointments: any[];
  medications: any[];
  labResults: any[];
  moodLogs: any[];
  notifications: any[];
  patientAssignments: any[];
}

interface RealTimeStats {
  unreadNotifications: number;
  todayAppointments: number;
  overdueReminders: number;
  pendingLabResults: number;
}

export const useRealTimeManager = () => {
  const [data, setData] = useState<RealTimeData>({
    appointments: [],
    medications: [],
    labResults: [],
    moodLogs: [],
    notifications: [],
    patientAssignments: []
  });
  
  const [stats, setStats] = useState<RealTimeStats>({
    unreadNotifications: 0,
    todayAppointments: 0,
    overdueReminders: 0,
    pendingLabResults: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const channelRef = useRef<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const initializeRealTime = async () => {
      try {
        // Fetch initial data
        await fetchAllData();
        
        // Setup single consolidated real-time channel
        setupRealTimeChannel();
        
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Real-time initialization error:', error);
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error",
          description: "Real-time updates may be delayed",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeRealTime();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  const fetchAllData = async () => {
    if (!user?.id) return;

    try {
      const [
        appointmentsResult,
        medicationsResult,
        labResultsResult,
        moodLogsResult,
        notificationsResult,
        assignmentsResult
      ] = await Promise.all([
        supabase.from('appointments').select('*').eq('user_id', user.id).order('appointment_date', { ascending: true }),
        supabase.from('medications').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('lab_results').select('*').eq('user_id', user.id).order('test_date', { ascending: false }),
        supabase.from('mood_logs').select('*').eq('user_id', user.id).order('log_date', { ascending: false }).limit(10),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
        supabase.from('patient_doctor_assignments').select(`
          *,
          patient_profile:profiles!patient_doctor_assignments_patient_id_fkey(first_name, last_name),
          doctor_profile:profiles!patient_doctor_assignments_doctor_id_fkey(first_name, last_name, specialization)
        `).eq('is_active', true).order('assigned_at', { ascending: false })
      ]);

      setData({
        appointments: appointmentsResult.data || [],
        medications: medicationsResult.data || [],
        labResults: labResultsResult.data || [],
        moodLogs: moodLogsResult.data || [],
        notifications: notificationsResult.data || [],
        patientAssignments: assignmentsResult.data || []
      });

      updateStats({
        appointments: appointmentsResult.data || [],
        medications: medicationsResult.data || [],
        labResults: labResultsResult.data || [],
        notifications: notificationsResult.data || []
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateStats = (currentData: any) => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayAppointments = currentData.appointments.filter((apt: any) => 
      apt.appointment_date === today && apt.status === 'scheduled'
    ).length;

    const unreadNotifications = currentData.notifications.filter((notif: any) => !notif.is_read).length;
    const pendingLabResults = currentData.labResults.filter((lab: any) => lab.status === 'pending').length;

    setStats({
      unreadNotifications,
      todayAppointments,
      overdueReminders: 0, // Will be calculated based on medication schedules
      pendingLabResults
    });
  };

  const setupRealTimeChannel = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`real-time-manager-${user?.id}-${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `user_id=eq.${user?.id}`
      }, handleAppointmentChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'medications',
        filter: `user_id=eq.${user?.id}`
      }, handleMedicationChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lab_results',
        filter: `user_id=eq.${user?.id}`
      }, handleLabResultChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mood_logs',
        filter: `user_id=eq.${user?.id}`
      }, handleMoodLogChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      }, handleNotificationChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patient_doctor_assignments'
      }, handleAssignmentChange)
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
        }
      });

    channelRef.current = channel;
  };

  const handleAppointmentChange = (payload: any) => {
    console.log('Appointment change:', payload);
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setData(prev => {
      let newAppointments = [...prev.appointments];
      
      if (eventType === 'INSERT') {
        newAppointments = [newRecord, ...newAppointments];
        toast({
          title: "New Appointment",
          description: `Appointment with ${newRecord.doctor_name} scheduled for ${newRecord.appointment_date}`,
        });
      } else if (eventType === 'UPDATE') {
        newAppointments = newAppointments.map(apt => apt.id === newRecord.id ? newRecord : apt);
        toast({
          title: "Appointment Updated",
          description: `Your appointment with ${newRecord.doctor_name} has been updated`,
        });
      } else if (eventType === 'DELETE') {
        newAppointments = newAppointments.filter(apt => apt.id !== oldRecord.id);
        toast({
          title: "Appointment Cancelled",
          description: `Appointment with ${oldRecord.doctor_name} has been cancelled`,
          variant: "destructive"
        });
      }
      
      const newData = { ...prev, appointments: newAppointments };
      updateStats(newData);
      return newData;
    });
  };

  const handleMedicationChange = (payload: any) => {
    console.log('Medication change:', payload);
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setData(prev => {
      let newMedications = [...prev.medications];
      
      if (eventType === 'INSERT') {
        newMedications = [newRecord, ...newMedications];
        toast({
          title: "New Medication",
          description: `${newRecord.name} has been added to your medications`,
        });
      } else if (eventType === 'UPDATE') {
        newMedications = newMedications.map(med => med.id === newRecord.id ? newRecord : med);
        toast({
          title: "Medication Updated",
          description: `${newRecord.name} has been updated`,
        });
      } else if (eventType === 'DELETE') {
        newMedications = newMedications.filter(med => med.id !== oldRecord.id);
      }
      
      return { ...prev, medications: newMedications };
    });
  };

  const handleLabResultChange = (payload: any) => {
    console.log('Lab result change:', payload);
    const { eventType, new: newRecord } = payload;
    
    setData(prev => {
      let newLabResults = [...prev.labResults];
      
      if (eventType === 'INSERT') {
        newLabResults = [newRecord, ...newLabResults];
        toast({
          title: "New Lab Result",
          description: `${newRecord.test_name} results are now available`,
          duration: 10000,
        });
      } else if (eventType === 'UPDATE') {
        newLabResults = newLabResults.map(lab => lab.id === newRecord.id ? newRecord : lab);
        if (newRecord.status === 'critical') {
          toast({
            title: "Critical Lab Result",
            description: `${newRecord.test_name} requires immediate attention`,
            variant: "destructive",
            duration: 15000,
          });
        }
      }
      
      const newData = { ...prev, labResults: newLabResults };
      updateStats(newData);
      return newData;
    });
  };

  const handleMoodLogChange = (payload: any) => {
    console.log('Mood log change:', payload);
    const { eventType, new: newRecord } = payload;
    
    setData(prev => {
      let newMoodLogs = [...prev.moodLogs];
      
      if (eventType === 'INSERT') {
        newMoodLogs = [newRecord, ...newMoodLogs].slice(0, 10);
      } else if (eventType === 'UPDATE') {
        newMoodLogs = newMoodLogs.map(mood => mood.id === newRecord.id ? newRecord : mood);
      }
      
      return { ...prev, moodLogs: newMoodLogs };
    });
  };

  const handleNotificationChange = (payload: any) => {
    console.log('Notification change:', payload);
    const { eventType, new: newRecord } = payload;
    
    setData(prev => {
      let newNotifications = [...prev.notifications];
      
      if (eventType === 'INSERT') {
        newNotifications = [newRecord, ...newNotifications];
        if (newRecord.priority === 'high' || newRecord.type === 'error') {
          toast({
            title: newRecord.title,
            description: newRecord.message,
            variant: newRecord.type === 'error' ? 'destructive' : 'default',
            duration: 10000,
          });
        }
      } else if (eventType === 'UPDATE') {
        newNotifications = newNotifications.map(notif => notif.id === newRecord.id ? newRecord : notif);
      }
      
      const newData = { ...prev, notifications: newNotifications };
      updateStats(newData);
      return newData;
    });
  };

  const handleAssignmentChange = (payload: any) => {
    console.log('Assignment change:', payload);
    fetchAllData(); // Refresh to get complete assignment data with profiles
  };

  return {
    data,
    stats,
    loading,
    connectionStatus,
    refetchAll: fetchAllData
  };
};
