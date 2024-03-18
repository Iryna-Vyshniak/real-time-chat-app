import { useCallback, useEffect } from 'react';

import { useSocketContext } from '../context/SocketContext';
import useConversation from '../../store/useConversation';

export const useListenEmoji = () => {
  const { socket } = useSocketContext();

  const { addEmoji } = useConversation();

  const handleEmoji = useCallback(
    (messageId, emoji) => {
      addEmoji(messageId, emoji);
    },
    [addEmoji]
  );

  useEffect(() => {
    const socketListener = ({ messageId, emoji }) => {
      handleEmoji(messageId, emoji);
    };

    socket?.on('addEmoji', socketListener);

    return () => socket?.off('addEmoji');
  }, [handleEmoji, socket]);
};
