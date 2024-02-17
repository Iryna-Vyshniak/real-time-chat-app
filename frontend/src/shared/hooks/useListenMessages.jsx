import { useEffect } from 'react';

import useConversation from '../../store/useConversation';
import { useSocketContext } from '../context/SocketContext';

import messageSound from '../../assets/sounds/message-sound.mp3';

export const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(messageSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });

    return () => socket?.off('newMessage');
  }, [messages, setMessages, socket]);
};
