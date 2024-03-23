import { useRef, useState } from 'react';

import { useSendMessage } from '../../../shared/hooks/useSendMessage';

import Icon from '../../ui/Icon';
import { usePreviewImage } from '../../../shared/hooks/usePreviewImage';
import RecordView from '../media.recoder/MediaRecorder';
import useConversation from '../../../store/useConversation';

const MessageInput = ({ onCloseQuote, isShowQuotedMessage, quotedMessage }) => {
  const [message, setMessage] = useState('');
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();
  const {
    isLoading: globalIsLoading,
    audioUrl,
    setAudioUrl,
    videoUrl,
    setVideoUrl,
    selectedEmoji,
    setSelectedEmoji,
  } = useConversation();

  const { isLoading, sendMessages } = useSendMessage();

  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message || imgUrl || audioUrl || videoUrl) {
      await sendMessages({
        message,
        img: imgUrl,
        audio: audioUrl,
        video: videoUrl,
        emoji: selectedEmoji,
        quote: isShowQuotedMessage,
        quotedId: quotedMessage?._id || '',
      });
      clearForm();
    }
  };

  const clearForm = () => {
    setMessage('');
    setImgUrl(null);
    setAudioUrl(null);
    setVideoUrl(null);
    setSelectedEmoji(null);
    onCloseQuote();
  };

  return (
    <form className='pl-2 pr-4 mt-auto w-full items-end' onSubmit={handleSubmit} autoComplete='off'>
      <div className='relative flex items-center justify-between gap-2 w-full'>
        <RecordView audio={true} video={true} />
        <textarea
          type='text'
          placeholder={!isShowQuotedMessage ? 'Send a message' : 'Reply to message'}
          name='message'
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          className='area relative p-2.5 py-2 pr-20 w-full bg-beige border border-slate-800 text-sm tracking-wider rounded-lg  text-slate-900 placeholder:text-slate-600 placeholder:line-clamp-1 input input-bordered h-10 selection:bg-accent/50'
        />
        <button
          type='button'
          disabled={isLoading}
          onClick={() => fileRef.current.click()}
          className={`absolute top-[20%] ${
            message || imgUrl || audioUrl || videoUrl ? 'right-[4.2rem]' : 'right-8'
          } flex items-center pe-2 bg-transparent cursor-pointer`}
        >
          <Icon src='#icon-paperclip' style='drop-shadow-1xl-black' />

          {imgUrl && (
            <span className='absolute -bottom-1 -left-2 flex items-center justify-center w-3 h-3 rounded-full bg-primary indicator-item text-slate-800 text-[7px] drop-shadow-5xl-black'>
              1
            </span>
          )}
        </button>
        <input type='file' ref={fileRef} hidden onChange={handleImageChange} />
        <button
          type='submit'
          className={`absolute top-[20%] ${
            message || imgUrl || audioUrl || videoUrl ? 'right-10' : 'right-0'
          } flex items-center pe-3 cursor-pointer`}
          disabled={globalIsLoading}
        >
          {isLoading ? (
            <span className='loading loading-spinner'></span>
          ) : (
            <Icon src='#icon-paper-plane' style='drop-shadow-1xl-black' />
          )}
        </button>
        {(message || imgUrl || audioUrl || videoUrl) && (
          <button
            type='reset'
            className={`flex items-center pe-3 cursor-pointer`}
            onClick={clearForm}
          >
            {isLoading ? (
              <span className='loading loading-spinner'></span>
            ) : (
              <Icon src='#icon-trash' style='w-5 h-5 drop-shadow-1xl-black fill-[#f97316]' />
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default MessageInput;
