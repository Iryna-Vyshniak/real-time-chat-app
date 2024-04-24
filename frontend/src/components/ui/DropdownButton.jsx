import Icon from './Icon';

const DropdownButton = ({ children, fromMe, style, button, isPinned }) => {
  const position = fromMe ? 'dropdown-left' : 'dropdown-right';

  return (
    <div className={style ? style : `dropdown ${position} absolute top-1 right-1`}>
      {button && (
        <div
          tabIndex={0}
          role='button'
          className='p-1 hover:bg-white/20 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none'
        >
          {isPinned ? (
            <Icon src='#icon-pin' style='w-3 fill-accent drop-shadow-1xl-black' />
          ) : (
            <Icon src='#icon-dots-horizontal-triple' style='w-2 h-2' />
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default DropdownButton;
