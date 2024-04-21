import Icon from '../../../components/ui/Icon';

import useConversation from '../../../store/useConversation';

const Status = ({ locationStatus, position }) => {
  const { socketStatus } = useConversation();

  return (
    <section className='flex gap-2 pb-3'>
      {locationStatus && (
        <div
          className={`rounded-full p-2 ${
            locationStatus === 'accessed' && position ? 'bg-green' : 'bg-accent animate-pulse'
          }`}
        >
          {' '}
          <p className='flex gap-1 items-center text-xs font-semibold text-gray-100'>
            {locationStatus === 'accessed' && position ? (
              <Icon
                src='#icon-location'
                style='w-[18px] h-[18px] fill-[#15803d] drop-shadow-1xl-black'
              />
            ) : (
              <Icon
                src='#icon-location_off'
                style='w-[18px] h-[18px] fill-[#b91c1c] drop-shadow-1xl-black'
              />
            )}{' '}
            {locationStatus}
          </p>
        </div>
      )}
      {socketStatus && (
        <div
          className={`p-2 rounded-full ${
            socketStatus === 'connected' ? 'bg-green' : 'bg-accent animate-pulse'
          }`}
        >
          <p className='text-xs font-semibold text-gray-100 flex gap-1 items-center'>
            {socketStatus === 'connected' ? (
              <Icon
                src='#icon-connected'
                style='w-[18px] h-[18px] fill-[#15803d] drop-shadow-1xl-black'
              />
            ) : (
              <Icon
                src='#icon-disconnected'
                style='w-[18px] h-[18px] fill-[#b91c1c] drop-shadow-1xl-black'
              />
            )}
            {socketStatus}
          </p>
        </div>
      )}
    </section>
  );
};

export default Status;
