import { useAuthContext } from '../../../shared/context/AuthContext';

import Avatar from '../../ui/Avatar';
import Dropdown from './Dropdown';
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
          <Dropdown avatar={<Avatar src={authUser.avatar} />} />
        </>
      )}
    </nav>
  );
};

export default Navigation;
