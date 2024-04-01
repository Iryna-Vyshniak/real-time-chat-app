import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';
import Logo from './Logo';
import Navigation from './Navigation';
import useConversation from '../../../store/useConversation';
import Divider from '../../ui/Divider';
import Icon from '../../ui/Icon';

const Navbar = ({ toggleSidebar }) => {
  const { setSelectedConversation } = useConversation();

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: '0' }}
      transition={{ duration: 0.5 }}
      className='fixed top-0 left-0 z-10 p-3 md:pb-4 md:pt-10 w-full md:w-fit h-[4rem] md:h-full flex items-center justify-end md:flex-col md:justify-start gap-4 bg-primary/20 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1  md:border-r border-slate-300'
    >
      <div className='flex md:flex-col items-center justify-between'>
        <Link to='/' onClick={() => setSelectedConversation(null)}>
          {' '}
          <Logo />
        </Link>{' '}
        <button className={`btn btn-ghost btn-circle md:hidden`} onClick={toggleSidebar}>
          <Icon src='#icon-users' style='z-10 drop-shadow-1xl-white' />
        </button>
        <Divider className='hidden md:block' />
        <Navigation />
      </div>
    </motion.div>
  );
};

export default Navbar;
