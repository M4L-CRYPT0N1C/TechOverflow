import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { User } from 'firebase/auth';

interface Message {
  user: {
    uid: string;
    displayName: string;
  };
  text: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, user: User) => void;
  onlineUsers: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const newSocket = io('http://localhost:3001'); // Replace with your actual server URL
    setSocket(newSocket);

    newSocket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('onlineUsers', (count: number) => {
      setOnlineUsers(count);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (text: string, user: User) => {
    if (socket) {
      const message = {
        user: {
          uid: user.uid,
          displayName: user.displayName,
        },
        text,
      };
      socket.emit('message', message);
    }
  };

  const value = {
    messages,
    sendMessage,
    onlineUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};