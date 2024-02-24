import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../shared/context/AuthContext.jsx';

import { useForm } from '../../shared/hooks/useForm.jsx';
import { useSignup } from '../../shared/hooks/useSignup.jsx';
import { usePreviewImage } from '../../shared/hooks/usePreviewImage.jsx';

import { signupFields } from '../../shared/data/index.js';

import TextField from './TextField.jsx';
import GenderCheckbox from './GenderCheckbox.jsx';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import Avatar from './Avatar.jsx';

const UpdateForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleImageChange, imgUrl } = usePreviewImage();
  const fileRef = useRef();
  const navigate = useNavigate();

  const { authUser } = useAuthContext();
  const { isLoading } = useSignup();

  const { state, handleChange, setState, reset } = useForm(
    {
      avatar: authUser.avatar || '',
      fullName: authUser.fullName || '',
      username: authUser.username || '',
      password: '',
      confirmPassword: '',
      gender: '',
    },
    onSubmit
  );

  useEffect(() => {
    setState({
      avatar: authUser.avatar || '',
      fullName: authUser.fullName || '',
      username: authUser.username || '',
      password: '',
      confirmPassword: '',
      gender: '',
    });
  }, [authUser, setState]);

  let { avatar, fullName, username, password, confirmPassword, gender } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({ ...state, avatar: imgUrl });

    if (localStorage.getItem('formdata')) {
      localStorage.removeItem('formdata');
    }

    reset();
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='relative flex items-center justify-center mt-4 w-28 h-20'>
        <Avatar src={imgUrl || avatar} style='w-20 h-20' />
        <div className='absolute bottom-[7%] right-0 z-50 w-8 h-8 rounded-full'>
          <button
            type='button'
            disabled={isLoading}
            onClick={() => fileRef.current.click()}
            className='flex items-center justify-center rounded-full w-8 h-8 bg-primary text-slate-800 shadow-md hover:bg-green transition duration-200 ease-in-out hover:shadow-lg active:bg-green'
          >
            <Icon src='#icon-add' />
          </button>
          <input type='file' hidden ref={fileRef} onChange={handleImageChange} />
        </div>
      </div>
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
      <div className='flex justify-between mt-2'>
        <Link to='/' className='group ml-1 text-white transition-all duration-200 ease-in-out'>
          <span className='bg-left-bottom bg-gradient-to-r from-white to-primary bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-200 ease-out'>
            {' '}
            Cancel
          </span>
        </Link>
      </div>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? <span className='loading loading-spinner'></span> : 'UPDATE'}
      </Button>
    </form>
  );
};

export default UpdateForm;
