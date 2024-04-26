import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export const useDeleteUserFromGroup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteUserFromGroup = useCallback(async ({ userId, groupId }) => {
    console.log("groupId: ", groupId);
    
    console.log('userId: ', userId);
   

    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/group/${groupId}/delete-user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      console.log('data: ', data);

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

  return { isLoading, deleteUserFromGroup };
};
