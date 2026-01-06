
import React, { useState, useEffect } from 'react';
import { Artifact } from '../types';

interface FloatingExtensionProps {
  onSync: (artifact: Artifact) => void;
  onOpenApp: () => void;
}

export const FloatingExtension: React.FC<FloatingExtensionProps> = ({ onSync, onOpenApp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [detectedCode, setDetectedCode] = useState(false);

  useEffect(() => {
    // Simulate detecting code in a chat tab after a few seconds
    const timer = setTimeout(() => setDetectedCode(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const newArtifact: Artifact = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Detected Landing Page Code',
        code: 'const App = () => <div>Live via ShipIt</div>;',
        language: 'javascript',
        sourceApp: 'Gemini',
        timestamp: new Date().toISOString()
      };
      onSync(newArtifact);
      setIsCapturing(false);
      setDetectedCode(false);
      setIsOpen(false);
      onOpenApp();
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      {isOpen && (
        <div className="w-72 bg-slate-900 text-white rounded-[32px] p-6 shadow-2xl border border-slate-700 pointer-events-auto animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">S</div>
              <span className="font-black text-sm tracking-tight">ShipIt Connector</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="space-y-4">
            {detectedCode ? (
              <div className="p-4 bg-indigo-600/20 border border-indigo-400/30 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-indigo-300 mb-1">Status</p>
                <p className="text-xs font-bold">Production-ready code detected in active tab.</p>
                <button 
                  onClick={handleCapture}
                  className="w-full mt-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all"
                >
                  {isCapturing ? 'Capturing...' : 'Push to Shipment'}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-800 rounded-2xl text-center">
                <p className="text-xs text-slate-400 font-medium italic">Scanning active chat for code blocks...</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <button onClick={onOpenApp} className="flex-1 py-2 text-[10px] font-black uppercase bg-slate-800 rounded-xl hover:bg-slate-700">Open Dashboard</button>
              <button className="flex-1 py-2 text-[10px] font-black uppercase bg-slate-800 rounded-xl hover:bg-slate-700">Settings</button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all pointer-events-auto active:scale-90 ${
          detectedCode && !isOpen ? 'bg-indigo-600 text-white animate-pulse ring-4 ring-indigo-600/30' : 'bg-slate-900 text-white'
        }`}
      >
        {isOpen ? (
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        ) : (
          <div className="relative">
            <span className="text-2xl font-black">S</span>
            {detectedCode && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-slate-900 rounded-full"></div>}
          </div>
        )}
      </button>
    </div>
  );
};
