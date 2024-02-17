import { useState } from 'react';
import { Link } from 'react-router-dom';

import { loginFields } from '../../shared/data/index.js';
import { useForm } from '../../shared/hooks/useForm';
import { useLogin } from '../../shared/hooks/useLogin.jsx';

import TextField from './TextField';
import Button from './Button';
import Icon from './Icon';

const LoginForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { state, handleChange, handleSubmit } = useForm({ username: '', password: '' }, onSubmit);
  const { isLoading } = useLogin();

  let { username, password } = state;

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id='login-username'
        type='text'
        name='username'
        value={username || ''}
        onChange={handleChange}
        {...loginFields.username}
      />
      <div className='relative'>
        {' '}
        <TextField
          id='login-password'
          type={showPassword ? 'text' : 'password'}
          name='password'
          value={password || ''}
          onChange={handleChange}
          {...loginFields.password}
        />
        <div
          className='absolute z-100 right-3 top-[60%] text-xl cursor-pointer'
          onClick={() => setShowPassword((prevState) => !prevState)}
        >
          {' '}
          <Icon logic={showPassword ? '#icon-eye' : '#icon-eye-hidden'} />
        </div>
      </div>
      <div className='flex justify-between mt-6 whitespace-nowrap text-sm font-semibold tracking-wider sm:text-lg text-primary drop-shadow-5xl-black'>
        <p className='mb-6'>Don`t have an account?</p>
        <Link
          to='/signup'
          className='group ml-1 text-white transition-all duration-200 ease-in-out'
        >
          <span className='bg-left-bottom bg-gradient-to-r from-white to-primary bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-200 ease-out'>
            {' '}
            Register
          </span>
        </Link>
      </div>
      <Button type='submit'>
        {isLoading ? <span className='loading loading-spinner'></span> : 'LOGIN'}
      </Button>
    </form>
  );
};

export default LoginForm;
