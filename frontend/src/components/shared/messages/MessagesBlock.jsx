import { useEffect } from 'react';

import useConversation from '../../../store/useConversation';

import Header from './Header';
import MessageInput from './MessageInput';
import Messages from './Messages';
import NoChatSelected from './NoChatSelected';
import LoadMoreMessages from './LoadMoreMessages';
import { useListenReadMessages } from '../../../shared/hooks/useListenReadMessages';

const MessagesBlock = ({ isOpen }) => {
  const { selectedConversation, setSelectedConversation, isLoading } = useConversation();
  useListenReadMessages();
  useListenReadMessages();

  useEffect(() => {
    // cleanup function when unmounted component
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  return (
    <>
      {isOpen && (
        <div className='fixed top-0 right-0 md:relative md:right-auto flex flex-col items-center justify-start flex-grow p-4 pt-24 md:pt-10 max-w-full w-full h-full overflow-hidden touch-auto will-change-scroll bg-slate-300/10 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-1'>
          {!selectedConversation ? (
            <NoChatSelected />
          ) : (
            <>
              <Header name={selectedConversation.fullName} />
              <Messages />
              {!isLoading && <LoadMoreMessages />}
              <MessageInput />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MessagesBlock;
