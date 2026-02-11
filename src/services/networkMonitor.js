// Network Monitor Service

let isOnlineStatus = navigator.onLine;
let listeners = [];

/**
 * Initialize network monitor
 * @param {Function} callback - Callback function for status changes
 * @returns {Function} Cleanup function
 */
export function initNetworkMonitor(callback) {
  const handleOnline = () => {
    isOnlineStatus = true;
    callback(true);
    notifyListeners(true);
  };

  const handleOffline = () => {
    isOnlineStatus = false;
    callback(false);
    notifyListeners(false);
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Get current online status
 * @returns {boolean} Current online status
 */
export function isOnline() {
  return isOnlineStatus;
}

/**
 * Add listener for network status changes
 * @param {Function} listener - Listener function
 */
export function addNetworkListener(listener) {
  listeners.push(listener);
}

/**
 * Remove listener
 * @param {Function} listener - Listener function to remove
 */
export function removeNetworkListener(listener) {
  listeners = listeners.filter(l => l !== listener);
}

/**
 * Notify all listeners of status change
 * @param {boolean} status - Current online status
 */
function notifyListeners(status) {
  listeners.forEach(listener => {
    try {
      listener(status);
    } catch (error) {
      console.error('Error in network listener:', error);
    }
  });
}

/**
 * Check if network is available with ping
 * @returns {Promise<boolean>} Network availability
 */
export async function checkNetworkAvailability() {
  if (!navigator.onLine) {
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      mode: 'no-cors',
      cache: 'no-store',
    });
    return true;
  } catch (error) {
    return false;
  }
}
