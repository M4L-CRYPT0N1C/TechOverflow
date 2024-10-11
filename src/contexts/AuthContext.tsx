import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, microsoftProvider, githubProvider } from '../firebase';
import { User, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { generateRandomAvatar } from '../utils/avatar';

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, photoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && !user.photoURL) {
        user.updateProfile({
          photoURL: generateRandomAvatar(user.displayName || user.email || 'User')
        });
      }
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithMicrosoft = async () => {
    await signInWithPopup(auth, microsoftProvider);
  };

  const signInWithGithub = async () => {
    await signInWithPopup(auth, githubProvider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateProfile = async (displayName: string, photoURL: string) => {
    if (user) {
      await user.updateProfile({ displayName, photoURL });
      setUser({ ...user, displayName, photoURL });
    }
  };

  const value = {
    user,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithGithub,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};