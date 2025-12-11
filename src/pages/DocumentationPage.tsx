import React from 'react';
import { Link } from 'react-router-dom';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { 
  Book, 
  User, 
  Settings, 
  Link as LinkIcon, 
  Crown, 
  Heart, 
  Gamepad2,
  ExternalLink,
  Key,
  Users,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export const DocumentationPage: React.FC = () => {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Star className="h-6 w-6" />,
      content: [
        {
          title: 'Create Your Account',
          description: 'Sign up with Discord OAuth to get started instantly',
          steps: [
            'Click "Login with Discord" on the homepage',
            'Authorize Rolink to access your Discord profile',
            'Your account will be created automatically'
          ]
        },
        {
          title: 'Set Up Your Profile',
          description: 'Customize your Rolink page with your information',
          steps: [
            'Go to your Dashboard after logging in',
            'Update your custom link (rolink.zone.id/yourname)',
            'Add your Roblox gamepasses with titles and links'
          ]
        }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      icon: <Gamepad2 className="h-6 w-6" />,
      content: [
        {
          title: 'Gamepass Showcase',
          description: 'Display your Roblox gamepasses with custom titles and direct links',
          features: [
            'Free: Up to 5 gamepass links',
            'Supporter: Up to 13 gamepass links',
            'Premium: Up to 20 gamepass links'
          ]
        },
        {
          title: 'Custom URLs',
          description: 'Get your personalized rolink.zone.id/username URL',
          features: [
            'Easy to remember and share',
            'Professional appearance',
            'SEO-friendly links'
          ]
        },
        {
          title: 'Community Discovery',
          description: 'Browse and discover other creators\' gamepasses',
          features: [
            'Browse all public profiles',
            'Discover new gamepasses',
            'Connect with other creators'
          ]
        }
      ]
    },
    {
      id: 'plans',
      title: 'Plans & Pricing',
      icon: <Crown className="h-6 w-6" />,
      content: [
        {
          title: 'Free Plan',
          description: 'Perfect for getting started',
          features: [
            'Up to 5 gamepass links',
            'Custom rolink.zone.id URL',
            'Basic profile page',
            'Discord login'
          ]
        },
        {
          title: 'Supporter Plan - 500 Robux',
          description: 'Great for growing creators',
          features: [
            'Up to 13 gamepass links',
            'Supporter badge',
            'Enhanced profile page',
            'Priority support'
          ]
        },
        {
          title: 'Premium Plan - 1,000 Robux',
          description: 'Ultimate creator experience',
          features: [
            'Up to 20 gamepass links',
            'Premium badge',
            'Custom profile themes',
            'Advanced customization',
            'Early access to features'
          ]
        }
      ]
    },
    {
      id: 'activation',
      title: 'Account Activation',
      icon: <Key className="h-6 w-6" />,
      content: [
        {
          title: 'How to Upgrade',
          description: 'Purchase and activate your Supporter or Premium plan',
          steps: [
            'Visit our Discord server at dsc.gg/asstes',
            'Purchase Supporter (500 Robux) or Premium (1,000 Robux)',
            'Receive your activation key',
            'Go to the Activate page on Rolink',
            'Enter your activation key to upgrade'
          ]
        },
        {
          title: 'Activation Key Format',
          description: 'Understanding your activation key',
          info: [
            'Supporter keys: SUPPORTER-XXXXXXXX',
            'Premium keys: PREMIUM-XXXXXXXX',
            'Keys are one-time use only',
            'Keys never expire'
          ]
        }
      ]
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: <Book className="h-6 w-6" />,
      content: [
        {
          title: 'General Questions',
          description: 'Common questions about Rolink',
          faqs: [
            {
              q: 'Is Rolink free to use?',
              a: 'Yes! Rolink offers a free plan with up to 5 gamepass links. You can upgrade to Supporter or Premium for more features.'
            },
            {
              q: 'How do I add my Roblox gamepasses?',
              a: 'Go to your Dashboard, click "Add Gamepass", enter the title and paste the Roblox gamepass URL.'
            },
            {
              q: 'Can I change my custom link?',
              a: 'Yes, you can update your custom link anytime from your Dashboard.'
            },
            {
              q: 'Are the plans one-time payments?',
              a: 'Yes! Both Supporter and Premium are one-time purchases with lifetime access.'
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ConstellationBackground />
      
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Book className="h-16 w-16 text-white mx-auto mb-6 animate-float" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-glow">
            Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about using Rolink to showcase your Roblox gamepasses
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16 animate-fade-in-up animation-delay-200">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="bg-gray-900/80 backdrop-blur-xl p-4 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 text-center group hover:scale-105 hover:shadow-xl hover:shadow-white/10"
            >
              <div className="text-white mb-2 flex justify-center group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <span className="text-white text-sm font-medium">{section.title}</span>
            </a>
          ))}
        </div>

        {/* Documentation Sections */}
        <div className="space-y-16">
          {sections.map((section, sectionIndex) => (
            <section
              key={section.id}
              id={section.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${400 + sectionIndex * 100}ms` }}
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="text-white">{section.icon}</div>
                <h2 className="text-3xl font-bold text-white animate-glow">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {section.content.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-xl hover:shadow-white/10"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3 animate-glow">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{item.description}</p>

                    {item.steps && (
                      <ol className="space-y-2">
                        {item.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-3">
                            <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-300">{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {item.features && (
                      <ul className="space-y-2">
                        {item.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.info && (
                      <ul className="space-y-2">
                        {item.info.map((info, infoIndex) => (
                          <li key={infoIndex} className="flex items-center space-x-3">
                            <ArrowRight className="h-4 w-4 text-white flex-shrink-0" />
                            <span className="text-gray-300">{info}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.faqs && (
                      <div className="space-y-4">
                        {item.faqs.map((faq, faqIndex) => (
                          <div key={faqIndex} className="border-l-2 border-white/20 pl-4">
                            <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                            <p className="text-gray-300">{faq.a}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gray-900/80 backdrop-blur-xl p-8 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 animate-fade-in-up hover:shadow-xl hover:shadow-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 animate-glow">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6">
            Create your Rolink page today and start showcasing your Roblox gamepasses to the world!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg animate-glow"
            >
              Get Started
            </Link>
            <Link
              to="/browse"
              className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-3 rounded-lg transition-all duration-300 font-semibold border border-white/20 hover:border-white/40 transform hover:scale-105"
            >
              Browse Creators
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center animate-fade-in-up">
          <p className="text-gray-300 mb-4">Need help? Have questions?</p>
          <a
            href="https://dsc.gg/asstes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-300 animate-glow"
          >
            <span>Join our Discord server</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};