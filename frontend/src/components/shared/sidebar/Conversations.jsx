import { useEffect, useRef } from 'react';

import { useGetConversations } from '../../../shared/hooks/useGetConversations';
import { useFilterConversations } from '../../../shared/hooks/useFilterConversations';
import useConversation from '../../../store/useConversation';

import { generateEmoji } from '../../../shared/utils/index';

import Conversation from './Conversation';

const Conversations = () => {
  const { isLoading, conversations } = useGetConversations();
  const { selectedConversation } = useConversation();
  const filteredConversation = useFilterConversations(conversations, selectedConversation);

  const conversationRef = useRef();

  const nonFilteredConversations = conversations.filter(
    (conversation) => !filteredConversation.includes(conversation)
  );

  // scroll to the selected talking
  useEffect(() => {
    const timerId = setTimeout(() => {
      conversationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 250);

    return () => clearTimeout(timerId);
  }, [filteredConversation]);

  return (
    <ul className='flex flex-col overflow-auto p-2'>
      {isLoading ? <span className='loading loading-spinner'></span> : null}
      {filteredConversation.length > 0 &&
        filteredConversation.map((conversation) => (
          <li key={conversation._id} ref={conversationRef}>
            <Conversation conversation={conversation} emoji={generateEmoji()} />
          </li>
        ))}
      {nonFilteredConversations.map((conversation, idx) => (
        <li key={conversation._id}>
          <Conversation
            lastIdx={idx === conversations.length - 1} // if last conversation - don`t show divider
            conversation={conversation}
            emoji={generateEmoji()}
          />
        </li>
      ))}
    </ul>
  );
};

export default Conversations;
