import { useEffect } from 'react';

import useConversation from '../../../store/useConversation';
import { useListenMessages } from '../../../shared/hooks/useListenMessages';

import Header from './Header';
import MessageInput from './MessageInput';
import Messages from './Messages';
import NoChatSelected from './NoChatSelected';

const MessagesBlock = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useListenMessages();

  useEffect(() => {
    // cleanup function when unmounted component
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className='grid grid-rows-[auto,1fr,auto] flex-grow p-4 max-w-full w-full'>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <Header name={selectedConversation.fullName} />
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessagesBlock;
