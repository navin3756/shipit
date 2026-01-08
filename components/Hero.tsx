
import React from 'react';

interface HeroProps {
  onStart: () => void;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart, onExplore }) => {
  return (
    <div className="relative py-20 md:py-32 px-6 overflow-hidden bg-white">
      {/* Abstract Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-5xl mx-auto relative z-10 animate-slide-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black mb-6 border border-slate-800 uppercase tracking-widest">
            The Completion Layer for AI
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
            AI gave you 80%. <br/>
            <span className="text-indigo-600">We ship the last 20%.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Don't let your project die in a Gemini or ChatGPT tab. One-tap capture your code, book an expert technician, and move to production MRR in 48 hours.
          </p>
        </div>

        {/* The "Booking Box" - Uber Style */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-200/50 border border-slate-100 p-2 md:p-3 mb-8">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 group">
                <div className="relative flex items-center p-4 bg-slate-50 rounded-2xl border border-transparent group-focus-within:border-indigo-200 transition-all">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mr-4 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Artifact</div>
                    <div className="text-sm font-bold text-slate-900 truncate">Detect AI Code Block</div>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center justify-center px-2 text-slate-300">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </div>

              <div className="flex-1 group">
                <div className="relative flex items-center p-4 bg-slate-50 rounded-2xl border border-transparent group-focus-within:border-indigo-200 transition-all">
                  <div className="w-2 h-2 rounded-sm bg-slate-900 mr-4"></div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</div>
                    <div className="text-sm font-bold text-slate-900">Live Production App</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={onStart}
                className="md:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95"
              >
                Start Last Mile
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onExplore}
              className="px-8 py-3 rounded-2xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              How it Works
            </button>
            <button 
              onClick={onStart}
              className="px-8 py-3 rounded-2xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all"
            >
              Ready to Ship
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
           <div className="text-center">
             <div className="text-2xl font-black text-slate-900">48h</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Avg. Delivery</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-black text-slate-900">1.2k+</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Experts Ready</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-black text-slate-900">$100k+</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Escrow Protected</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-black text-slate-900">Zero</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Code Skill Req.</div>
           </div>
        </div>
      </div>
    </div>
  );
};
