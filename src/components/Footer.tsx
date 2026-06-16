import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Send, X, ChevronUp, ChevronDown, 
  Circle, Sparkles, Laptop, ShieldCheck, ExternalLink, 
  Clock, CheckCheck, Users, HelpCircle, CornerDownRight 
} from 'lucide-react';
import { UserProfile } from '../types';
import { getSavedUsers } from '../data';

interface FooterProps {
  currentUser: UserProfile;
  showToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface ChatChannel {
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  messages: ChatMessage[];
}

export default function Footer({ currentUser, showToast }: FooterProps) {
  // UI states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Loaded contacts & persistent message stores
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [channels, setChannels] = useState<ChatChannel[]>([]);

  const messageListRef = useRef<HTMLDivElement>(null);

  // Initialize and load channels & contacts
  useEffect(() => {
    // 1. Get other users as contacts (exclude current logged in user)
    const allUsers = getSavedUsers();
    const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
    setContacts(otherUsers);

    // 2. Load chats from local storage
    const storageKey = `sandbox_chats_${currentUser.id}`;
    const savedChats = localStorage.getItem(storageKey);
    
    if (savedChats) {
      try {
        setChannels(JSON.parse(savedChats));
      } catch (e) {
        console.error('Error loading sandbox chats', e);
      }
    } else {
      // Seed default chats per other user to make UI look alive
      const preseeded: ChatChannel[] = otherUsers.map(user => {
        const isClient = user.role === 'client';
        return {
          participantId: user.id,
          participantName: user.name,
          participantAvatar: user.avatar,
          participantRole: user.role,
          messages: [
            {
              id: `${user.id}-seed-1`,
              senderId: user.id,
              senderName: user.name,
              senderAvatar: user.avatar,
              text: isClient 
                ? `Hi! I saw your registered developer profile. Are you open to custom contracts this week?`
                : `Hello! I reviewed your project posting. Let me know if we can schedule a quick brief to alignment on deliverables.`,
              timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
              read: true
            }
          ]
        };
      });
      setChannels(preseeded);
      localStorage.setItem(storageKey, JSON.stringify(preseeded));
    }
  }, [currentUser]);

  // Sync to LS when channels state changes
  const saveChannelsToStorage = (updatedChannels: ChatChannel[]) => {
    const storageKey = `sandbox_chats_${currentUser.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedChannels));
    setChannels(updatedChannels);
  };

  // Scroll message elements to bottom on new message or channel swap
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [selectedChannelId, channels, isTyping]);

  // Handle active contact selection
  const handleSelectChannel = (participantId: string) => {
    setSelectedChannelId(participantId);
    
    // Mark incoming messages as read
    const updated = channels.map(ch => {
      if (ch.participantId === participantId) {
        return {
          ...ch,
          messages: ch.messages.map(m => m.senderId !== currentUser.id ? { ...m, read: true } : m)
        };
      }
      return ch;
    });
    saveChannelsToStorage(updated);
  };

  // Automated chatbot contextual response generator
  const triggerAutomatedReply = (targetChannelId: string, userMessageText: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const allUsers = getSavedUsers();
      const targetUser = allUsers.find(u => u.id === targetChannelId);
      if (!targetUser) {
        setIsTyping(false);
        return;
      }

      const textLower = userMessageText.toLowerCase();
      let replyText = "";

      // Contextual triggers
      if (textLower.includes('budget') || textLower.includes('price') || textLower.includes('cost') || textLower.includes('rupees') || textLower.includes('₹')) {
        replyText = targetUser.role === 'client' 
          ? `We can negotiate a comfortable milestone structure! My maximum flexibility is around ₹${(targetUser.totalSpent ? targetUser.totalSpent / 2 : 5000).toLocaleString()} for this deliverable phase.`
          : `My standard hourly rate is set at ₹${(targetUser.hourlyRate || 70).toLocaleString()}/hr, but I am open to fixed-price packages depending on clarity of scope.`;
      } else if (textLower.includes('react') || textLower.includes('tailwind') || textLower.includes('typescript') || textLower.includes('code')) {
        replyText = targetUser.role === 'client'
          ? "Our technology platform is deeply centered on React and Tailwind. Clean components and maintainability are absolute key deliverables for us!"
          : "I write highly scalable JSX/TSX. I structure hooks, keep state dry, and style using native utility classes for premium load speeds.";
      } else if (textLower.includes('hire') || textLower.includes('deal') || textLower.includes('accept') || textLower.includes('approve') || textLower.includes('yes')) {
        replyText = targetUser.role === 'client'
          ? "Wonderful! Proceed and submit your bidding proposal to the listing feed. I'll immediately accept it to fund our escrow!"
          : "That sounds excellent! Let me review the workflow details. I'm ready to begin immediately and push the first repo commit.";
      } else if (textLower.includes('time') || textLower.includes('schedule') || textLower.includes('days') || textLower.includes('deadline')) {
        replyText = targetUser.role === 'client'
          ? "Our production roadmap is tight. Ideally, we need the initial draft ready within 7-10 days. Can your workflow cover that?"
          : "Based on historical projects, I can complete the full-featured restyle and documentation in about 5 to 7 days, with daily progress standups.";
      } else {
        // Fallback generic but high-fidelity responses
        const clientResponses = [
          "That sounds logical. In terms of your portfolio milestones, what project best demonstrates your expertise with dynamic state handles?",
          "Thanks for the update! Let me coordinate with my creative team and get back to you with the draft specs.",
          "Perfect! Sending you our preliminary wireframe link. Feel free to draft a formal proposal anytime.",
          "That makes complete sense. I appreciate the swift sandbox alignment!"
        ];

        const freelancerResponses = [
          "Got it! I am currently compiling some sample designs that match your specific style guide. I can send them over shortly.",
          "Absolutely. Let me check my pipeline calendar. I can begin onboarding process as early as tomorrow morning.",
          "Appreciate the clarity. I'm fully confident we can craft a beautiful solution for your checkout requirements.",
          "Awesome. Feel free to review my active skills tags inside the marketplace feed!"
        ];

        const responsesList = targetUser.role === 'client' ? clientResponses : freelancerResponses;
        replyText = responsesList[Math.floor(Math.random() * responsesList.length)];
      }

      // Add automated response message
      const automaticMessage: ChatMessage = {
        id: `msg-auto-${Date.now()}`,
        senderId: targetUser.id,
        senderName: targetUser.name,
        senderAvatar: targetUser.avatar,
        text: replyText,
        timestamp: new Date().toISOString(),
        read: isChatOpen && selectedChannelId === targetUser.id
      };

      setChannels(prev => {
        const updated = prev.map(ch => {
          if (ch.participantId === targetChannelId) {
            return {
              ...ch,
              messages: [...ch.messages, automaticMessage]
            };
          }
          return ch;
        });
        
        // Sync to localStorage
        const storageKey = `sandbox_chats_${currentUser.id}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });

