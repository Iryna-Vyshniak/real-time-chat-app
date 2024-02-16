import { useAuthContext } from '../../../shared/context/AuthContext';
import useConversation from '../../../store/useConversation';

import { unreadMessagesCount } from '../../../shared/utils';

import Avatar from '../../ui/Avatar';
import Dropdown from './Dropdown';

const Navigation = () => {
  const { authUser } = useAuthContext();
  const { lastMessages } = useConversation();

  const unreadMessagesCounts = unreadMessagesCount(lastMessages);

  return (
    <nav className='flex-none flex items-center justify-between gap-2'>
      {authUser && (
        <>
          <div className='navbar-end'>
            <button className='btn btn-ghost btn-circle'>
              <div className='indicator drop-shadow-[0px_1px_1px_rgba(250,250,250,1)]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1'
                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  />
                </svg>
                {unreadMessagesCounts && (
                  <span className='absolute top-0 right-0 flex items-center justify-center w-[16px] h-[16px] rounded-full bg-primary indicator-item text-slate-800 text-[7px] drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
                    {unreadMessagesCounts}
                  </span>
                )}
              </div>
            </button>
          </div>
          <Dropdown avatar={<Avatar src={authUser.avatar} />} />
        </>
      )}
    </nav>
  );
};

export default Navigation;
