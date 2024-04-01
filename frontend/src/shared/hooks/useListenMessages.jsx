import { useCallback, useEffect } from 'react';

import useConversation from '../../store/useConversation';

import { useAuthContext } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';

import messageSound from '../../assets/sounds/message-sound.mp3';
import notifySound from '../../assets/sounds/notify-sound.mp3';

export const useListenMessages = () => {
  const { socket, onlineUsers } = useSocketContext();

  const { authUser } = useAuthContext();

  const {
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

  // add message
  const handleNewMessage = useCallback(
    (newMessage) => {
      const sound = new Audio(messageSound);
      const notify = new Audio(notifySound);
      // Check if receiver online or not
      const receiverIsOnline = onlineUsers.some((user) => user === newMessage.receiver._id);
      // Check if the current user is a member of the group if group exists
      const isMemberOfGroup = selectedConversation?.data?.participantsData?.some(
        ({ _id }) => _id === authUser._id
      );

      // Check if conversation is selected
      const conversationNotSelected =
        !selectedConversation || selectedConversation?.data?._id !== newMessage.sender._id;

      // checking whether the recipient is different from the sender before adding a notification - help you avoid accidentally adding notifications for your own messages.
      const isDifferentRecipient = newMessage.receiver._id !== newMessage.sender._id;
      const hasNotification = notification.some((msg) => msg._id === newMessage._id);

      if (!selectedConversation || selectedConversation?.type === 'private') {
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
      } else if (selectedConversation?.type === 'group') {
        if (isMemberOfGroup && newMessage.sender._id !== authUser._id) {
          newMessage.shouldShake = true;
          sound.play();
          addMessage(newMessage);
        }
      }
    },
    [addMessage, authUser._id, notification, onlineUsers, selectedConversation, setNotification]
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
