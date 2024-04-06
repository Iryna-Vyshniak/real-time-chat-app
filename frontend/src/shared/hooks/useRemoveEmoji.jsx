import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useRemoveEmoji = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedConversation } = useConversation();

  const removeEmoji = useCallback(
    async ({ messageId }) => {
      if (!selectedConversation?.data?._id) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/messages/${selectedConversation?.data?._id}/emoji-remove/${messageId}?type=${selectedConversation?.type}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
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
    [selectedConversation?.data?._id, selectedConversation?.type]
  );

  return { isLoading, removeEmoji };
};
