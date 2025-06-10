
import { useSimpleNotifications } from './useSimpleNotifications';

// Simple replacement for the complex useRealTimeManager
export const useRealTimeData = () => {
  const { notifications, loading, unreadCount } = useSimpleNotifications();
  
  return {
    data: {
      notifications,
      appointments: [],
      medications: [],
      labResults: [],
      moodLogs: [],
      patientAssignments: []
    },
    loading,
    isConnected: true // Simplified for now
  };
};
