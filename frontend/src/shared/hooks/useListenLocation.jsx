import { useEffect, useState } from 'react';

import useConversation from '../../store/useConversation';
import { useAuthContext } from '../context/AuthContext';

export const useListenLocation = () => {
  const [locationStatus, setLocationStatus] = useState('unknown');
  const { socket, position, setPosition } = useConversation();

  const { authUser } = useAuthContext();

  useEffect(() => {
    //   watchPosition() - this method is called every time the position changes
    let watchId = null;
    const handlePositionChange = (position) => {
      const { latitude, longitude } = position.coords;
      const newPosition = { lat: latitude, lng: longitude };
      setPosition(newPosition);
      setLocationStatus('accessed');
      if (newPosition) {
        socket.emit('updateLocation', { position: newPosition, userId: authUser._id });
      }
    };
    if ('geolocation' in navigator) {
      // fint the current location
      watchId = navigator.geolocation.watchPosition(handlePositionChange, (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus('unknown');
            break;
          case error.TIMEOUT:
            setLocationStatus('error');
            break;
          default:
            setLocationStatus('error');
            break;
        }
      });
      //   clear
      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, [authUser._id, setPosition, socket]);

  return { position, locationStatus };
};
