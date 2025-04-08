import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Don't render header on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white font-poppins">DogSwipe</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/discover"
              className={`text-white/80 hover:text-white transition-colors font-poppins ${
                isActive('/discover') ? 'text-white font-semibold' : ''
              }`}
            >
              Discover
            </Link>
            <Link
              to="/chat"
              className={`text-white/80 hover:text-white transition-colors font-poppins ${
                isActive('/chat') ? 'text-white font-semibold' : ''
              }`}
            >
              Chat
            </Link>
            <Link
              to="/profile"
              className={`text-white/80 hover:text-white transition-colors font-poppins ${
                isActive('/profile') ? 'text-white font-semibold' : ''
              }`}
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 