import { Trip } from '../models/Trip.js';

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.findByUserId(req.user.id);
    res.json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, notes, lat, lon } = req.body;

    // Validation
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Destination, start date, and end date are required' 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ 
        message: 'End date must be after start date' 
      });
    }

    if (start < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ 
        message: 'Start date cannot be in the past' 
      });
    }

    let coords = { lat, lon };
    if ((!lat || !lon) && destination) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(destination)}`;
        const resp = await fetch(url, { headers: { 'User-Agent': 'EasyTrip/1.0' } });
        const data = await resp.json();
        if (Array.isArray(data) && data[0]) {
          coords = { lat: Number(data[0].lat), lon: Number(data[0].lon) };
        }
      } catch (_) {
        // ignore geocode failure; proceed without coords
      }
    }

    const newTrip = await Trip.create({
      userId: req.user.id,
      destination,
      startDate,
      endDate,
      notes,
      lat: coords?.lat,
      lon: coords?.lon
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip: newTrip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { destination, startDate, endDate, notes } = req.body;

    // Check if trip exists and belongs to user
    const existingTrip = await Trip.findById(id, req.user.id);
    if (!existingTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        return res.status(400).json({ 
          message: 'End date must be after start date' 
        });
      }
    }

    const updates = {};
    if (destination) updates.destination = destination;
    if (startDate) updates.start_date = startDate;
    if (endDate) updates.end_date = endDate;
    if (notes !== undefined) updates.notes = notes;

    const updatedTrip = await Trip.update(id, req.user.id, updates);

    res.json({
      message: 'Trip updated successfully',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if trip exists and belongs to user
    const existingTrip = await Trip.findById(id, req.user.id);
    if (!existingTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await Trip.delete(id, req.user.id);

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};