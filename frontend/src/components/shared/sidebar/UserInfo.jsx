import { Link } from 'react-router-dom';
import Icon from '../../ui/Icon';

const UserInfo = ({ user }) => {
  return (
    <div className='p-4 w-[90%] md:w-1/3 h-auto bg-primary/10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 rounded-md text-slate-300 text-lg drop-shadow-1xl-black'>
      <Link
        to='/'
        className='group flex items-center ml-1 text-white transition-all duration-200 ease-in-out drop-shadow-2xl-black'
      >
        {' '}
        <Icon src='#icon-chevrons-left' style='w-5 h-5' />
        <span className='bg-left-bottom bg-gradient-to-r from-white to-primary bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-200 ease-out'>
          {' '}
          Back
        </span>
      </Link>
      <div className='flex flex-col items-center justify-center gap-4'>
        {' '}
        <div className='w-full md:w-60 h-auto'>
          <img
            alt='user avatar'
            src={user.avatar}
            width='6rem'
            height='6rem'
            className='w-full rounded-full'
          />
        </div>
        <div className='flex flex-col items-start  gap-4'>
          {' '}
          <h1>Full name: {user.fullName}</h1>
          <p>Nickname: @{user.username}</p>
          <p>Gender: {user.gender}</p>
          <p>
            Join: {user.createdAt.split('T')[0]} {} {user.createdAt.split('T')[1].split('.')[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
