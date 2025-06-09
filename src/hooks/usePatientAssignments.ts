
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
    email: string | null;
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
    if (user) {
      fetchAssignments();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      // First get assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('patient_doctor_assignments')
        .select('*')
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        toast({
          title: "Error",
          description: "Failed to load patient assignments",
          variant: "destructive"
        });
        return;
      }

      // Then get profile data for each assignment
      const enrichedAssignments: PatientAssignment[] = [];
      
      for (const assignment of assignmentsData || []) {
        // Get patient profile
        const { data: patientProfile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', assignment.patient_id)
          .single();

        // Get doctor profile
        const { data: doctorProfile } = await supabase
          .from('profiles')
          .select('first_name, last_name, specialization')
          .eq('id', assignment.doctor_id)
          .single();

        enrichedAssignments.push({
          ...assignment,
          patient_profile: patientProfile || undefined,
          doctor_profile: doctorProfile || undefined
        });
      }

      setAssignments(enrichedAssignments);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('patient-assignments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_doctor_assignments'
        },
        (payload) => {
          console.log('Assignment update:', payload);
          fetchAssignments(); // Refresh the full list with profile data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const assignPatient = async (patientEmail: string, notes?: string) => {
    if (!user) return false;

    try {
      // Find user by email using profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', patientEmail)
        .single();

      if (profileError || !profileData) {
        toast({
          title: "Patient not found",
          description: "No patient found with this email address",
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
