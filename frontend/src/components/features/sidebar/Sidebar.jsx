import { motion } from 'framer-motion';

import Divider from '../../ui/Divider';
import Conversations from './Conversations';
import ConversationSearch from './ConversationSearch';

import GroupChatModal from './chat.data/GroupChatModal';
import GroupsList from './groups.data/GroupsList';

import useConversation from '../../../store/useConversation';

const Sidebar = ({ isMobile, isOpen, toggleSidebar }) => {
  const { groups } = useConversation();

  return (
    <>
      <motion.aside
        initial={{ y: '-100%' }}
        animate={{ y: isMobile ? (isOpen ? 0 : '-100%') : '0' }}
        transition={{ duration: 0.5 }}
        className='fixed top-0 left-0 pt-24 w-full h-full md:relative md:pt-10 md:pl-24 md:h-full md:w-32 md:min-w-[24rem] flex flex-col justify-start flex-grow overflow-hidden bg-green/10 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 text-slate-300 md:border-r border-slate-300'
      >
        <ConversationSearch />
        <Divider style={isMobile ? 'hidden' : 'block'} />
        <GroupChatModal />
        {groups.length > 0 && <GroupsList data={groups} toggleSidebar={toggleSidebar} />}
        <Conversations toggleSidebar={toggleSidebar} />
      </motion.aside>
    </>
  );
};

export default Sidebar;
