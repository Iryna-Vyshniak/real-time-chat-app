import Icon from './Icon';

const DropdownButton = ({ children }) => {
  return (
    <div className='dropdown dropdown-end absolute top-1 right-1'>
      <button
        tabIndex={0}
        type='button'
        className='p-1 hover:bg-white/20 rounded-lg focus:ring-4 focus:ring-primary focus:outline-none'
      >
        <Icon src='#icon-dots-horizontal-triple' style='w-4 h-4' />
      </button>
      {children}
    </div>
  );
};

export default DropdownButton;
