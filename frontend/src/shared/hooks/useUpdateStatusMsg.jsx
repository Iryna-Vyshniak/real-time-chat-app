import { useState } from 'react';
import toast from 'react-hot-toast';
import useConversation from '../../store/useConversation';

const useUpdateStatusMsg = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { messages, setMessages } = useConversation();

  const updateStatusMessage = async (id) => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/users/messages`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setMessages(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, updateStatusMessage };
};

export default useUpdateStatusMsg;
