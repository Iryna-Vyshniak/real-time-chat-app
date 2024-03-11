import { useCallback, useEffect } from 'react';

import useConversation from '../../store/useConversation';

import { useSocketContext } from '../context/SocketContext';

import messageSound from '../../assets/sounds/message-sound.mp3';

export const useListenMessages = () => {
  const { socket, onlineUsers } = useSocketContext();

  const { addMessage, selectedConversation, notification, setNotification } = useConversation();

  const handleNewMessage = useCallback(
    (newMessage) => {
      const sound = new Audio(messageSound);
      const receiverIsOnline = onlineUsers.some((user) => user._id === newMessage.receiver._id);
      // Check if conversation is selected
      const conversationNotSelected =
        !selectedConversation || selectedConversation?._id !== newMessage.sender._id;

      if (!receiverIsOnline && conversationNotSelected) {
        if (!notification.includes(newMessage._id)) {
          setNotification([...notification, newMessage]);
          sound.play();
        }
      } else {
        newMessage.shouldShake = true;
        sound.play();
        addMessage(newMessage);
      }
    },
    [onlineUsers, selectedConversation, notification, setNotification, addMessage]
  );

  useEffect(() => {
    const socketListener = (newMessage) => {
      handleNewMessage(newMessage);
    };

    socket?.on('newMessage', socketListener);

    return () => {
      socket?.off('newMessage', socketListener);
    };
  }, [handleNewMessage, socket]);
};
