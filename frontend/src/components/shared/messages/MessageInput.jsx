import { useState } from 'react';

import { useSendMessage } from '../../../shared/hooks/useSendMessage';

import TextField from '../../ui/TextField';
import Icon from '../../ui/Icon';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { isLoading, sendMessages } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessages(message);
    setMessage('');
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
          className='p-2.5 pr-10 w-full bg-beige border border-slate-800 text-sm tracking-wider rounded-lg  text-slate-900 placeholder:text-slate-600 placeholder:line-clamp-1'
        />
        <button type='submit' className='absolute top-[45%] right-0 flex items-center pe-3'>
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
