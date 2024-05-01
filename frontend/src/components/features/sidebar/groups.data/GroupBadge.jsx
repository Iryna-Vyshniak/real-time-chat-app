import useConversation from '../../../../store/useConversation';
import { useListenRoom } from '../../../../shared/hooks/useListenRoom';
import { usePinGroupChat } from '../../../../shared/hooks/usePinGroupChat';

import Avatar from '../../../ui/Avatar';
import AvatarGroup from '../../../ui/AvatarGroup';
import Divider from '../../../ui/Divider';
import DropdownButton from '../../../ui/DropdownButton';
import Icon from '../../../ui/Icon';

import { getTitle } from '../../../../shared/utils';

const GroupBadge = ({ group, toggleSidebar }) => {
  const {
    isLoading,
    selectedConversation,
    setSelectedConversation,
    resetCurrentPage,
    setInitialGroupChatName,
    setInitialSelectedUsers,
    setInitialImgUrl,
  } = useConversation();
  const listenRoom = useListenRoom();
  const { addPinGroup } = usePinGroupChat(group._id);

  const pinnedGroups = JSON.parse(localStorage.getItem('pinnedGroups')) || [];

  const avatars = group.participants?.map((participant) => participant);

  const isSelected = selectedConversation?.data?._id === group._id;

  const pinnedText = pinnedGroups.includes(group._id) ? 'Unpin' : 'Pin';
  const isPinned = pinnedGroups.includes(group._id);

  const handleClick = async () => {
    if (isSelected) return;
    if (isLoading) return;

    //  listen who entered or leave room
    listenRoom(isSelected, group);

    resetCurrentPage();

    setSelectedConversation({
      type: 'group',
      data: { ...group },
    });

    // Save the initial values for modal group
    setInitialGroupChatName(group.chatName);
    setInitialSelectedUsers(group.participants);
    setInitialImgUrl(group.chatAvatar);
  };

  return (
    <li className='relative w-full'>
      <div
        className={`flex items-center justify-between gap-2 p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
          isSelected ? 'border-[1px] border-green/30 shadow-md md:bg-secondary/10' : 'border-none'
        }`}
        onClick={() => {
          handleClick();
          toggleSidebar();
        }}
      >
        <Avatar src={group.chatAvatar} isTooltip={true} />

        <p className='font-semibold text-slate-300 tracking-wider drop-shadow-1xl-black'>
          {' '}
          {getTitle(group.chatName)}
        </p>

        <div className='flex rounded-md'>
          <AvatarGroup
            avatars={avatars}
            id={group._id}
            isCount={true}
            style='-space-x-[18px] rtl:space-x-reverse'
          />
        </div>
      </div>

      <DropdownButton
        id={group._id}
        fromMe={true}
        button={true}
        isPinned={isPinned}
        style='dropdown dropdown-hover dropdown-left absolute z-[50] top-1 right-1 cursor-pointer'
      >
        <div
          tabIndex={0}
          className='dropdown-content z-[50] menu py-1 px-2 shadow bg-primary rounded-box w-20'
          onClick={addPinGroup}
        >
          <div className='flex items-center justify-between gap-2'>
            {' '}
            <Icon src='#icon-pin' style='w-3 fill-accent drop-shadow-1xl-black' />
            <p className='text-slate-800 text-xs'>{pinnedText}</p>
          </div>
        </div>
      </DropdownButton>

      <Divider />
    </li>
  );
};

export default GroupBadge;
