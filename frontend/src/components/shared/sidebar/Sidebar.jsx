import Divider from '../../ui/Divider';
import Conversations from './Conversations';
import SearchInput from './SearchInput';

const Sidebar = () => {
  return (
    <div className='sidebar flex flex-col gap-2 p-4 md:border-r border-slate-500'>
      <SearchInput />
      <Divider />
      <Conversations />
    </div>
  );
};

export default Sidebar;
