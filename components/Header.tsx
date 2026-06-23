import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  isLoggedIn: boolean;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLogin, onLogout, toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-gray-800/80 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <h1 className="text-xl font-bold text-white">Magistory AI</h1>
        </div>
        <nav>
          {isLoggedIn && user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="hidden md:inline text-sm font-medium">{user.name}</span>
              </button>
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-md shadow-lg py-2 z-20"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-600">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-300">Sisa Kredit: <span className="font-bold text-green-400">{user.credits}</span></p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
            >
              Login / Register
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;