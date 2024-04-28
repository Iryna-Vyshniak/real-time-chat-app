import { useEffect } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useListenGroups = () => {
  const { socket, setGroups, groups, setSelectedConversation } = useConversation();

  useEffect(() => {
    socket?.on('groupCreated', (group) => {
      setGroups([...groups, group]);

      toast.success(
        `Congratulations! The group ${group.chatName} has been successfully created and you have been added to it.`
      );
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
      socket.off('groupDeleted');
    };
  }, [groups, setGroups, setSelectedConversation, socket]);
};
