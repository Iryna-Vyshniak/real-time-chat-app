const UserAdminGroups = ({ groups }) => {
  return (
    <div>
      {' '}
      <p>Admin of groups: </p>{' '}
      <ul className='flex flex-wrap items-center'>
        {groups.slice(0, 5).map(({ _id, chatName, chatAvatar, participants }, idx) => (
          <li
            key={_id}
            className={`px-2 py-1 rounded-md text-slate-500 ${
              idx === 4 ? 'tooltip tooltip-right' : 'tooltip'
            } cursor-pointer`}
            data-tip={`${chatName}, members: ${participants.length}`}
          >
            <div className='w-8 h-8 rounded-full hover:ring ring-accent ring-offset-base-100 ring-offset-2 transition-all duration-200 ease-out'>
              <img src={chatAvatar} className='w-full h-full rounded-full' />
            </div>
          </li>
        ))}
        {groups.length > 5 && (
          <li className='flex items-center justify-center px-2 py-1 w-8 h-8 rounded-full bg-green text-slate-800 text-xs'>
            <span>+{Number(groups.length - 5)}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default UserAdminGroups;
