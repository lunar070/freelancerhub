import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, X, Bot, Clock, HelpCircle, 
  Lightbulb, Briefcase, Code2, AlertTriangle, ChevronUp, UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface AIAssistantProps {
  currentUser: UserProfile;
  showToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function AIAssistant({ currentUser, showToast }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorPrompt, setErrorPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested pre-seeded prompt list
  const suggestedPrompts = [
    {
      id: 'p1',
      title: 'Draft Project Brief',
      text: 'Draft a professional scope document for a React & Tailwind landing page, including realistic deliverables.',
      icon: Briefcase,
      color: 'text-indigo-400'
    },
    {
      id: 'p2',
      title: 'Formulate Milestone Budgets',
      text: 'Create a fair milestone structure for a hybrid e-commerce integration. Suggest rupee estimates (₹).',
      icon: Lightbulb,
      color: 'text-amber-400'
    },
    {
      id: 'p3',
      title: 'Review My Pitch',
      text: 'Critique my bidding pitch: "Hey! I can build your webapp fast. Let me know if you want to work together."',
      icon: UserCheck,
      color: 'text-emerald-400'
    },
    {
      id: 'p4',
      title: 'Optimized Tech Stack',
      text: 'Recommend the perfect technology stack for a real-time collaborative workspace app using state hooks.',
      icon: Code2,
      color: 'text-pink-400'
    }
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Load welcome prompt when opening first time
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = currentUser.role === 'client' 
        ? `Hello, **${currentUser.name.split(' ')[0]}**! I am your AI Product Architect. \n\nI can help you **draft crisp project descriptions**, formulate budget milestones, or evaluate contractor bids inside this sandbox. What would you like to build today?`
        : `Hello, **${currentUser.name.split(' ')[0]}**! I am your AI Development Coach. \n\nI can help you **optimize your proposal bids**, estimate development hours, suggest modern React structures, or debug TypeScript. How can I help you level up your contracts?`;

      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: welcomeText,
          timestamp: new Date()
        }
      ]);
    }
  }, [currentUser, messages.length]);

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `ai-msg-user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setErrorPrompt(null);

    try {
      // Map history for Gemini API
      // Exclude welcome message to avoid polluting structured history schemas
      const chatHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          context: {
            user: {
              name: currentUser.name,
              role: currentUser.role,
              bio: currentUser.bio,
              skills: (currentUser as any).skills,
              hourlyRate: (currentUser as any).hourlyRate
            },
            role: currentUser.role
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const modelMsg: Message = {
          id: `ai-msg-model-${Date.now()}`,
          role: 'model',
          text: data.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMsg]);
      } else {
        const errMessage = data.error || "Failed context validation execution.";
        setErrorPrompt(errMessage);
        showToast("Gemini API could not generate response.", "error");
      }
    } catch (err: any) {
      console.error(err);
      setErrorPrompt("Database proxy or API key missing. Please verify you have configured your GEMINI_API_KEY in the Settings > Secrets tab.");
      showToast("AI Assistant Service offline.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  const clearSession = () => {
    setMessages([]);
    setErrorPrompt(null);
  };

  return (
    <div id="ai-assistant-container" className="fixed bottom-6 left-6 z-50 flex flex-col items-start pointer-events-none select-none">
      
      {/* 1. COLLAPSED FLOATING LAUNCHER (Bottom Left Placement) */}
      {!isOpen && (
        <motion.button
          id="ai-assistant-launcher-btn"
          layoutId="ai-assistant-drawer"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Open Catalyst AI Companion"
          className="pointer-events-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 via-indigo-650 to-indigo-500 text-white shadow-2xl flex items-center justify-center border border-indigo-400/30 cursor-pointer relative"
        >
          <Sparkles className="h-5 w-5 text-indigo-100 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
        </motion.button>
      )}

      {/* 2. OPEN COMPANION WORKSPACE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-drawer-box"
            layoutId="ai-assistant-drawer"
            initial={{ y: 50, opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0.8 }}
            className="pointer-events-auto w-85 md:w-100 h-[500px] bg-white border border-slate-205 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative text-slate-800"
          >
            
            {/* Header segment */}
            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center border border-indigo-300/20 shadow">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-slate-800">Catalyst AI</h4>
                    <span className="text-[8px] font-mono font-bold bg-blue-50 border border-blue-150 text-blue-600 rounded px-1.5 py-0.2 uppercase tracking-widest">Model 3.5</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium">Contextual Sandbox consultant</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {messages.length > 1 && (
                  <button
                    id="ai-clear-session-btn"
                    onClick={clearSession}
                    className="text-[9px] text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded font-bold cursor-pointer transition-all shadow-sm"
                  >
                    Clear history
                  </button>
                )}

                <button
                  id="ai-close-drawer-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-855 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversation list stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              
              <AnimatePresence>
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Avatar */}
                      {!isUser && (
                        <div className="h-7.5 w-7.5 shrink-0 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border border-blue-300">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div className="max-w-[85%] space-y-1">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold shadow-sm ${
                          isUser 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-205 text-slate-800 rounded-tl-none whitespace-pre-line'
                        }`}>
                          
                          {/* Markdown parsing replacement layout */}
                          {msg.text.split('\n\n').map((paragraph, pIdx) => {
                            // Basic support for bold formatting (**bold**)
                            const parts = paragraph.split('**');
                            return (
                              <p key={pIdx} className="mb-2 last:mb-0">
                                {parts.map((pText, tIdx) => {
                                    if (tIdx % 2 === 1) {
                                      return <strong key={tIdx} className="font-extrabold text-blue-605">{pText}</strong>;
                                    }
                                    return pText;
                                })}
                              </p>
                            );
                          })}

                        </div>

                        {/* Timestamp label segment */}
                        <div className={`flex items-center gap-1 text-[8px] text-slate-400 font-mono ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <Clock className="h-2.5 w-2.5" />
                          <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Waiting state loading display */}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-7.5 w-7.5 shrink-0 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-650 flex items-center justify-center border border-blue-300 animate-pulse">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-202 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] text-slate-450 font-bold font-mono pl-1">Catalytic analysis...</span>
                  </div>
                </div>
              )}

              {/* Unconfigured Secret Alert segment */}
              {errorPrompt && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex gap-2.5 items-start mt-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-[10px] text-rose-700 leading-relaxed">
                    <h5 className="font-extrabold text-rose-800">Execution Error</h5>
                    <p className="mt-0.5 font-semibold">{errorPrompt}</p>
                    <div className="mt-2 text-[9px] text-slate-500 font-mono bg-slate-50 p-1 px-2 border border-slate-100 rounded-md">
                      Settings &gt; Secrets &gt; GEMINI_API_KEY
                    </div>
                  </div>
                </div>
              )}

              {/* End pointer */}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggested Prompts Tray (show when list length is minimal) */}
            {messages.length <= 1 && !loading && (
              <div className="p-3.5 bg-slate-50 border-t border-slate-200">
                <span className="text-[9px] uppercase font-extrabold text-slate-450 tracking-wider flex items-center gap-1 mb-2.5">
                  <HelpCircle className="h-3 w-3 text-blue-550" /> Need a Consultant draft? Pick one:
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  {suggestedPrompts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSendPrompt(p.text)}
                      className="text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl p-2.5 transition-all cursor-pointer text-slate-700 shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-extrabold text-slate-800">
                        <p.icon className={`h-3.5 w-3.5 ${p.color}`} />
                        <span>{p.title}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium truncate">{p.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form actions control input */}
            <form 
              onSubmit={handleFormSubmit}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                id="ai-text-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentUser.role === 'client' ? 'Draft a brief, estimate budgets...' : 'Rate structure, draft propose summaries...'}
                className="flex-1 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 text-xs text-slate-800 placeholder-slate-400 px-3 py-2.5 rounded-xl font-medium"
              />
              <button
                id="ai-send-prompt-btn"
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:bg-slate-100 disabled:text-slate-400 hover:scale-[1.03] text-white p-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
