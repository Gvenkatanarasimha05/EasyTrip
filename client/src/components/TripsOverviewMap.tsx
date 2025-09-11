import React, { useMemo } from 'react';

type TripPoint = { id: string; destination: string; lat: number; lon: number };

type Props = {
  trips: TripPoint[];
  height?: number | string;
  dark?: boolean;
};

export const TripsOverviewMap: React.FC<Props> = ({ trips, height = 380 }) => {
  const center = useMemo(() => {
    if (trips.length === 0) return [20, 0] as [number, number];
    const lat = trips.reduce((s, t) => s + t.lat, 0) / trips.length;
    const lon = trips.reduce((s, t) => s + t.lon, 0) / trips.length;
    return [lat, lon] as [number, number];
  }, [trips]);

  const first = trips[0] || { lat: center[0], lon: center[1] } as any;
  const deltaLat = 20; const deltaLon = 20;
  const left = first.lon - deltaLon;
  const right = first.lon + deltaLon;
  const bottom = first.lat - deltaLat;
  const top = first.lat + deltaLat;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${first.lat}%2C${first.lon}`;

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden shadow bg-gray-100 dark:bg-gray-800">
      <iframe title="Trips Map" width="100%" height="100%" frameBorder="0" scrolling="no" src={src} />
    </div>
  );
};

export default TripsOverviewMap;

