import { useState } from 'react';
import toast from 'react-hot-toast';

import { useAuthContext } from '../context/AuthContext';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
    //   check success or not
    const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
    if (!success) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
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

  return { signup, isLoading };
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
