import { useParams } from 'react-router-dom';

import UserInfo from '../../components/shared/sidebar/UserInfo';

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
      {!isLoading && user && <UserInfo user={user} />}
    </>
  );
};

export default UserInfoPage;
