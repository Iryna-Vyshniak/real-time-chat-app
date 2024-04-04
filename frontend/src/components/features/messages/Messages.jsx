import { Fragment, useEffect, useRef } from 'react';

import useConversation from '../../../store/useConversation';

import Message from './Message';

import { getFormattedDate, hasDateChanged } from '../../../shared/utils';

const Messages = ({ onReply }) => {
  const lastMessageElement = useRef(null);

  const { selectedConversation, isLoading, totalPages, currentPage } = useConversation();

  // By utilizing messageRef.current directly, the component ensures accurate tracking of the message list's state without causing unnecessary re-renders. Additionally, the implementation now correctly handles message visibility and scrolling to the last message when applicable.
  const messageRef = useRef(useConversation.getState().messages);

  useEffect(() => {
    // connect to the storage when mounting,
    const unsubscribe = useConversation.subscribe((state) => (messageRef.current = state.messages));

    // disconnect when unmounting
    return () => {
      unsubscribe();
    };
  }, []);

  //scroll to the last messsages
  useEffect(() => {
    if (messageRef.current.length > 0 && currentPage === totalPages) {
      lastMessageElement?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage, messageRef.current.length, totalPages]);

  return (
    <div className='relative mb-4 px-4 flex-auto w-full overflow-auto touch-auto will-change-scroll'>
      {isLoading && (
        <div className='absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2 z-[50] flex items-center justify-center'>
          <p className='loading loading-ring loading-lg'></p>
        </div>
      )}

      {!isLoading &&
        messageRef.current.length > 0 &&
        (totalPages === 0 || currentPage === totalPages) && (
          <ul className='flex-auto px-4 h-full overflow-auto touch-auto will-change-scroll'>
            {messageRef.current.map((message, index) => {
              const previousMessage = messageRef.current[index - 1];
              const currentDate = getFormattedDate(message.createdAt);
              const previousDate = previousMessage
                ? getFormattedDate(previousMessage.createdAt)
                : null;
              // Check the type of conversation and render messages depending on the type
              if (
                (selectedConversation.type === 'group' &&
                  message.conversationId === selectedConversation.data._id) ||
                (selectedConversation.type === 'private' &&
                  message.conversationId !== message.receiver &&
                  (message.receiver._id === selectedConversation?.data?._id ||
                    message.sender._id === selectedConversation?.data?._id))
              ) {
                if (hasDateChanged(previousDate, currentDate)) {
                  return (
                    <Fragment key={message._id}>
                      <li
                        key={`date_${currentDate}_${index}`}
                        className='flex items-center justify-center gap-2 after:content-[""] after:ml-0.5 after:w-20 after:h-[1px] after:bg-primary before:content-[""] before:ml-0.5 before:w-20 before:h-[1px] before:bg-primary text-sm text-center p-2 pt-4 text-slate-200 drop-shadow-1xl-black'
                      >
                        {currentDate}
                      </li>
                      <li
                        key={message._id}
                        ref={(element) => {
                          if (index === messageRef.current.length - 1) {
                            lastMessageElement.current = element;
                          }
                        }}
                      >
                        <Message
                          message={message}
                          onReply={onReply}
                          quotedMessage={message.repliedTo}
                        />
                      </li>
                    </Fragment>
                  );
                } else {
                  return (
                    <li
                      key={message._id}
                      ref={(element) => {
                        if (index === messageRef.current.length - 1) {
                          lastMessageElement.current = element;
                        }
                      }}
                    >
                      <Message
                        message={message}
                        onReply={onReply}
                        quotedMessage={message.repliedTo}
                      />
                    </li>
                  );
                }
              }
              return null; // Add null to avoid displaying unnecessary items in the list
            })}
          </ul>
        )}

      {!isLoading &&
        (messageRef.current.length === 0 ||
          (selectedConversation?.type === 'group' &&
            selectedConversation?.data.messages.length === 0)) && (
          <p className='text-accent text-center drop-shadow-2xl-red'>
            Send a message to start the conversation
          </p>
        )}
    </div>
  );
};

export default Messages;
