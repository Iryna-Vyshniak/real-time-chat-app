import { useEffect, useRef, useState } from 'react';

import { useGetMessages } from '../../../shared/hooks/useGetMessages';
import { useListenMessages } from '../../../shared/hooks/useListenMessages';

import MessageSkeleton from '../skeletons/MessageSkeleton';
import Message from './Message';
import useConversation from '../../../store/useConversation';

const Messages = () => {
  const [messageStatus, setMessageStatus] = useState({});

  const { selectedConversation } = useConversation();
  const { isLoading, messages } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      // Оновлюємо статус для кожного повідомлення відповідно до його прочитаності
      const updatedStatus = {};
      messages.forEach((message) => {
        updatedStatus[message._id] = message.read;
      });
      setMessageStatus(updatedStatus);
    }
  }, [messages]);

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
              message.receiverId === selectedConversation._id ||
              message.senderId === selectedConversation._id
            ) {
              return (
                <li key={message._id} ref={lastMessageRef}>
                  <Message message={message} read={messageStatus[message._id]} />
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
