import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useAuthContext } from '../../../shared/context/AuthContext.jsx';
import { generateEmoji } from '../../../shared/utils/index.js';
import { emojiUser } from '../../../shared/data/index.js';

import Icon from '../../ui/Icon';

const NoChatSelected = () => {
  const { authUser } = useAuthContext();

  // generate emoji
  const generateConversationsWithEmoji = useMemo(() => {
    return generateEmoji(emojiUser);
  }, []);

  return (
    <div className='grid place-items-center gap-4 px-4 sm:text-lg md:text-xl text-accent font-semibold text-center tracking-wider'>
      <p className='drop-shadow-2xl-double'>Welcome 👋</p>
      <Link
        to={`/users/${authUser._id}`}
        className='w-40 h-40 rounded-full bg-transparent shadow-lg shadow-primary/30'
      >
        <div className='w-40 rounded-full'>
          <img
            alt='user avatar'
            src={authUser.avatar}
            width='6rem'
            height='6rem'
            className='w-40 h-40 rounded-full'
          />
        </div>
      </Link>
      <h1 className='drop-shadow-2xl-double'>
        {authUser.fullName} <span>{generateConversationsWithEmoji}</span>
      </h1>
      <p className='text-center drop-shadow-2xl-double'>Select a chat to start messaging</p>
      <Icon src='#icon-chat' style='w-8 h-8' />
    </div>
  );
};

export default NoChatSelected;
