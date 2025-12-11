import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { Gamepad2, Users, Share2, Zap, Shield, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, login } = useAuth();

  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8 text-white" />,
      title: "Showcase Your Gamepasses",
      description: "Display up to 5 Roblox gamepasses on your personalized page"
    },
    {
      icon: <Share2 className="h-8 w-8 text-white" />,
      title: "Custom Links",
      description: "Get your own www.rolink.zone.id/yourname URL to share with friends"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Browse Community",
      description: "Discover amazing gamepasses from other creators"
    },
    {
      icon: <Zap className="h-8 w-8 text-white" />,
      title: "Instant Setup",
      description: "Login with Discord and start sharing in seconds"
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Secure & Safe",
      description: "Discord OAuth ensures your account stays protected"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-white" />,
      title: "Beautiful Pages",
      description: "Modern, responsive designs that look great everywhere"
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Constellation Background */}
      <ConstellationBackground />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Rolink
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              The ultimate platform to showcase and discover Roblox gamepasses. 
              Create your personalized page and connect with the community.
            </p>
            
            {user ? (
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center animate-fade-in-up animation-delay-400">
                <Link
                  to="/dashboard"
                  className="inline-block bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-glow border-none outline-none"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to={`/u/${user.custom_link}`}
                  className="inline-block bg-gray-800 text-white hover:bg-gray-700 font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-600 outline-none"
                >
                  View My Page
                </Link>
              </div>
            ) : (
              <div className="animate-fade-in-up animation-delay-400">
              <button
                onClick={login}
                className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-glow animate-pulse border-none outline-none"
              >
                Get Started with Discord
              </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Rolink provides all the tools you need to showcase your Roblox gamepasses professionally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-white hover:bg-gray-800/80 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="mb-4 transform hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to Start Sharing?
          </h2>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
            Join thousands of Roblox creators already using Rolink to showcase their gamepasses
          </p>
          
          {!user && (
            <div className="animate-fade-in-up animation-delay-400">
            <button
              onClick={login}
              className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-glow"
            >
              Create Your Page Now
            </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};