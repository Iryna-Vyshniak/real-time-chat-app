import Avatar from '../../../ui/Avatar';
import AvatarGroup from '../../../ui/AvatarGroup';

const GroupBadge = ({ group }) => {
  const avatars = group.participantsData?.map((participant) => participant.avatar);

  return (
    <div className='flex items-center justify-between gap-2 m-1 mb-2 px-2 py-1 rounded-lg cursor-pointer'>
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
  );
};

export default GroupBadge;
