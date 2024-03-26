import { useAuthContext } from '../../../shared/context/AuthContext';

import Avatar from '../../ui/Avatar';
import Dropdown from './Dropdown';
import DropdownContent from './DropdownContent';
import Notification from './Notification';

const Navigation = () => {
  const { authUser } = useAuthContext();

  return (
    <nav className='flex md:flex-col-reverse items-center justify-between md:justify-center gap-2'>
      {authUser && (
        <>
          {' '}
          <div className='navbar-end md:navbar'>
            <Notification />
          </div>
          <Dropdown>
            <Avatar src={authUser.avatar} />
            <DropdownContent />
          </Dropdown>
        </>
      )}
    </nav>
  );
};

export default Navigation;
