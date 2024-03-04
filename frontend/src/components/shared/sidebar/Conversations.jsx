import { useEffect, useMemo, useRef } from 'react';

import { useGetConversations } from '../../../shared/hooks/useGetConversations';
import { useFilterConversations } from '../../../shared/hooks/useFilterConversations';
import useConversation from '../../../store/useConversation';

import { generateEmoji, uniqueSender } from '../../../shared/utils/index';

import Conversation from './Conversation';

const Conversations = ({ toggleSidebar }) => {
  const { isLoading, conversations } = useGetConversations();

  const { selectedConversation, notification } = useConversation();

  const filteredConversation = useFilterConversations(conversations, selectedConversation);

  const conversationRef = useRef();

  const nonFilteredConversations = conversations.filter(
    (conversation) => !filteredConversation.includes(conversation)
  );

  const unreadMessagesCounts = uniqueSender(notification);

  const filterNotification = (id) => unreadMessagesCounts.filter(({ sender }) => sender._id === id);

  // keep emoji values stable when rerendering, using useMemo for performance optimization
  const generateConversationsWithEmoji = useMemo(() => {
    return conversations.map((conversation) => ({
      ...conversation,
      emoji: generateEmoji(),
    }));
  }, [conversations]);

  // scroll to the selected talking
  useEffect(() => {
    const timerId = setTimeout(() => {
      conversationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 250);

    return () => clearTimeout(timerId);
  }, [filteredConversation]);

  return (
    <ul className='flex flex-col mt-4 p-2 gap-2 overflow-auto touch-auto will-change-scroll'>
      {isLoading ? <span className='loading loading-spinner'></span> : null}
      {filteredConversation.length > 0 &&
        filteredConversation.map((conversation) => (
          <li key={conversation._id} ref={conversationRef} className='w-full'>
            <Conversation
              conversation={conversation}
              // If the emoji is not found (i.e., if it's undefined), the generateEmoji() function is called to generate a new emoji. This ensures that each conversation has a stable emoji associated with it, even if the conversation data changes.
              emoji={
                generateConversationsWithEmoji.find((c) => c._id === conversation._id)?.emoji ||
                generateEmoji()
              }
              filteredNotification={filterNotification(conversation._id)}
              toggleSidebar={toggleSidebar}
            />
          </li>
        ))}
      {nonFilteredConversations.map((conversation, idx) => (
        <li key={conversation._id}>
          <Conversation
            lastIdx={idx === conversations.length - 1} // if last conversation - don`t show divider
            conversation={conversation}
            emoji={
              generateConversationsWithEmoji.find((c) => c._id === conversation._id)?.emoji ||
              generateEmoji()
            }
            filteredNotification={filterNotification(conversation._id)}
            toggleSidebar={toggleSidebar}
          />
        </li>
      ))}
    </ul>
  );
};

export default Conversations;
