import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { StarRating } from '../components/StarRating';
import { User } from '../types';
import { Users, ExternalLink } from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Constellation Background */}
      <ConstellationBackground />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="relative">
            <Users className="h-16 w-16 text-white mx-auto mb-4 animate-pulse animate-glow" />
            <div className="absolute inset-0 h-16 w-16 mx-auto mb-4 bg-white rounded-full blur-lg opacity-30 animate-ping"></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 animate-glow animate-float">Browse Creators</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover amazing Roblox gamepasses from creators around the community
          </p>
        </div>

        {/* Users Grid */}
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-white/20 animate-fade-in-up"
                style={{ animationDelay: `${users.indexOf(user) * 100}ms` }}
              >
                <div className="text-center">
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="h-20 w-20 rounded-full mx-auto mb-4 border-2 border-white hover:border-gray-300 transition-all duration-300 hover:scale-110 animate-glow"
                  />
                  <h3 className="text-xl font-semibold text-white mb-2 animate-glow">
                    {user.username}
                  </h3>
                  
                  {/* User Description */}
                  {user.description && (
                    <p className="text-gray-400 text-sm mb-2 italic line-clamp-2">
                      "{user.description}"
                    </p>
                  )}
                  
                  {/* Rating Display */}
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <StarRating 
                      rating={Number(user.rating_average) || 0} 
                      readonly 
                      size="sm"
                    />
                    <span className="text-white text-sm">
                      {user.rating_average ? Number(user.rating_average).toFixed(1) : '0.0'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      ({user.rating_count || 0})
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    rolink.com/{user.custom_link}
                  </p>
                  
                  <div className="space-y-2">
                    <Link
                      to={`/u/${user.custom_link}`}
                      className="block w-full bg-white text-black hover:bg-gray-200 py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 animate-glow"
                    >
                      View Page
                    </Link>
                    <a
                      href={`${window.location.origin}/u/${user.custom_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 w-full bg-gray-800/50 hover:bg-gray-700/50 text-white py-2 px-4 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-24 w-24 text-white mx-auto mb-4 animate-pulse animate-glow" />
            <h2 className="text-2xl font-bold text-white mb-2 animate-glow">No Creators Yet</h2>
            <p className="text-gray-300">
              Be the first to create a page and share your Roblox gamepasses!
            </p>
          </div>
        )}

        {/* Stats */}
        {users.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 inline-block hover:border-white/40 transition-all duration-300 animate-fade-in-up hover:shadow-2xl hover:shadow-white/10">
              <div className="text-3xl font-bold text-white mb-2 animate-glow">{users.length}</div>
              <div className="text-gray-300">
                {users.length === 1 ? 'Creator' : 'Creators'} on Rolink
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};