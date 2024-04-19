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
  const { socket, setSocket, onlineUsers, setOnlineUsers } = useConversation();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io('https://chat-mern-ujj2.onrender.com', {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(newSocket);

      // socket.on() is used to listen to the events; can be used both on client and server side
      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
  );
};
