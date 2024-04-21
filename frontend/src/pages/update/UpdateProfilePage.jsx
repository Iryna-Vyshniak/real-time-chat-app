import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

import useUpdateProfile from '../../shared/hooks/useUpdateProfile';

import Title from '../../components/ui/Title';
import UpdateForm from '../../components/ui/UpdateForm';
import { LinkToBack } from '../../components/ui/LinkToBack';

const UpdateProfilePage = () => {
  const location = useLocation();
  const backLinkLocationRef = useRef(location.state?.from ?? '/');
  const { update, isLoading } = useUpdateProfile();

  const onSubmit = async (state) => {
    if (isLoading) return;
    await update(state);
  };

  return (
    <div className='flex flex-col item-center justify-center mx-auto w-96 max-w-full'>
      <LinkToBack to={backLinkLocationRef.current}>Back</LinkToBack>
      <div className='p-6 w-full rounded-lg shadow-md bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <Title text='Update Profile' span='ChatApp' />

        <UpdateForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default UpdateProfilePage;
