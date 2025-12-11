import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

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

      let userData;

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

      localStorage.setItem('discord_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Force page reload to update auth context
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error handling Discord user:', error);
      throw error;
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          console.log('Processing OAuth callback with code:', code);
          
          const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
              client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
              grant_type: 'authorization_code',
              code,
              redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI || `${window.location.origin}/auth/callback`,
            }),
          });

          const tokenData = await tokenResponse.json();
          console.log('Token response:', tokenData);
          
          if (tokenData.access_token) {
            // Get user data from Discord
            const userResponse = await fetch('https://discord.com/api/users/@me', {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
              },
            });
            
            if (userResponse.ok) {
              const discordUser = await userResponse.json();
              console.log('Discord user data:', discordUser);
              await handleDiscordUser(discordUser, tokenData.access_token);
            } else {
              throw new Error('Failed to fetch user data from Discord');
            }
          } else {
            console.error('Token data:', tokenData);
            throw new Error('No access token received');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          alert('Authentication failed. Please try again.');
          navigate('/');
        }
      } else {
        console.error('No code parameter in callback URL');
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <div className="text-white text-xl">Authenticating with Discord...</div>
        <div className="text-purple-300 text-sm mt-2">Please wait while we set up your account</div>
      </div>
    </div>
  );
};