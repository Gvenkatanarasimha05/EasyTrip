import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Props = { lat?: number; lon?: number; destination?: string };

export const WeatherBadge: React.FC<Props> = ({ lat, lon, destination }) => {
  const [temp, setTemp] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setErr(null);
        let coords = { lat, lon } as any;
        if ((!coords.lat || !coords.lon) && destination) {
          const g = await api.geocode(destination);
          coords = { lat: g.lat, lon: g.lon };
        }
        if (!coords.lat || !coords.lon) return;
        const w = await api.weather(coords.lat, coords.lon);
        setTemp(Math.round(w.current?.temperature_2m));
      } catch (e: any) {
        setErr(e?.message || '');
      }
    };
    run();
  }, [lat, lon, destination]);

  if (err || temp === null) return null;
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
      {temp}°C
    </span>
  );
};

export default WeatherBadge;

