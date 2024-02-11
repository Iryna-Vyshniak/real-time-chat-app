const Message = () => {
  return (
    <li>
      <div className='chat chat-end'>
        {' '}
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full'>
            <img
              alt='user avatar'
              src='https://res.cloudinary.com/dkqxaid79/image/upload/v1692265419/rewievs/Fletcher_lyecuy.png'
              width='40px'
              height='40px'
            />
          </div>
        </div>
        <div className={'chat-bubble  text-white bg-slate-500/30'}>Hi! {"What's"} upp?</div>
        <div className='chat-footer flex items-center gap-1 text-xs opacity-50'>12:42</div>
      </div>
      <div className='chat chat-start'>
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full'>
            <img
              alt='user avatar'
              src='https://res.cloudinary.com/dkqxaid79/image/upload/v1691497617/rewievs/image_70_j8immx.png'
              width='40px'
              height='40px'
            />
          </div>
        </div>
        <div className={'chat-bubble text-white bg-blue-500/30'}>You were the Chosen One!</div>
      </div>
    </li>
  );
};

export default Message;
