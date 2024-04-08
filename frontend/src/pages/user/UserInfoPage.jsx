import { useParams } from 'react-router-dom';

import UserFullInfo from '../../components/features/sidebar/user.data/UserFullInfo';

import { useGetUserInfo } from '../../shared/hooks/useGetUserInfo';

const UserInfoPage = () => {
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
        <div className='p-4 w-[90%] md:w-1/3 h-auto bg-primary/10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 rounded-md text-slate-300 text-lg drop-shadow-1xl-black'>
          <UserFullInfo user={user} />
        </div>
      )}
    </>
  );
};

export default UserInfoPage;
