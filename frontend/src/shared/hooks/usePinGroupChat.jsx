import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const usePinGroupChat = (id) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setPinnedGroups } = useConversation();

  const addPinGroup = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/group/${id}/pin-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const updatedPinnedGroups = await res.json();

        setPinnedGroups(updatedPinnedGroups);

        localStorage.setItem('pinnedGroups', JSON.stringify(updatedPinnedGroups));
      } else {
        throw new Error('Failed to add pin group');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [id, setPinnedGroups]);

  return { isLoading, addPinGroup };
};
