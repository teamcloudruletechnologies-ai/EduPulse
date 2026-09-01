import React, { useEffect, useState, useRef } from 'react';
import { Send, CheckCheck, User, Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const StudentMessages = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('edtech_shared_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: '1',
        senderName: 'Dr. Robert Langdon',
        role: 'MENTOR',
        content: 'Hello Alex! I am your assigned capstone mentor. You can send me your code queries and architecture questions here anytime.',
        time: '10:00 AM',
      },
    ];
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Sync messages in real-time across tabs / windows when mentor replies
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'edtech_shared_chat' && e.newValue) {
        try {
          setMessages(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('edtech_shared_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const myMsg = {
      id: String(Date.now()),
      senderName: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Alex Mercer',
      role: 'STUDENT',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, myMsg];
    setMessages(updated);
    localStorage.setItem('edtech_shared_chat', JSON.stringify(updated));
    setInput('');
    showToast('Message sent to mentor!', 'info');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation history?')) {
      const reset = [
        {
          id: '1',
          senderName: 'Dr. Robert Langdon',
          role: 'MENTOR',
          content: 'Hello Alex! I am your assigned capstone mentor. You can send me your code queries here anytime.',
          time: '10:00 AM',
        },
      ];
      setMessages(reset);
      localStorage.setItem('edtech_shared_chat', JSON.stringify(reset));
      showToast('Chat history reset.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Direct Mentor Communication Channel</h1>
          <p className="text-xs text-slate-500">Live chat with your assigned mentor. Mentor replies manually from their Mentor Workspace.</p>
        </div>
        <button
          onClick={handleClearHistory}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Clear Chat
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-900 text-white font-extrabold text-sm shadow-xs">
              RL
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dr. Robert Langdon</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Online • Principal Solution Architect (Mentor)
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Capstone Advisor</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((m) => {
            const isMe = m.role === 'STUDENT';
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-md rounded-2xl px-4 py-3 text-xs shadow-xs ${
                    isMe
                      ? 'bg-brand-900 text-white rounded-br-none'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className={`font-bold text-[10px] mb-1 ${isMe ? 'text-brand-200' : 'text-purple-800'}`}>
                    {m.senderName} ({m.role})
                  </p>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1">
                  <span>{m.time}</span>
                  {isMe && <CheckCheck className="h-3 w-3 text-brand-900" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question or code doubt to Dr. Langdon..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-900"
          />
          <button
            type="submit"
            className="flex items-center space-x-1.5 rounded-xl bg-brand-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-800 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
