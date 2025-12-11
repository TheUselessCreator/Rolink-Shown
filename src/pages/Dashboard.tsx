import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { ThemedConstellationBackground } from '../components/ThemedConstellationBackground';
import { Gamepass } from '../types';
import { Link, Plus, Trash2, Eye, ExternalLink, Crown, Heart, Palette, Save } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [gamepasses, setGamepasses] = useState<Gamepass[]>([]);
  const [loading, setLoading] = useState(true);
  const [customLink, setCustomLink] = useState('');
  const [userTier, setUserTier] = useState<'free' | 'supporter' | 'premium'>('free');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('default');
  const [customColor, setCustomColor] = useState('#ffffff');

  useEffect(() => {
    if (user) {
      setCustomLink(user.custom_link);
      setUserTier(user.tier);
      setDescription(user.description || '');
      setTheme(user.theme || 'default');
      setCustomColor(user.custom_background_color || '#ffffff');
      fetchGamepasses();
    }
  }, [user]);

  const fetchGamepasses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('gamepasses')
        .select('*')
        .eq('user_id', user.id)
        .order('order');

      if (error) throw error;
      setGamepasses(data || []);
    } catch (error) {
      console.error('Error fetching gamepasses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGamepass = async () => {
    const maxGamepasses = userTier === 'premium' ? 20 : userTier === 'supporter' ? 13 : 5;
    if (!user || gamepasses.length >= maxGamepasses) return;

    const newGamepass = {
      user_id: user.id,
      title: 'New Gamepass',
      link: '',
      order: gamepasses.length + 1
    };

    try {
      const { data, error } = await supabase
        .from('gamepasses')
        .insert([newGamepass])
        .select()
        .single();

      if (error) throw error;
      setGamepasses([...gamepasses, data]);
    } catch (error) {
      console.error('Error adding gamepass:', error);
    }
  };

  const updateGamepass = async (id: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('gamepasses')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      setGamepasses(gamepasses.map(gp => 
        gp.id === id ? { ...gp, [field]: value } : gp
      ));
    } catch (error) {
      console.error('Error updating gamepass:', error);
    }
  };

  const deleteGamepass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gamepasses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGamepasses(gamepasses.filter(gp => gp.id !== id));
    } catch (error) {
      console.error('Error deleting gamepass:', error);
    }
  };

  const updateCustomLink = async () => {
    if (!user || !customLink) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ custom_link: customLink })
        .eq('id', user.id);

      if (error) throw error;
      alert('Custom link updated successfully!');
    } catch (error) {
      console.error('Error updating custom link:', error);
      alert('Error updating custom link');
    }
  };

  const updateDescription = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ description })
        .eq('id', user.id);

      if (error) throw error;
      alert('Description updated successfully!');
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Error updating description');
    }
  };

  const updateTheme = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          theme,
          custom_background_color: customColor
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Theme updated successfully!');
    } catch (error) {
      console.error('Error updating theme:', error);
      alert('Error updating theme');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Please log in to access your dashboard.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden py-8">
      {/* Constellation Background */}
      <ThemedConstellationBackground theme={theme} customColor={customColor} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20 hover:border-white/40 transition-all duration-300 animate-fade-in-up hover:shadow-2xl hover:shadow-white/10">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={user.avatar_url}
              alt={user.username}
              className="h-16 w-16 rounded-full border-2 border-white hover:border-gray-300 transition-all duration-300 hover:scale-110 animate-glow"
            />
            <div>
              <h1 className="text-2xl font-bold text-white animate-glow">{user.username}</h1>
              <div className="flex items-center space-x-2">
                <p className="text-gray-300">Dashboard</p>
                {userTier === 'premium' && (
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs flex items-center space-x-1 border border-yellow-500 animate-pulse">
                    <Crown className="h-3 w-3 animate-spin-slow" />
                    <span>Premium</span>
                  </span>
                )}
                {userTier === 'supporter' && (
                  <span className="bg-pink-400 text-black px-2 py-1 rounded-full text-xs flex items-center space-x-1 border border-pink-500 animate-pulse">
                    <Heart className="h-3 w-3 animate-bounce" />
                    <span>Supporter</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <div className="flex space-x-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 px-3 py-2 border border-white/30 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg transition-all duration-300 outline-none focus:border-white resize-none"
                  placeholder="Tell others about yourself..."
                  rows={3}
                  maxLength={200}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">{description.length}/200 characters</span>
                <button
                  onClick={updateDescription}
                  className="bg-white text-black hover:bg-gray-200 px-3 py-1 rounded text-sm transition-all duration-300 transform hover:scale-105"
                >
                  Save
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Custom Link
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-white/30 bg-gray-800/50 backdrop-blur-sm text-gray-200 text-sm">
                      www.rolink.zone.id/
                    </span>
                    <input
                      type="text"
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-white/30 bg-gray-800/50 backdrop-blur-sm text-white transition-all duration-300 outline-none focus:border-white"
                      placeholder="your-username"
                    />
                  </div>
                </div>
                <button
                  onClick={updateCustomLink}
                  className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 animate-glow border-none outline-none"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Theme Selection - Only for Premium users */}
            {userTier === 'premium' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Palette className="inline h-4 w-4 mr-1" />
                  Theme
                </label>
                <div className="space-y-2">
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg transition-all duration-300 outline-none focus:border-white"
                  >
                    <option value="default">Default (White)</option>
                    <option value="blue">Blue Ocean</option>
                    <option value="purple">Purple Galaxy</option>
                    <option value="green">Green Forest</option>
                    <option value="red">Red Fire</option>
                    <option value="yellow">Golden Sun</option>
                    <option value="pink">Pink Dreams</option>
                    <option value="custom">Custom Color</option>
                  </select>
                  
                  {theme === 'custom' && (
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-12 h-10 border border-white/30 bg-gray-800/50 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-white/30 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg transition-all duration-300 outline-none focus:border-white"
                        placeholder="#ffffff"
                      />
                    </div>
                  )}
                  
                  <button
                    onClick={updateTheme}
                    className="w-full bg-white text-black hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Theme</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-end space-x-2 lg:col-span-3">
              <Link
                to={`/u/${user.custom_link}`}
                className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 animate-glow"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Page</span>
              </Link>
              <a
                href={`${window.location.origin}/u/${user.custom_link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 border border-white/20"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open</span>
              </a>
            </div>
          </div>
        </div>

        {/* Gamepasses Section */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 animate-fade-in-up animation-delay-200 hover:shadow-2xl hover:shadow-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white animate-glow">Your Gamepasses</h2>
            <div className="flex items-center space-x-4">
              {userTier === 'free' && (
                <Link
                  to="/pricing"
                  className="bg-yellow-400 text-black hover:bg-yellow-300 px-3 py-1 rounded-lg transition-all duration-300 text-sm flex items-center space-x-1 transform hover:scale-105 animate-pulse"
                >
                  <Crown className="h-3 w-3 animate-spin-slow" />
                  <span>Upgrade</span>
                </Link>
              )}
            <button
              onClick={addGamepass}
              disabled={gamepasses.length >= (userTier === 'premium' ? 20 : userTier === 'supporter' ? 13 : 5)}
              className="bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 disabled:hover:scale-100 animate-glow"
            >
              <Plus className="h-4 w-4" />
              <span>Add Gamepass ({gamepasses.length}/{userTier === 'premium' ? 20 : userTier === 'supporter' ? 13 : 5})</span>
            </button>
            </div>
          </div>

          <div className="space-y-4">
            {gamepasses.map((gamepass) => (
              <div key={gamepass.id} className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={gamepass.title}
                      onChange={(e) => updateGamepass(gamepass.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-white/30 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg focus:ring-white focus:border-white transition-all duration-300"
                      placeholder="Gamepass Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Roblox Link
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={gamepass.link}
                        onChange={(e) => updateGamepass(gamepass.id, 'link', e.target.value)}
                        className="flex-1 px-3 py-2 border border-white/30 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg focus:ring-white focus:border-white transition-all duration-300"
                        placeholder="https://www.roblox.com/game-pass/..."
                      />
                      <button
                        onClick={() => deleteGamepass(gamepass.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {gamepasses.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg mb-2 text-gray-400">No gamepasses added yet</p>
                <p className="text-gray-300">Click "Add Gamepass" to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};