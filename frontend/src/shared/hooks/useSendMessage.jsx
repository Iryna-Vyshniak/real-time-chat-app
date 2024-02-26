import { useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  if (!selectedConversation?._id) return;

  const sendMessages = async ({ message, img }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, img }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, sendMessages };
};
