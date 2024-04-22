import { useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../../store/useConversation';

import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';

const ShareLocation = ({ position, locationStatus }) => {
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const { socketStatus } = useConversation();

  const handleClick = () => {
    if (locationStatus !== 'accessed') {
      toast.error('Please allow location access');
    } else {
      if (position) {
        setShareLinkCopied(true);
      }
    }
  };

  const generateLink = () => {
    if (position) {
      return `${window.location.href}/share-location?lat=${position.lat}&lng=${position.lng}`;
    } else {
      return window.location.href;
    }
  };

  return (
    <div className='flex flex-col gap-3 w-full'>
      {' '}
      <Button
        style={`${
          locationStatus !== 'accessed' || !position ? 'bg-gray-600 cursor-not-allowed' : ''
        }
        text-md text-white font-bold py-2 px-4 rounded-md`}
        onClick={handleClick}
        disabled={locationStatus !== 'accessed' || !position}
      >
        Share Location
      </Button>
      {locationStatus === 'accessed' && socketStatus === 'connected' && shareLinkCopied && (
        <>
          <div className='flex gap-2 items-center justify-between bg-gray-300 rounded-md p-3'>
            <p className='text-md font-bold break-all peer'>{generateLink()}</p>
            <span
              className='cursor-pointer p-2 rounded-full  hover:bg-gray-200 flex items-center active:animate-ping'
              onClick={() => {
                navigator.clipboard
                  .writeText(generateLink())
                  .then(() => {
                    toast.success('Copied to clipboard!');
                  })
                  .catch(() => {
                    toast.error('Failed to copy to clipboard');
                  });
              }}
            >
              <Icon
                src='#icon-copy'
                style='w-[18px] h-[18px] fill-[#15803d] drop-shadow-1xl-black'
              />
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareLocation;
