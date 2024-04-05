import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

import { useAuthContext } from './AuthContext';

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io('https://chat-mern-ujj2.onrender.com', {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socket);

      // socket.on() is used to listen to the events; can be used both on client and server side
      socket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
  );
};
