const Avatar = ({ src, selected, isOnline, style }) => {
  return (
    <div
      tabIndex={0}
      role='button'
      className={
        !style
          ? `btn btn-ghost btn-circle avatar shadow-xl shadow-primary/30 
      ${isOnline ? 'online' : ''} 
      ${selected ? 'ring ring-accent ring-offset-base-100 ring-offset-2' : ''}`
          : 'update-avatar btn btn-ghost btn-circle avatar shadow-xl shadow-primary/30'
      }
    >
      <div className={style ? style : 'w-10 rounded-full'}>
        <img
          alt='user avatar'
          src={src}
          width='2.8rem'
          height='2.8rem'
          className={'w-[2.8rem] h-[2.8rem] shadow-lg'}
        />
      </div>
    </div>
  );
};

export default Avatar;
