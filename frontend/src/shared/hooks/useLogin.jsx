import { useState } from 'react';
import toast from 'react-hot-toast';

import { useAuthContext } from '../context/AuthContext';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({ username, password }) => {
    //   check validation
    const success = handleInputErrors({ username, password });
    if (!success) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
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

  return { isLoading, login };
};

function handleInputErrors({ username, password }) {
  if (!username || !password) {
    toast.error('Please fill in all fields');
    return false;
  }

  return true;
}
