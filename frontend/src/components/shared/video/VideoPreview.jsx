import { useEffect, useRef } from 'react';

const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return (
    <div className='fixed inset-0 m-0 grid h-[95%] max-h-none w-full max-w-none justify-center p-0 overscroll-contain z-[60] overflow-y-hidden pointer-events-none bg-green-300/10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 transition-all duration-200 ease-in'>
      <div className='flex items-center justify-center mt-auto mb-auto w-72 h-72 rounded-full bg-primary border-8 border-primary'>
        <video
          ref={videoRef}
          autoPlay
          muted
          width='288'
          height='288'
          preload='auto'
          className='relative w-full h-full rounded-full object-cover'
        />
      </div>
    </div>
  );
};

export default VideoPreview;
