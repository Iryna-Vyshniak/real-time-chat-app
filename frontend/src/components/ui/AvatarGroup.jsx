const AvatarGroup = ({ avatars, id }) => {
  return (
    <ul className='avatar-group -space-x-[18px] rtl:space-x-reverse'>
      {avatars.slice(0, 3).map((avatar, idx) => (
        <li key={id + `_${idx}`} className='avatar'>
          <div className='w-8 h-8 rounded-full'>
            <img src={avatar} className='w-10 h-10 rounded-full' />
          </div>
        </li>
      ))}
      {avatars.length > 3 && (
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
