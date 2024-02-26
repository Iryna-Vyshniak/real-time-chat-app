import { useRef, useState } from 'react';

import { useSendMessage } from '../../../shared/hooks/useSendMessage';

import TextField from '../../ui/TextField';
import Icon from '../../ui/Icon';
import { usePreviewImage } from '../../../shared/hooks/usePreviewImage';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

  const { isLoading, sendMessages } = useSendMessage();

  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message || imgUrl) {
      await sendMessages({
        message,
        img: imgUrl,
      });
      setMessage('');
      setImgUrl(null);
    }
  };

  return (
    <form className='px-4 mt-auto w-full' onSubmit={handleSubmit} autoComplete='off'>
      <div className='relative w-full'>
        <TextField
          type='text'
          placeholder='Send a message'
          name='message'
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          className='relative p-2.5 pr-20 w-full bg-beige border border-slate-800 text-sm tracking-wider rounded-lg  text-slate-900 placeholder:text-slate-600 placeholder:line-clamp-1'
        />
        <button
          type='button'
          disabled={isLoading}
          onClick={() => fileRef.current.click()}
          className='absolute top-[25%] right-8 flex items-center pe-2 bg-transparent cursor-pointer'
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
          className='absolute top-[25%] right-0 flex items-center pe-3 cursor-pointer'
        >
          {isLoading ? (
            <span className='loading loading-spinner'></span>
          ) : (
            <Icon src='#icon-paper-plane' style='drop-shadow-1xl-black' />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
