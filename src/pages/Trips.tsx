import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import TripCard from '../components/Trip/TripCard';
import { useAuth } from '../contexts/AuthContext';
import { storage, Trip } from '../lib/storage';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTrips = () => {
    if (!user) return;

    try {
      const userTrips = storage.getTrips(user.id);
      setTrips(userTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const handleTripClick = (tripId: string) => {
    // For now, just show a message since we don't have itinerary page yet
    toast.success('Trip details coming soon!');
  };

  const handleDeleteTrip = (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }

    try {
      storage.deleteTrip(tripId);
      setTrips(trips.filter(trip => trip.id !== tripId));
      toast.success('Trip deleted successfully');
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip');
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
              <p className="text-gray-600">
                {trips.length === 0 
                  ? 'Start planning your first adventure'
                  : `You have ${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`
                }
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Trip
            </motion.button>
          </motion.div>

          {trips.length > 0 && (
            <>
              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col md:flex-row gap-4 mb-8"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search trips by title or destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                </button>
              </motion.div>

              {/* Trips Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TripCard
                      trip={trip}
                      onClick={() => handleTripClick(trip.id)}
                      onDelete={() => handleDeleteTrip(trip.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {filteredTrips.length === 0 && searchQuery && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 text-lg">
                    No trips found matching "{searchQuery}"
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* Empty State */}
          {trips.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-sky-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No trips yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start planning your first adventure! Create a trip and build your perfect itinerary.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Plan Your First Trip
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Trips;