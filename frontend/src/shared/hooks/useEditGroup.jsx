import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useEditGroup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedConversation, groups, setGroups } = useConversation();

  const editGroup = useCallback(
    async ({ chatname, chatAvatar, users }) => {
      if (!selectedConversation?.data?._id) return;

      const groupId = selectedConversation?.data?._id;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/chat/group-edit/${groupId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatname, chatAvatar, users }),
        });

        const data = await res.json();

        if (data.error || data.message) {
          throw new Error(data.error || data.message);
        }
        const updatedGroups = groups.map((group) => (group._id === data._id ? data : group));
        setGroups(updatedGroups);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [groups, selectedConversation?.data?._id, setGroups]
  );

  return { isLoading, editGroup };
};
