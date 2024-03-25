import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import useConversation from '../../store/useConversation';

export const useEditMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedConversation } = useConversation();

  const editMessage = useCallback(
    async ({ messageId, text }) => {
      if (!selectedConversation?._id) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/messages/edit/${selectedConversation?._id}/${messageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

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
    [selectedConversation?._id]
  );

  return { isLoading, editMessage };
};
