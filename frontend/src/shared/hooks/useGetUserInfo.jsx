import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const useGetUserInfo = (id) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();

      if (data.error || data.message) {
        throw new Error(data.error || data.message);
      }

      setUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isCancel = false;

    if (!isCancel) {
      fetchData();
    }

    return () => (isCancel = true);
  }, [fetchData]);

  return { user, setUser, isLoading };
};
