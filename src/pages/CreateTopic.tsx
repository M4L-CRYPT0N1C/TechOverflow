import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Filter from 'bad-words';

const filter = new Filter();

const CreateTopic: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be signed in to create a topic.');
      return;
    }

    if (filter.isProfane(title) || filter.isProfane(content)) {
      alert('Your post contains inappropriate content. Please revise and try again.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'topics'), {
        title,
        content,
        language,
        author: user.displayName,
        createdAt: serverTimestamp(),
      });
      navigate(`/topic/${docRef.id}`);
    } catch (error) {
      console.error('Error creating topic:', error);
      alert('An error occurred while creating the topic. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Topic</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-1">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="language" className="block mb-1">Programming Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a language</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            {/* Add more language options as needed */}
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          Create Topic
        </button>
      </form>
    </div>
  );
};

export default CreateTopic;