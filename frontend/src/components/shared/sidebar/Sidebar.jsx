import Divider from '../../ui/Divider';
import Conversations from './Conversations';
import SearchInput from './SearchInput';

const Sidebar = () => {
  return (
    <div className='grid grid-rows-[auto,auto,1fr] gap-1 p-4 max-w-full rounded-lg bg-green/10 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 text-slate-300 md:border-r border-slate-300'>
      <SearchInput />
      <Divider style='hidden md:block' />
      <Conversations />
    </div>
  );
};

export default Sidebar;
