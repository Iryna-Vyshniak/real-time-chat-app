import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import useConversation from '../../store/useConversation';

import Map from './location.content/Map';
import Status from './location.content/Status';

import { LinkToBack } from '../../components/ui/LinkToBack';

const ShareLocationPage = () => {
  const { id } = useParams();

  const { state, search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const lat = queryParams.get('lat');
  const lng = queryParams.get('lng');
  const backLinkLocationRef = useRef(state?.from ?? '/');

  const [location, setLocation] = useState(null);

  const { socket } = useConversation();

  useEffect(() => {
    socket?.emit('updateLocation', { position: { lat, lng }, userId: id });
  }, [id, lat, lng, socket]);

  useEffect(() => {
    socket?.on('updateLocationResponse', ({ position }) => {
      setLocation(position);
    });

    return () => {
      socket?.off('updateLocationResponse');
    };
  }, [socket]);

  return (
    <section className='flex flex-col gap-2 md:gap-4 w-full md:w-1/2 p-2'>
      <LinkToBack to={backLinkLocationRef.current}>Back</LinkToBack>
      <section className='p-3 flex flex-wrap gap-3 justify-between items-center w-full bg-primary/20 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 md:border-b border-slate-300'>
        {' '}
        <Status position={location} locationStatus={null} />
        {location && (
          <div className='flex gap-2 justify-end text-xs font-semibold text-gray-100 drop-shadow-2xl-black'>
            <p>
              Lat: <span>{location.lat}</span>
            </p>
            <p>|</p>
            <p>
              Lng: <span>{location.lng}</span>
            </p>
          </div>
        )}
      </section>

      {location ? (
        <Map position={location} />
      ) : (
        <div className='flex items-center justify-center'>
          <p className='loading loading-ring loading-lg'></p>
        </div>
      )}
    </section>
  );
};

export default ShareLocationPage;
