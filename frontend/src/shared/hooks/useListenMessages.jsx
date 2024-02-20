import { useEffect } from 'react';

import useConversation from '../../store/useConversation';
import { useSocketContext } from '../context/SocketContext';

import messageSound from '../../assets/sounds/message-sound.mp3';

export const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation, notification, setNotification } =
    useConversation();

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      if (!selectedConversation || selectedConversation._id !== newMessage.sender._id) {
        if (!notification.includes(newMessage._id)) {
          setNotification([...notification, newMessage]);
        }
      } else {
        newMessage.shouldShake = true;
        const sound = new Audio(messageSound);
        sound.play();
        setMessages([...messages, newMessage]);
      }
    });

    return () => socket?.off('newMessage');
  }, [messages, notification, selectedConversation, setMessages, setNotification, socket]);
};
