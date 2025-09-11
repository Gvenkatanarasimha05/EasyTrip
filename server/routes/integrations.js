import express from 'express';

const router = express.Router();

// Simple in-memory cache
const cache = new Map();
const putCache = (key, value, ttlMs = 5 * 60 * 1000) => {
  cache.set(key, { value, expireAt: Date.now() + ttlMs });
};
const getCache = (key) => {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.expireAt) { cache.delete(key); return null; }
  return e.value;
};

// Geocoding using Nominatim (OpenStreetMap)
router.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query q is required' });
    const key = `geocode:${q}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(String(q))}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'EasyTrip/1.0' } });
    const data = await r.json();
    if (!Array.isArray(data) || data.length === 0) return res.status(404).json({ message: 'Location not found' });
    const { lat, lon, display_name } = data[0];
    const resp = { lat: Number(lat), lon: Number(lon), name: display_name };
    putCache(key, resp);
    res.json(resp);
  } catch (e) {
    console.error('Geocode error', e);
    res.status(500).json({ message: 'Geocoding failed' });
  }
});

// Autocomplete suggestions via Nominatim (OpenStreetMap)
router.get('/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || String(q).length < 2) return res.json({ suggestions: [] });
    const key = `ac:${q}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(String(q))}&addressdetails=1&limit=5`; 
    const r = await fetch(url, { headers: { 'User-Agent': 'EasyTrip/1.0' } });
    const data = await r.json();
    const suggestions = (Array.isArray(data) ? data : []).map((item) => ({
      name: item.display_name,
      lat: Number(item.lat),
      lon: Number(item.lon)
    }));
    const resp = { suggestions };
    putCache(key, resp);
    res.json(resp);
  } catch (e) {
    console.error('Autocomplete error', e);
    res.status(500).json({ message: 'Autocomplete failed' });
  }
});

// Weather using Open-Meteo (no API key)
router.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: 'lat and lon are required' });
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error('Weather error', e);
    res.status(500).json({ message: 'Weather fetch failed' });
  }
});

export default router;

