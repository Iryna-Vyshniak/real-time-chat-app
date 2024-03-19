import { useEffect } from 'react';

import { useSocketContext } from '../context/SocketContext';
import useConversation from '../../store/useConversation';

export const useListenEmoji = () => {
  const { socket } = useSocketContext();
  const { addEmoji, deleteEmoji } = useConversation();

  useEffect(() => {
    const addEmojiListener = ({ messageId, emoji }) => {
      addEmoji(messageId, emoji);
    };

    const removeEmojiListener = ({ messageId }) => {
      deleteEmoji(messageId);
    };

    socket?.on('addEmoji', addEmojiListener);
    socket?.on('removeEmoji', removeEmojiListener);

    return () => {
      socket?.off('addEmoji', addEmojiListener);
      socket?.off('removeEmoji', removeEmojiListener);
    };
  }, [addEmoji, deleteEmoji, socket]);
};
