import { useState } from 'react';

import TextField from '../../ui/TextField';
import Icon from '../../ui/Icon';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  return (
    <form className='px-4 mt-auto'>
      <div className='relative w-full'>
        <TextField
          type='text'
          placeholder='Send a message'
          name='message'
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          className='p-2.5 w-full bg-slate-500 border border-slate-800 text-sm tracking-wider rounded-lg  text-white'
        />
        <button type='submit' className='absolute top-[45%] right-0 flex items-center pe-3'>
          <div className='loading loading-spinner'></div>
          <Icon src='#icon-paper-plane' />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
