import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';
import { getUserConversationId } from '../utils';

export const useGetMessages = () => {
  const {
    setIsLoading,
    setMessages,
    addMessages,
    messages,
    selectedConversation,
    conversationId,
    setConversationId,
    currentPage,
    setTotalPages,
    setCurrentPage,
    limit,
    setLimit,
  } = useConversation();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const lastConversationId = selectedConversation?._id;
      if (!lastConversationId || lastConversationId === '') {
        return;
      }

      const res = await fetch(
        `/api/messages/${lastConversationId}?page=${currentPage}&limit=${limit}`
      );
      const data = await res.json();

      if (data.error || data.message) {
        throw new Error(data.error || data.message);
      }

      const conversationsId = getUserConversationId(data.messages, lastConversationId);
      setConversationId(conversationsId);

      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setLimit(data.limit);

      if (data.messages.length > 0 && currentPage > 1) {
        addMessages(data.messages);
      } else {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    selectedConversation?._id,
    currentPage,
    limit,
    setConversationId,
    setTotalPages,
    setCurrentPage,
    setLimit,
    addMessages,
    setMessages,
  ]);

  useEffect(() => {
    let isCancel = false;

    if (!isCancel && selectedConversation && selectedConversation?._id) {
      fetchData();
    }

    return () => (isCancel = true);
  }, [fetchData, selectedConversation, selectedConversation?._id]);

  return { messages, conversationId };
};
