import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';
import { getUserConversationId } from '../utils';

export const useGetMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { messages, setMessages, selectedConversation, conversationId, setConversationId } =
    useConversation();

  const getLastConversationId = useCallback(() => {
    return selectedConversation?._id;
  }, [selectedConversation]);

  useEffect(() => {
    const getMessages = async () => {
      setIsLoading(true);
      try {
        const lastConversationId = getLastConversationId();
        if (!lastConversationId) return;

        const res = await fetch(`/api/messages/${lastConversationId}`);
        const data = await res.json();

        if (data.error || data.message) {
          throw new Error(data.error || data.message);
        }

        // getting the conversation ID for a particular user and setting that ID as the active conversation
        const conversationsId = getUserConversationId(data, lastConversationId);
        setConversationId(conversationsId);

        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getMessages();
  }, [getLastConversationId, setMessages, setConversationId]);

  return { messages, isLoading, conversationId };
};
