import { Link } from 'react-router-dom';
import Logo from './Logo';
import Navigation from './Navigation';
import useConversation from '../../../store/useConversation';

const Navbar = () => {
  const { setSelectedConversation } = useConversation();

  return (
    <header className='fixed left-0 top-0 z-10 w-full h-[10%] md:h-[4.5rem] bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      <div className='container flex items-center justify-between'>
        <Link to='/' onClick={() => setSelectedConversation(null)}>
          {' '}
          <Logo />
        </Link>

        <Navigation />
      </div>
    </header>
  );
};

export default Navbar;
