/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';
import { getUserConversationId } from '../utils';

export const useGetMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    messages,
    setMessages,
    selectedConversation,
    conversationId,
    setConversationId,
    totalPages,
    currentPage,
    setTotalPages,
    setCurrentPage,
    limit,
    setLimit,
  } = useConversation();

  const getLastConversationId = useCallback(() => {
    return selectedConversation?._id;
  }, [selectedConversation]);

  useEffect(() => {
    const getMessages = async () => {
      setIsLoading(true);
      try {
        const lastConversationId = getLastConversationId();
        if (!lastConversationId) return;

        const res = await fetch(
          `/api/messages/${lastConversationId}?page=${currentPage}&limit=${limit}`
        );
        const data = await res.json();

        if (data.error || data.message) {
          throw new Error(data.error || data.message);
        }

        // getting the conversation ID for a particular user and setting that ID as the active conversation
        const conversationsId = getUserConversationId(data, lastConversationId);
        // Set the conversation ID
        setConversationId(conversationsId);

        // Update page data
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLimit(data.limit);

        // Add new messages to the store if there are any
        if (data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation, limit, currentPage]);

  const loadMoreMessages = (newCurrentPage) => {
    console.log('Loading more messages for page:', newCurrentPage);
    // Load the next page of messages if there are more pages to load
    if (newCurrentPage <= totalPages) {
      setCurrentPage(newCurrentPage);
    }
  };

  return { messages, isLoading, conversationId, loadMoreMessages, currentPage };
};
