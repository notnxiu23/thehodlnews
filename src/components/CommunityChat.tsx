import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, User, Clock, LogIn, ArrowUp } from 'lucide-react';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, startAfter, getDocs, where, Timestamp } from 'firebase/firestore';
import { firestore } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Timestamp;
}

const MESSAGES_PER_PAGE = 10; // Reduced batch size
const CACHE_KEY = 'chat_messages_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export function CommunityChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load from cache initially
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    }
    return [];
  });
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<any>(null);
  const lastMessageTimestampRef = useRef<number>(Date.now());

  // Cache messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: messages,
        timestamp: Date.now()
      }));
    }
  }, [messages]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        const messagesQuery = query(
          collection(firestore, 'messages'),
          where('timestamp', '>', Timestamp.fromDate(oneHourAgo)),
          orderBy('timestamp', 'desc'),
          limit(MESSAGES_PER_PAGE)
        );

        const snapshot = await getDocs(messagesQuery);
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];

        lastMessageRef.current = snapshot.docs[snapshot.docs.length - 1];
        setMessages(prev => {
          const combined = [...prev, ...newMessages];
          const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
          return unique.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        });
        setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setInitialLoad(false);
      }
    };

    loadInitialMessages();

    // Listen for new messages
    const realtimeQuery = query(
      collection(firestore, 'messages'),
      where('timestamp', '>', Timestamp.fromMillis(lastMessageTimestampRef.current)),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(realtimeQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newMessage = { id: change.doc.id, ...change.doc.data() } as Message;
          lastMessageTimestampRef.current = newMessage.timestamp.toMillis();
          setMessages(prev => [...prev, newMessage]);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const loadMoreMessages = useCallback(async () => {
    if (loadingMore || !hasMore || !lastMessageRef.current) return;

    setLoadingMore(true);
    try {
      const messagesQuery = query(
        collection(firestore, 'messages'),
        orderBy('timestamp', 'desc'),
        startAfter(lastMessageRef.current),
        limit(MESSAGES_PER_PAGE)
      );

      const snapshot = await getDocs(messagesQuery);
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      lastMessageRef.current = snapshot.docs[snapshot.docs.length - 1];
      setMessages(prev => {
        const combined = [...newMessages.reverse(), ...prev];
        const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
        return unique.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      });
      setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast.error('Failed to load more messages');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to send messages');
      return;
    }

    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const messageData = {
        text: newMessage.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
        timestamp: serverTimestamp()
      };

      await addDoc(collection(firestore, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday ? format(date, 'HH:mm') : format(date, 'MMM d, HH:mm');
  };

  if (initialLoad) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8 flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 bg-indigo-600 dark:bg-indigo-900">
        <h2 className="text-xl font-bold text-white">Community Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {hasMore && (
          <button
            onClick={loadMoreMessages}
            disabled={loadingMore}
            className="w-full py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center justify-center gap-2"
          >
            {loadingMore ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <>
                <ArrowUp className="w-4 h-4" />
                Load more messages
              </>
            )}
          </button>
        )}

        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages yet. Be the first to start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.userId === currentUser?.uid ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div
                className={`flex-1 ${
                  message.userId === currentUser?.uid ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {message.userName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] inline-block ${
                    message.userId === currentUser?.uid
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {!currentUser ? (
        <div className="p-4 border-t dark:border-dark-700 bg-gray-50 dark:bg-dark-700">
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
            <LogIn className="w-5 h-5" />
            <span>Please login to participate in the chat</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 border-t dark:border-dark-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}