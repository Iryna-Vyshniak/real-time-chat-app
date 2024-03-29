const Logo = () => {
  return (
    <div className='hidden md:flex flex-1 cursor-pointer'>
      <img
        src='/avatar-logo.svg'
        alt='logo chat'
        width='44px'
        height='44px'
        className='w-[44px] h-[44px]'
      />
    </div>
  );
};

export default Logo;
