
import React from 'react';

interface ExpertPortalLandingProps {
  onJoin: () => void;
}

export const ExpertPortalLanding: React.FC<ExpertPortalLandingProps> = ({ onJoin }) => {
  return (
    <div className="bg-slate-950 min-h-screen text-white overflow-hidden selection:bg-indigo-500">
      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 text-center mb-24 animate-slide-in">
          <div className="inline-block px-4 py-1.5 bg-indigo-950 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">
            Supply Side: Deliver the Last Mile
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
            Trade your DevOps <br/> for <span className="text-indigo-500 italic">Predictable Revenue.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            AI handles the 80% bulk code. You use your pro toolchain to refactor, provision, and ship the last 20%. No scope creep. Just scoped delivery.
          </p>
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
            <button onClick={onJoin} className="w-full md:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">
              Join as Technician
            </button>
            <div className="text-slate-500 font-bold text-sm">Earn up to $5k/mo as a side-hustle.</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-indigo-500/50 transition-all group">
            <div className="text-4xl mb-6">📦</div>
            <h3 className="text-xl font-black mb-4 group-hover:text-indigo-400 transition-colors">Scoped Cargo</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Stop guessing requirements. Our AI Blueprint analyzes the customer's code and gives you a clear delivery checklist before you start.</p>
          </div>
          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-indigo-500/50 transition-all group">
            <div className="text-4xl mb-6">🛠️</div>
            <h3 className="text-xl font-black mb-4 group-hover:text-indigo-400 transition-colors">Bring Your Own Pro-Tools</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Founders don't have IDEs or servers. You use your licensed toolchain to build, test, and host their project. You are the infrastructure.</p>
          </div>
          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-indigo-500/50 transition-all group">
            <div className="text-4xl mb-6">💰</div>
            <h3 className="text-xl font-black mb-4 group-hover:text-indigo-400 transition-colors">Escrow Guaranteed</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Payment is captured upfront. Once you push to production and the customer verifies the live app, your fee is released instantly.</p>
          </div>
        </div>

        <div className="mt-32 p-12 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-[48px] border border-white/10 text-center">
          <h2 className="text-4xl font-black mb-6">The "DoorDash" for DevOps</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-10 font-medium italic">
            "I used to spend weeks on freelance platforms arguing over scope. Now I just pick up unmanifested cargo, push it live on my server cluster, and get paid for the delivery. It's high-velocity tech work."
          </p>
          <div className="flex items-center justify-center gap-4">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64" className="w-12 h-12 rounded-full border-2 border-indigo-500" />
            <div className="text-left">
              <div className="font-black">Marcus Thorne</div>
              <div className="text-[10px] font-black uppercase text-indigo-400">Lead Technician • 89 Deliveries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
