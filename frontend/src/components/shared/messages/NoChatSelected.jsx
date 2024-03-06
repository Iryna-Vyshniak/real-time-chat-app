import { useMemo } from 'react';
import { useAuthContext } from '../../../shared/context/AuthContext.jsx';
import { generateEmoji } from '../../../shared/utils/index.js';
import Icon from '../../ui/Icon';

const NoChatSelected = () => {
  const { authUser } = useAuthContext();

  // generate emoji
  const generateConversationsWithEmoji = useMemo(() => {
    return generateEmoji();
  }, []);

  return (
    <div className='grid place-items-center gap-4 px-4 sm:text-lg md:text-xl text-accent font-semibold text-center tracking-wider drop-shadow-2xl-double'>
      <p>Welcome 👋</p>
      <h1>
        {authUser.fullName} <span>{generateConversationsWithEmoji}</span>
      </h1>
      <p className='text-center'>Select a chat to start messaging</p>
      <Icon src='#icon-chat' style='w-8 h-8' />
    </div>
  );
};

export default NoChatSelected;
