import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useListenLocation } from '../../shared/hooks/useListenLocation';

import Map from './location.content/Map';
import Status from './location.content/Status';
import ShareLocation from './location.content/ShareLocation';

import { LinkToBack } from '../../components/ui/LinkToBack';

const LocationPage = () => {
  const location = useLocation();
  const backLinkLocationRef = useRef(location.state?.from ?? '/');
  const { position, locationStatus } = useListenLocation();

  return (
    <section className='flex flex-col gap-2 md:gap-4 w-full md:w-1/2 p-2'>
      <LinkToBack to={backLinkLocationRef.current}>Back</LinkToBack>
      <Status position={position} locationStatus={locationStatus} />
      <ShareLocation position={position} locationStatus={locationStatus} />
      {position ? (
        <Map position={position} />
      ) : (
        <div className='flex items-center justify-center'>
          <p className='loading loading-ring loading-lg'></p>
        </div>
      )}
    </section>
  );
};

export default LocationPage;
