import { useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

import { useBlobToFileOrUrl } from '../../../../../shared/hooks/useBlobToFileOrUrl';

import VideoPreview from '../video/VideoPreview';
import Icon from '../../../../ui/Icon';

const RecordView = ({ audio, video }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [saveVideo, setSaveVideo] = useState(false);

  const {
    status: audioStatus,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    mediaBlobUrl: audioBlobUrl,
    clearBlobUrl: clearAudioBlobUrl,
  } = useReactMediaRecorder(audio && { audio: true });

  const {
    status: videoStatus,
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
    mediaBlobUrl: videoBlobUrl,
    clearBlobUrl: clearVideoBlobUrl,
    previewStream,
  } = useReactMediaRecorder(video && { video: true });

  const { blobToBase64, audioUrl, videoUrl } = useBlobToFileOrUrl();

  const startVideo = () => {
    setShowPreview(true);
    startVideoRecording();
  };

  const stopVideo = () => {
    setShowPreview(false);
    stopVideoRecording();
    setSaveVideo(true);
  };

  useEffect(() => {
    if (audioStatus === 'stopped' && audioBlobUrl) {
      blobToBase64(audioBlobUrl, true, false);
      clearAudioBlobUrl();
    }
    if (videoStatus === 'stopped' && videoBlobUrl) {
      if (saveVideo) {
        blobToBase64(videoBlobUrl, false, true);
      }
      clearVideoBlobUrl();
    }
  }, [
    audio,
    audioBlobUrl,
    audioStatus,
    blobToBase64,
    clearAudioBlobUrl,
    clearVideoBlobUrl,
    saveVideo,
    video,
    videoBlobUrl,
    videoStatus,
    videoUrl,
  ]);

  return (
    <div className='flex items-center gap-1'>
      {audioStatus === 'idle' && (
        <button onClick={startAudioRecording} className='relative bg-transparent cursor-pointer'>
          <Icon src='#icon-mic' />
          {audioUrl && (
            <span className='absolute -bottom-1 -left-1 flex items-center justify-center w-3 h-3 rounded-full bg-primary indicator-item text-slate-800 text-[7px] drop-shadow-5xl-black'>
              1
            </span>
          )}
        </button>
      )}

      {videoStatus === 'idle' && (
        <button onClick={startVideo} className='relative bg-transparent cursor-pointer'>
          <Icon src='#icon-video-play' style='fill-[#f97316]' />{' '}
          {videoUrl && (
            <span className='absolute -bottom-1 -left-1 z-[40] cursor-pointer flex items-center justify-center w-3 h-3 rounded-full bg-primary indicator-item text-slate-800 text-[7px] drop-shadow-5xl-black'>
              1
            </span>
          )}
        </button>
      )}
      {audioStatus === 'recording' && (
        <button onClick={stopAudioRecording} className='bg-transparent cursor-pointer'>
          <Icon src='#icon-media-stop' style='pulse fill-[#f97316]' />
        </button>
      )}
      {videoStatus === 'recording' && (
        <button onClick={stopVideo} className='bg-transparent cursor-pointer'>
          <Icon src='#icon-media-stop' style='pulse fill-[#f97316]' />
        </button>
      )}
      {audioStatus === 'stopped' && (
        <div className='bg-transparent cursor-pointer'>
          <Icon src='#icon-mic' />
        </div>
      )}
      {videoStatus === 'stopped' && (
        <div className='bg-transparent cursor-pointer'>
          <Icon src='#icon-video-play' style='fill-[#f97316]' />
        </div>
      )}

      {showPreview && previewStream && <VideoPreview stream={previewStream} />}
    </div>
  );
};

export default RecordView;
