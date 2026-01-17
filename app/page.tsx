"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { PromptInput } from "@/components/PromptInput";
import { PreviewPanel } from "@/components/PreviewPanel";
import { generateWebsite } from "@/lib/api";
import AuthForm from "@/components/AuthForm";
import SavedProjects from "@/components/SavedProjects";
import ChatHistoryPanel from "@/components/ChatHistoryPanel";
import ChatDisplay from "@/components/ChatDisplay";

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

export default function Home() {
  const { data: session, status } = useSession();
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [currentAiModel, setCurrentAiModel] = useState<string>("");
  const [currentProvider, setCurrentProvider] = useState<string>("");
  const [showSaved, setShowSaved] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [leftWidth, setLeftWidth] = useState(35); // Percentage - default 35% for input, 65% for preview
  const [isDragging, setIsDragging] = useState(false);

  const handleGenerate = async (prompt: string, model: string, provider: string) => {
    setIsGenerating(true);
    setError("");
    setEnhancedPrompt("");
    setAnalysis("");
    setGeneratedHtml("");
    setCurrentPrompt(prompt);
    setCurrentAiModel(model);
    setCurrentProvider(provider);
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
      metadata: { provider, model },
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    try {
      const result = await generateWebsite(prompt, model, provider);
      const generatedCode = result.code || result.html || "";
      setGeneratedHtml(generatedCode);
      
      if (result.enhancedPrompt) {
        setEnhancedPrompt(result.enhancedPrompt);
      }
      if (result.analysis) {
        setAnalysis(result.analysis);
      }
      
      // Add assistant message to chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `Generated a website with ${generatedCode.length} characters of HTML/CSS/JS code.`,
        timestamp: new Date().toISOString(),
        metadata: {
          provider,
          model,
          enhancedPrompt: result.enhancedPrompt,
          analysis: result.analysis,
        },
      };
      setChatMessages(prev => [...prev, assistantMessage]);
      
      // Auto-save chat if there are multiple messages
      if (chatMessages.length > 0) {
        saveChatToDatabase([...chatMessages, userMessage, assistantMessage]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate website");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveChatToDatabase = async (messages: ChatMessage[]) => {
    try {
      const title = messages[0]?.content.substring(0, 50) + '...' || 'New Chat';
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, messages }),
      });
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  const handleSaveProject = async (title: string) => {
    if (!session || !generatedHtml) return;

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          prompt: currentPrompt,
          enhancedPrompt,
          analysis,
          htmlCode: generatedHtml,
          aiModel: currentAiModel,
          provider: currentProvider,
        }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Server error:', text.substring(0, 200));
        alert('Server error. Please check console and ensure MongoDB is connected.');
        return;
      }

      if (res.ok) {
        alert('Project saved successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save project');
      }
    } catch (error) {
      alert('Failed to save project');
    }
  };

  const handleLoadChat = (chat: any) => {
    setChatMessages(chat.messages || []);
    setCurrentChatId(chat._id);
    setShowChatHistory(false);
    
    // Load the last generated HTML if available
    const lastAssistantMessage = [...chat.messages].reverse().find((m: ChatMessage) => m.role === 'assistant');
    if (lastAssistantMessage) {
      // Would need to store HTML in chat messages for full restore
      console.log('Chat loaded:', chat.title);
    }
  };

  const handleLoadProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Server error:', text.substring(0, 200));
        alert('Failed to load project. Server error.');
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedHtml(data.project.htmlCode);
        setCurrentPrompt(data.project.prompt);
        setEnhancedPrompt(data.project.enhancedPrompt || '');
        setAnalysis(data.project.analysis || '');
        setCurrentAiModel(data.project.aiModel);
        setCurrentProvider(data.project.provider);
        setShowSaved(false);
      }
    } catch (error) {
      alert('Failed to load project');
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const offsetX = showSaved ? 320 : 0; // Account for saved projects sidebar
    const newLeftWidth = ((e.clientX - rect.left - offsetX) / (rect.width - offsetX)) * 100;
    
    // Limit between 20% and 80%
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">AI Website Generator</h1>
          <p className="text-gray-400 mb-8">Login or create an account to start generating websites</p>
          <AuthForm onSuccess={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-bold">AI Website Generator</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">Welcome, {session.user?.name}</span>
          <button
            onClick={() => {
              setShowChatHistory(!showChatHistory);
              if (showSaved && !showChatHistory) setShowSaved(false);
            }}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-colors"
          >
            {showChatHistory ? 'Hide Chats' : 'Chat History'}
          </button>
          <button
            onClick={() => {
              setShowSaved(!showSaved);
              if (showChatHistory && !showSaved) setShowChatHistory(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
          >
            {showSaved ? 'Hide Projects' : 'My Projects'}
          </button>
          <button
            onClick={() => signOut()}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex flex-1 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {showChatHistory && (
          <div className="w-80 bg-gray-900 text-white p-4 overflow-y-auto border-r border-gray-700 flex-shrink-0">
            <ChatHistoryPanel onLoadChat={handleLoadChat} />
          </div>
        )}
        {showSaved && (
          <div className="w-80 bg-gray-900 text-white p-4 overflow-y-auto border-r border-gray-700 flex-shrink-0">
            <SavedProjects onLoadProject={handleLoadProject} />
          </div>
        )}
        
        <div className="flex flex-1 relative">
          <div 
            className="overflow-auto"
            style={{ width: `${leftWidth}%` }}
          >
            <PromptInput 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={error}
              enhancedPrompt={enhancedPrompt}
              analysis={analysis}
              chatMessages={chatMessages}
            />
          </div>
          
          {/* Resize Handle */}
          <div
            className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize flex-shrink-0 transition-colors relative group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-gray-400 group-hover:bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
          
          <div 
            className="overflow-auto"
            style={{ width: `${100 - leftWidth}%` }}
          >
            <PreviewPanel 
              html={generatedHtml}
              isGenerating={isGenerating}
              onSaveProject={handleSaveProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
