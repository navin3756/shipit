
import React, { useState } from 'react';
import { Integration } from '../types';

export const IntegrationHub: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: '1', name: 'ShipIt Chrome Extension', type: 'extension', status: 'connected', lastSync: '2 minutes ago' },
    { id: '2', name: 'Gemini Overlay Tool', type: 'overlay', status: 'disconnected' },
    { id: '3', name: 'ChatGPT Sync Plugin', type: 'plugin', status: 'connected', lastSync: 'Yesterday' },
  ]);

  const toggleStatus = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, status: int.status === 'connected' ? 'disconnected' : 'connected' } : int
    ));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-slide-in">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">AI Connectors</h2>
        <p className="text-slate-500 font-medium">Link ShipIt to your favorite AI platforms. Once connected, your technicians can instantly access artifacts and chat context directly from the source.</p>
      </div>

      <div className="grid gap-6">
        {integrations.map(int => (
          <div key={int.id} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110 ${
                int.name.includes('Chrome') ? 'bg-slate-900' : 
                int.name.includes('Gemini') ? 'bg-indigo-600' : 'bg-emerald-500'
              }`}>
                {int.name[0]}
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">{int.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${int.status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {int.status}
                  </span>
                  {int.lastSync && (
                    <span className="text-[10px] text-slate-400 font-bold italic">Last sync: {int.lastSync}</span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => toggleStatus(int.id)}
              className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                int.status === 'connected' ? 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {int.status === 'connected' ? 'Disconnect' : 'Connect Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-black mb-4">Install Chrome Extension</h3>
          <p className="text-indigo-200 text-sm font-medium mb-8">Hand over code artifacts to technicians without leaving Gemini or ChatGPT. Pinned blocks appear instantly on your dashboard.</p>
          <button className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all active:scale-95">
            Add to Chrome (Free)
          </button>
        </div>
      </div>
    </div>
  );
};
