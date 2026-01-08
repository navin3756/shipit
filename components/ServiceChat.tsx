
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';

interface ServiceChatProps {
  messages: Message[];
  onSend: (text: string) => void;
  expertName: string;
}

export const ServiceChat: React.FC<ServiceChatProps> = ({ messages, onSend, expertName }) => {
  const [inputText, setInputText] = useState('');
  const [isSimulatingTyping, setIsSimulatingTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSimulatingTyping]);

  useEffect(() => {
    // Basic heuristic: if the last message was from the user, show typing indicator briefly before the "fake" reply comes in from App.tsx
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'user') {
      setIsSimulatingTyping(true);
      const timer = setTimeout(() => setIsSimulatingTyping(false), 2000); // Matches the App.tsx delay roughly
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSend(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-50 rounded-[32px] border border-slate-100 overflow-hidden shadow-inner">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
            {expertName[0]}
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">{expertName}</div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-10 opacity-40">
            <p className="text-xs font-bold text-slate-400">Start the conversation with {expertName}</p>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                m.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none'
              }`}>
                {m.text}
                <div className={`text-[8px] mt-1 font-bold uppercase ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isSimulatingTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message..."
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
