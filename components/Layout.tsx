
import React, { useState } from 'react';
import { ViewState } from '../types';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isExpertSide = activeView.includes('expert');

  const handleMobileNavigate = (view: ViewState) => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isExpertSide ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
      <header className={`sticky top-0 z-50 glass-effect border-b px-6 py-4 ${isExpertSide ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('landing')}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-colors ${isExpertSide ? 'bg-indigo-600 ring-2 ring-indigo-400/20' : 'bg-slate-900'}`}>S</div>
            <span className={`text-2xl font-bold transition-colors ${isExpertSide ? 'text-white' : 'text-slate-900'}`}>
              ShipIt <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1 hidden sm:inline">{isExpertSide ? 'Technician' : ''}</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {!isExpertSide ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className={`text-sm font-bold transition-colors ${activeView === 'dashboard' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Dashboard</button>
                <button onClick={() => onNavigate('experts')} className={`text-sm font-bold transition-colors ${activeView === 'experts' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Experts</button>
                <button onClick={() => onNavigate('pricing')} className={`text-sm font-bold transition-colors ${activeView === 'pricing' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Pricing</button>
                <button onClick={() => onNavigate('integrations')} className={`text-sm font-bold transition-colors ${activeView === 'integrations' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Integrations</button>
                <button onClick={() => onNavigate('expert-landing')} className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">Deliver with ShipIt</button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('expert-portal')} className={`text-sm font-bold transition-colors ${activeView === 'expert-portal' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>Command Center</button>
                <button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Earnings</button>
                <button onClick={() => onNavigate('landing')} className="text-xs font-black uppercase text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-white hover:text-white transition-all">Founders App</button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {!isExpertSide ? (
              <button 
                onClick={() => onNavigate('onboarding')}
                className="hidden md:block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                Start Shipping
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                 <span className="text-xs font-black text-white uppercase tracking-widest">Technician Active</span>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className={`md:hidden p-2 rounded-lg transition-colors ${isExpertSide ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 pt-4 border-t animate-slide-in ${isExpertSide ? 'border-slate-800' : 'border-slate-100'}`}>
            <nav className="flex flex-col gap-2">
              {!isExpertSide ? (
                <>
                  <button onClick={() => handleMobileNavigate('dashboard')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeView === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Dashboard</button>
                  <button onClick={() => handleMobileNavigate('experts')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeView === 'experts' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Experts</button>
                  <button onClick={() => handleMobileNavigate('pricing')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeView === 'pricing' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Pricing</button>
                  <button onClick={() => handleMobileNavigate('integrations')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeView === 'integrations' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Integrations</button>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <button onClick={() => handleMobileNavigate('onboarding')} className="text-left px-4 py-3 rounded-xl font-bold text-sm text-indigo-600 bg-indigo-50">Start Shipping</button>
                  <button onClick={() => handleMobileNavigate('expert-landing')} className="text-left px-4 py-3 rounded-xl font-black text-xs uppercase text-slate-400 hover:text-slate-600">Deliver with ShipIt</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleMobileNavigate('expert-portal')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeView === 'expert-portal' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>Command Center</button>
                  <button className="text-left px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Earnings</button>
                  <div className="h-px bg-slate-800 my-2"></div>
                  <button onClick={() => handleMobileNavigate('landing')} className="text-left px-4 py-3 rounded-xl font-black text-xs uppercase text-slate-500 hover:text-white">Founders App</button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-auto relative">
        {children}
      </main>

      <Footer onNavigate={onNavigate} isExpertSide={isExpertSide} />
    </div>
  );
};
