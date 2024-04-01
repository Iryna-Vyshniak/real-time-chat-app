import { useCallback, useState } from 'react';
import useConversation from '../../store/useConversation';
import toast from 'react-hot-toast';

const useSendEmoji = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedConversation } = useConversation();

  const sendEmoji = useCallback(
    async ({ messageId, emoji }) => {
      if (!selectedConversation?.data?._id) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/messages/${selectedConversation?.data?._id}/emoji/${messageId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emoji }),
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
    [selectedConversation?.data?._id]
  );

  return { isLoading, sendEmoji };
};

export default useSendEmoji;
