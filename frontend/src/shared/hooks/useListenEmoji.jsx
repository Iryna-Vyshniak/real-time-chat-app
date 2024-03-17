import { useCallback, useEffect } from 'react';

import { useSocketContext } from '../context/SocketContext';
import useConversation from '../../store/useConversation';

import messageSound from '../../assets/sounds/message-sound.mp3';

const useListenEmoji = (messageId) => {
  const { socket } = useSocketContext();

  const { addEmoji } = useConversation();

  const handleEmoji = useCallback(
    (emoji) => {
      const sound = new Audio(messageSound);
      sound.play();
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
