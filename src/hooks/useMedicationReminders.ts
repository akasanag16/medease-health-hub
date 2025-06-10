
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'as_needed' | 'weekly' | 'monthly';
  prescribed_by: string | null;
  start_date: string | null;
  end_date: string | null;
  instructions: string | null;
  side_effects: string | null;
  is_active: boolean;
  created_at: string;
}

interface MedicationReminder {
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: Date;
  taken: boolean;
}

export const useMedicationReminders = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todayReminders, setTodayReminders] = useState<MedicationReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetchMedications();
  }, [user?.id]);

  useEffect(() => {
    if (medications.length > 0) {
      generateTodayReminders();
    }
  }, [medications]);

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching medications:', error);
      } else {
        setMedications(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTodayReminders = () => {
    const today = new Date();
    const reminders: MedicationReminder[] = [];

    medications.forEach(medication => {
      if (!medication.is_active) return;

      const times = getScheduledTimes(medication.frequency);
      times.forEach(time => {
        const scheduledTime = new Date(today);
        scheduledTime.setHours(time.hour, time.minute, 0, 0);

        reminders.push({
          medicationId: medication.id,
          medicationName: medication.name,
          dosage: medication.dosage,
          scheduledTime,
          taken: false
        });
      });
    });

    reminders.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
    setTodayReminders(reminders);
  };

  const getScheduledTimes = (frequency: string) => {
    const times = [];
    switch (frequency) {
      case 'once_daily':
        times.push({ hour: 9, minute: 0 });
        break;
      case 'twice_daily':
        times.push({ hour: 9, minute: 0 }, { hour: 21, minute: 0 });
        break;
      case 'three_times_daily':
        times.push({ hour: 8, minute: 0 }, { hour: 14, minute: 0 }, { hour: 20, minute: 0 });
        break;
      case 'four_times_daily':
        times.push({ hour: 8, minute: 0 }, { hour: 12, minute: 0 }, { hour: 16, minute: 0 }, { hour: 20, minute: 0 });
        break;
      case 'weekly':
        times.push({ hour: 9, minute: 0 });
        break;
      case 'monthly':
        times.push({ hour: 9, minute: 0 });
        break;
      default:
        times.push({ hour: 9, minute: 0 });
    }
    return times;
  };

  const markMedicationTaken = (medicationId: string, scheduledTime: Date) => {
    setTodayReminders(prev => 
      prev.map(reminder => 
        reminder.medicationId === medicationId && 
        reminder.scheduledTime.getTime() === scheduledTime.getTime()
          ? { ...reminder, taken: true }
          : reminder
      )
    );

    toast({
      title: "Medication Taken",
      description: "Marked as taken successfully",
      variant: "default"
    });
  };

  return {
    medications,
    todayReminders,
    loading,
    markMedicationTaken,
    refetchMedications: fetchMedications
  };
};
