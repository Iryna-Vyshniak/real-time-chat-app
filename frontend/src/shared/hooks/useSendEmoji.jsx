import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';
import { useAuthContext } from '../context/AuthContext';

const useSendEmoji = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const sendEmoji = useCallback(
    async ({ messageId, emoji }) => {
      if (!selectedConversation?.data?._id) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/messages/${selectedConversation?.data?._id}/emoji/${messageId}?type=${selectedConversation?.type}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emoji: { userId: authUser._id, value: emoji } }),
          }
        );

        const data = await res.json();

        if (data.error || data.message) {
          throw new Error(data.error || data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [authUser._id, selectedConversation?.data?._id, selectedConversation?.type]
  );

  return { isLoading, sendEmoji };
};

export default useSendEmoji;
