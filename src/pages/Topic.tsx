import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ThumbsUp, ThumbsDown, MessageCircle, Smile } from 'lucide-react';

interface TopicData {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  language: string;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

const Topic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopic = async () => {
      if (id) {
        const topicDoc = await getDoc(doc(db, 'topics', id));
        if (topicDoc.exists()) {
          setTopic({ id: topicDoc.id, ...topicDoc.data() } as TopicData);
        }
      }
    };

    fetchTopic();

    if (id) {
      const answersRef = collection(db, 'topics', id, 'answers');
      const q = query(answersRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedAnswers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Answer));
        setAnswers(fetchedAnswers);
      });

      return () => unsubscribe();
    }
  }, [id]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && id && newAnswer.trim()) {
      await addDoc(collection(db, 'topics', id, 'answers'), {
        content: newAnswer,
        author: user.displayName,
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      });
      setNewAnswer('');
    }
  };

  const handleVote = async (answerId: string, voteType: 'upvote' | 'downvote') => {
    if (user && id) {
      const answerRef = doc(db, 'topics', id, 'answers', answerId);
      // Implement the voting logic here
    }
  };

  if (!topic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{topic.title}</h1>
      <div className="bg-white p-6 rounded shadow">
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {topic.content}
        </ReactMarkdown>
        <p className="mt-4 text-sm text-gray-500">
          Posted by {topic.author} on {topic.createdAt.toLocaleString()}
        </p>
        <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-white bg-indigo-500 rounded">
          {topic.language}
        </span>
      </div>

      <h2 className="text-2xl font-bold mt-8">Answers</h2>
      {answers.map((answer) => (
        <div key={answer.id} className="bg-white p-6 rounded shadow">
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {answer.content}
          </ReactMarkdown>
          <p className="mt-4 text-sm text-gray-500">
            Answered by {answer.author} on {answer.createdAt.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={() => handleVote(answer.id, 'upvote')}
              className="flex items-center space-x-1 text-green-500"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{answer.upvotes}</span>
            </button>
            <button
              onClick={() => handleVote(answer.id, 'downvote')}
              className="flex items-center space-x-1 text-red-500"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{answer.downvotes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500">
              <Smile className="w-4 h-4" />
              <span>React</span>
            </button>
          </div>
        </div>
      ))}

      {user ? (
        <form onSubmit={handleSubmitAnswer} className="mt-8">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer..."
            className="w-full p-4 border rounded"
            rows={6}
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            Post Answer
          </button>
        </form>
      ) : (
        <p className="mt-8 text-center">Please sign in to post an answer.</p>
      )}
    </div>
  );
};

export default Topic;