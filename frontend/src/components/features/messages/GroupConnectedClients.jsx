import { useSocketContext } from '../../../shared/context/SocketContext';
import useConversation from '../../../store/useConversation';

import Button from '../../ui/Button';
import Icon from '../../ui/Icon';

const GroupConnectedClients = ({ isShow, toggleShow }) => {
  const { participants } = useSocketContext();

  const { selectedConversation } = useConversation();

  return (
    <>
      {participants && selectedConversation.type === 'group' && (
        <Button
          style={`absolute top-[0.8rem] md:top-[0.25rem] right-2 z-[50] btn btn-ghost btn-circle btn-xs shadow-xs shadow-slate-500 transition duration-200 ease-in-out`}
          onClick={toggleShow}
        >
          <Icon src='#icon-users' style='w-4 h-4 z-10 drop-shadow-1xl-white' />
        </Button>
      )}
      {participants && selectedConversation.type === 'group' && isShow && (
        <div className='absolute top-[2.8rem] md:top-[2.3rem] left-0 z-[50] w-full p-2 rounded-lg bg-primary/50 bg-clip-padding backdrop-filter backdrop-blur-lg md:border-b border-slate-300'>
          {Object.entries(participants).map(([username, status], idx) => {
            if (
              selectedConversation.type === 'group' &&
              selectedConversation.data.chatName === status.room
            ) {
              return (
                <p
                  key={`${status.room + idx + username}`}
                  className='text-center text-slate-500 text-xs'
                >
                  {username}{' '}
                  {status.status === 'joined'
                    ? `has entered the group: ${status.room}`
                    : `has left the group: ${status.room}`}
                </p>
              );
            }
            return null; // If the condition is not met, return null
          })}
        </div>
      )}
    </>
  );
};

export default GroupConnectedClients;
