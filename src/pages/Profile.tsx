import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateRandomAvatar } from '../utils/avatar';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.photoURL || '');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setAvatar(user.photoURL || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateProfile(displayName, avatar);
    }
  };

  const generateNewAvatar = () => {
    const newAvatar = generateRandomAvatar(displayName || 'User');
    setAvatar(newAvatar);
  };

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block mb-1">Display Name</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Avatar</label>
          <div className="flex items-center space-x-4">
            <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
            <button
              type="button"
              onClick={generateNewAvatar}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              Generate New Avatar
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;