import { useEffect, useState } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const LocationMarker = ({ position }) => {
  const map = useMapEvents({});

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (position && position.lat && position.lng) {
      setLocation({
        lat: position.lat,
        lng: position.lng,
      });
      map.flyTo([position.lat, position.lng]);
    }
  }, [map, position]);

  return location === null ? null : (
    <Marker position={location} icon={DefaultIcon}>
      <Popup>User is here!</Popup>
    </Marker>
  );
};

export default LocationMarker;