      setIsTyping(false);

      // Notify user with audio support suggestion or toast if minimized or in other channel
      if (!isChatOpen || selectedChannelId !== targetChannelId) {
        showToast(`New message from ${targetUser.name}: "${replyText.substring(0, 35)}..."`, 'success');
      }
    }, 1500);
  };

  // Send message from user
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannelId) return;

    const sendingText = newMessage.trim();

    // Create the message payload
    const userMsg: ChatMessage = {
      id: `msg-usr-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: sendingText,
      timestamp: new Date().toISOString(),
      read: true
    };

    // Update channels
    let hasTargetChannel = false;
    const updated = channels.map(ch => {
      if (ch.participantId === selectedChannelId) {
        hasTargetChannel = true;
        return {
          ...ch,
          messages: [...ch.messages, userMsg]
        };
      }
      return ch;
    });

    if (!hasTargetChannel) {
      const activeContact = contacts.find(c => c.id === selectedChannelId);
      if (activeContact) {
        updated.push({
          participantId: activeContact.id,
          participantName: activeContact.name,
          participantAvatar: activeContact.avatar,
          participantRole: activeContact.role,
          messages: [userMsg]
        });
      }
    }

    saveChannelsToStorage(updated);
    setNewMessage('');

    // Trigger simulate message response
    triggerAutomatedReply(selectedChannelId, sendingText);
  };

  // Get current active channel
  const activeChannel = channels.find(ch => ch.participantId === selectedChannelId);

  // Compute overall unread messages count
  const unreadCount = channels.reduce((acc, ch) => {
    return acc + ch.messages.filter(m => m.senderId !== currentUser.id && !m.read).length;
  }, 0);

  return (
    <>
      {/* 1. SECURE VISUAL SYSTEM FOOTER */}
      <footer id="platform-footer" className="bg-white border-t border-slate-200 text-slate-500 text-xs py-10 px-4 md:px-8 mt-12 select-none relative z-10">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand/Slogan Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm tracking-tight">
              <span className="p-1 px-1.5 rounded-lg bg-blue-600 text-white font-black text-xs font-mono">F</span>
              <span>FreelanceHub Sandbox</span>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Enterprise vetting, secured hourly pipelines, and peer review metrics. Programmed in an isolated Cloud container workspace.
            </p>
            
            <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 p-1 px-2.5 rounded-lg border border-emerald-150 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Escrow API Online</span>
            </div>
          </div>

          {/* Column 2: Platform Shortcuts */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-extrabold text-slate-800 tracking-wider block">Workspace Capabilities</span>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-mono font-medium">
              <li className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
                <Laptop className="h-3.5 w-3.5 text-blue-550" /> Web Development Gigs
              </li>
              <li className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
                <Laptop className="h-3.5 w-3.5 text-indigo-500" /> UI Mockups restyling
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 select-none">
                <ShieldCheck className="h-3.5 w-3.5 opacity-60" /> Smart Contract Escrow (V2)
              </li>
            </ul>
          </div>

          {/* Column 3: Sandbox Resources */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-extrabold text-slate-800 tracking-wider block">Developer Sandbox Settings</span>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-medium">
              <li>
                <a href="#marketplace-feed" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  Active Listings Feed <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">API Playground Documentation</span>
              </li>
              <li className="text-[10px] text-slate-400">
                Current Host: <span className="font-mono text-blue-600 bg-blue-50 border border-blue-100 px-1 py-0.5 rounded">0.0.0.0:3000</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Vetting Disclaimer */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-extrabold text-slate-800 tracking-wider block">Vetting & Compliance</span>
            <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
              Every profile is pre-seeded with ratings and historical transaction values to demonstrate multi-tier escrow features. Data is hosted locally and secure.
            </p>
            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono pt-1">
              <span>Tailwind v4 • ESM</span>
              <span>© {new Date().getFullYear()} FreelanceHub</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 2. PREMIUM COLLAPSIBLE WORKSPACE CHAT PANEL */}
      <div id="footer-chat-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
        
        {/* Toggle Floating Launcher when minimized */}
        {!isChatOpen && (
          <motion.button
            id="chat-floating-launcher-btn"
            layoutId="chat-pane-box"
            onClick={() => setIsChatOpen(true)}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title="Open Sandbox Messenger"
            className="pointer-events-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-2xl flex items-center justify-center border border-blue-400/40 cursor-pointer relative animate-pulse"
          >
            <MessageSquare className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
            <span className="absolute -bottom-0.5 -left-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </motion.button>
        )}

        {/* Full Interactive Chat Drawer Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              id="active-chat-drawer-box"
              layoutId="chat-pane-box"
              initial={{ y: 50, opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0.8 }}
              className="pointer-events-auto w-80 md:w-96 h-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative text-slate-800"
            >
              
              {/* Drawer Top Header Area */}
              <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-105">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Sandbox Messenger</h4>
                    <p className="text-[9px] text-slate-450 font-medium">Persisted in local storage</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {selectedChannelId && (
                    <button
                      id="chat-return-list-btn"
                      onClick={() => setSelectedChannelId(null)}
                      className="text-[9px] text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded font-bold cursor-pointer transition-colors"
                    >
                      Contacts list
                    </button>
                  )}
                  
                  <button
                    id="chat-collapse-drawer-btn"
                    onClick={() => {
                      setIsChatOpen(false);
                    }}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* MAIN DRAWER LAYOUT - Split or swap depending on selected channel */}
              <div className="flex-1 flex overflow-hidden">
                
                {selectedChannelId === null ? (
                  /* 1. CHANNELS / CONTACTS LIST SCREEN */
                  <div className="flex-1 flex flex-col bg-slate-50 divide-y divide-slate-100 overflow-y-auto">
                    
                    <div className="p-3 bg-white border-b border-slate-100">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                        <Users className="h-3 w-3 text-blue-550" /> Engage Workspace Networks
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">Select a participant to secure a proposal negotiation thread:</p>
                    </div>

                    {contacts.map(user => {
                      const ch = channels.find(c => c.participantId === user.id);
                      const latestMessage = ch && ch.messages.length > 0 ? ch.messages[ch.messages.length - 1] : null;
                      const userUnreadsCount = ch ? ch.messages.filter(m => m.senderId !== currentUser.id && !m.read).length : 0;

                      return (
                        <button
                          key={user.id}
                          id={`chat-contact-row-${user.name.split(' ')[0]}`}
                          onClick={() => handleSelectChannel(user.id)}
                          className={`w-full p-3 text-left hover:bg-slate-100 transition-colors flex items-center justify-between group cursor-pointer ${
                            selectedChannelId === user.id ? 'bg-slate-100' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="relative shrink-0">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-9 w-9 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-500/30 transition-all"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>

                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <span className="block text-xs font-bold text-slate-800 truncate">{user.name}</span>
                                <span className={`text-[8px] uppercase font-black px-1.5 py-0.2 rounded shrink-0 font-mono ${
                                  user.role === 'client' 
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                }`}>
                                  {user.role}
                                </span>
                              </div>
                              <span className="block text-[10px] text-slate-500 truncate mt-0.5 leading-tight font-medium">
                                {latestMessage ? latestMessage.text : `Start chatting with ${user.name.split(' ')[0]}`}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0 pl-2">
                            {latestMessage && (
                              <span className="text-[8px] text-slate-400 font-bold font-mono">
                                {new Date(latestMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                            
                            {userUnreadsCount > 0 ? (
                              <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white font-black text-[8px] flex items-center justify-center mt-1">
                                {userUnreadsCount}
                              </span>
                            ) : (
                              <ChevronUp className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ transform: 'rotate(90deg)' }} />
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {contacts.length === 0 && (
                      <div className="p-8 text-center text-slate-400 select-none text-[11px] font-medium">
                        No other participants registered in the sandbox roster.
                      </div>
                    )}

                  </div>
                ) : (
                  /* 2. CHAT CONVERSATION FEED SCREEN */
                  <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
                    
                    {/* Active Chat Header Metadata */}
                    <div className="p-2.5 bg-white border-b border-slate-150 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={activeChannel?.participantAvatar || contacts.find(c => c.id === selectedChannelId)?.avatar}
                          alt={activeChannel?.participantName}
                          className="h-6 w-6 rounded-lg object-cover ring-1 ring-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="block text-[11px] font-extrabold text-slate-800">
                            {activeChannel?.participantName || contacts.find(c => c.id === selectedChannelId)?.name}
                          </span>
                          <span className="block text-[8px] text-emerald-600 flex items-center gap-1 font-mono uppercase font-black">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Vetted Active
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-bold font-mono">
                        {activeChannel?.participantRole === 'client' ? 'Escrow Client' : 'Contractor'}
                      </div>
                    </div>

                    {/* Chat Messages Feed List */}
                    <div 
                      id="chat-message-list"
                      ref={messageListRef}
                      className="flex-1 overflow-y-auto p-4 space-y-3.5"
                    >
                      {activeChannel?.messages.map((msg, idx) => {
                        const isSelf = msg.senderId === currentUser.id;
                        return (
                          <div
                            key={msg.id || idx}
                            className={`flex gap-2.5 ${isSelf ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isSelf && (
                              <img
                                src={msg.senderAvatar}
                                alt={msg.senderName}
                                className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-100 mt-0.5 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            )}

                            <div className="max-w-[75%] space-y-1">
                              <div className={`p-2.5 rounded-2xl text-xs leading-relaxed font-semibold ${
                                isSelf 
                                  ? 'bg-blue-600 text-white rounded-tr-none' 
                                  : 'bg-white border border-slate-205 text-slate-800 rounded-tl-none shadow-sm'
                              }`}>
                                <p className="whitespace-pre-line break-words">{msg.text}</p>
                              </div>
                              <div className={`flex items-center gap-1.5 text-[8px] text-slate-400 font-mono ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                <Clock className="h-2.5 w-2.5" />
                                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {isSelf && <CheckCheck className="h-2.5 w-2.5 text-blue-500 font-black" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Animated Bouncing Simulated Typing Indicator */}
                      {isTyping && (
                        <div className="flex gap-2.5 justify-start">
                          <img
                            src={activeChannel?.participantAvatar || contacts.find(c => c.id === selectedChannelId)?.avatar}
                            alt="Typing Partner"
                            className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-150 mt-0.5 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="text-[10px] text-slate-450 font-bold font-mono pl-1">Vetting review...</span>
                          </div>
                        </div>
                      )}

                      {(!activeChannel || activeChannel.messages.length === 0) && (
                        <div className="p-8 text-center text-slate-400 select-none text-[11px] leading-relaxed font-medium">
                          Secure negotiation tunnel initialized. Type a greeting below to test system responses.
                        </div>
                      )}
                    </div>

                    {/* Chat Input form Actions segment */}
                    <form 
                      onSubmit={handleSendMessage}
                      className="p-2.5 bg-white border-t border-slate-150 flex items-center gap-2"
                    >
                      <input
                        id="chat-text-input"
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Negotiate budget, timeline, React, deals..."
                        className="flex-1 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 text-xs text-slate-800 placeholder-slate-400 px-3 py-2 rounded-xl"
                      />
                      <button
                        id="chat-send-message-btn"
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 disabled:text-slate-400 hover:scale-[1.03] text-white p-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>

                    <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-150 text-[8px] text-slate-450 font-mono font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Sparkles className="h-2 w-2 text-blue-500" /> Ask about: **budget**, **react**, **hire**, **time**</span>
                      <CornerDownRight className="h-2.5 w-2.5 text-slate-400" />
                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
