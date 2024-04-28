import { useEffect } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useListenGroups = () => {
  const { socket, setGroups, groups } = useConversation();

  useEffect(() => {
    socket?.on('groupCreated', (group) => {
      setGroups([...groups, group]);

      toast.success(
        `Congratulations! The group ${group.chatName} has been successfully created and you have been added to it.`
      );
    });

    return () => {
      socket.off('groupCreated');
    };
  }, [groups, setGroups, socket]);
};
