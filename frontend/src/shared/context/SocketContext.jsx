/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';

import { useAuthContext } from './AuthContext';
import useConversation from '../../store/useConversation';

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const { socket, setSocket, setSocketStatus, position, onlineUsers, setOnlineUsers } =
    useConversation();

  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io('https://chat-mern-ujj2.onrender.com', {
        query: {
          userId: authUser._id,
          userLocation: position,
        },
      });
      setSocket(newSocket);
      setSocketStatus('connected');

      // socket.on() is used to listen to the events; can be used both on client and server side
      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // listen location
      position && authUser && newSocket.emit('updateLocation', { position, userId: authUser._id });

      return () => {
        newSocket.off('getOnlineUsers');
        newSocket.off('updateLocation');
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocketStatus('disconnected');
        setSocket(null);
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (socket && position && authUser) {
      socket.emit('updateLocation', {
        position,
        userId: authUser._id,
      });
    }
  }, [socket, position, authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
  );
};
