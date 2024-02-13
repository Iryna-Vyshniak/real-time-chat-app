import LoginForm from '../../components/ui/LoginForm';
import Title from '../../components/ui/Title';

import { useLogin } from '../../shared/hooks/useLogin';

const LoginPage = () => {
  const { login } = useLogin();

  const onSubmit = async (state) => {
    await login(state);
  };

  return (
    <div className='flex flex-col item-center justify-center mx-auto w-96 max-w-full'>
      <div className='p-6 w-full rounded-lg shadow-md bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <Title text='Log In' span='ChatApp' />
        <LoginForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default LoginPage;
