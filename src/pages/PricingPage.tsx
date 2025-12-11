import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { Check, Star, Zap, Crown, Heart } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { user } = useAuth();

  const getCurrentPlanButton = (planType: string) => {
    if (!user) return null;
    
    if (planType === 'free' && user.tier === 'free') {
      return (
        <button
          disabled
          className="w-full bg-gray-700 text-gray-400 py-3 px-6 rounded-lg cursor-not-allowed"
        >
          Current Plan
        </button>
      );
    }
    
    if (planType === 'supporter' && user.tier === 'supporter') {
      return (
        <button
          disabled
          className="w-full bg-gray-700 text-gray-400 py-3 px-6 rounded-lg cursor-not-allowed"
        >
          Current Plan
        </button>
      );
    }
    
    if (planType === 'premium' && user.tier === 'premium') {
      return (
        <button
          disabled
          className="w-full bg-gray-700 text-gray-400 py-3 px-6 rounded-lg cursor-not-allowed"
        >
          Current Plan
        </button>
      );
    }
    
    return null;
  };

  const features = {
    free: [
      'Up to 5 gamepass links',
      'Custom rolink.com/username URL',
      'Basic profile page',
      'Discord login'
    ],
    supporter: [
      'Up to 13 gamepass links',
      'Custom rolink.com/username URL',
      'Enhanced profile page',
      'Discord login',
      'Supporter badge',
      'Priority support'
    ],
    premium: [
      'Up to 20 gamepass links',
      'Custom rolink.com/username URL',
      'Custom constellation themes',
      'Personalized background colors',
      'Discord login',
      'Premium badge',
      'Priority support',
      'Advanced customization',
      'Analytics (coming soon)',
      'Early access to new features'
    ]
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Constellation Background */}
      <ConstellationBackground />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up animate-glow animate-float">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Start free and upgrade to supporter or premium for more gamepass links and exclusive features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 animate-fade-in-up animation-delay-400">
            <div className="text-center mb-8">
              <div className="relative">
                <Zap className="h-12 w-12 text-white mx-auto mb-4 animate-pulse animate-glow" />
                <div className="absolute inset-0 h-12 w-12 mx-auto mb-4 bg-white rounded-full blur-lg opacity-30 animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 animate-glow">Free</h3>
              <div className="text-4xl font-bold text-white mb-2">
                R$0
              </div>
              <p className="text-gray-300">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {getCurrentPlanButton('free') || (
              <button
                disabled
                className="w-full bg-gray-700 text-gray-400 py-3 px-6 rounded-lg cursor-not-allowed"
              >
                Free Forever
              </button>
            )}
          </div>

          {/* Supporter Plan */}
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-pink-400/50 hover:border-pink-400 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-400/20 animate-fade-in-up animation-delay-600">
            <div className="text-center mb-8">
              <div className="relative">
                <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4 animate-bounce" />
                <div className="absolute inset-0 h-12 w-12 mx-auto mb-4 bg-pink-400 rounded-full blur-lg opacity-30 animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 animate-glow">Supporter</h3>
              <div className="text-4xl font-bold text-white mb-2">
                R$500
              </div>
              <p className="text-gray-300">Great for growing creators</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.supporter.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {getCurrentPlanButton('supporter') || (
              <a
                href="https://dsc.gg/asstes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-pink-400 text-black hover:bg-pink-300 py-3 px-6 rounded-lg transition-all duration-300 text-center block font-semibold transform hover:scale-105 hover:shadow-lg animate-pulse"
              >
                Purchase Supporter
              </a>
            )}
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border-2 border-yellow-400 relative hover:border-yellow-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/30 animate-fade-in-up animation-delay-800">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 animate-pulse">
                <Star className="h-4 w-4" />
                <span>Most Popular</span>
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="relative">
                <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-spin-slow" />
                <div className="absolute inset-0 h-12 w-12 mx-auto mb-4 bg-yellow-400 rounded-full blur-lg opacity-30 animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 animate-glow">Premium</h3>
              <div className="text-4xl font-bold text-white mb-2">
                R$1,000
              </div>
              <p className="text-gray-300">One-time payment</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {getCurrentPlanButton('premium') || (
              <a
                href="https://dsc.gg/asstes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-yellow-400 text-black hover:bg-yellow-300 py-3 px-6 rounded-lg transition-all duration-300 text-center block font-semibold transform hover:scale-105 hover:shadow-lg animate-pulse"
              >
                Purchase Premium
              </a>
            )}
          </div>
        </div>

        {user && (
          <div className="mt-8 text-center">
            <Link
              to="/activate"
              className="text-white hover:text-gray-300 underline transition-colors duration-300 animate-glow"
            >
              Already have an activation key? Click here to activate
            </Link>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                How do I get my activation key?
              </h3>
              <p className="text-gray-300">
                After purchasing supporter or premium through our Discord server at dsc.gg/asstes, 
                you'll receive an activation key that you can use to upgrade your account.
              </p>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                What's the difference between Supporter and Premium?
              </h3>
              <p className="text-gray-300">
                Supporter gives you 13 gamepass links and a supporter badge for 500 Robux. 
                Premium gives you 20 gamepass links, premium badge, custom themes, and advanced features for 1,000 Robux.
              </p>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                Are these one-time payments?
              </h3>
              <p className="text-gray-300">
                Yes! Both Supporter and Premium are one-time purchases with lifetime access 
                to all tier features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};