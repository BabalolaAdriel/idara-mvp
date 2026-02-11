// Sidebar Component

import { Link, useLocation } from 'react-router-dom';
import { Home, Mic, Library, Settings, X } from 'lucide-react';
import useStore from '../../store/useStore.js';

export default function Sidebar() {
  const location = useLocation();
  const sidebarOpen = useStore(state => state.sidebarOpen);
  const toggleSidebar = useStore(state => state.toggleSidebar);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/record', icon: Mic, label: 'Record' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          w-64
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 lg:hidden">
            <span className="text-lg font-bold">Menu</span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${active
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-primary-700' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Idara MVP v1.0.0
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Gemini Day Hackathon
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
