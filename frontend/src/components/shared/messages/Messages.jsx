import { useEffect, useRef } from 'react';

import { useGetMessages } from '../../../shared/hooks/useGetMessages';
import { useListenMessages } from '../../../shared/hooks/useListenMessages';
import useConversation from '../../../store/useConversation';

import MessageSkeleton from '../skeletons/MessageSkeleton';
import Message from './Message';

const Messages = () => {
  const { selectedConversation } = useConversation();
  const { isLoading, messages } = useGetMessages();

  useListenMessages();

  const lastMessageRef = useRef(null);

  // scroll to the last messsages
  useEffect(() => {
    const timerId = setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

    return () => clearTimeout(timerId);
  }, [messages]);

  return (
    <div className='flex-auto px-4 overflow-auto touch-auto will-change-scroll'>
      {!isLoading && messages.length > 0 && (
        <ul className='flex-1 px-4 overflow-auto'>
          {messages.map((message) => {
            if (
              message.receiver._id === selectedConversation._id ||
              message.sender._id === selectedConversation._id
            ) {
              return (
                <li key={message._id} ref={lastMessageRef}>
                  <Message message={message} />
                </li>
              );
            }
          })}
        </ul>
      )}
      {/* if loading - 4 cycles display skeleton */}
      {isLoading && [...Array(4)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!isLoading && messages.length === 0 && (
        <p className='text-accent text-center drop-shadow-2xl-red'>
          Send a message to start the conversation
        </p>
      )}
    </div>
  );
};

export default Messages;
