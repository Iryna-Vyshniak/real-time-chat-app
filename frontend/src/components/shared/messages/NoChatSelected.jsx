import { useAuthContext } from '../../../shared/context/AuthContext.jsx';
import { genEmoji } from '../../../shared/utils/index.js';
import Icon from '../../ui/Icon';

const NoChatSelected = () => {
  const { authUser } = useAuthContext();

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='flex flex-col items-center gap-2 px-4 sm:text-lg md:text-xl text-gray-200 font-semibold tracking-wider '>
        <p>
          Welcome 👋 {authUser.fullName} <span>{genEmoji()}</span>
        </p>
        <p>Select a chat to start messaging</p>
        <Icon src='#icon-chat' style='w-8 h-8' />
      </div>
    </div>
  );
};

export default NoChatSelected;
