import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import useConversation from '../../../store/useConversation';
import { useListenMessages } from '../../../shared/hooks/useListenMessages';

import Header from './Header';
import MessageInput from './MessageInput';
import Messages from './Messages';
import NoChatSelected from './NoChatSelected';

const MessagesBlock = ({ isOpen }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useListenMessages();

  useEffect(() => {
    // cleanup function when unmounted component
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className='fixed top-0 right-0 md:relative md:right-auto flex flex-col items-center justify-start flex-grow p-4 pt-24 md:pt-10 max-w-full w-full h-full overflow-hidden bg-slate-300/10 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-1'
        >
          {!selectedConversation ? (
            <NoChatSelected />
          ) : (
            <>
              <Header name={selectedConversation.fullName} />
              <Messages />
              <MessageInput />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagesBlock;
