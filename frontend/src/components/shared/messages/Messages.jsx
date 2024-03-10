import { useEffect, useRef } from 'react';

import useConversation from '../../../store/useConversation';

import Message from './Message';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import { getFormattedDate, hasDateChanged } from '../../../shared/utils';

const Messages = () => {
  const lastMessageElement = useRef(null);
  const messageRef = useRef(useConversation.getState().messages);

  const { selectedConversation, isLoading, messages, totalPages, currentPage } = useConversation();

  useEffect(() => {
    // connect to the storage when mounting,
    const unsubscribe = useConversation.subscribe((state) => (messageRef.current = state.messages));

    // disconnect when unmounting
    return () => {
      unsubscribe();
    };
  }, []);

  // scroll to the last messsages
  useEffect(() => {
    if (messages.length > 0 && currentPage === totalPages) {
      lastMessageElement?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage, messages.length, totalPages]);

  return (
    <div className='relative mb-4 px-4 flex-auto w-full overflow-auto touch-auto will-change-scroll'>
      <>
        {isLoading && [...Array(4)].map((_, idx) => <MessageSkeleton key={idx} />)}
        {!isLoading && messages.length > 0 && currentPage === totalPages && (
          <ul className='flex-1 px-4 overflow-auto touch-auto will-change-scroll'>
            {messages?.map((message, index) => {
              const previousMessage = messages[index - 1];
              const currentDate = getFormattedDate(message.createdAt);
              const previousDate = previousMessage
                ? getFormattedDate(previousMessage.createdAt)
                : null;
              if (
                message.receiver._id === selectedConversation._id ||
                message.sender._id === selectedConversation._id
              ) {
                // Add a new date if it changes
                if (hasDateChanged(previousDate, currentDate)) {
                  return (
                    <>
                      <li
                        key={`date_${currentDate}`}
                        className='flex items-center justify-center gap-2 after:content-[""]  after:ml-0.5 after:w-20 after:h-[1px] after:bg-primary before:content-[""]  before:ml-0.5 before:w-20 before:h-[1px] before:bg-primary  text-sm text-center p-2 pt-4 text-slate-200 drop-shadow-1xl-black'
                      >
                        {currentDate}
                      </li>
                      <li
                        key={message._id}
                        ref={(element) => {
                          if (index === messages.length - 1) {
                            lastMessageElement.current = element;
                          }
                        }}
                      >
                        <Message message={message} key={message._id} />
                      </li>
                    </>
                  );
                } else {
                  // Add a message if the date remains the same
                  return (
                    <li
                      key={message._id}
                      ref={(element) => {
                        if (index === messages.length - 1) {
                          lastMessageElement.current = element;
                        }
                      }}
                    >
                      <Message message={message} key={message._id} />
                    </li>
                  );
                }
              }
              return null; // Add null to avoid displaying unnecessary items in the list
            })}
          </ul>
        )}

        {!isLoading && messages.length === 0 && (
          <p className='text-accent text-center drop-shadow-2xl-red'>
            Send a message to start the conversation
          </p>
        )}
      </>
    </div>
  );
};

export default Messages;
