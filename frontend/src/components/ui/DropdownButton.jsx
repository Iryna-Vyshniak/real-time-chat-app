import Icon from './Icon';

const DropdownButton = ({ children }) => {
  return (
    <div className='dropdown dropdown-end absolute top-0 right-1 z-10'>
      <button
        tabIndex={0}
        type='button'
        className='p-1 hover:bg-white/20 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none'
      >
        <Icon src='#icon-dots-horizontal-triple' style='w-2 h-2' />
      </button>
      {children}
    </div>
  );
};

export default DropdownButton;
