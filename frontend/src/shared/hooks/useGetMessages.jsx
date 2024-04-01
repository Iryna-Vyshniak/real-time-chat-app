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
      const lastConversationId = selectedConversation.data._id;
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

      // get converastionId and add to store for listen read message or not
      const conversationsId = getUserConversationId(data.messages, lastConversationId);
      setConversationId(conversationsId);

      // Update total pages, current page, and limit
      setTotalPages(data.totalPages);
      setCurrentPage(currentPage);
      setLimit(data.limit);

      currentPage === 1 ? setMessages(data.messages) : addMessages(data.messages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    selectedConversation?.data?._id,
    currentPage,
    limit,
    setConversationId,
    setTotalPages,
    setCurrentPage,
    setLimit,
    setMessages,
    addMessages,
  ]);

  useEffect(() => {
    let isCancel = false;

    if (!isCancel && selectedConversation && selectedConversation?.data?._id) {
      fetchData();
    }

    return () => (isCancel = true);
  }, [fetchData, selectedConversation, selectedConversation?.data?._id]);

  return { messages, conversationId };
};
