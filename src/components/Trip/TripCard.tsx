import React from 'react';
import { MapPin, Calendar, Users, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Trip } from '../../lib/storage';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onClick, onEdit, onDelete }) => {
  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="h-32 bg-gradient-to-r from-sky-400 to-blue-500 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute top-4 right-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              // Handle menu action
            }}
            className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all duration-200"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-1">{trip.title}</h3>
          <div className="flex items-center space-x-1 text-white text-opacity-90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{trip.destination}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <div className="text-sm">
              <div className="font-medium">{format(startDate, 'MMM dd')}</div>
              <div className="text-gray-500">{duration} days</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <div className="text-sm">
              <div className="font-medium">{trip.travelers_count} travelers</div>
              <div className="text-gray-500 capitalize">{trip.trip_type}</div>
            </div>
          </div>
        </div>

        {trip.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {trip.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created {format(new Date(trip.created_at), 'MMM dd, yyyy')}
          </span>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="px-3 py-1 text-xs font-medium text-sky-600 bg-sky-100 rounded-full hover:bg-sky-200 transition-colors duration-200"
            >
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;