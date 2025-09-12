import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-blue-600 rounded-lg"
            >
              <MapPin className="w-6 h-6 text-white" />
            </motion.div>
            <span
              className={`text-xl font-bold ${
                isScrolled || !isHomePage ? 'text-gray-900 dark:text-white' : 'text-white'
              }`}
            >
              EasyTrip
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`hover:text-blue-600 transition-colors ${
                    isScrolled || !isHomePage ? 'text-gray-700 dark:text-gray-300' : 'text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/trips"
                  className={`hover:text-blue-600 transition-colors ${
                    isScrolled || !isHomePage ? 'text-gray-700 dark:text-gray-300' : 'text-white'
                  }`}
                >
                  My Trips
                </Link>
                <div className="flex items-center space-x-4">
                  <span
                    className={`text-sm ${
                      isScrolled || !isHomePage ? 'text-gray-600 dark:text-gray-400' : 'text-white'
                    }`}
                  >
                    Hi, {user?.full_name.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : !isLoading ? (
              <>
                <Link
                  to="/login"
                  className={`hover:text-blue-600 transition-colors ${
                    isScrolled || !isHomePage ? 'text-gray-700 dark:text-gray-300' : 'text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <span className="text-gray-400">Loading...</span>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                isScrolled || !isHomePage
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                isScrolled || !isHomePage ? 'text-gray-700 dark:text-gray-300' : 'text-white hover:bg-white/10'
              }`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                isScrolled || !isHomePage ? 'text-gray-700 dark:text-gray-300' : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 py-4 space-y-4">
            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/trips"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  My Trips
                </Link>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hi, {user?.full_name}</p>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : !isLoading ? (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <span className="text-gray-400">Loading...</span>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};
