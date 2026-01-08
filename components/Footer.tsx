
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
  isExpertSide?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, isExpertSide = false }) => {
  const [systemStatus, setSystemStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulated status check - in production this would poll a status endpoint
  useEffect(() => {
    const checkStatus = () => {
      // Simulate 95% uptime
      const rand = Math.random();
      if (rand > 0.98) setSystemStatus('degraded');
      else if (rand > 0.995) setSystemStatus('outage');
      else setSystemStatus('operational');
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    operational: { color: 'bg-emerald-500', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.6)]', text: 'All Systems Operational' },
    degraded: { color: 'bg-amber-500', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]', text: 'Partial Degradation' },
    outage: { color: 'bg-rose-500', glow: 'shadow-[0_0_8px_rgba(244,63,94,0.6)]', text: 'Service Disruption' }
  };

  const status = statusConfig[systemStatus];

  return (
    <footer className={`border-t transition-colors ${
      isExpertSide 
        ? 'bg-slate-900/95 border-slate-800 text-slate-400' 
        : 'bg-white/95 border-slate-200 text-slate-500'
    } backdrop-blur-sm`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                isExpertSide ? 'bg-indigo-600' : 'bg-slate-900'
              }`}>S</div>
              <span className={`text-2xl font-bold ${isExpertSide ? 'text-white' : 'text-slate-900'}`}>
                ShipIt
              </span>
            </div>
            <p className={`text-sm leading-relaxed mb-6 max-w-xs ${isExpertSide ? 'text-slate-400' : 'text-slate-500'}`}>
              The last-mile logistics platform for AI-generated software. From artifact to production in 48 hours.
            </p>
            
            {/* Social Proof */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                      isExpertSide 
                        ? 'border-slate-900 bg-slate-700 text-slate-300' 
                        : 'border-white bg-gradient-to-br from-indigo-400 to-indigo-600 text-white'
                    }`}
                  >
                    {['JD', 'MK', 'AS', 'RL'][i]}
                  </div>
                ))}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-black ${
                  isExpertSide 
                    ? 'border-slate-900 bg-slate-800 text-indigo-400' 
                    : 'border-white bg-slate-100 text-slate-600'
                }`}>
                  +2k
                </div>
              </div>
              <div className="text-xs">
                <div className={`font-black ${isExpertSide ? 'text-white' : 'text-slate-900'}`}>2,400+ Founders</div>
                <div className={`${isExpertSide ? 'text-slate-500' : 'text-slate-400'}`}>Shipped to production</div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                isExpertSide ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                SOC 2 Type II
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                isExpertSide ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                AES-256 Encrypted
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                isExpertSide ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                GDPR Ready
              </div>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${
              isExpertSide ? 'text-slate-500' : 'text-slate-400'
            }`}>Product</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('how-it-works')} 
                  className={`text-sm font-medium transition-colors ${
                    isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                  }`}
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('pricing')} 
                  className={`text-sm font-medium transition-colors ${
                    isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                  }`}
                >
                  Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('integrations')} 
                  className={`text-sm font-medium transition-colors ${
                    isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                  }`}
                >
                  Integrations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('experts')} 
                  className={`text-sm font-medium transition-colors ${
                    isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                  }`}
                >
                  Expert Network
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${
              isExpertSide ? 'text-slate-500' : 'text-slate-400'
            }`}>Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className={`text-sm font-medium transition-colors ${
                  isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                }`}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm font-medium transition-colors ${
                  isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                }`}>
                  Careers
                </a>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('expert-landing')} 
                  className={`text-sm font-medium transition-colors ${
                    isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                  }`}
                >
                  Become a Technician
                </button>
              </li>
              <li>
                <a href="#" className={`text-sm font-medium transition-colors ${
                  isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                }`}>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${
              isExpertSide ? 'text-slate-500' : 'text-slate-400'
            }`}>Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className={`text-sm font-medium transition-colors ${
                  isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                }`}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm font-medium transition-colors ${
                  isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                }`}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm font-medium transition-colors ${
                  isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                }`}>
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm font-medium transition-colors ${
                  isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                }`}>
                  Security
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm font-medium transition-colors ${
                  isExpertSide ? 'hover:text-white' : 'hover:text-indigo-600'
                }`}>
                  DPA
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${isExpertSide ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className={`text-xs ${isExpertSide ? 'text-slate-500' : 'text-slate-400'}`}>
              © {currentTime.getFullYear()} ShipIt Technologies, Inc. All rights reserved.
            </div>

            {/* System Status Indicator */}
            <div className="flex items-center gap-6">
              <a 
                href="#" 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  isExpertSide 
                    ? 'bg-slate-800 hover:bg-slate-700' 
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${status.color} ${status.glow} animate-pulse`}></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  isExpertSide ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {status.text}
                </span>
              </a>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a 
                  href="#" 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isExpertSide 
                      ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' 
                      : 'bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isExpertSide 
                      ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' 
                      : 'bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isExpertSide 
                      ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' 
                      : 'bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
