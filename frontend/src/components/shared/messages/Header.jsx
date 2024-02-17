const Header = ({ name }) => {
  return (
    <div className='px-4 py-2 mt-2 md:mt-0 mb-8 w-full h-9 bg-primary rounded-lg'>
      <span className='text-[12px] sm:label-text text-slate-800'>To:</span>{' '}
      <span className='text-slate-800 font-semibold tracking-widest'>{name}</span>
    </div>
  );
};

export default Header;
