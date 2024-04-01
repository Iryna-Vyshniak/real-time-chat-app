import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useCreateGroupChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { groups, setGroups } = useConversation();

  const createGroupChat = useCallback(
    async ({ chatname, users }) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/chat/group`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatname, users }),
        });

        const data = await res.json();

        if (data.error || data.message) {
          throw new Error(data.error || data.message);
        }

        setGroups([...groups, data]);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [groups, setGroups]
  );

  return { isLoading, createGroupChat };
};
