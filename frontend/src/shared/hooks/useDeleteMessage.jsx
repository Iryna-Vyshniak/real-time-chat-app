import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export const useDeleteMessage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteMessage = useCallback(async ({ id }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages/delete/${id}`, {
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
  }, []);

  return { isLoading, deleteMessage };
};
