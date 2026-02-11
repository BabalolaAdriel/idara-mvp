// Footer Component

import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>© {currentYear} Idara.</span>
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for Gemini Day Hackathon</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Support
            </a>
          </div>

          {/* Version */}
          <div className="text-xs text-gray-500">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}
