import Logo from './Logo';
import Navigation from './Navigation';

const Navbar = () => {
  return (
    <header className='fixed left-0 top-0 z-10 w-full h-[4.5rem] bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      <div className='container flex items-center justify-between'>
        <Logo />

        <Navigation />
      </div>
    </header>
  );
};

export default Navbar;
