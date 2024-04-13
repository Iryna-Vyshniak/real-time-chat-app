import useConversation from '../../../../store/useConversation';

import { useAuthContext } from '../../../../shared/context/AuthContext';
import { useSocketContext } from '../../../../shared/context/SocketContext';

import Avatar from '../../../ui/Avatar';
import AvatarGroup from '../../../ui/AvatarGroup';
import Divider from '../../../ui/Divider';

const GroupBadge = ({ group, toggleSidebar }) => {
  const { isLoading, selectedConversation, setSelectedConversation, resetCurrentPage } =
    useConversation();

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const avatars = group.participants?.map((participant) => participant);

  const isSelected = selectedConversation?.data?._id === group._id;

  const handleClick = async () => {
    if (isSelected) return;
    if (isLoading) return;

    // check if the user is already in the group before subscribing to receive messages, and only subscribe to receive messages if we are not already connected to that group.
    if (selectedConversation?.data?._id !== group._id) {
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

    resetCurrentPage();

    setSelectedConversation({
      type: 'group',
      data: { ...group },
    });
  };

  return (
    <li
      className='w-full'
      onClick={() => {
        handleClick();
        toggleSidebar();
      }}
    >
      <div
        className={`relative flex items-center justify-between gap-2 p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
          isSelected ? 'border-[1px] border-green/30 shadow-md md:bg-secondary/10' : 'border-none'
        }`}
      >
        {' '}
        {group.participants?.length > 0 ? (
          <AvatarGroup
            avatars={avatars}
            id={group._id}
            isCount={true}
            style='-space-x-[18px] rtl:space-x-reverse'
          />
        ) : (
          <Avatar src={group.chatAvatar} />
        )}
        <p className='font-semibold text-slate-300 tracking-wider drop-shadow-1xl-black'>
          {' '}
          {group.chatName}
        </p>
      </div>

      <Divider />
    </li>
  );
};

export default GroupBadge;
