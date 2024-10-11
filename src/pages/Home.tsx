import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Search } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  author: string;
  createdAt: Date;
  language: string;
}

const Home: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      const topicsRef = collection(db, 'topics');
      const q = query(topicsRef, orderBy('createdAt', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      const fetchedTopics = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Topic));
      setTopics(fetchedTopics);
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedLanguage === '' || topic.language === selectedLanguage)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Recent Topics</h1>
      <div className="flex space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Languages</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          {/* Add more language options as needed */}
        </select>
      </div>
      <div className="space-y-4">
        {filteredTopics.map((topic) => (
          <Link
            key={topic.id}
            to={`/topic/${topic.id}`}
            className="block p-4 bg-white rounded shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{topic.title}</h2>
            <p className="text-sm text-gray-500">
              Posted by {topic.author} on {topic.createdAt.toLocaleString()}
            </p>
            <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-white bg-indigo-500 rounded">
              {topic.language}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;