import { useAuthContext } from '../../../shared/context/AuthContext';
import useConversation from '../../../store/useConversation';

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const chatColor = fromMe ? 'bg-beige/50' : 'bg-green/50';
  const avatar = fromMe ? authUser.avatar : selectedConversation?.avatar;
  return (
    <li>
      <div className={`chat ${chatClassName}`}>
        {' '}
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full'>
            <img alt='user avatar' src={avatar} width='40px' height='40px' />
          </div>
        </div>
        <div className={`chat-bubble  text-slate-800 ${chatColor}`}>{message.message}</div>
        <div className='chat-footer flex items-center gap-1 text-xs opacity-50'>12:42</div>
      </div>
    </li>
  );
};

export default Message;
