import { useState } from 'react';
import toast from 'react-hot-toast';

import { useAuthContext } from '../context/AuthContext';

const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();

  const update = async ({ fullName, username, password, confirmPassword, gender, avatar }) => {
    const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });

    if (!success) return;

    setIsLoading(true);

    try {
      if (!authUser?._id) return;

      const res = await fetch(`/api/users/update/${authUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
          avatar,
        }),
      });

      const data = await res.json();

      if (data.error || data.message) {
        throw new Error(data.error || data.message);
      }

      // localStorage
      localStorage.setItem('chat-user', JSON.stringify(data));
      // context
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, update };
};

// validation - checks if any of these properties are missing or if the password and confirm password don't match, or passwords lehgth less than min characters
function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error('Please fill in all fields');
    return false;
  }

  if (password !== confirmPassword) {
    toast.error('Passwords don`t match');
    return false;
  }

  if (password.length < 7) {
    toast.error('Password must be at least 7 characters');
    return false;
  }

  return true;
}

export default useUpdateProfile;
