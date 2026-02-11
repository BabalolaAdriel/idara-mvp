// Header Component

import { Link } from 'react-router-dom';
import { Menu, Settings, Wifi, WifiOff } from 'lucide-react';
import useStore from '../../store/useStore.js';
import useNetworkStatus from '../../hooks/useNetworkStatus.js';

export default function Header() {
  const { isOnline } = useNetworkStatus();
  const toggleSidebar = useStore(state => state.toggleSidebar);
  const sidebarOpen = useStore(state => state.sidebarOpen);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Idara</span>
            </Link>
          </div>

          {/* Center - Navigation links (desktop) */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/record"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Record
            </Link>
            <Link
              to="/library"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Library
            </Link>
          </nav>

          {/* Right side - Network status and settings */}
          <div className="flex items-center space-x-4">
            {/* Network status indicator */}
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <>
                  <Wifi className="w-5 h-5 text-green-600" />
                  <span className="hidden sm:inline text-sm text-gray-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-600" />
                  <span className="hidden sm:inline text-sm text-red-600">Offline</span>
                </>
              )}
            </div>

            {/* Settings link */}
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
