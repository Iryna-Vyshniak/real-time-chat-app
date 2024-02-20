import { useAuthContext } from '../../../shared/context/AuthContext';

import Avatar from '../../ui/Avatar';
import Dropdown from './Dropdown';
import Notification from './Notification';

const Navigation = () => {
  const { authUser } = useAuthContext();

  return (
    <nav className='flex-none flex items-center justify-between gap-2'>
      {authUser && (
        <>
          <div className='navbar-end'>
            <Notification />
          </div>
          <Dropdown avatar={<Avatar src={authUser.avatar} />} />
        </>
      )}
    </nav>
  );
};

export default Navigation;
