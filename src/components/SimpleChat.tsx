import { useState, useEffect, useRef } from 'react';
import { Send, User, AlertCircle } from 'lucide-react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ChatModerator } from '../utils/chatModeration';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: number;
  clientId: string;
}

const WS_URL = 'wss://ws.postman-echo.com/raw';
const CLIENT_ID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const generateMessageId = (clientId: string) => {
  return `${clientId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem('chat_username');
    return saved || `User${Math.floor(Math.random() * 10000)}`;
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<ReconnectingWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedMessages = useRef(new Set<string>());
  const moderatorRef = useRef(new ChatModerator());

  useEffect(() => {
    wsRef.current = new ReconnectingWebSocket(WS_URL);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log('Connected to chat');
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from chat');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as Message;
        
        if (processedMessages.current.has(message.id)) {
          return;
        }

        processedMessages.current.add(message.id);
        setMessages(prev => [...prev, message]);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    // Cleanup old user states periodically
    const cleanupInterval = setInterval(() => {
      moderatorRef.current.cleanup();
    }, 60000); // Every minute

    return () => {
      wsRef.current?.close();
      clearInterval(cleanupInterval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_username', username);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !wsRef.current) return;

    // Validate message through moderation
    const validation = moderatorRef.current.validateMessage(newMessage, CLIENT_ID);
    
    if (!validation.isValid) {
      toast.error(validation.reason || 'Message not allowed');
      return;
    }

    const message: Message = {
      id: generateMessageId(CLIENT_ID),
      text: newMessage.trim(),
      username,
      timestamp: Date.now(),
      clientId: CLIENT_ID
    };

    processedMessages.current.add(message.id);
    wsRef.current.send(JSON.stringify(message));
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 bg-indigo-600 dark:bg-indigo-900 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Community Chat</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            className="px-2 py-1 text-sm rounded bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40"
          />
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 text-sm flex items-center gap-2 border-b border-yellow-100 dark:border-yellow-900/50">
        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
        <span className="text-yellow-700 dark:text-yellow-400">
          Messages are moderated. Be respectful and avoid spam.
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.clientId === CLIENT_ID ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div
                className={`flex-1 ${
                  message.clientId === CLIENT_ID ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {message.username}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] inline-block ${
                    message.clientId === CLIENT_ID
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

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-dark-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}