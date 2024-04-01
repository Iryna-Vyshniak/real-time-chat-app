import GroupBadge from './GroupBadge';

const GroupsList = ({ data, toggleSidebar }) => {
  return (
    <ul
      className={`flex flex-col mt-4 p-2 gap-2 ${
        data.length === 1 ? 'min-h-20' : data.length === 2 ? 'min-h-48' : 'min-h-56'
      } overflow-auto touch-auto will-change-scroll`}
    >
      {data.map((group) => (
        <GroupBadge key={group._id} group={group} toggleSidebar={toggleSidebar} />
      ))}
    </ul>
  );
};

export default GroupsList;
