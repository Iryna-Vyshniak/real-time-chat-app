import { useCallback, useEffect } from 'react';

import useConversation from '../../store/useConversation';

import { useAuthContext } from '../context/AuthContext';

import messageSound from '../../assets/sounds/message-sound.mp3';
import notifySound from '../../assets/sounds/notify-sound.mp3';

export const useListenMessages = () => {
  const { authUser } = useAuthContext();

  const {
    socket,
    // onlineUsers,
    addMessage,
    selectedConversation,
    notification,
    setNotification,
    deleteNotification,
    deleteMessage,
    setSelectedMessage,
    messages,
    setMessages,
  } = useConversation();

  // --------------------------------------------------------
  const handleNewMessage = useCallback(
    (newMessage) => {
      const sound = new Audio(messageSound);
      const notify = new Audio(notifySound);

      // Check if there was already a notification for this message
      const hasNotification = notification?.some((msg) => msg.newMessage._id === newMessage._id);

      // Check if the user is a member of the group to which the message was sent
      let isMemberOfGroup = false;
      if (newMessage.receiver.participants) {
        isMemberOfGroup = newMessage.receiver.participants.includes(authUser._id);
      }

      // Check if the selected conversation is private and matches the conversation of the new message
      const isSamePrivateConversationSelected =
        selectedConversation?.data?._id === newMessage.sender._id &&
        newMessage.receiver.fullName !== undefined;

      // Check if the selected conversation is group and matches the conversation of the new message
      const isSameGroupConversationSelected =
        selectedConversation?.data?._id === newMessage.conversationId &&
        newMessage.receiver.chatName !== undefined;

      if (isMemberOfGroup && isSameGroupConversationSelected) {
        newMessage.shouldShake = true;
        sound.play();
        addMessage(newMessage);
      } else if (isSamePrivateConversationSelected) {
        newMessage.shouldShake = true;
        sound.play();
        addMessage(newMessage);
      } else {
        if (!hasNotification) {
          const notificationType = isMemberOfGroup ? 'group' : 'private';
          setNotification([...notification, { newMessage, type: notificationType }]);
          notify.play();
        }
      }
    },
    [addMessage, authUser._id, notification, selectedConversation, setNotification]
  );

  // delete message
  const handleDeleteMessage = useCallback(
    (id) => {
      const senderId = messages
        .filter((message) => message._id === id)
        .map((message) => message.sender._id)
        .join(' ');

      // Check if conversation is selected
      const conversationNotSelected =
        !selectedConversation || selectedConversation?.data?._id !== senderId;

      if (conversationNotSelected) {
        const findNotification = notification?.find(({ newMessage }) => newMessage._id === id);
        if (findNotification) {
          deleteNotification(id);
          setNotification(notification?.filter(({ newMessage }) => newMessage._id !== id));
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

  // edit message
  const handleEditMessageSender = useCallback(
    (messageId, text) => {
      setSelectedMessage(messageId, text);
      setMessages(
        messages.map((message) => (message._id === messageId ? { ...message, text } : message))
      );
    },
    [messages, setMessages, setSelectedMessage]
  );
  const handleEditMessageReceiver = useCallback(
    (messageId, text) => {
      setMessages(
        messages.map((message) => (message._id === messageId ? { ...message, text } : message))
      );
    },
    [messages, setMessages]
  );

  useEffect(() => {
    const addMessageListener = (newMessage) => {
      handleNewMessage(newMessage);
    };

    const editMsgListenerSender = ({ messageId, text }) => {
      handleEditMessageSender(messageId, text);
    };
    const editMsgListenerReceiver = ({ messageId, text }) => {
      handleEditMessageReceiver(messageId, text);
    };

    const deleteMessageListener = ({ id }) => {
      handleDeleteMessage(id);
    };

    socket?.on('newMessage', addMessageListener);
    socket?.on('editMessageSender', editMsgListenerSender);
    socket?.on('editMessageReceiver', editMsgListenerReceiver);
    socket?.on('deleteMessage', deleteMessageListener);

    return () => {
      socket?.off('newMessage');
      socket?.off('editMessageSender');
      socket?.off('editMessageReceiver');
      socket?.off('deleteMessage');
    };
  }, [
    handleDeleteMessage,
    handleEditMessageReceiver,
    handleEditMessageSender,
    handleNewMessage,
    selectedConversation?.data?._id,
    selectedConversation?.type,
    socket,
  ]);
};
