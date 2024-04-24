import { Link } from 'react-router-dom';

import Icon from './Icon';

export const LinkToBack = ({ children, to }) => {
  return (
    <Link
      to={to}
      className='group self-start flex items-center ml-1 text-white transition-all duration-200 ease-in-out drop-shadow-2xl-black'
    >
      <Icon src='#icon-chevrons-left' style='w-5 h-5' />
      <span className='bg-left-bottom bg-gradient-to-r from-white to-primary bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-200 ease-out'>
        {children}
      </span>
    </Link>
  );
};
