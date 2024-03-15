import { useEffect, useState } from 'react';

import useConversation from '../../../store/useConversation';

import Header from './Header';
import MessageInput from './MessageInput';
import Messages from './Messages';
import NoChatSelected from './NoChatSelected';
import LoadMoreMessages from './LoadMoreMessages';
import QuotedMessage from './QuotedMessage';

import { useListenReadMessages } from '../../../shared/hooks/useListenReadMessages';
import { useListenMessages } from '../../../shared/hooks/useListenMessages';

const MessagesBlock = ({ isOpen }) => {
  const [quotedMessage, setQuotedMessage] = useState(null);
  const [isShowQuotedMessage, setIsShowQuotedMessage] = useState(true);

  const handleClose = () => {
    setIsShowQuotedMessage(false);
    setQuotedMessage(null);
  };

  const handleReply = (message) => {
    setQuotedMessage(message);
    setIsShowQuotedMessage(true);
  };

  const { selectedConversation, setSelectedConversation, isLoading } = useConversation();
  useListenMessages();
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
              <Messages onReply={handleReply} />
              {!isLoading && <LoadMoreMessages />}
              <div className='flex flex-col items-center justify-center w-full'>
                {' '}
                {isShowQuotedMessage && (
                  <QuotedMessage
                    message={quotedMessage}
                    showButton='true'
                    onCloseQuote={handleClose}
                  />
                )}
                <MessageInput
                  onCloseQuote={handleClose}
                  isShowQuotedMessage={isShowQuotedMessage}
                  quotedMessage={quotedMessage}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MessagesBlock;
