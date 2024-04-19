import { useEffect, useState } from 'react';

import useConversation from '../../store/useConversation';

export const useGroupParticipants = () => {
  const [participants, setParticipants] = useState({});
  const { socket, onlineGroupUsers, setOnlineGroupUsers } = useConversation();

  useEffect(() => {
    const handleNewUserJoined = ({ room, username }) => {
      setParticipants((prevParticipants) => ({
        ...prevParticipants,
        [username]: {
          status: 'joined',
          room,
          online: true,
        },
      }));
    };

    const handleUserLeftGroup = ({ room, username }) => {
      setParticipants((prevParticipants) => ({
        ...prevParticipants,
        [username]: {
          status: 'left',
          room,
          online: false,
        },
      }));
    };

    const handleOnlineGroupUsers = ({ room, onlineUsers }) => {
      setOnlineGroupUsers({ room, onlineUsers });
    };

    socket?.on('newUserJoined', handleNewUserJoined);
    socket?.on('userLeftGroup', handleUserLeftGroup);
    socket?.on('updateOnlineUsers', handleOnlineGroupUsers);

    return () => {
      // Clean up event listeners when component unmounts
      socket.off('newUserJoined', handleNewUserJoined);
      socket.off('userLeftGroup', handleUserLeftGroup);
      socket.off('updateOnlineUsers', handleOnlineGroupUsers);
    };
  }, [setOnlineGroupUsers, socket]);

  return { participants, onlineGroupUsers };
};
