import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Google, Github, Mail } from 'lucide-react';

const SignIn: React.FC = () => {
  const { signInWithGoogle, signInWithMicrosoft, signInWithGithub } = useAuth();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      <div className="space-y-4">
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded shadow hover:shadow-md"
        >
          <Google className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>
        <button
          onClick={signInWithMicrosoft}
          className="w-full flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded shadow hover:shadow-md"
        >
          <Mail className="w-5 h-5 mr-2" />
          Sign in with Microsoft
        </button>
        <button
          onClick={signInWithGithub}
          className="w-full flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded shadow hover:shadow-md"
        >
          <Github className="w-5 h-5 mr-2" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default SignIn;