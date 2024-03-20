import { useCallback, useEffect } from 'react';

import useConversation from '../../store/useConversation';

import { useSocketContext } from '../context/SocketContext';

import messageSound from '../../assets/sounds/message-sound.mp3';
import notifySound from '../../assets/sounds/notify-sound.mp3';

export const useListenMessages = () => {
  const { socket, onlineUsers } = useSocketContext();

  const {
    addMessage,
    selectedConversation,
    notification,
    setNotification,
    deleteNotification,
    deleteMessage,
    messages,
  } = useConversation();

  const handleNewMessage = useCallback(
    (newMessage) => {
      const sound = new Audio(messageSound);
      const notify = new Audio(notifySound);
      // Check if receiver online or not
      const receiverIsOnline = onlineUsers.some((user) => user === newMessage.receiver._id);
      // Check if conversation is selected
      const conversationNotSelected =
        !selectedConversation || selectedConversation?._id !== newMessage.sender._id;

      // checking whether the recipient is different from the sender before adding a notification - help you avoid accidentally adding notifications for your own messages.
      const isDifferentRecipient = newMessage.receiver._id !== newMessage.sender._id;
      const hasNotification = notification.some((msg) => msg._id === newMessage._id);

      if (receiverIsOnline && isDifferentRecipient && conversationNotSelected) {
        if (!hasNotification) {
          setNotification([...notification, newMessage]);
          notify.play();
        }
      } else {
        newMessage.shouldShake = true;
        sound.play();
        addMessage(newMessage);
      }
    },
    [addMessage, notification, onlineUsers, selectedConversation, setNotification]
  );

  const handleDeleteMessage = useCallback(
    (id) => {
      const senderId = messages
        .filter((message) => message._id === id)
        .map((message) => message.sender._id)
        .join(' ');

      // Check if conversation is selected
      const conversationNotSelected =
        !selectedConversation || selectedConversation?._id !== senderId;

      if (conversationNotSelected) {
        const findNotification = notification.find((n) => n._id === id);

        if (findNotification) {
          deleteNotification(id);
          setNotification(notification.filter((n) => n._id !== id));
        }
      }
      deleteMessage(id);
    },
    [
      deleteMessage,
      deleteNotification,
      messages,
      notification,
      selectedConversation,
      setNotification,
    ]
  );

  useEffect(() => {
    const addMessageListener = (newMessage) => {
      handleNewMessage(newMessage);
    };

    const deleteMessageListener = ({ id }) => {
      handleDeleteMessage(id);
    };

    socket?.on('newMessage', addMessageListener);
    socket?.on('deleteMessage', deleteMessageListener);

    return () => {
      socket?.off('newMessage');
      socket?.off('deleteMessage');
    };
  }, [handleDeleteMessage, handleNewMessage, socket]);
};
