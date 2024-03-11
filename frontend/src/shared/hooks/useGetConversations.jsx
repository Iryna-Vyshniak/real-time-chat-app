import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useGetConversations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { lastMessages, setLastMessages, conversations, setConversations } = useConversation();

  const getConversations = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/users`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setConversations(data.allFilteredUsers);
      setLastMessages(data.lastMessages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [setConversations, setLastMessages]);

  useEffect(() => {
    getConversations();
  }, [getConversations]);

  return { isLoading, conversations, lastMessages, getConversations };
};
