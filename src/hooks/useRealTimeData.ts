// This hook has been deprecated and replaced by useRealTimeManager
// Keeping for backwards compatibility but redirecting to new implementation

import { useRealTimeManager } from './useRealTimeManager';

export const useRealTimeData = () => {
  const { data, loading, connectionStatus } = useRealTimeManager();
  
  return {
    data,
    loading,
    isConnected: connectionStatus === 'connected'
  };
};
