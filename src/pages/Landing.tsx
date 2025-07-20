import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Users, Star, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import bg from '../assets/landing_bg.jpeg'; 


const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking on links
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: MapPin,
      title: 'Smart Destination Planning',
      description: 'Get personalized recommendations based on your preferences and travel style.',
    },
    {
      icon: Calendar,
      title: 'Day-by-Day Itineraries',
      description: 'Build detailed schedules with activities, dining, and transportation.',
    },
    {
      icon: Users,
      title: 'Group Trip Coordination',
      description: 'Plan and organize trips for families, friends, or business groups.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, NY',
      text: 'EasyTrip made planning our European vacation effortless. The itinerary builder is incredible!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Michael Chen',
      location: 'San Francisco, CA',
      text: 'Perfect for business trips. I can plan everything in advance and stay organized.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Emma Williams',
      location: 'Toronto, ON',
      text: 'Love how I can coordinate group trips with friends. Everyone stays on the same page.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
  ];

  const handleGetStarted = () => {
    console.log('Navigate to registration');
  };

  const handleSignIn = () => {
    console.log('Navigate to login');
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Responsive Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg' 
            : 'bg-white/10 backdrop-blur-md border-b border-white/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center cursor-pointer"
            >
              <Plane className={`w-8 h-8 lg:w-10 lg:h-10 transition-colors duration-300 ${
                scrolled ? 'text-sky-600' : 'text-white'
              }`} />
              <span className={`ml-2 text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                EasyTrip
              </span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-center space-x-8">
                <a 
                  href="#features" 
                  className={`transition-all duration-300 font-medium hover:scale-105 ${
                    scrolled 
                      ? 'text-gray-700 hover:text-sky-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Features
                </a>
                <a 
                  href="#testimonials" 
                  className={`transition-all duration-300 font-medium hover:scale-105 ${
                    scrolled 
                      ? 'text-gray-700 hover:text-sky-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Reviews
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignIn}
                  className={`transition-all duration-300 font-medium px-4 py-2 rounded-lg ${
                    scrolled 
                      ? 'text-gray-700 hover:text-sky-600 hover:bg-sky-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg ${
                    scrolled 
                      ? 'bg-sky-600 text-white hover:bg-sky-700 hover:shadow-xl' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  Get Started
                </motion.button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-sky-600 hover:bg-sky-50' 
                    : 'text-white hover:text-white/80 hover:bg-white/10'
                }`}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`lg:hidden overflow-hidden ${
                scrolled 
                  ? 'bg-white/95 backdrop-blur-lg border-t border-gray-200/50' 
                  : 'bg-black/50 backdrop-blur-md border-t border-white/20'
              }`}
            >
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-4 py-6 space-y-4"
              >
                <motion.a 
                  whileHover={{ x: 8 }}
                  href="#features" 
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    scrolled 
                      ? 'text-gray-700 hover:text-sky-600 hover:bg-sky-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Features
                </motion.a>
                <motion.a 
                  whileHover={{ x: 8 }}
                  href="#testimonials" 
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    scrolled 
                      ? 'text-gray-700 hover:text-sky-600 hover:bg-sky-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Reviews
                </motion.a>
                <motion.button
                  whileHover={{ x: 8 }}
                  onClick={() => {
                    handleSignIn();
                    closeMobileMenu();
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    scrolled 
                      ? 'text-gray-700 hover:text-sky-600 hover:bg-sky-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleGetStarted();
                    closeMobileMenu();
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg ${
                    scrolled 
                      ? 'bg-sky-600 text-white hover:bg-sky-700' 
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section*/}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
               backgroundImage: `url(${bg})`,
            }}
          ></div>
        </div>

        
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-transparent to-blue-900/30 z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Plan Your Perfect
              <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent"> Trip</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Discover amazing destinations, create detailed itineraries, and coordinate group travel all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-none"
          >
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 text-lg shadow-lg group backdrop-blur-sm"
            >
              Start Planning
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={handleSignIn}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 text-lg shadow-lg"
            >
              Sign In
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 text-sm text-white/80"
          >
            <p>Join 50,000+ travelers worldwide</p>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          className="absolute top-1/4 left-4 lg:left-8 w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center z-10 border border-white/30"
        >
          <Plane className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2 
          }}
          className="absolute top-1/3 right-4 lg:right-8 w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center z-10 border border-white/30"
        >
          <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Plan Amazing Trips
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From destination research to detailed itineraries, we've got all the tools to make your travel planning seamless and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their EasyTrip experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Next Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of travelers who trust EasyTrip to plan their perfect trips.
            </p>
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-sky-600 font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 text-lg group shadow-lg"
            >
              Get Started Free
              <Plane className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Plane className="w-8 h-8 text-sky-400" />
              <span className="ml-2 text-xl font-bold">EasyTrip</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EasyTrip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;