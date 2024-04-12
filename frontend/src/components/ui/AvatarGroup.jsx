const AvatarGroup = ({ avatars, isCount, style }) => {
  return (
    <ul
      className={`${
        !isCount ? 'flex flex-wrap items-center justify-start gap-2' : 'avatar-group'
      } p-2 ${style ? style : ''}`}
    >
      {isCount
        ? avatars.slice(0, 3).map(({ avatar, _id }) => (
            <li key={_id} className='avatar'>
              <div className='w-8 h-8 rounded-full'>
                <img src={avatar} className='w-full h-full rounded-full' />
              </div>
            </li>
          ))
        : avatars.map(({ avatar, _id, username }) => (
            <li key={_id} className='relative tooltip' data-tip={username}>
              <div className='avatar'>
                {' '}
                <div className='w-8 h-8 rounded-full'>
                  <img src={avatar} className='w-full h-full rounded-full' />
                </div>
              </div>
            </li>
          ))}
      {avatars.length > 3 && isCount && (
        <div className='avatar placeholder'>
          <div className='w-8 h-8 rounded-full bg-green text-slate-800 text-xs'>
            <span>+{Number(avatars.length - 3)}</span>
          </div>
        </div>
      )}
    </ul>
  );
};

export default AvatarGroup;
