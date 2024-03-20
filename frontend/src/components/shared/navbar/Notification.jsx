import { useEffect } from 'react';
import { uniqueSender } from '../../../shared/utils';
import useConversation from '../../../store/useConversation';

import Icon from '../../ui/Icon';

const Notification = () => {
  const { setSelectedConversation, notification, setNotification, lastMessages } =
    useConversation();

  useEffect(() => {
    setNotification(lastMessages);
  }, [lastMessages, setNotification]);

  const uniqueSenders = uniqueSender(notification);

  return (
    <button
      className={`btn btn-ghost btn-circle ${
        notification.length > 0 && 'dropdown dropdown-bottom dropdown-left  md:dropdown-right'
      }`}
    >
      <div className='indicator drop-shadow-1xl-white'>
        <Icon src='#icon-bell' style='drop-shadow-1xl-black' />

        {notification.length > 0 && (
          <>
            {' '}
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-8 p-1 rounded-box w-52 shadow-md bg-primary'
            >
              {uniqueSenders.map(({ sender: { _id, fullName, username, avatar }, count }, idx) => (
                <li
                  key={_id + idx}
                  onClick={() => {
                    setSelectedConversation({ _id, fullName, username, avatar });
                    setNotification(
                      notification.filter(({ sender: { _id: idSender } }) => idSender !== _id)
                    );
                  }}
                  className='grid grid-cols-[1fr,40px] gap-2 items-center justify-between text-slate-800'
                >
                  <p className='text-[10px]'>{`New message from ${username}`} </p>
                  <span className='flex items-center justify-center shadow bg-secondary h-4 w-4 text-[10px] rounded-full text-slate-800'>
                    {' '}
                    {`${count}`}
                  </span>
                </li>
              ))}
            </ul>
            {(notification.length > 0 || lastMessages.length > 0) && (
              <span className='absolute top-0 right-0 flex items-center justify-center w-[16px] h-[16px] rounded-full bg-primary indicator-item text-slate-800 text-[7px] drop-shadow-5xl-black'>
                {notification.length > 9 ? '9+' : notification.length}
              </span>
            )}
          </>
        )}
      </div>
    </button>
  );
};

export default Notification;
