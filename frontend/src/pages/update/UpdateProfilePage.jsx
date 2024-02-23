import useUpdateProfile from '../../shared/hooks/useUpdateProfile';

import Title from '../../components/ui/Title';
import UpdateForm from '../../components/ui/UpdateForm';

const UpdateProfilePage = () => {
  const { update, isLoading } = useUpdateProfile();

  const onSubmit = async (state) => {
    if (isLoading) return;
    await update(state);
  };

  return (
    <div className='flex flex-col item-center justify-center mx-auto w-96 max-w-full'>
      <div className='p-6 w-full rounded-lg shadow-md bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <Title text='Update Profile' span='ChatApp' />

        <UpdateForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default UpdateProfilePage;
