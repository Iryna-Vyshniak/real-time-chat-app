import { useEffect } from 'react';

import useConversation from '../../../store/useConversation';
import { useListenRoom } from '../../../shared/hooks/useListenRoom';

import Icon from '../../ui/Icon';

import { uniqueSender } from '../../../shared/utils';

const Notification = () => {
  const {
    setSelectedConversation,
    selectedConversation,
    notification,
    setNotification,
    lastMessages,
  } = useConversation();
  const listenRoom = useListenRoom();

  useEffect(() => {
    const newMessagesWithTypes = lastMessages.map((message) => ({
      newMessage: message,
      type: message.sender._id ? 'private' : 'group',
    }));

    setNotification(newMessagesWithTypes);
  }, [lastMessages, setNotification]);

  const uniqueSenders = uniqueSender(notification);

  const handleClick = (type, sender, receiver) => {
    setSelectedConversation({
      type: type,
      data: type === 'private' ? sender : receiver,
    });

    setNotification(
      notification.filter(
        ({
          newMessage: {
            sender: { _id: idSender },
            receiver: { _id: idReceiver },
          },
        }) => {
          if (type === 'private') {
            return idSender !== sender._id;
          } else if (type === 'group') {
            return idReceiver !== receiver._id;
          }
        }
      )
    );

    if (type === 'group') {
      const isSelected = receiver._id === selectedConversation?.data?._id;
      listenRoom(isSelected, receiver);
    }
  };

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
              {uniqueSenders.map(({ type, sender, receiver, count }, idx) => (
                <li
                  key={idx}
                  onClick={() => handleClick(type, sender, receiver)}
                  className='grid grid-cols-[1fr,40px] gap-2 items-center justify-between text-slate-800'
                >
                  <p className='text-[10px]'>
                    {type === 'private'
                      ? `New message from ${sender.username}`
                      : `New message from group ${receiver.chatName}`}
                  </p>
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
