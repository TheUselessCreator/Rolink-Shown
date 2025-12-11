import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI || 'https://www.rolink.zone.id/auth/callback';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('discord_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          // Try to use stored user data first
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('discord_token');
          localStorage.removeItem('user_data');
          
          // Fallback to Discord API
          if (token) {
            try {
              const response = await fetch('https://discord.com/api/users/@me', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              if (response.ok) {
                const discordUser = await response.json();
                await handleDiscordUser(discordUser, token);
              } else {
                localStorage.removeItem('discord_token');
              }
            } catch (error) {
              console.error('Auth check failed:', error);
              localStorage.removeItem('discord_token');
            }
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleDiscordUser = async (discordUser: any, token: string) => {
    try {
      // Check if user exists in our database
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('discord_id', discordUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      let userData: User;

      if (existingUser) {
        userData = existingUser;
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            discord_id: discordUser.id,
            username: discordUser.username,
            avatar_url: discordUser.avatar 
              ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`,
            custom_link: discordUser.username.toLowerCase().replace(/[^a-z0-9]/g, ''),
            tier: 'free'
          })
          .select()
          .single();

        if (insertError) throw insertError;
        userData = newUser;
      }

      setUser(userData);
      localStorage.setItem('discord_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error handling Discord user:', error);
    }
  };

  const login = () => {
    const scope = 'identify';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scope}`;
    window.location.href = discordAuthUrl;
  };

  const logout = () => {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};