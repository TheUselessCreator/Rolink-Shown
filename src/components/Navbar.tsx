import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, User, LogOut, Users, Crown, Heart, Zap, Star, Book } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="bg-black/80 backdrop-blur-lg border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-gray-300 transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <Gamepad2 className="h-8 w-8" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-white">
                Rolink
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {/* Browse Button */}
            <Link
              to="/browse"
              className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Browse</span>
            </Link>

            {/* Documentation Button */}
            <Link
              to="/docs"
              className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <Book className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Docs</span>
            </Link>

            {/* Pricing Button */}
            <Link
              to="/pricing"
              className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <Star className="h-4 w-4 group-hover:scale-110 transition-transform text-white" />
              <span className="font-medium">Plans</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Activate Premium Button (only for free users) */}
                {user.tier === 'free' && (
                  <Link
                    to="/activate"
                    className="group flex items-center space-x-2 bg-white text-black hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Upgrade</span>
                  </Link>
                )}

                {/* Dashboard Button */}
                <Link
                  to="/dashboard"
                  className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                {/* User Profile */}
                <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-3 py-2 border border-gray-600">
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="h-8 w-8 rounded-full border-2 border-white"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{user.username}</span>
                    {user.tier === 'premium' && (
                      <div className="flex items-center space-x-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs">
                        <Crown className="h-3 w-3" />
                        <span>Premium</span>
                      </div>
                    )}
                    {user.tier === 'supporter' && (
                      <div className="flex items-center space-x-1 bg-pink-400 text-black px-2 py-1 rounded-full text-xs">
                        <Heart className="h-3 w-3" />
                        <span>Supporter</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-red-400 transition-all duration-300 p-2 rounded-lg hover:bg-gray-800"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="group bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                <span className="flex items-center space-x-2">
                  <span>Login with Discord</span>
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};