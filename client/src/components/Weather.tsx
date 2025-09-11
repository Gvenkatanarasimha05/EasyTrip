import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

type WeatherProps = {
  query?: string; // place name to geocode
  lat?: number;
  lon?: number;
};

export const Weather: React.FC<WeatherProps> = ({ query, lat, lon }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number; name?: string } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        let target = coords;
        if (!target) {
          if (typeof lat === 'number' && typeof lon === 'number') {
            target = { lat, lon };
          } else if (query) {
            const g = await api.geocode(query);
            target = { lat: g.lat, lon: g.lon, name: g.name };
          }
        }
        if (!target) return;
        setCoords(target);
        const w = await api.weather(target.lat, target.lon);
        setWeather(w);
      } catch (e: any) {
        setError(e?.message || 'Failed to load weather');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, lat, lon]);

  if (loading) return <div className="text-sm text-gray-500">Loading weather…</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!weather) return null;

  const current = weather.current;
  const locationLabel = coords?.name || query || 'Selected location';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow">
      <div className="text-sm text-gray-500 mb-1">{locationLabel}</div>
      <div className="flex items-baseline gap-3">
        <div className="text-3xl font-semibold">{Math.round(current?.temperature_2m)}°C</div>
        <div className="text-gray-500">Humidity {current?.relative_humidity_2m}% · Wind {Math.round(current?.wind_speed_10m)} km/h</div>
      </div>
    </div>
  );
};

export default Weather;

