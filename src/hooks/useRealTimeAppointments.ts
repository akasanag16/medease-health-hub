import { useRealTimeManager } from './useRealTimeManager';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { data, loading } = useRealTimeManager();
  const { user } = useAuth();
  const { toast } = useToast();

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
    appointments: data.appointments,
    loading,
    createAppointment,
    updateAppointment,
    refetchAppointments: () => {} // Will be handled by centralized manager
  };
};
