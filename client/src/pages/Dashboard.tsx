import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Plus, 
  TrendingUp, 
  Clock,
  Users,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import TripsOverviewMap from '../components/TripsOverviewMap';
import SuggestionsPanel from '../components/SuggestionsPanel';

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  notes: string;
  created_at: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    totalDays: 0
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.getTrips();
        setTrips(response.trips);
        
        // Calculate stats
        const now = new Date();
        const upcoming = response.trips.filter((trip: Trip) => 
          new Date(trip.start_date) > now
        ).length;
        
        const completed = response.trips.filter((trip: Trip) => 
          new Date(trip.end_date) < now
        ).length;
        
        const totalDays = response.trips.reduce((sum: number, trip: Trip) => {
          const start = new Date(trip.start_date);
          const end = new Date(trip.end_date);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          return sum + days;
        }, 0);
        
        setStats({
          totalTrips: response.trips.length,
          upcomingTrips: upcoming,
          completedTrips: completed,
          totalDays
        });
      } catch (error: any) {
        toast.error(error.message || 'Failed to load trips');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTripStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const recentTrips = trips.slice(0, 3);
  const mapTrips = trips.map(t => ({ id: t.id, destination: t.destination, lat: (t as any).lat || 0, lon: (t as any).lon || 0 }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.full_name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's an overview of your travel plans and activity.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrips}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingTrips}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTrips}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Travel Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDays}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Trips</h2>
              <Link
                to="/trips"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </Link>
            </div>

            {recentTrips.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No trips planned yet</p>
                <Link
                  to="/trips"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Plan Your First Trip</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTrips.map((trip) => {
                  const status = getTripStatus(trip.start_date, trip.end_date);
                  return (
                    <motion.div
                      key={trip.id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {trip.destination}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </p>
                      {trip.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">
                          {trip.notes}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick Action - simplified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <Link
              to="/trips"
              className="w-full flex items-center justify-center space-x-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Plan New Trip</span>
            </Link>
          </motion.div>

          {/* Trips Map (placeholder centers until coordinates are added) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Trips Map</h2>
            </div>
            <TripsOverviewMap trips={mapTrips} dark={true} />
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <SuggestionsPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};