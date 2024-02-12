import { useState } from 'react';
import { Link } from 'react-router-dom';

import { signupFields } from '../../shared/data/index.js';
import { useForm } from '../../shared/hooks/useForm';

import TextField from './TextField';
import GenderCheckbox from './GenderCheckbox';
import Button from './Button';
import Icon from './Icon';

const SignupForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { state, handleChange, handleSubmit } = useForm(
    {
      fullName: '',
      username: '',
      password: '',
      confirmPassword: '',
      gender: '',
    },
    onSubmit
  );

  let { fullName, username, password, confirmPassword, gender } = state;

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id='fullName'
        type='text'
        name='fullName'
        value={fullName || ''}
        onChange={handleChange}
        variant={`after:content-['*'] after:ml-1 after:text-red-500`}
        {...signupFields.fullName}
      />
      <TextField
        id='username'
        type='text'
        name='username'
        value={username || ''}
        onChange={handleChange}
        variant={`after:content-['*'] after:ml-1 after:text-red-500`}
        {...signupFields.username}
      />
      <div className='relative'>
        <TextField
          type={showPassword ? 'text' : 'password'}
          id='password'
          name='password'
          value={password || ''}
          onChange={handleChange}
          variant={`after:content-['*'] after:ml-1 after:text-red-500`}
          {...signupFields.password}
        />
        <div
          className='absolute z-100 right-3 top-[60%] text-xl cursor-pointer'
          onClick={() => setShowPassword((prevState) => !prevState)}
        >
          <Icon logic={showPassword ? '#icon-eye' : '#icon-eye-hidden'} />
        </div>
      </div>
      <div className='relative'>
        <TextField
          type={showConfirmPassword ? 'text' : 'password'}
          id='confirmPassword'
          name='confirmPassword'
          value={confirmPassword || ''}
          onChange={handleChange}
          variant={`after:content-['*'] after:ml-1 after:text-red-500`}
          {...signupFields.confirmPassword}
        />
        <div
          className='absolute z-100 right-3 top-[60%] text-xl cursor-pointer'
          onClick={() => setShowConfirmPassword((prevState) => !prevState)}
        >
          {' '}
          <Icon logic={showConfirmPassword ? '#icon-eye' : '#icon-eye-hidden'} />
        </div>
      </div>
      <GenderCheckbox selectedGender={gender} handleChange={handleChange} />
      <div className='flex justify-between mt-2 whitespace-nowrap text-sm sm:text-lg font-semibold tracking-wider text-blue-500 drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
        <p className='mb-6'>Already have an account?</p>
        <Link to='/login' className='group ml-1 text-white transition-all duration-200 ease-in-out'>
          <span className='bg-left-bottom bg-gradient-to-r from-white to-blue-500 bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-200 ease-out'>
            {' '}
            Sign in
          </span>
        </Link>
      </div>
      <Button type='submit'>SIGNUP</Button>
    </form>
  );
};

export default SignupForm;
