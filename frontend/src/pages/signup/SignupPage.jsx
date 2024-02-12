import Title from '../../components/ui/Title';
import SignupForm from '../../components/ui/SignupForm';
import { useSignup } from '../../shared/hooks/useSignup';

const SignupPage = () => {
  const { signup } = useSignup();

  const onSubmit = async (state) => {
    await signup(state);
  };

  return (
    <div className='flex flex-col item-center justify-center mx-auto w-96 max-w-full'>
      <div className='p-6 w-full rounded-lg shadow-md bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <Title text='Sign Up' span='ChatApp' />

        <SignupForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default SignupPage;
