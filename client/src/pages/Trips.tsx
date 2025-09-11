import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin,
  Search,
  Filter,
  X
} from 'lucide-react';
import { api } from '../lib/api';
import Map from '../components/Map';
import DestinationAutocompleteInput from '../components/DestinationAutocompleteInput';
import WeatherBadge from '../components/WeatherBadge';
import toast from 'react-hot-toast';

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  notes: string;
  created_at: string;
  lat?: number;
  lon?: number;
}

export const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [formCoords, setFormCoords] = useState<{ lat?: number; lon?: number }>({});

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Geocoding/map state for destination search
  const [geo, setGeo] = useState<{ lat: number; lon: number; name?: string } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [trips, searchTerm, filterStatus]);

  const fetchTrips = async () => {
    try {
      const response = await api.getTrips();
      setTrips(response.trips);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter(trip => {
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);

        switch (filterStatus) {
          case 'upcoming':
            return start > now;
          case 'active':
            return start <= now && end >= now;
          case 'completed':
            return end < now;
          default:
            return true;
        }
      });
    }

    setFilteredTrips(filtered);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (start >= end) {
        errors.endDate = 'End date must be after start date';
      }

      if (start < new Date().setHours(0, 0, 0, 0) && !editingTrip) {
        errors.startDate = 'Start date cannot be in the past';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingTrip) {
        const response = await api.updateTrip(editingTrip.id, { ...formData, ...(formCoords.lat ? { lat: formCoords.lat } : {}), ...(formCoords.lon ? { lon: formCoords.lon } : {}) });
        setTrips(trips.map(trip => 
          trip.id === editingTrip.id ? response.trip : trip
        ));
        toast.success('Trip updated successfully!');
      } else {
        const response = await api.createTrip({ ...formData, ...(formCoords.lat ? { lat: formCoords.lat } : {}), ...(formCoords.lon ? { lon: formCoords.lon } : {}) });
        setTrips([response.trip, ...trips]);
        toast.success('Trip created successfully!');
      }

      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save trip');
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      notes: trip.notes || ''
    });
    setFormCoords({ lat: trip.lat, lon: trip.lon });
    setIsFormOpen(true);
  };

  const locateDestination = async () => {
    try {
      setGeoError(null);
      setGeo(null);
      if (!formData.destination.trim()) {
        setGeoError('Enter a destination to locate');
        return;
      }
      setGeoLoading(true);
      const g = await api.geocode(formData.destination.trim());
      setGeo({ lat: g.lat, lon: g.lon, name: g.name });
    } catch (e: any) {
      setGeoError(e?.message || 'Failed to locate destination');
    } finally {
      setGeoLoading(false);
    }
  };

  const handleDelete = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      await api.deleteTrip(tripId);
      setTrips(trips.filter(trip => trip.id !== tripId));
      toast.success('Trip deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete trip');
    }
  };

  const resetForm = () => {
    setFormData({
      destination: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setFormErrors({});
    setEditingTrip(null);
    setIsFormOpen(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Trips</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Plan, manage, and track all your adventures
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Trip</span>
          </motion.button>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips by destination or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Trips</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No trips found' : 'No trips yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start planning your next adventure!'
              }
            </p>
            {(!searchTerm && filterStatus === 'all') && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Plan Your First Trip</span>
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => {
              const status = getTripStatus(trip.start_date, trip.end_date);
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-36 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={`https://source.unsplash.com/800x400/?travel,${encodeURIComponent(trip.destination)}`}
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {trip.destination}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <WeatherBadge lat={trip.lat} lon={trip.lon} destination={trip.destination} />
                    </div>

                    {trip.notes && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {trip.notes}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(trip)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Trip Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingTrip ? 'Edit Trip' : 'Plan New Trip'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destination *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <DestinationAutocompleteInput
                        value={formData.destination}
                        onChange={(v) => setFormData({ ...formData, destination: v })}
                        onSelect={(s) => {
                          setFormData({ ...formData, destination: s.name });
                          setGeo({ lat: s.lat, lon: s.lon, name: s.name });
                          setFormCoords({ lat: s.lat, lon: s.lon });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={locateDestination}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                    >
                      {geoLoading ? 'Locating…' : 'Show on Map'}
                    </button>
                  </div>
                  {formErrors.destination && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.destination}</p>
                  )}
                  {geoError && (
                    <p className="mt-1 text-sm text-red-600">{geoError}</p>
                  )}
                  {geo && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">{geo.name}</div>
                      <Map lat={geo.lat} lon={geo.lon} label={geo.name} height={200} />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full px-3 py-2 border ${
                        formErrors.startDate ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {formErrors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={`w-full px-3 py-2 border ${
                        formErrors.endDate ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {formErrors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add any notes about your trip..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTrip ? 'Update Trip' : 'Create Trip'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};