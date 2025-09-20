import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Building2, Sparkles, User, Shield } from 'lucide-react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const storedToken = localStorage.getItem('internship_token');
    const storedUsername = localStorage.getItem('internship_username');
    const storedIsAdmin = localStorage.getItem('is_admin') === 'true';
    if (storedToken && storedUsername) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUsername(storedUsername);
      setIsAdmin(storedIsAdmin);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (authToken, userUsername, userIsAdmin) => {
    localStorage.setItem('internship_token', authToken);
    localStorage.setItem('internship_username', userUsername);
    localStorage.setItem('is_admin', userIsAdmin);
    setToken(authToken);
    setUsername(userUsername);
    setIsAdmin(userIsAdmin);
    setIsLoggedIn(true);
    setMessage(`Welcome back, ${userUsername}! 🎉`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('internship_token');
    localStorage.removeItem('internship_username');
    localStorage.removeItem('is_admin');
    setToken('');
    setUsername('');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage('dashboard');
    setMessage('Successfully logged out. See you soon! 👋');
    setTimeout(() => setMessage(''), 3000);
  };

  const toggleTheme = () => {
    setIsDark(prevTheme => !prevTheme);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard token={token} username={username} onMessage={setMessage} />;
      case 'profile':
        return <Profile token={token} username={username} onMessage={setMessage} />;
      case 'admin':
        return <AdminPanel token={token} onMessage={setMessage} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
                  InternshipHub
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Your Gateway to Amazing Opportunities
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Sun className={`absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
                  <Moon className={`absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-50'}`} />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              {isLoggedIn && (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage('profile')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => setCurrentPage('admin')}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Admin</span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {message && (
          <div className="mb-6 animate-fadeIn">
            <div className="max-w-2xl mx-auto p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-blue-700 dark:text-blue-300 font-medium">{message}</p>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto">
          {!isLoggedIn ? (
            <AuthForm onAuthSuccess={handleLogin} onMessage={setMessage} />
          ) : (
            renderPage()
          )}
        </div>
      </main>
      {!isLoggedIn && (
        <footer className="mt-auto py-8 text-center text-gray-500 dark:text-gray-400">
          <div className="container mx-auto px-4">
            <p className="text-sm">
              © 2025 InternshipHub. Connecting talent with opportunity.
            </p>
          </div>
        </footer>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default App;