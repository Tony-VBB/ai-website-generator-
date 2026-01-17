"use client";

import { useState } from "react";
import ChatDisplay from "./ChatDisplay";

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

interface PromptInputProps {
  onGenerate: (prompt: string, model: string, provider: string) => void;
  isGenerating: boolean;
  error: string;
  enhancedPrompt?: string;
  analysis?: string;
  chatMessages?: ChatMessage[];
}

export function PromptInput({ onGenerate, isGenerating, error, enhancedPrompt, analysis, chatMessages = [] }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("groq");
  const [model, setModel] = useState("llama3.3");

  const examplePrompts = [
    "Create a portfolio website for a photographer with gallery and contact form",
    "Build a landing page for a SaaS product with pricing tiers and testimonials",
    "Design a restaurant website with menu, location map, and reservation form",
    "Create a personal blog with featured posts, categories, and author bio",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, model, provider);
    }
  };

  return (
    <div className="w-full h-full border-r border-gray-200 flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">AI Website Generator</h1>
        <p className="text-sm text-gray-600 mt-1">
          Describe your website and let AI build it for you
        </p>
      </div>

      {/* Content with Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Chat History Display */}
        {chatMessages.length > 0 && (
          <ChatDisplay messages={chatMessages} />
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your website
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a portfolio website for a photographer with gallery and contact form"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                // Set default model for provider
                if (e.target.value === "groq") setModel("llama3.3");
                else if (e.target.value === "huggingface") setModel("llama3.3");
                else if (e.target.value === "openrouter") setModel("claude-3.5-sonnet");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isGenerating}
            >
              <option value="groq">Groq (Fast)</option>
              <option value="huggingface">Hugging Face (Free)</option>
              <option value="openrouter">OpenRouter (Multi-Model)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isGenerating}
            >
              {provider === "groq" ? (
                <>
                  <option value="llama3.3">Llama 3.3 70B (Recommended)</option>
                  <option value="llama8b">Llama 3.1 8B (Faster)</option>
                </>
              ) : provider === "huggingface" ? (
                <>
                  <option value="llama3.3">Llama 3.3 70B Instruct (Best)</option>
                  <option value="llama3.1">Llama 3.1 8B Instruct (Fast)</option>
                  <option value="llama3.2">Llama 3.2 3B Instruct (Faster)</option>
                </>
              ) : (
                <>
                  <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Best)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="llama-3.3-70b">Llama 3.3 70B</option>
                  <option value="gemini-pro-1.5">Gemini Pro 1.5</option>
                </>
              )}
            </select>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Analysis Display */}
          {analysis && !isGenerating && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs font-semibold text-purple-900 mb-2">🔍 AI Analysis:</p>
              <p className="text-sm text-purple-800 whitespace-pre-wrap">{analysis}</p>
            </div>
          )}

          {/* Enhanced Prompt Display */}
          {enhancedPrompt && !isGenerating && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-2">✨ Enhanced Prompt:</p>
              <p className="text-sm text-blue-800 whitespace-pre-wrap">{enhancedPrompt}</p>
            </div>
          )}

          {/* Example Prompts */}
          <div className="pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Example prompts:</p>
            <div className="space-y-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isGenerating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Website"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
