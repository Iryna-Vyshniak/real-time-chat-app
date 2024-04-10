import { useGroupParticipants } from '../../../shared/hooks/useGroupParticipants';
import useConversation from '../../../store/useConversation';

const GroupConnectedClients = ({ isShow }) => {
  const { selectedConversation } = useConversation();
  const { participants, onlineGroupUsers } = useGroupParticipants();

  return (
    <>
      {participants && selectedConversation.type === 'group' && isShow && (
        <div className='absolute top-[2.8rem] md:top-[2.3rem] left-0 z-[50] w-full p-2 rounded-lg bg-primary/50 bg-clip-padding backdrop-filter backdrop-blur-lg md:border-b border-slate-300'>
          {onlineGroupUsers &&
            onlineGroupUsers.onlineUsers?.length > 0 &&
            selectedConversation.type === 'group' && (
              <div className='flex align-items justify-center gap-2'>
                <h3 className='text-center text-slate-700 text-xs'>Online: </h3>
                {onlineGroupUsers.onlineUsers.map((user, idx) => (
                  <p key={idx + user} className='text-center text-slate-700 text-xs'>
                    {user}
                  </p>
                ))}
              </div>
            )}

          {Object.entries(participants).map(([username, { status, room }], idx) => {
            if (
              selectedConversation.type === 'group' &&
              selectedConversation.data.chatName === room
            ) {
              return (
                <p key={`${room + idx + username}`} className='text-center text-slate-500 text-xs'>
                  {username}{' '}
                  {status === 'joined'
                    ? `has entered the group: ${room}`
                    : `has left the group: ${room}`}
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
