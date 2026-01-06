
import React from 'react';

interface HowItWorksProps {
  onStart: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  return (
    <div className="max-w-5xl mx-auto py-20 px-6 animate-slide-in">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 italic">The Journey to Production</h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">We've automated the logistics of software deployment so you can focus on the product.</p>
      </div>

      <div className="space-y-32">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
             <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl">1</div>
             <h3 className="text-3xl font-black mb-4">Capture the Artifact</h3>
             <p className="text-slate-500 font-medium leading-relaxed">Connect your GitHub or simply paste code directly from your AI conversation. Our system immediately analyzes the stack and requirements.</p>
          </div>
          <div className="flex-1 bg-slate-100 h-64 rounded-[48px] border-4 border-white shadow-inner flex items-center justify-center italic text-slate-400 font-black">
             Code Input Visualization
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
             <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl">2</div>
             <h3 className="text-3xl font-black mb-4">Calculate Technical Distance</h3>
             <p className="text-slate-500 font-medium leading-relaxed">We calculate the "delta" between your raw code and a production-ready app. This generates your fixed-price Shipment Quote.</p>
          </div>
          <div className="flex-1 bg-indigo-50 h-64 rounded-[48px] border-4 border-white shadow-inner flex flex-col items-center justify-center">
             <div className="text-4xl font-black text-indigo-600 mb-2">$142.50</div>
             <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Guaranteed Quote</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
             <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl">3</div>
             <h3 className="text-3xl font-black mb-4">Dispatch Expert Technician</h3>
             <p className="text-slate-500 font-medium leading-relaxed">A certified technician picks up your cargo. They provision servers, link databases, and harden security while you watch the meter on your dashboard.</p>
          </div>
          <div className="flex-1 bg-emerald-50 h-64 rounded-[48px] border-4 border-white shadow-inner flex items-center justify-center gap-4">
             <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl">👨‍💻</div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
        </div>
      </div>

      <div className="mt-32 p-16 bg-slate-900 rounded-[64px] text-white text-center">
         <h2 className="text-4xl font-black mb-8">Ready to ship?</h2>
         <button onClick={onStart} className="px-12 py-6 bg-indigo-600 rounded-3xl font-black text-xl shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all">Start Your Shipment</button>
      </div>
    </div>
  );
};
