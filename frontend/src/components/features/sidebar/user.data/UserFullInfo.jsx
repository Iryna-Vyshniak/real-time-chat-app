import UserGroups from './UserGroups';
import UserAdminGroups from './UserAdminGroups';

const UserFullInfo = ({ user }) => {
  return (
    <>
      {' '}
      <div className='self-center flex items-center justify-center w-60 h-auto mt-2'>
        <img
          alt='user avatar'
          src={user.avatar}
          width='6rem'
          height='6rem'
          className='w-full rounded-full'
        />
      </div>
      <div className='flex flex-col self-start gap-4 w-full text-slate-300'>
        {' '}
        <h1>Full name: {user.fullName}</h1>
        <p>Nickname: @{user.username}</p>
        <p>Gender: {user.gender}</p>
        {user.adminGroups.length > 0 && <UserAdminGroups groups={user.adminGroups} />}
        {user.groups.length > 0 && <UserGroups groups={user.groups} />}
        <p>
          Join: {user.createdAt.split('T')[0]} {} {user.createdAt.split('T')[1].split('.')[0]}
        </p>
      </div>
    </>
  );
};

export default UserFullInfo;
