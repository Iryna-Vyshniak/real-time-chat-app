import { useEffect, useState } from 'react';

import { useGetMessages } from '../../../shared/hooks/useGetMessages';
import { useListenMessages } from '../../../shared/hooks/useListenMessages';
import useConversation from '../../../store/useConversation';

import Message from './Message';
import LoadMoreMessages from './LoadMoreMessages';

const Messages = () => {
  const [lastMessageElement, setLastMessageElement] = useState(null);

  useListenMessages();

  const { selectedConversation, currentPage, messages } = useConversation();
  console.log('currentPage: ', currentPage);

  const { isLoading } = useGetMessages();
  // scroll to the last messsages
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      lastMessageElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className='mb-4 px-4 flex-auto w-full overflow-auto touch-auto will-change-scroll'>
      <>
        {!isLoading && messages.length > 0 && (
          <ul className='flex-1 px-4 overflow-auto'>
            {messages.map((message, index) => {
              if (
                message.receiver._id === selectedConversation._id ||
                message.sender._id === selectedConversation._id
              ) {
                return (
                  <li
                    key={message._id}
                    ref={(element) => {
                      if (index === messages.length - 1) {
                        setLastMessageElement(element);
                      }
                    }}
                  >
                    <Message message={message} />
                  </li>
                );
              }
            })}
          </ul>
        )}
        {!isLoading && messages.length === 0 && (
          <p className='text-accent text-center drop-shadow-2xl-red'>
            Send a message to start the conversation
          </p>
        )}
        {!isLoading && <LoadMoreMessages />}
      </>
    </div>
  );
};

export default Messages;
