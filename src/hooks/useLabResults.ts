
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LabResult {
  id: string;
  test_name: string;
  test_date: string;
  result_value: string | null;
  reference_range: string | null;
  unit: string | null;
  status: 'normal' | 'abnormal' | 'pending' | 'critical' | null;
  lab_name: string | null;
  doctor_name: string | null;
  notes: string | null;
  file_url: string | null;
  created_at: string;
}

interface NewLabResult {
  test_name: string;
  test_date: string;
  result_value: string;
  reference_range: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'pending' | 'critical';
  lab_name: string;
  doctor_name: string;
  notes: string;
}

export const useLabResults = () => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchLabResults();
    }
  }, [user]);

  const fetchLabResults = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('test_date', { ascending: false });

      if (error) {
        console.error('Error fetching lab results:', error);
        toast({
          title: "Error",
          description: "Failed to load lab results",
          variant: "destructive"
        });
      } else {
        setLabResults(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLabResult = async (labResult: NewLabResult) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('lab_results')
        .insert([
          {
            user_id: user.id,
            test_name: labResult.test_name,
            test_date: labResult.test_date,
            result_value: labResult.result_value || null,
            reference_range: labResult.reference_range || null,
            unit: labResult.unit || null,
            status: labResult.status,
            lab_name: labResult.lab_name || null,
            doctor_name: labResult.doctor_name || null,
            notes: labResult.notes || null
          }
        ]);

      if (error) {
        console.error('Error adding lab result:', error);
        toast({
          title: "Error",
          description: "Failed to add lab result",
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Lab result added!",
          description: "Your lab result has been added successfully",
        });
        fetchLabResults();
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    labResults,
    loading,
    addLabResult,
    refetchLabResults: fetchLabResults
  };
};
