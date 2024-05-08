import { useRef, useState } from 'react';

import Icon from '../../../../ui/Icon';

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);

  const audioRef = useRef();

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // When the audio is finished, set isPlaying to false
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const calculateTime = (value) => {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='flex items-center justify-between gap-2 mt-2'>
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnd} />
      <button onClick={toggleAudio} className='bg-transparent cursor-pointer'>
        {isPlaying ? (
          <Icon src='#icon-pause' style='pulse w-4 h-2 drop-shadow-[0px_1px_0.5px_rgba(0,0,0,1)]' />
        ) : (
          <Icon src='#icon-play' style='w-3 h-3 drop-shadow-[0px_1px_0.5px_rgba(0,0,0,1)]' />
        )}
      </button>
      <p className='text-[10px]'>{calculateTime(currentTime)}</p>
      <input
        type='range'
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className='range self-center'
      />
    </div>
  );
};

export default AudioPlayer;
