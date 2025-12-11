import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { ThemedConstellationBackground } from '../components/ThemedConstellationBackground';
import { StarRating } from '../components/StarRating';
import { User, Gamepass, UserRating } from '../types';
import { useAuth } from '../context/AuthContext';
import { ExternalLink, User as UserIcon } from 'lucide-react';
import { Crown, Heart } from 'lucide-react';

export const UserPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [gamepasses, setGamepasses] = useState<Gamepass[]>([]);
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username]);

  const fetchUserData = async () => {
    try {
      // Fetch user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('custom_link', username)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw userError;
        }
        return;
      }

      setUser(userData);

      // Fetch gamepasses
      const { data: gamepassData, error: gamepassError } = await supabase
        .from('gamepasses')
        .select('*')
        .eq('user_id', userData.id)
        .order('order');

      if (gamepassError) throw gamepassError;
      setGamepasses(gamepassData || []);

      // Fetch current user's rating for this user (if logged in)
      if (currentUser && currentUser.id !== userData.id) {
        const { data: ratingData } = await supabase
          .from('user_ratings')
          .select('*')
          .eq('user_id', userData.id)
          .eq('rater_id', currentUser.id)
          .single();
        
        setUserRating(ratingData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!currentUser || !user || currentUser.id === user.id) return;

    try {
      if (userRating) {
        // Update existing rating
        const { error } = await supabase
          .from('user_ratings')
          .update({ rating })
          .eq('id', userRating.id);

        if (error) throw error;
        setUserRating({ ...userRating, rating });
      } else {
        // Create new rating
        const { data, error } = await supabase
          .from('user_ratings')
          .insert({
            user_id: user.id,
            rater_id: currentUser.id,
            rating
          })
          .select()
          .single();

        if (error) throw error;
        setUserRating(data);
      }

      // Refresh user data to get updated rating average
      fetchUserData();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-24 w-24 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">User Not Found</h1>
          <p className="text-purple-300">The user "{username}" doesn't exist or hasn't created a page yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Constellation Background */}
      <ThemedConstellationBackground 
        theme={user.theme || 'default'} 
        customColor={user.custom_background_color || '#ffffff'} 
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* User Profile Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <img
            src={user.avatar_url}
            alt={user.username}
            className="h-32 w-32 rounded-full mx-auto mb-6 border-4 border-white hover:border-gray-300 transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-glow"
          />
          <div className="flex items-center justify-center space-x-3 mb-2">
            <h1 className="text-4xl font-bold text-white">{user.username}</h1>
            {user.tier === 'premium' && (
              <Crown className="h-8 w-8 text-yellow-400 animate-spin-slow" />
            )}
            {user.tier === 'supporter' && (
              <Heart className="h-8 w-8 text-pink-400 animate-bounce" />
            )}
          </div>
          {user.discord_id === '1189666481278025860' ? (
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-full text-lg font-bold animate-pulse animate-glow">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span>Creator of Rolink</span>
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-300 mb-4">Roblox Creator</p>
          )}
          
          {/* User Description */}
          {user.description && (
            <div className="mb-4">
              <p className="text-gray-300 max-w-md mx-auto italic">
                "{user.description}"
              </p>
            </div>
          )}
          
          {/* Rating Display */}
          <div className="flex flex-col items-center space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <StarRating 
                rating={Number(user.rating_average) || 0} 
                readonly 
                size="md"
              />
              <span className="text-white font-medium">
                {user.rating_average ? Number(user.rating_average).toFixed(1) : '0.0'}
              </span>
              <span className="text-gray-400 text-sm">
                ({user.rating_count || 0} {user.rating_count === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
            
            {/* Rating Input (only for logged in users who aren't viewing their own page) */}
            {currentUser && currentUser.id !== user.id && (
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm text-gray-400">Rate this creator:</span>
                <StarRating 
                  rating={userRating?.rating || 0}
                  onRatingChange={handleRating}
                  size="md"
                />
                {userRating && (
                  <span className="text-xs text-gray-500">
                    You rated: {userRating.rating} star{userRating.rating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-gray-600">
              www.rolink.zone.id/{user.custom_link}
            </span>
            {user.tier !== 'free' && (
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                user.tier === 'premium' 
                  ? 'bg-yellow-400 text-black border border-yellow-500' 
                  : 'bg-pink-400 text-black border border-pink-500'
              }`}>
                {user.tier === 'premium' ? 'Premium' : 'Supporter'}
              </span>
            )}
          </div>
        </div>

        {/* Gamepasses Section */}
        <div className={`backdrop-blur-sm rounded-lg p-8 border ${
          user.tier === 'premium' 
            ? 'bg-gray-900/80 border-yellow-400 animate-fade-in-up animation-delay-200' 
            : user.tier === 'supporter'
            ? 'bg-gray-900/80 border-pink-400 animate-fade-in-up animation-delay-200'
            : 'bg-gray-900/80 border-gray-600 animate-fade-in-up animation-delay-200'
        } hover:border-opacity-100 transition-all duration-500`}>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Available Gamepasses
          </h2>

          {gamepasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gamepasses.map((gamepass) => (
                <div
                  key={gamepass.id}
                  className="bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 border border-gray-600 hover:border-white transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {gamepass.title}
                  </h3>
                  
                  {gamepass.link ? (
                    <a
                      href={gamepass.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <span>View on Roblox</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Link not provided</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">
                No gamepasses available yet
              </div>
              <p className="text-gray-400 mt-2">
                This creator hasn't added any gamepasses to showcase.
              </p>
            </div>
          )}
        </div>

        {/* Share Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-300 mb-4">Share this page:</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-gray-600 hover:border-white transform hover:scale-105"
            >
              Copy Link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=Check out ${user.username}'s Roblox gamepasses on Rolink!&url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Share on Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};