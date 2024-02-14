import useConversation from '../../../store/useConversation.jsx';
import Avatar from '../../ui/Avatar';
import Divider from '../../ui/Divider.jsx';

const Conversation = ({ conversation: { _id, fullName, username, avatar }, emoji, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  const isSelected = selectedConversation?._id == _id;

  return (
    <div className='flex flex-col justify-center'>
      <div
        className={`relative flex items-center justify-between gap-2 px-2 py-1 hover:bg-beige/40 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
          isSelected ? 'bg-secondary/30' : ''
        }`}
        onClick={() => setSelectedConversation({ _id, fullName, username, avatar })}
      >
        {' '}
        <Avatar src={avatar} selected={isSelected} />
        <div className='flex-grow w-full'>
          <div className='flex items-center justify-between gap-2'>
            <p className='flex-grow font-semibold text-slate-300 tracking-wider drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
              {fullName}
            </p>
            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-slate-500/20 shadow-md'>
              <div className='absolute z-[10] flex items-center justify-center h-full right-0 top-0 mr-3'>
                <span className='flex items-center justify-center shadow bg-primary h-6 w-6 text-xs rounded-full text-slate-800'>
                  4
                </span>
              </div>

              <span className='text-lg drop-shadow-lg'>{emoji}</span>
            </div>
          </div>
        </div>
      </div>
      {!lastIdx && <Divider />}
    </div>
  );
};

export default Conversation;
