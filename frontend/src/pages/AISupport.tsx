import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, User, Wrench, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/ai';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  toolsUsed?: string[];
}

const QUICK_PROMPTS = [
  'Where is my order #1?',
  'Do you have Sony headphones?',
  'What is your refund policy?',
  'Show me mechanical keyboard price and stock',
];

export const AISupport: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 I am your **ShopAI Customer Support Assistant**.\n\nI have direct access to our PostgreSQL database and can help you with:\n• **Tracking Orders** (e.g., *"Where is my order #1?"*)\n• **Live Stock & Pricing** (e.g., *"Check headphone stock"*)\n• **Store Policies** (e.g., *"What is your return policy?"*)\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolsUsed: ['tool_assistant_greeting'],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(query);
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolsUsed: res.tools_used,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'response' in err && (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Failed to process message'
          : 'Could not connect to AI Support Agent. Please verify the backend is online.';

      const errorBotMsg: Message = {
        id: `bot_err_${Date.now()}`,
        sender: 'bot',
        text: `⚠️ ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>ShopAI Assistant</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-semibold uppercase text-[11px]">
                AI Agent Active
              </Badge>
            </h1>
            <p className="text-xs text-slate-500">
              Autonomous customer service powered by database tool calling
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="rounded-3xl shadow-sm flex flex-col h-[560px] overflow-hidden p-0">
        {/* Messages list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';

            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isBot
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-blue-600 text-white shadow-sm'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                      isBot
                        ? 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-sm'
                        : 'bg-blue-600 text-white rounded-tr-sm'
                    }`}
                  >
                    {isBot && (
                      <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ShopAI Support</span>
                      </div>
                    )}
                    <div>{m.text}</div>
                  </div>

                  {/* Metadata & Tool Badges */}
                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${!isBot && 'justify-end'}`}>
                    <span>{m.timestamp}</span>
                    {m.toolsUsed && m.toolsUsed.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-600 border-purple-200 font-normal">
                        <Wrench className="w-3 h-3" />
                        <span>tools: {m.toolsUsed.join(', ')}</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 rounded-tl-sm flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>ShopAI agent is querying database tools...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-semibold uppercase text-slate-400 shrink-0">
            Try asking:
          </span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <Button
              key={i}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSend(prompt)}
              className="h-7 text-xs rounded-full font-medium shrink-0 bg-white hover:bg-purple-50 hover:text-purple-700"
            >
              {prompt}
            </Button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Ask about orders, products, stock, or store policies..."
            className="flex-1 rounded-2xl py-6 bg-slate-50 focus-visible:bg-white"
          />
          <Button
            type="button"
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="h-12 w-12 rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
