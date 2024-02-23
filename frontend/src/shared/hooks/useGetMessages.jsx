import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';
import { getUserConversationId } from '../utils';

export const useGetMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    messages,
    setMessages,
    selectedConversation,
    lastMessages,
    setConversationId,
    conversationId,
  } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setIsLoading(true);
      try {
        if (!selectedConversation?._id) return;

        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        // getting the conversation ID for a particular user and setting that ID as the active conversation
        const conversationsId = getUserConversationId(data, selectedConversation._id);
        setConversationId(conversationsId);

        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getMessages();
  }, [selectedConversation?._id, setMessages, lastMessages, setConversationId]);

  return { messages, isLoading, conversationId };
};
