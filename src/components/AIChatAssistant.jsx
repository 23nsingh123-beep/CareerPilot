import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_ORIGIN =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  
// Utility to parse basic markdown (**bold**) safely without innerHTML
const renderText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    // Simple parser for **bold**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <React.Fragment key={lineIndex}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

const STARTER_PROMPTS = [
  "Improve my ATS score",
  "DevOps learning roadmap",
  "Interview preparation tips",
  "Skills for a cloud engineer"
];

function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load history from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('careerpilot-chat-history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history');
      }
    } else {
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: 'Hi! I am the CareerPilot AI Assistant. I can help you with resumes, interview prep, career planning, and more. How can I assist you today?',
        createdAt: new Date().toISOString()
      }]);
    }
  }, []);

  // Save history to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('careerpilot-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (messageText = input) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    if (text.length > 2000) {
      setError('Message is too long (maximum 2000 characters).');
      return;
    }

    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      // Send only role and content to backend
      const payload = {
        messages: newMessages.map(m => ({ role: m.role, content: m.content }))
      };

      const res = await axios.post(`${API_ORIGIN}/chat`, payload);
      
      if (res.data && res.data.success) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: res.data.reply,
          createdAt: new Date().toISOString()
        }]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    const initial = [{
      id: Date.now(),
      role: 'assistant',
      content: 'Chat history cleared. How can I help you?',
      createdAt: new Date().toISOString()
    }];
    setMessages(initial);
    sessionStorage.removeItem('careerpilot-chat-history');
    setError(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:bg-primary-fixed hover:text-on-primary-fixed hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30"
        aria-label="Open AI Career Assistant"
      >
        <span className="material-symbols-outlined text-[28px]">smart_toy</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[90vw] max-w-[400px] h-[80vh] max-h-[600px] bg-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30 animate-fade-in">
      {/* Header */}
      <div className="bg-primary text-on-primary p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">smart_toy</span>
          <h3 className="font-headline-sm font-bold text-[16px]">Career Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleClear} 
            className="p-1 hover:bg-black/10 rounded transition-colors"
            title="Clear Chat"
            aria-label="Clear Chat"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="Close Chat"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-surface-container-lowest space-y-4" aria-live="polite">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[14px] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary text-on-primary rounded-br-none' 
                : 'bg-surface-container-low text-on-surface border border-outline-variant/20 rounded-bl-none'
            }`}>
              {renderText(msg.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 rounded-bl-none flex gap-1">
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-error-container text-on-error-container text-[12px] p-2 rounded-lg max-w-[90%] text-center border border-error/20 flex flex-col items-center gap-1">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="font-bold hover:underline">Dismiss</button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-surface border-t border-outline-variant/30 shrink-0">
        {messages.length === 1 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 custom-scrollbar no-scrollbar">
            {STARTER_PROMPTS.map((prompt, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-primary text-[12px] font-medium rounded-full border border-primary/20 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask about your career..."
            className="flex-1 max-h-[120px] min-h-[44px] bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-[14px] resize-none disabled:opacity-50"
            rows={1}
            style={{
              height: 'auto',
              maxHeight: '120px'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 bg-primary text-on-primary rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors shrink-0"
            aria-label="Send Message"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
        <p className="text-center text-[10px] text-on-surface-variant mt-2">
          AI may produce inaccurate information. Please verify important details.
        </p>
      </div>
    </div>
  );
}

export default AIChatAssistant;
