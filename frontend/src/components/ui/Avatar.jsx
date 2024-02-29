const Avatar = ({ src, selected, isOnline, style }) => {
  return (
    <div
      tabIndex={0}
      role='button'
      className={
        !style
          ? `btn btn-ghost btn-circle avatar shadow-lg shadow-primary/30
      ${isOnline ? 'online' : ''} 
      ${selected ? 'ring ring-accent ring-offset-base-100 ring-offset-2' : ''}`
          : 'update-avatar btn btn-ghost btn-circle avatar shadow-lg shadow-primary/30'
      }
    >
      <div className={style ? style : 'w-10 rounded-full'}>
        <img
          alt='user avatar'
          src={src}
          width='2rem'
          height='2rem'
          className={style ? 'w-10 h-10 rounded-full' : 'w-10 h-10'}
        />
      </div>
    </div>
  );
};

export default Avatar;
