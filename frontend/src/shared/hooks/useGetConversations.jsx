import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const useGetConversations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/users`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getConversations();
  }, []);

  return { isLoading, conversations };
};
