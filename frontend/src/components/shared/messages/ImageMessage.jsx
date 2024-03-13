import { downloadImage } from '../../../shared/utils';

import Icon from '../../ui/Icon';

const ImageMessage = ({ message, dropdownColor }) => {
  return (
    <>
      <div className='w-32 h-20'>
        <img
          src={message.img}
          alt='message'
          width={128}
          height={80}
          onClick={() => document.getElementById(`${message._id}`).showModal()}
          className='w-full h-full object-contain cursor-pointer'
        />

        <div className='dropdown dropdown-end absolute top-1 right-1'>
          <button
            tabIndex={0}
            type='button'
            className='p-1 hover:bg-white/20 rounded-lg focus:ring-4 focus:ring-primary focus:outline-none'
          >
            <Icon src='#icon-dots-horizontal-triple' style='w-4 h-4' />
          </button>

          <ul
            tabIndex={0}
            className={`
                ${dropdownColor} 
                dropdown-content z-[1] menu mt-2 p-2 shadow rounded-box w-24`}
          >
            <li>
              <a href='#'>Replay</a>
            </li>
            <li>
              <a href='#'>Copy</a>
            </li>
            <li>
              <a href='#'>Delete</a>
            </li>
          </ul>
        </div>

        <a
          href={downloadImage(message.img)}
          download
          target='_blank'
          rel='noopener noreferrer'
          className='absolute bottom-1 right-1 flex items-center justify-center p-1 hover:bg-white/20 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none'
        >
          <Icon src='#icon-download' style='w-4 h-4' />
        </a>
      </div>
    </>
  );
};

export default ImageMessage;
