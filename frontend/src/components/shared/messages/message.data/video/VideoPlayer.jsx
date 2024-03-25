import { useRef, useState } from 'react';

import CircleRange from './CircleRange';
import Icon from '../../../../ui/Icon';

const VideoPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationOfVideo, setDurationOfVideo] = useState(0);
  const [currentDurationOfVideo, setCurrentDurationOfVideo] = useState(0);

  const videoRef = useRef();
  let videoIntervalTime = null;

  const clearVideoInterval = () => {
    clearInterval(videoIntervalTime);
  };

  const getDurationOfVideo = () => {
    videoIntervalTime = setInterval(() => {
      setCurrentDurationOfVideo(parseFloat(videoRef?.current?.currentTime));

      if (parseFloat(videoRef?.current?.currentTime) >= durationOfVideo) {
        clearVideoInterval();
      }
    }, 1000);
  };

  const handleLoadedMetadata = () => {
    setDurationOfVideo(videoRef?.current?.duration);
    getDurationOfVideo();
  };

  const toggleVideo = () => {
    if (isPlaying) {
      videoRef?.current?.pause();
      clearVideoInterval();
    } else {
      videoRef?.current?.play();
      handleLoadedMetadata();
    }
    setIsPlaying(!isPlaying);
  };

  const videoDuration = (e) => {
    setCurrentDurationOfVideo(parseFloat(e.target.value));
    videoRef.current.currentTime = parseFloat(e.target.value);
  };

  return (
    <div className='relative w-32 h-32 rounded-full'>
      <video
        width='128'
        height='128'
        src={src}
        ref={videoRef}
        preload='auto'
        onLoadedMetadata={handleLoadedMetadata}
        className='relative w-full h-full rounded-full object-cover'
      >
        <source src={src} type='video/mp4' />
        Download the
        <a href={src}>MP4</a>
        video.
      </video>
      <button onClick={toggleVideo} className='bg-transparent'>
        <Icon
          src={isPlaying ? '#icon-media-stop' : '#icon-video-play'}
          style={`absolute top-[40%] left-[40%] z-40 ${
            isPlaying ? 'w-[126px] h-[126px] fill-transparent' : 'fill-white/50'
          }`}
        />
      </button>
      <CircleRange max={durationOfVideo} value={currentDurationOfVideo} onChange={videoDuration} />
    </div>
  );
};

export default VideoPlayer;
