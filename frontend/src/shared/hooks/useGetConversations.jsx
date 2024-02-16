import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useConversation from '../../store/useConversation';

export const useGetConversations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { lastMessages, setLastMessages } = useConversation();

  useEffect(() => {
    const getConversations = async () => {
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
    };

    getConversations();
  }, [setLastMessages]);

  return { isLoading, conversations, lastMessages };
};
