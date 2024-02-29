import { useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

import { useBlobToFileOrUrl } from '../../../shared/hooks/useBlobToFileOrUrl';

import Icon from '../../ui/Icon';

const RecordView = ({ audio, video, screen }) => {
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder(
      audio && { audio: true },
      video && { video: true },
      screen && { screen: true }
    );

  const { blobToBase64, mediaUrl } = useBlobToFileOrUrl();

  useEffect(() => {
    if (status === 'stopped' && mediaBlobUrl) {
      blobToBase64(mediaBlobUrl);
      clearBlobUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      {status === 'idle' && (
        <button onClick={startRecording} className='bg-transparent cursor-pointer'>
          <Icon src='#icon-mic' />
          {mediaUrl && (
            <span className='absolute bottom-1 -left-0 flex items-center justify-center w-3 h-3 rounded-full bg-primary indicator-item text-slate-800 text-[7px] drop-shadow-5xl-black'>
              1
            </span>
          )}
        </button>
      )}
      {status === 'recording' && (
        <button onClick={stopRecording} className='bg-transparent cursor-pointer'>
          <Icon src='#icon-media-stop' style='pulse' />
        </button>
      )}
      {status === 'stopped' && (
        <div className='relative bg-transparent cursor-pointer'>
          <Icon src='#icon-mic' />
        </div>
      )}
    </div>
  );
};

export default RecordView;
