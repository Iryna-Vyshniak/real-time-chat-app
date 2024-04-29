import { useEffect } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useListenGroups = () => {
  const { socket, setGroups, groups, setSelectedConversation } = useConversation();

  useEffect(() => {
    socket?.on('groupCreated', (group) => {
      setGroups([...groups, group]);

      toast.success(`Congratulations! You have been added to group ${group.chatName}`);
    });

    socket?.on('groupUpdated', (group) => {
      const updatedGroups = groups.map((oldGroup) =>
        oldGroup._id === group._id ? group : oldGroup
      );
      setGroups(updatedGroups);

      toast.success(`The group ${group.chatName} has been updated`);
    });

    socket?.on('groupDeleted', (group) => {
      setGroups(groups.filter(({ _id }) => _id !== group._id));
      setSelectedConversation(null);
      toast.success(
        `The group "${group.chatName}" has been deleted. You have been removed from this group.`
      );
    });

    return () => {
      socket.off('groupCreated');
      socket.off('groupUpdated');
      socket.off('groupDeleted');
    };
  }, [groups, setGroups, setSelectedConversation, socket]);
};
