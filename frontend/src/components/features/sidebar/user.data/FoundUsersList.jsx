import UserSimpleInfo from './UserSimpleInfo';

const FoundUsersList = ({ foundUsers, handleGroup }) => {
  return (
    <ul className='flex items-center gap-2 flex-wrap'>
      {' '}
      {foundUsers?.length > 0 &&
        foundUsers.slice(0, 4).map((user) => (
          <li
            key={user._id}
            className='min-w-[10rem] w-fit bg-green/10 hover:bg-green/20 rounded-lg shadow-md transition-all duration-200 ease-out'
          >
            {' '}
            <UserSimpleInfo user={user} handleGroup={() => handleGroup(user)} />
          </li>
        ))}
    </ul>
  );
};

export default FoundUsersList;
