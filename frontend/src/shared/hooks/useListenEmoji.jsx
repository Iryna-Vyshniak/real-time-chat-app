import { useEffect } from 'react';

import useConversation from '../../store/useConversation';

export const useListenEmoji = () => {
  const { socket, addEmoji, deleteEmoji } = useConversation();

  useEffect(() => {
    const addEmojiListener = ({ messageId, emoji }) => {
      addEmoji({ messageId, emoji });
    };

    const removeEmojiListener = ({ messageId, emoji }) => {
      deleteEmoji({ messageId, emoji });
    };

    socket?.on('addEmoji', addEmojiListener);
    socket?.on('removeEmoji', removeEmojiListener);

    return () => {
      socket?.off('addEmoji', addEmojiListener);
      socket?.off('removeEmoji', removeEmojiListener);
    };
  }, [addEmoji, deleteEmoji, socket]);
};
