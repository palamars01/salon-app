'use client';
import { config } from '@/config/config';
import { SocketEvents } from '@repo/shared/enums';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  Dispatch,
} from 'react';
import { io, Socket } from 'socket.io-client';

const WebSocketContext = createContext<{
  socket: Socket | null;
  notificationsCount: number | null;
  setNotificationsCount: Dispatch<React.SetStateAction<number | null>>;
} | null>(null);

const WebSocketProvider = ({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string | undefined;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [notificationsCount, setNotificationsCount] = useState<number | null>(
    null,
  );

  const cleanup = () => {
    if (socket) {
      socket.removeAllListeners(SocketEvents.ADD_USER);
      socket.removeAllListeners(SocketEvents.APPOINTMENT_CREATED);
      socket.removeAllListeners(SocketEvents.INITIAL_NOTIFICATIONS_COUNT);
      socket.removeAllListeners('connect');

      setSocket(null);
      socket.disconnect();
    }
    setNotificationsCount(null);
  };

  useEffect(() => {
    if (userId && !socket) {
      const newSocket = io(config.BACKEND_URL, {
        reconnection: true,
        transports: ['polling', 'websocket'],
        extraHeaders: {
          'Access-Control-Allow-Origin': '*',
        },
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        if (userId) {
          newSocket.emit(SocketEvents.ADD_USER, { userId });
        }
      });

      newSocket.on(
        SocketEvents.INITIAL_NOTIFICATIONS_COUNT,
        (data: { initialNotificationsCount: number }) => {
          if (data?.initialNotificationsCount) {
            setNotificationsCount(data.initialNotificationsCount);
          }
        },
      );

      newSocket.on(SocketEvents.APPOINTMENT_CREATED, () => {
        setNotificationsCount((prev) => (prev ? prev + 1 : 1));
      });

      newSocket.on(SocketEvents.NOTIFICATION_READ, () => {
        setNotificationsCount((prev) => (prev ? prev - 1 : 0));
      });
    }
    if (!userId && socket) {
      cleanup();
    }

    return () => {
      cleanup();
    };
  }, [socket, userId]);

  return (
    <WebSocketContext.Provider
      value={{ socket, notificationsCount, setNotificationsCount }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocket = () => useContext(WebSocketContext);

export { WebSocketProvider, useWebSocket };
