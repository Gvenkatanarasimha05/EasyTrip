import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Props = {
  query?: string;
  lat?: number;
  lon?: number;
};

const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const ForecastStrip: React.FC<Props> = ({ query, lat, lon }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [daily, setDaily] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        let target = coords;
        if (!target) {
          if (typeof lat === 'number' && typeof lon === 'number') {
            target = { lat, lon };
          } else if (query) {
            const g = await api.geocode(query);
            target = { lat: g.lat, lon: g.lon };
          }
        }
        if (!target) return;
        setCoords(target);
        const w = await api.weather(target.lat, target.lon);
        setDaily(w.daily);
      } catch (e: any) {
        setError(e?.message || 'Failed to load forecast');
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, lat, lon]);

  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!daily) return null;

  const items = (daily.time || []).map((t: string, i: number) => {
    const date = new Date(t);
    const label = `${dayNames[date.getDay()]} ${date.getDate()}`;
    const max = Math.round(daily.temperature_2m_max?.[i] ?? 0);
    const min = Math.round(daily.temperature_2m_min?.[i] ?? 0);
    return { label, max, min };
  }).slice(0, 7);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow flex gap-3 overflow-x-auto">
      {items.map((d, idx) => (
        <div key={idx} className="min-w-[80px] text-center">
          <div className="text-xs text-gray-500 mb-1">{d.label}</div>
          <div className="text-lg font-semibold">{d.max}°</div>
          <div className="text-xs text-gray-500">{d.min}°</div>
        </div>
      ))}
    </div>
  );
};

export default ForecastStrip;

