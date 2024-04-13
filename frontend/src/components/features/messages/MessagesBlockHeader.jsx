import { useGroupParticipants } from '../../../shared/hooks/useGroupParticipants';

import useConversation from '../../../store/useConversation';
import Button from '../../ui/Button';
import Icon from '../../ui/Icon';

import ChatInfoModal from './chat.data/ChatInfoModal';

const MessagesBlockHeader = ({ name, data, toggleShow }) => {
  const { participants } = useGroupParticipants();
  const { selectedConversation } = useConversation();
  return (
    <div className='flex items-center justify-between px-4 py-2 mt-2 md:mt-0 mb-8 w-full h-9 bg-primary rounded-lg'>
      <div className='flex items-center gap-2'>
        <span className='text-[12px] sm:label-text text-slate-800'>To:</span>{' '}
        <span className='text-slate-800 font-semibold tracking-widest'>{name}</span>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          style='btn btn-ghost btn-circle btn-xs shadow-xs shadow-slate-500 transition duration-200 ease-in-out'
          onClick={() => document.getElementById('chat-info').showModal()}
        >
          <Icon src='#icon-info' style='drop-shadow-1xl-white' />
        </Button>
        <ChatInfoModal data={data} type={selectedConversation.type} />
        {participants && selectedConversation.type === 'group' && (
          <Button
            style='btn btn-ghost btn-circle btn-xs shadow-xs shadow-slate-500 transition duration-200 ease-in-out'
            onClick={toggleShow}
          >
            <Icon src='#icon-users' style='w-4 h-4 z-10 drop-shadow-1xl-white' />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessagesBlockHeader;
