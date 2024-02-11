const Header = () => {
  return (
    <div className='px-4 py-2 mt-2 h-9 bg-slate-500/50 rounded-lg'>
      <span className='label-text text-slate-300 drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
        To:
      </span>{' '}
      <span className='text-blue-800 font-semibold'>Will Smith</span>
    </div>
  );
};

export default Header;
