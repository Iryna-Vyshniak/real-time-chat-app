import { useEffect } from 'react';
import useConversation from '../../../../store/useConversation';
import GroupBadge from './GroupBadge';

const GroupsList = ({ data, toggleSidebar }) => {
  const { groups, pinnedGroups, setPinnedGroups } = useConversation();
  // const pinnedGroups = JSON.parse(localStorage.getItem('pinnedGroups')) || [];

  useEffect(() => {
    setPinnedGroups(JSON.parse(localStorage.getItem('pinnedGroups')) || []);
  }, [setPinnedGroups]);

  const pinnedIds = pinnedGroups.map((pin) => pin);

  const pinnedGroupsSorted = groups.filter((group) => pinnedIds.includes(group._id));
  const unpinnedGroupsSorted = groups.filter((group) => !pinnedIds.includes(group._id));

  const sortedGroups = [...pinnedGroupsSorted, ...unpinnedGroupsSorted];

  return (
    <ul
      className={`flex flex-col mt-4 p-2 gap-2 ${
        data.length === 1 ? 'min-h-20' : data.length === 2 ? 'min-h-48' : 'min-h-56'
      } overflow-auto touch-auto will-change-scroll`}
    >
      {sortedGroups.map((group) => (
        <GroupBadge key={group._id} group={group} toggleSidebar={toggleSidebar} />
      ))}
    </ul>
  );
};

export default GroupsList;
