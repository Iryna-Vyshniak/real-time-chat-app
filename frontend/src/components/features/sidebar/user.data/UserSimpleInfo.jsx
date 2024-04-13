import Avatar from '../../../ui/Avatar';

const UserSimpleInfo = ({ handleGroup, user, adminName, close }) => {
  return (
    <div className='relative flex items-center gap-1 px-2 py-1' onClick={handleGroup}>
      <Avatar src={user.avatar} />
      <div className='flex flex-col items-start gap-1 cursor-pointer'>
        <h1 className='text-xs'>{user.fullName}</h1>
        <p className='text-xs'>@{user.username}</p>
      </div>
      {close && (!adminName || adminName.fullName !== user.fullName) && (
        <button className='btn btn-xs btn-circle btn-ghost absolute right-0 top-0 text-[8px]'>
          ✕
        </button>
      )}
    </div>
  );
};

export default UserSimpleInfo;
