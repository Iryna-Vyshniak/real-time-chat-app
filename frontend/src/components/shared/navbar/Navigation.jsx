import { useAuthContext } from '../../../shared/context/AuthContext';

import Avatar from '../../ui/Avatar';
import DropdownButton from '../../ui/DropdownButton';
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
          <DropdownButton style='dropdown dropdown-bottom dropdown-left md:dropdown-right'>
            <Avatar src={authUser.avatar} />
            <DropdownContent />
          </DropdownButton>
        </>
      )}
    </nav>
  );
};

export default Navigation;
