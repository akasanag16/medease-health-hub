
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RealTimeConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onUpdate?: (payload: any) => void;
}

export const useRealTimeData = (configs: RealTimeConfig[]) => {
  const [channels, setChannels] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const newChannels = configs.map((config, index) => {
      const channelName = `realtime-${config.table}-${index}`;
      
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: config.event || '*',
            schema: 'public',
            table: config.table,
            filter: config.filter
          },
          (payload) => {
            console.log(`Real-time update on ${config.table}:`, payload);
            if (config.onUpdate) {
              config.onUpdate(payload);
            }
          }
        )
        .subscribe();

      return channel;
    });

    setChannels(newChannels);

    return () => {
      newChannels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, configs.length]);

  return channels;
};
