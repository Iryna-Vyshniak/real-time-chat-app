import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useDeleteMessage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { selectedConversation } = useConversation();

  const deleteMessage = useCallback(
    async ({ id }) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/messages/delete/${id}?type=${selectedConversation?.type}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (data.error || data.message) {
          throw new Error(data.error || data.message);
        }

        toast.success(data.info);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedConversation?.type]
  );

  return { isLoading, deleteMessage };
};
