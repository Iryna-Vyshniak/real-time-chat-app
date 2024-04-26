import { useLocation, useParams } from 'react-router-dom';

import UserFullInfo from '../../components/features/sidebar/user.data/UserFullInfo';

import { useGetUserInfo } from '../../shared/hooks/useGetUserInfo';
import { LinkToBack } from '../../components/ui/LinkToBack';
import { useRef } from 'react';

const UserInfoPage = () => {
  const location = useLocation();
  const backLinkLocationRef = useRef(location.state?.from ?? '/');
  const { id } = useParams();
  const { user, isLoading } = useGetUserInfo(id);

  return (
    <>
      {isLoading && (
        <div className='flex items-center justify-center'>
          <p className='loading loading-ring loading-lg'></p>
        </div>
      )}
      {!isLoading && user && (
        <div className='flex flex-col items-center gap-2 p-4 w-[90%] md:w-1/2 h-auto bg-primary/10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 rounded-md text-slate-300 text-lg drop-shadow-1xl-black overflow-x-hidden overflow-y-scroll no-scrollbar'>
          <LinkToBack to={backLinkLocationRef.current}>Back</LinkToBack>
          <UserFullInfo user={user} />
        </div>
      )}
    </>
  );
};

export default UserInfoPage;
