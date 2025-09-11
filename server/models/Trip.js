import mongoose from '../config/database.js';

const tripSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  destination: { type: String, required: true, trim: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  notes: { type: String, default: '' },
  lat: { type: Number },
  lon: { type: Number }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const TripModel = mongoose.models.Trip || mongoose.model('Trip', tripSchema, 'trips');

export class Trip {
  // Create a new trip
  static async create({ userId, destination, startDate, endDate, notes, lat, lon }) {
    const trip = await TripModel.create({
      user_id: userId,
      destination,
      start_date: startDate,
      end_date: endDate,
      notes: notes || '',
      lat,
      lon
    });
    return Trip._formatTrip(trip);
  }

  // Get all trips for a user
  static async findByUserId(userId) {
    const trips = await TripModel.find({ user_id: userId })
      .sort({ start_date: -1 })
      .lean();
    return trips.map(Trip._formatTrip);
  }

  // Get a single trip by id and user
  static async findById(tripId, userId) {
    const trip = await TripModel.findOne({ _id: tripId, user_id: userId }).lean();
    if (!trip) return null;
    return Trip._formatTrip(trip);
  }

  // Update a trip
  static async update(tripId, userId, updates) {
    const updateDoc = {};
    if (updates.destination) updateDoc.destination = updates.destination;
    if (updates.startDate) updateDoc.start_date = updates.startDate;
    if (updates.endDate) updateDoc.end_date = updates.endDate;
    if (updates.notes !== undefined) updateDoc.notes = updates.notes;

    const trip = await TripModel.findOneAndUpdate(
      { _id: tripId, user_id: userId },
      { $set: updateDoc },
      { new: true }
    ).lean();

    if (!trip) return null;
    return Trip._formatTrip(trip);
  }

  // Delete a trip
  static async delete(tripId, userId) {
    const result = await TripModel.deleteOne({ _id: tripId, user_id: userId });
    return result.deletedCount > 0;
  }

  // Internal helper: convert MongoDB doc to camelCase object
  static _formatTrip(trip) {
    return {
      id: trip._id.toString(),
      userId: trip.user_id.toString(),
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      notes: trip.notes,
      lat: trip.lat,
      lon: trip.lon,
      createdAt: trip.created_at,
      updatedAt: trip.updated_at
    };
  }
}
