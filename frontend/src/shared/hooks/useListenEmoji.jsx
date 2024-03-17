import { useCallback, useEffect } from 'react';

import { useSocketContext } from '../context/SocketContext';
import useConversation from '../../store/useConversation';

const useListenEmoji = (messageId) => {
  const { socket } = useSocketContext();

  const { addEmoji } = useConversation();

  const handleEmoji = useCallback(
    (emoji) => {
      addEmoji(messageId, emoji);
    },
    [addEmoji, messageId]
  );

  useEffect(() => {
    const socketListener = (emoji) => {
      handleEmoji(emoji);
    };

    socket?.on('addEmoji', (emoji) => socketListener(emoji));

    return () => socket?.off('addEmoji');
  }, [handleEmoji, socket]);
};

export default useListenEmoji;
