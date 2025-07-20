import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Calendar, Users, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface TripFormData {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelersCount: number;
  tripType: string;
  description: string;
}

interface TripPlannerFormProps {
  onTripCreated?: (tripId: string) => void;
}

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ onTripCreated }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TripFormData>();

  const tripTypes = [
    { value: 'leisure', label: 'Leisure & Vacation' },
    { value: 'business', label: 'Business Trip' },
    { value: 'adventure', label: 'Adventure & Outdoor' },
    { value: 'family', label: 'Family Trip' },
    { value: 'solo', label: 'Solo Travel' },
    { value: 'romantic', label: 'Romantic Getaway' },
  ];

  const onSubmit = async (data: TripFormData) => {
    if (!user) {
      toast.error('Please sign in to create a trip');
      return;
    }

    setLoading(true);
    try {
      const trip = storage.createTrip({
        userId: user.id,
        title: data.title,
        destination: data.destination,
        start_date: data.startDate,
        end_date: data.endDate,
        travelers_count: data.travelersCount,
        trip_type: data.tripType,
        description: data.description,
      });

      toast.success('Trip created successfully!');
      reset();
      
      if (onTripCreated) {
        onTripCreated(trip.id);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Next Adventure</h2>
        <p className="text-gray-600">Tell us about your dream destination and we'll help you plan every detail</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Title
            </label>
            <input
              {...register('title', {
                required: 'Trip title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters',
                },
              })}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Summer Vacation in Italy"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('destination', {
                  required: 'Destination is required',
                })}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Where do you want to go?"
              />
            </div>
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('startDate', {
                  required: 'Start date is required',
                })}
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('endDate', {
                  required: 'End date is required',
                })}
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Travelers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('travelersCount', {
                  required: 'Number of travelers is required',
                  min: {
                    value: 1,
                    message: 'At least 1 traveler is required',
                  },
                  max: {
                    value: 20,
                    message: 'Maximum 20 travelers allowed',
                  },
                })}
                type="number"
                min="1"
                max="20"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="How many people?"
              />
            </div>
            {errors.travelersCount && (
              <p className="mt-1 text-sm text-red-600">{errors.travelersCount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Type
            </label>
            <div className="relative">
              <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                {...register('tripType', {
                  required: 'Trip type is required',
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="">Select trip type</option>
                {tripTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.tripType && (
              <p className="mt-1 text-sm text-red-600">{errors.tripType.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
            placeholder="Tell us more about your trip plans, preferences, or special requirements..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Creating Your Trip...' : 'Create My Trip'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TripPlannerForm;