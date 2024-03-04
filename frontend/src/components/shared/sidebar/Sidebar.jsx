import { motion } from 'framer-motion';

import Divider from '../../ui/Divider';
import Conversations from './Conversations';
import SearchInput from './SearchInput';

const Sidebar = ({ isMobile, isOpen, toggleSidebar }) => {
  return (
    <>
      <motion.aside
        initial={{ y: '-100%' }}
        animate={{ y: isMobile ? (isOpen ? 0 : '-100%') : '0' }}
        transition={{ duration: 0.5 }}
        className='fixed top-0 left-0 pt-24 w-full h-full md:relative md:pt-10 md:pl-24 md:h-full md:w-32 md:min-w-[24rem] flex flex-col justify-start flex-grow overflow-hidden bg-green/10 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 text-slate-300 md:border-r border-slate-300'
      >
        <SearchInput />
        <Divider style={isMobile ? 'hidden' : 'block'} />
        <Conversations toggleSidebar={toggleSidebar} />
      </motion.aside>
    </>
  );
};

export default Sidebar;
