import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Topic from './pages/Topic';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import CreateTopic from './pages/CreateTopic';
import Chat from './components/Chat';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/topic/:id" element={<Topic />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/create-topic" element={<CreateTopic />} />
              </Routes>
            </main>
            <Chat />
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;