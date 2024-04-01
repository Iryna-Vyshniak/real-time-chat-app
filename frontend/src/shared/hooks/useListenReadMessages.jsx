import { useCallback, useEffect } from 'react';

import useConversation from '../../store/useConversation';
import { useAuthContext } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';

export const useListenReadMessages = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();

  const { messages, selectedConversation, updateMessagesStatus } = useConversation();

  const conversationId = useConversation((state) => state.conversationId);

  const handleMessagesRead = useCallback(
    ({ conversationId }) => {
      updateMessagesStatus(conversationId);
    },
    [updateMessagesStatus]
  );

  useEffect(() => {
    if (
      messages?.length > 0 &&
      messages[messages.length - 1]?.sender._id !== authUser._id &&
      selectedConversation &&
      selectedConversation?.data?._id &&
      conversationId
    ) {
      socket.emit('markMessagesAsRead', {
        conversationId: conversationId,
        userId: selectedConversation?.data?._id,
      });
    }

    const messagesReadListener = ({ conversationId }) => {
      handleMessagesRead({ conversationId });
    };

    socket?.on('messagesRead', (conversationId) => messagesReadListener(conversationId));

    return () => {
      socket?.off('messagesRead', messagesReadListener);
    };
  }, [
    authUser._id,
    conversationId,
    selectedConversation?.data?._id,
    handleMessagesRead,
    messages,
    selectedConversation,
    socket,
  ]);
};
