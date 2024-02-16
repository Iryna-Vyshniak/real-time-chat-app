import useUpdateStatusMsg from '../../../shared/hooks/useUpdateStatusMsg.jsx';
import { unreadMessagesCount } from '../../../shared/utils/index.js';
import useConversation from '../../../store/useConversation.jsx';

import Avatar from '../../ui/Avatar';
import Divider from '../../ui/Divider.jsx';

const Conversation = ({
  conversation: { _id, fullName, username, avatar },
  emoji,
  lastIdx,
  lastMessages,
}) => {
  const { selectedConversation, setSelectedConversation, setLastMessages } = useConversation();

  const { updateStatusMessage } = useUpdateStatusMsg();

  // const unreadMessagesCount = Array.isArray(lastMessages)
  //   ? lastMessages.filter(({ lastMessage }) => lastMessage.senderId === _id && !lastMessage.read)
  //       .length
  //   : 0;

  const unreadMessagesCounts = unreadMessagesCount(lastMessages, _id);

  const isSelected = selectedConversation?._id == _id;

  const handleClick = async () => {
    setSelectedConversation({ _id, fullName, username, avatar });
    if (unreadMessagesCounts) {
      await updateStatusMessage(_id);

      const updatedLastMessages = lastMessages.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            lastMessage: {
              ...item.lastMessage,
              read: true,
            },
          };
        }
        return item;
      });
      setLastMessages(updatedLastMessages);
    }
  };

  return (
    <>
      <div
        className={`relative flex items-center justify-between gap-2 px-2 py-1 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
          isSelected ? 'md:bg-secondary/30' : ''
        }`}
        onClick={handleClick}
      >
        <div className='relative'>
          <Avatar src={avatar} selected={isSelected} />

          {unreadMessagesCounts && (
            <div className='absolute bottom-0 right-0 z-10 flex items-end justify-end md:hidden'>
              <span className='flex items-center justify-center shadow bg-primary h-4 w-4 text-[10px] rounded-full text-slate-800'>
                {unreadMessagesCounts}
              </span>
            </div>
          )}
        </div>

        <div className='hidden md:flex items-center justify-between gap-4 flex-grow'>
          <p className='font-semibold text-slate-300 tracking-wider drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
            {fullName}
          </p>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-slate-500/20 shadow-md'>
            {unreadMessagesCounts ? (
              <div className='absolute z-[10] flex items-center justify-center h-full right-0 top-0 mr-3'>
                <span className='flex items-center justify-center shadow bg-primary h-6 w-6 text-xs rounded-full text-slate-800'>
                  {unreadMessagesCounts}
                </span>
              </div>
            ) : (
              <span className='text-lg drop-shadow-lg'>{emoji}</span>
            )}
          </div>
        </div>
      </div>
      {!lastIdx && <Divider style='hidden md:flex' />}
    </>
  );
};

export default Conversation;
