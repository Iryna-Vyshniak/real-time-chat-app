import { genEmoji } from '../../../shared/utils/index.js';
import Avatar from '../../ui/Avatar';

const Conversation = () => {
  const message = true;
  return (
    <div className='relative flex items-center gap-2 px-2 py-1 hover:bg-blue-500/30 rounded cursor-pointer transition duration-200 ease-in-out'>
      <Avatar src='https://res.cloudinary.com/dkqxaid79/image/upload/v1691497617/rewievs/image_70_j8immx.png' />
      <div className='flex flex-col flex-1'>
        <div className='flex items-center justify-between gap-2'>
          <p className='flex-1 font-semibold text-slate-300 tracking-wider drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
            User name
          </p>
          <div className='flex items-center justify-center  w-8 h-8 rounded-full bg-slate-500/20 shadow-md'>
            {message ? (
              <div className='absolute z-[10] flex items-center justify-center h-full right-0 top-0 mr-3'>
                <span className='flex items-center justify-center shadow bg-blue-700 h-6 w-6 text-xs rounded-full text-white'>
                  4
                </span>
              </div>
            ) : (
              <span className='text-lg drop-shadow-lg'>{genEmoji()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
