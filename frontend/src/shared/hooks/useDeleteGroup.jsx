import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export const useDeleteGroup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteGroup = useCallback(async ({ users, groupId }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/group/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users }),
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

  return { isLoading, deleteGroup };
};
