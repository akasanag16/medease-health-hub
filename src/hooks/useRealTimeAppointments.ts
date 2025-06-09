
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  doctor_name: string;
  specialty: string | null;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
  location: string | null;
  notes: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  created_at: string;
}

export const useRealTimeAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAppointments();
      
      const channel = supabase
        .channel(`appointments-${user.id}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'appointments',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('New appointment:', payload);
            const newAppointment = payload.new as Appointment;
            setAppointments(prev => [...prev, newAppointment].sort((a, b) => 
              new Date(a.appointment_date + ' ' + a.appointment_time).getTime() - 
              new Date(b.appointment_date + ' ' + b.appointment_time).getTime()
            ));
            
            toast({
              title: "New Appointment",
              description: `Appointment with ${newAppointment.doctor_name} scheduled for ${newAppointment.appointment_date}`,
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'appointments',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Appointment updated:', payload);
            const updatedAppointment = payload.new as Appointment;
            setAppointments(prev => 
              prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
            );
            
            toast({
              title: "Appointment Updated",
              description: `Your appointment with ${updatedAppointment.doctor_name} has been updated`,
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'appointments',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Appointment deleted:', payload);
            const deletedAppointment = payload.old as Appointment;
            setAppointments(prev => prev.filter(apt => apt.id !== deletedAppointment.id));
            
            toast({
              title: "Appointment Cancelled",
              description: `Appointment with ${deletedAppointment.doctor_name} has been cancelled`,
              variant: "destructive"
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id, toast]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive"
        });
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: user?.id,
            ...appointmentData
          }
        ]);

      if (error) {
        console.error('Error creating appointment:', error);
        toast({
          title: "Error",
          description: "Failed to create appointment",
          variant: "destructive"
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating appointment:', error);
        toast({
          title: "Error",
          description: "Failed to update appointment",
          variant: "destructive"
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    refetchAppointments: fetchAppointments
  };
};
