/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../store/useConversation';

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { messages, addMessage, selectedConversation } = useConversation();

  const sendMessages = useCallback(
    async ({ message: text, img, audio, video, quote, quotedId, emoji }) => {
      if (!selectedConversation?.data?._id) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/messages/send/${selectedConversation?.data?._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, img, audio, video, quote, quotedId, emoji }),
        });

        const data = await res.json();

        if (data.error || data.message) {
          throw new Error(data.error || data.message);
        }

        addMessage(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, selectedConversation?.data?._id, addMessage]
  );

  return { isLoading, sendMessages };
};
