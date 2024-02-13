import { useGetMessages } from '../../../shared/hooks/useGetMessages';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import Message from './Message';

const Messages = () => {
  const { isLoading, messages } = useGetMessages();
  return (
    <div className='flex-1 px-4 overflow-auto'>
      {/* if loading - 4 cycles display skeleton */}
      {isLoading && [...Array(4)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!isLoading && messages.length === 0 && (
        <p className='text-center'>Send a message to start the conversation</p>
      )}
      {!isLoading && messages.length > 0 && (
        <ul className='flex-1 px-4 overflow-auto'>
          {messages.map((message) => (
            <Message key={message._id} message={message}/>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
