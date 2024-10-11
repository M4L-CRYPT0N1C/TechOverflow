import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Users } from 'lucide-react';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [onlineUsers, setOnlineUsers] = React.useState(0);

  React.useEffect(() => {
    // TODO: Implement real-time online users counter
    const fakeOnlineUsers = Math.floor(Math.random() * 1000) + 500;
    setOnlineUsers(fakeOnlineUsers);
  }, []);

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">FutureForum</Link>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <span>{onlineUsers} online</span>
          </div>
          {user ? (
            <>
              <Link to="/create-topic" className="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded">
                New Topic
              </Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <button onClick={signOut} className="hover:underline">Sign Out</button>
            </>
          ) : (
            <Link to="/signin" className="hover:underline">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;