'use client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    provider?: string;
    model?: string;
    enhancedPrompt?: string;
    analysis?: string;
  };
}

interface ChatDisplayProps {
  messages: ChatMessage[];
}

export default function ChatDisplay({ messages }: ChatDisplayProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No messages yet. Start by generating a website!
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 sticky top-0 bg-gray-50 pb-2">Conversation History</h3>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg ${
            message.role === 'user'
              ? 'bg-blue-100 border border-blue-200 ml-8'
              : 'bg-white border border-gray-200 mr-8'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-sm">
              {message.role === 'user' ? '🧑 You' : '🤖 AI Assistant'}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {message.content}
          </div>
          {message.metadata && (
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              {message.metadata.provider && message.metadata.model && (
                <div>📡 {message.metadata.provider} - {message.metadata.model}</div>
              )}
              {message.metadata.enhancedPrompt && (
                <details className="mt-1">
                  <summary className="cursor-pointer hover:text-blue-600">Enhanced Prompt</summary>
                  <div className="mt-1 p-2 bg-gray-100 rounded text-xs">
                    {message.metadata.enhancedPrompt}
                  </div>
                </details>
              )}
              {message.metadata.analysis && (
                <details className="mt-1">
                  <summary className="cursor-pointer hover:text-blue-600">Analysis</summary>
                  <div className="mt-1 p-2 bg-gray-100 rounded text-xs">
                    {message.metadata.analysis}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
