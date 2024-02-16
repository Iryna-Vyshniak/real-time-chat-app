import { useEffect } from 'react';

import useConversation from '../../../store/useConversation';

import Header from './Header';
import MessageInput from './MessageInput';
import Messages from './Messages';
import NoChatSelected from './NoChatSelected';

const MessagesBlock = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    // cleanup function when unmounted component
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className='max-w-full md:w-[50vw] h-[50vh] md:h-[70vh] flex flex-col p-4'>
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
