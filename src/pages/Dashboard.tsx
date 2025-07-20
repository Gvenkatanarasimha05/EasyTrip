import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import TripPlannerForm from '../components/Trip/TripPlannerForm';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/storage';
import { motion } from 'framer-motion';
import { Plane, MapPin, Calendar, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTrips: 0,
    destinationsVisited: 0,
    daysPlanned: 0,
  });

  useEffect(() => {
    if (user) {
      const trips = storage.getTrips(user.id);
      const destinations = new Set(trips.map(trip => trip.destination));
      const totalDays = trips.reduce((acc, trip) => {
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        return acc + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0);

      setStats({
        totalTrips: trips.length,
        destinationsVisited: destinations.size,
        daysPlanned: totalDays,
      });
    }
  }, [user]);

  const handleTripCreated = (tripId: string) => {
    navigate(`/trips`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Explorer'}! 
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to plan your next adventure? Let's create an amazing itinerary that you'll never forget.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
                </div>
                <div className="p-3 bg-sky-100 rounded-lg">
                  <Plane className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Destinations Visited</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.destinationsVisited}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Days Planned</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.daysPlanned}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trip Planner Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <TripPlannerForm onTripCreated={handleTripCreated} />
          </motion.div>

          {/* Featured Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Paris, France',
                  image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
                  rating: 4.9,
                  trips: '2.3k trips planned',
                },
                {
                  name: 'Tokyo, Japan',
                  image: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=400',
                  rating: 4.8,
                  trips: '1.8k trips planned',
                },
                {
                  name: 'New York, USA',
                  image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400',
                  rating: 4.7,
                  trips: '3.1k trips planned',
                },
              ].map((destination, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${destination.image})` }} />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{destination.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{destination.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{destination.trips}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;