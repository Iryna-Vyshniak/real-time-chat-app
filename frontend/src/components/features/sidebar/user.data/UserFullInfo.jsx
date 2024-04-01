import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

import { LinkToBack } from '../../../ui/LinkToBack';

const UserFullInfo = ({ user }) => {
  const location = useLocation();
  const backLinkLocationRef = useRef(location.state?.from ?? '/');

  return (
    <div className='p-4 w-[90%] md:w-1/3 h-auto bg-primary/10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 rounded-md text-slate-300 text-lg drop-shadow-1xl-black'>
      <LinkToBack to={backLinkLocationRef.current}>Back</LinkToBack>
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

export default UserFullInfo;
