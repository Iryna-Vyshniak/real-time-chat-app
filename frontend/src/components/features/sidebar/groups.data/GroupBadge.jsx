import { useEffect } from 'react';
import useConversation from '../../../../store/useConversation';

import { useSocketContext } from '../../../../shared/context/SocketContext';

import Avatar from '../../../ui/Avatar';
import AvatarGroup from '../../../ui/AvatarGroup';
import Divider from '../../../ui/Divider';

const GroupBadge = ({ group, toggleSidebar }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  const { socket } = useSocketContext();

  useEffect(() => {
    if (selectedConversation?.type === 'group' && selectedConversation?.data?._id === group._id) {
      socket.emit('joinRoom', group._id);
    }
  }, [group._id, selectedConversation?.data?._id, selectedConversation?.type, socket]);

  const avatars = group.participantsData?.map((participant) => participant.avatar);

  const isSelected = selectedConversation?.data?._id === group._id;

  const handleClick = () => {
    if (isSelected) return;

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
        {group.participantsData?.length > 0 ? (
          <AvatarGroup avatars={avatars} />
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
