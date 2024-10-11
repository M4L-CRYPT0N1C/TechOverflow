import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, onlineUsers } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      sendMessage(newMessage, user);
      setNewMessage('');
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-500 transition-colors"
        >
          <MessageSquare />
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Chat ({onlineUsers} online)</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{msg.user.displayName}: </span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-2 border rounded"
            />
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;