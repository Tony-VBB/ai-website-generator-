'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    provider?: string;
    model?: string;
  };
}

interface Chat {
  _id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatHistoryProps {
  onLoadChat: (chat: Chat) => void;
}

export default function ChatHistoryPanel({ onLoadChat }: ChatHistoryProps) {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    if (!session?.user) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      } else {
        console.error('Failed to fetch chats:', res.status);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      const res = await fetch(`/api/chat/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setChats(chats.filter(c => c._id !== id));
        if (selectedChat === id) {
          setSelectedChat(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleChatClick = async (chat: Chat) => {
    setSelectedChat(chat._id);
    onLoadChat(chat);
  };

  if (!session) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Chat History</h3>
        <button
          onClick={fetchChats}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : chats.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No chat history yet
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              className={`p-3 rounded border cursor-pointer transition-colors ${
                selectedChat === chat._id
                  ? 'bg-blue-700 border-blue-500'
                  : 'bg-gray-700 border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm truncate flex-1">
                  {chat.title}
                </h4>
                <button
                  onClick={(e) => handleDelete(chat._id, e)}
                  className="text-red-400 hover:text-red-300 text-sm ml-2"
                >
                  ×
                </button>
              </div>
              <div className="text-xs text-gray-400">
                {chat.messages.length} messages
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(chat.updatedAt).toLocaleDateString()} {new Date(chat.updatedAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
