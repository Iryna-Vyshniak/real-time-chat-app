const Header = ({ name }) => {
  return (
    <div className='px-4 py-2 mt-2 mb-8 w-full h-9 bg-primary rounded-lg line-clamp-1'>
      <span className='label-text text-slate-800'>To:</span>{' '}
      <span className='text-slate-800 font-semibold tracking-widest'>{name}</span>
    </div>
  );
};

export default Header;
