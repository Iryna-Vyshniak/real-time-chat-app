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
      {!isLoading && user && <UserFullInfo user={user} />}
    </>
  );
};

export default UserInfoPage;
