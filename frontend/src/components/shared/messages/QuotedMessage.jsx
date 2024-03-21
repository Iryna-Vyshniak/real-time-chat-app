import Icon from '../../ui/Icon';

const QuotedMessage = ({ message, showButton, onCloseQuote, dropdownColor }) => {
  if (!message) return;

  const { sender, text, img, audio, video } = message;

  return (
    <>
      <div className={showButton ? 'pl-[66px] pr-5 max-w-full w-full' : 'max-w-full w-full'}>
        <div
          className={`relative flex flex-col items-start justify-center gap-2 border-l-2 border-accent p-1 pl-2 pr-4 w-full ${
            dropdownColor || 'bg-secondary'
          } text-[10px] italic rounded-lg text-slate-800 select-none truncate`}
        >
          {' '}
          <div className='flex items-center justify-start gap-2'>
            {' '}
            <Icon src='#icon-forward' style='drop-shadow-1xl-black w-3 h-3' />
            <p>Reply to {sender?.fullName}</p>
          </div>
          <div className='flex items-center justify-start gap-2'>
            {' '}
            {text && <p className='px-2 text-ellipsis overflow-hidden whitespace-nowrap'>{text}</p>}
            {img && (
              <>
                <Icon src='#icon-picture' style='drop-shadow-1xl-white w-3 h-3' />{' '}
                <span>Image</span>
              </>
            )}
            {audio && (
              <>
                <Icon src='#icon-audio' style='drop-shadow-1xl-white w-3 h-3' /> <span>Audio</span>
              </>
            )}
            {video && (
              <>
                <Icon src='#icon-video-play' style='drop-shadow-1xl-white w-3 h-3' />{' '}
                <span>Video</span>
              </>
            )}
          </div>
          {showButton && (
            <button
              onClick={onCloseQuote}
              className='absolute right-2 top-2 text-accent border-accent drop-shadow-1xl-white'
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default QuotedMessage;
