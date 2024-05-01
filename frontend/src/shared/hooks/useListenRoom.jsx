import useConversation from '../../store/useConversation';
import { useAuthContext } from '../context/AuthContext';

export const useListenRoom = () => {
  const { socket } = useConversation();

  const { authUser } = useAuthContext();

  const listenRoom = async (isSelected, group) => {
    // check if the user is already in the group before subscribing to receive messages, and only subscribe to receive messages if we are not already connected to that group.
    if (!isSelected) {
      // Check whether the current group is different from the clicked group
      if (socket.currentRoom && socket.currentRoom !== group.chatName) {
        // If the user is already in the group, leave it
        await socket.emit('leaveRoom', { room: socket.currentRoom, username: authUser.fullName });
        socket.currentRoom = null;
      }

      // Join a new group, if not yet connected
      if (socket.currentRoom !== group.chatName) {
        await socket.emit('joinRoom', { room: group.chatName, username: authUser.fullName });
        socket.currentRoom = group.chatName;
      }
    }
  };
  return listenRoom;
};
