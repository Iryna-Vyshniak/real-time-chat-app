import Header from './Header';
import MessageInput from './MessageInput';
import Messages from './Messages';
import NoChatSelected from './NoChatSelected';

const MessagesBlock = () => {
  const noChatSelected = true;
  return (
    <div className='md:min-w-[450px] w-[50vw] flex flex-col p-4'>
      {noChatSelected ? (
        <NoChatSelected />
      ) : (
        <>
          <Header />
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessagesBlock;
