// useNetworkStatus Hook

import { useState, useEffect } from 'react';
import { initNetworkMonitor, isOnline as checkIsOnline } from '../services/networkMonitor.js';
import useStore from '../store/useStore.js';

export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(checkIsOnline());
  const setOnlineStatus = useStore(state => state.setOnlineStatus);

  useEffect(() => {
    // Initialize network monitor
    const cleanup = initNetworkMonitor((status) => {
      setIsOnline(status);
      setOnlineStatus(status);
    });

    // Set initial status
    const initialStatus = checkIsOnline();
    setIsOnline(initialStatus);
    setOnlineStatus(initialStatus);

    return cleanup;
  }, [setOnlineStatus]);

  return { isOnline };
}
