"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
  notifications: { message: string; timestamp: string }[];
  clearNotifications: () => void;
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<{ message: string; timestamp: string }[]>([]);

  const connectSocket = useCallback(() => {
    if (!socket) {
      const _socket = io(process.env.EXPO_PUBLIC_BASE_URL);
      _socket.on("chat:receive", (data) => {
        setMessages((prev) => [...prev, data.message]);
      });
      _socket.on("message:delivered", (data) => {
        console.log("Received message:delivered", data);
        setNotifications((prev) => [data, ...prev]);
      });
      setSocket(_socket);
    }
  }, [socket]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.off("chat:receive");
      socket.off("message:delivered");
      socket.disconnect();
      setSocket(undefined);
    }
  }, [socket]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send Message", msg);
      if (socket) {
        socket.emit("chat:send", { message: msg });
      }
    },
    [socket]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, connectSocket, disconnectSocket, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};