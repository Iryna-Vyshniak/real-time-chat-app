import { useEffect } from 'react';

import useConversation from '../../store/useConversation';

import { useSocketContext } from '../context/SocketContext';
import { useAuthContext } from '../context/AuthContext';
import { useGetMessages } from './useGetMessages';

import messageSound from '../../assets/sounds/message-sound.mp3';

export const useListenMessages = () => {
  const { socket, onlineUsers } = useSocketContext();
  const { authUser } = useAuthContext();
  const { conversationId } = useGetMessages();

  const { messages, setMessages, selectedConversation, notification, setNotification } =
    useConversation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sound = new Audio(messageSound);

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      // Check if the user is online
      const senderIsOnline = onlineUsers.some((user) => user._id === newMessage.receiver._id);

      // Check if conversation is selected
      const conversationNotSelected =
        !selectedConversation || selectedConversation._id !== newMessage.sender._id;

      if (!senderIsOnline && conversationNotSelected) {
        if (!notification.includes(newMessage._id)) {
          setNotification([...notification, newMessage]);
          sound.play();
        }
      } else {
        newMessage.shouldShake = true;
        sound.play();
        setMessages([...messages, newMessage]);
      }
    });

    return () => socket?.off('newMessage');
  }, [
    messages,
    notification,
    onlineUsers,
    selectedConversation,
    setMessages,
    setNotification,
    socket,
    sound,
  ]);

  useEffect(() => {
    // condition checks if the last message received was from a user other than the current user
    const lastMessageIsFromOtherUser =
      messages.length > 0 && messages[messages.length - 1]?.sender._id !== authUser._id;

    if (
      lastMessageIsFromOtherUser &&
      selectedConversation &&
      selectedConversation._id &&
      conversationId
    ) {
      socket.emit('markMessagesAsRead', {
        conversationId: conversationId,
        userId: selectedConversation._id,
      });
    }

    const handleMessagesRead = ({ conversationId }) => {
      // Updated messages
      let updatedMessages = [];

      // Check if messages is an array before using
      if (Array.isArray(messages)) {
        // Update the status of each message
        updatedMessages = messages.map((message) => {
          // We check whether the message belongs to the current conversation
          const isCurrentConversation = message.conversationId === conversationId;
          // Check if the current user is not the sender of the message
          const isInCommonChat =
            selectedConversation && selectedConversation._id !== message.sender._id;

          // Update the message status if they meet the conditions
          if (isInCommonChat && isCurrentConversation && !message.read) {
            return { ...message, read: true };
          }
          return message;
        });
      } else {
        console.error('Error: messages is not an array');
        // If messages is not an array, simply return the previous state
        updatedMessages = messages;
      }

      // Update the state with updated messages
      setMessages(updatedMessages);
    };

    socket?.on('messagesRead', handleMessagesRead);

    return () => socket?.off('messagesRead');
  }, [
    authUser._id,
    conversationId,
    messages,
    selectedConversation,
    selectedConversation?._id,
    setMessages,
    socket,
  ]);
};
