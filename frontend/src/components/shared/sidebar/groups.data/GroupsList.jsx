import Divider from '../../../ui/Divider';
import GroupBadge from './GroupBadge';

const GroupsList = ({ data }) => {
  return (
    <ul className='flex flex-col p-2'>
      {data.map((group) => (
        <li key={group._id}>
          <GroupBadge group={group} />
        </li>
      ))}
      <Divider />
    </ul>
  );
};

export default GroupsList;
