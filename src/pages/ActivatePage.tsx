import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { Key, Crown, Heart, AlertCircle, CheckCircle } from 'lucide-react';

export const ActivatePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activationKey, setActivationKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activationKey.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      // Check if key exists and is unused
      const { data: keyData, error: keyError } = await supabase
        .from('activation_keys')
        .select('*')
        .eq('key', activationKey.trim().toUpperCase())
        .is('used_at', null)
        .single();

      if (keyError || !keyData) {
        setMessage({ type: 'error', text: 'Invalid or already used activation key.' });
        return;
      }

      // Determine tier based on key type
      const tier = keyData.key.startsWith('SUPPORTER-') ? 'supporter' : 'premium';

      // Update the key as used
      const { error: updateKeyError } = await supabase
        .from('activation_keys')
        .update({
          used_at: new Date().toISOString(),
          used_by: user.id
        })
        .eq('key', activationKey.trim().toUpperCase());

      if (updateKeyError) {
        console.error('Key update error:', updateKeyError);
        throw updateKeyError;
      }

      // Update user tier
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ tier })
        .eq('id', user.id);

      if (updateUserError) {
        console.error('User update error:', updateUserError);
        throw updateUserError;
      }

      // Verify the key was updated
      const { data: verifyKey } = await supabase
        .from('activation_keys')
        .select('*')
        .eq('key', activationKey.trim().toUpperCase())
        .single();
      
      console.log('Key after update:', verifyKey);

      const tierName = tier === 'supporter' ? 'Supporter' : 'Premium';
      setMessage({ 
        type: 'success', 
        text: `Congratulations! Your account has been upgraded to ${tierName}!` 
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload(); // Refresh to update user context
      }, 2000);

    } catch (error) {
      console.error('Activation error:', error);
      setMessage({ type: 'error', text: 'An error occurred during activation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
          <p className="text-purple-300">Please log in to activate your account upgrade.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Constellation Background */}
      <ConstellationBackground />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-lg p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-2 mb-4">
              <Heart className="h-12 w-12 text-pink-400" />
              <Crown className="h-12 w-12 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 animate-glow">Activate Your Upgrade</h1>
            <p className="text-gray-300">
              Enter your activation key to upgrade to Supporter or Premium
            </p>
          </div>

          <form onSubmit={handleActivation} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Activation Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white" />
                <input
                  type="text"
                  value={activationKey}
                  onChange={(e) => setActivationKey(e.target.value)}
                  placeholder="SUPPORTER-XXXXXXXX or PREMIUM-XXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 border border-white/30 bg-gray-800 text-white rounded-lg outline-none focus:border-white transition-all duration-300"
                  required
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-900/50 border border-green-600' 
                  : 'bg-red-900/50 border border-red-600'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                  {message.text}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !activationKey.trim()}
              className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg transition-colors font-semibold animate-glow border-none outline-none"
            >
              {loading ? 'Activating...' : 'Activate Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-purple-400 mb-2">
              Don't have an activation key yet?
            </p>
            <a
              href="https://dsc.gg/asstes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 underline animate-glow"
            >
              Purchase Supporter (500 Robux) or Premium (1,000 Robux)
            </a>
          </div>

          <div className="mt-8 space-y-4">
            {/* Supporter Benefits */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-pink-400/50 hover:border-pink-400 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-5 w-5 text-pink-400" />
                <h3 className="text-lg font-semibold text-white">Supporter Benefits</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Up to 13 gamepass links</li>
                <li>• Supporter badge</li>
                <li>• Enhanced profile page</li>
                <li>• Priority support</li>
              </ul>
            </div>

            {/* Premium Benefits */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/50 hover:border-yellow-400 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Premium Benefits</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Up to 20 gamepass links</li>
                <li>• Premium badge</li>
                <li>• Custom profile themes</li>
                <li>• Advanced customization</li>
                <li>• Priority support</li>
                <li>• Early access to features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};