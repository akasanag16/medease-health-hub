
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PatientAssignment {
  id: string;
  patient_id: string;
  doctor_id: string;
  assigned_at: string;
  is_active: boolean;
  notes: string | null;
  patient_profile?: {
    first_name: string | null;
    last_name: string | null;
  };
  doctor_profile?: {
    first_name: string | null;
    last_name: string | null;
    specialization: string | null;
  };
}

export const usePatientAssignments = () => {
  const [assignments, setAssignments] = useState<PatientAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetchAssignments();
  }, [user?.id]);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_doctor_assignments')
        .select(`
          *,
          patient_profile:profiles!patient_doctor_assignments_patient_id_fkey(first_name, last_name),
          doctor_profile:profiles!patient_doctor_assignments_doctor_id_fkey(first_name, last_name, specialization)
        `)
        .eq('doctor_id', user?.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching assignments:', error);
      } else {
        setAssignments(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignPatient = async (patientId: string, notes?: string) => {
    if (!user) return false;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', patientId)
        .single();

      if (profileError || !profileData) {
        toast({
          title: "Patient not found",
          description: "No patient found with this ID",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('patient_doctor_assignments')
        .insert([
          {
            patient_id: profileData.id,
            doctor_id: user.id,
            notes: notes || null
          }
        ]);

      if (error) {
        console.error('Error assigning patient:', error);
        toast({
          title: "Error",
          description: "Failed to assign patient",
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Patient assigned!",
          description: "Patient has been successfully assigned to you",
        });
        await fetchAssignments();
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const unassignPatient = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('patient_doctor_assignments')
        .update({ is_active: false })
        .eq('id', assignmentId);

      if (error) {
        console.error('Error unassigning patient:', error);
        toast({
          title: "Error",
          description: "Failed to unassign patient",
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Patient unassigned",
          description: "Patient has been unassigned",
        });
        await fetchAssignments();
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    assignments,
    loading,
    assignPatient,
    unassignPatient,
    refetchAssignments: fetchAssignments
  };
};
