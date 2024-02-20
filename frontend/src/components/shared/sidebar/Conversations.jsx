import { useEffect, useRef } from 'react';

import { useGetConversations } from '../../../shared/hooks/useGetConversations';
import { useFilterConversations } from '../../../shared/hooks/useFilterConversations';
import useConversation from '../../../store/useConversation';

import { generateEmoji, uniqueSender } from '../../../shared/utils/index';

import Conversation from './Conversation';

const Conversations = () => {
  const { isLoading, conversations } = useGetConversations();
  const { selectedConversation, notification } = useConversation();
  const filteredConversation = useFilterConversations(conversations, selectedConversation);

  const conversationRef = useRef();

  const nonFilteredConversations = conversations.filter(
    (conversation) => !filteredConversation.includes(conversation)
  );

  const unreadMessagesCounts = uniqueSender(notification);

  const filterNotification = (id) => unreadMessagesCounts.filter(({ sender }) => sender._id === id);

  // scroll to the selected talking
  useEffect(() => {
    const timerId = setTimeout(() => {
      conversationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 250);

    return () => clearTimeout(timerId);
  }, [filteredConversation]);

  return (
    <ul className='flex md:flex-col p-2 gap-2 overflow-auto touch-auto will-change-scroll'>
      {isLoading ? <span className='loading loading-spinner'></span> : null}
      {filteredConversation.length > 0 &&
        filteredConversation.map((conversation) => (
          <li key={conversation._id} ref={conversationRef} className='w-full'>
            <Conversation
              conversation={conversation}
              emoji={generateEmoji()}
              filteredNotification={filterNotification(conversation._id)}
            />
          </li>
        ))}
      {nonFilteredConversations.map((conversation, idx) => (
        <li key={conversation._id}>
          <Conversation
            lastIdx={idx === conversations.length - 1} // if last conversation - don`t show divider
            conversation={conversation}
            emoji={generateEmoji()}
            filteredNotification={filterNotification(conversation._id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default Conversations;
