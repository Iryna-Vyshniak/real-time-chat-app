import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import LocationMarker from './LocationMarker';

const Map = ({ position }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (position) {
      setMapLoaded(true);
    }
  }, [position]);

  if (typeof window === 'undefined' || !mapLoaded) {
    return (
      <div className='flex items-center justify-center'>
        <p className='loading loading-ring loading-lg'></p>
      </div>
    );
  }

  const mapCenter = position ? position : null;

  const attribution = `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`;

  const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className='relative mt-6 w-full z-10 h-[400px] overflow-hidden border-2 border-green shadow-lg shadow-green'>
      <MapContainer
        center={mapCenter}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: '100%', height: 400 }}
      >
        <TileLayer attribution={attribution} url={url} />
        <LocationMarker position={position}/>
      </MapContainer>
    </div>
  );
};

export default Map;
