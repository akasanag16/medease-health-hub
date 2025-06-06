
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MoodLog {
  id: string;
  mood_level: 'very_sad' | 'sad' | 'neutral' | 'happy' | 'very_happy';
  note: string | null;
  log_date: string;
  log_time: string;
  created_at: string;
}

export const useMoodLogs = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMoodLogs();
    }
  }, [user]);

  const fetchMoodLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('log_date', { ascending: false })
        .order('log_time', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching mood logs:', error);
        toast({
          title: "Error",
          description: "Failed to load mood history",
          variant: "destructive"
        });
      } else {
        setMoodLogs(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMoodLog = async (moodLevel: number, note: string) => {
    const moodLevelMap = {
      1: 'very_sad',
      2: 'sad', 
      3: 'neutral',
      4: 'happy',
      5: 'very_happy'
    } as const;

    try {
      const { error } = await supabase
        .from('mood_logs')
        .insert([
          {
            user_id: user?.id,
            mood_level: moodLevelMap[moodLevel as keyof typeof moodLevelMap],
            note: note || null,
          }
        ]);

      if (error) {
        console.error('Error saving mood log:', error);
        toast({
          title: "Error",
          description: "Failed to save mood entry",
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Mood logged successfully!",
          description: "Your mood has been recorded for today",
        });
        fetchMoodLogs(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return { moodLogs, loading, saveMoodLog, refetchMoodLogs: fetchMoodLogs };
};
