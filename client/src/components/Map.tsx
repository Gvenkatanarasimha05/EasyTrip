import React from 'react';

type MapProps = {
  lat: number;
  lon: number;
  label?: string;
  height?: number | string;
  zoom?: number;
};

export const Map: React.FC<MapProps> = ({ lat, lon, label, height = 320, zoom = 12 }) => {
  const deltaLon = 0.05;
  const deltaLat = 0.03;
  const left = lon - deltaLon;
  const right = lon + deltaLon;
  const bottom = lat - deltaLat;
  const top = lat + deltaLat;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
  const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden shadow bg-gray-100 dark:bg-gray-800">
      <iframe
        title={label || 'Map'}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={src}
      />
      <small>
        <a href={link} target="_blank" rel="noreferrer" className="hidden">View Larger Map</a>
      </small>
    </div>
  );
};

export default Map;

