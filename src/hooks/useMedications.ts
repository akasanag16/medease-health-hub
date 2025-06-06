
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

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMedications();
    }
  }, [user]);

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medications:', error);
        toast({
          title: "Error",
          description: "Failed to load medications",
          variant: "destructive"
        });
      } else {
        setMedications(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMedication = async (medicationData: Omit<Medication, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('medications')
        .insert([
          {
            user_id: user?.id,
            ...medicationData
          }
        ]);

      if (error) {
        console.error('Error creating medication:', error);
        toast({
          title: "Error",
          description: "Failed to add medication",
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Medication added!",
          description: "Your medication has been added successfully",
        });
        fetchMedications();
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    try {
      const { error } = await supabase
        .from('medications')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating medication:', error);
        toast({
          title: "Error",
          description: "Failed to update medication",
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Medication updated!",
          description: "Your medication has been updated successfully",
        });
        fetchMedications();
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    medications,
    loading,
    createMedication,
    updateMedication,
    refetchMedications: fetchMedications
  };
};
