import { Link } from 'react-router-dom';

import useUpdateProfile from '../../shared/hooks/useUpdateProfile';

import Title from '../../components/ui/Title';
import UpdateForm from '../../components/ui/UpdateForm';
import Icon from '../../components/ui/Icon';

const UpdateProfilePage = () => {
  const { update, isLoading } = useUpdateProfile();

  const onSubmit = async (state) => {
    if (isLoading) return;
    await update(state);
  };

  return (
    <div className='flex flex-col item-center justify-center mx-auto w-96 max-w-full'>
      <Link
        to='/'
        className='group flex items-center ml-1 text-white transition-all duration-200 ease-in-out'
      >
        {' '}
        <Icon src='#icon-chevrons-left' style='w-5 h-5' />
        <span className='bg-left-bottom bg-gradient-to-r from-white to-primary bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-200 ease-out'>
          {' '}
          Back
        </span>
      </Link>
      <div className='p-6 w-full rounded-lg shadow-md bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <Title text='Update Profile' span='ChatApp' />

        <UpdateForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default UpdateProfilePage;
