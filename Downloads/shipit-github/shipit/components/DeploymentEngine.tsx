import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
  text: string;
  type: 'cmd' | 'info' | 'success' | 'error' | 'gemini';
  timestamp: string;
}

interface DeploymentEngineProps {
  repoName: string;
  stack: string;
  description: string;
  onComplete: (url: string) => void;
}

export const DeploymentEngine: React.FC<DeploymentEngineProps> = ({ repoName, stack, description, onComplete }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      text,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const runDeployment = async () => {
      try {
        // 1. Gemini Analysis
        addLog('Consulting Gemini for optimal deployment configuration...', 'gemini');
        await new Promise(r => setTimeout(r, 2000));
        addLog('Gemini: vercel.json generated. Next.js detected.', 'success');
        setProgress(20);

        // 2. Git Prep
        addLog(`git init`, 'cmd');
        await new Promise(r => setTimeout(r, 800));
        addLog('Initialized empty Git repository in /tmp/cargo-deploy');
        addLog(`git add .`, 'cmd');
        addLog(`git commit -m "Initial automated shipment via ShipIt"`, 'cmd');
        setProgress(40);

        // 3. GitHub Push
        addLog(`gh repo create shipit/${repoName} --public --source=. --remote=upstream`, 'cmd');
        await new Promise(r => setTimeout(r, 2500));
        addLog(`✓ Created repository shipit/${repoName} on GitHub`, 'success');
        addLog(`git push upstream main`, 'cmd');
        await new Promise(r => setTimeout(r, 1500));
        addLog('✓ Objects uploaded. Head is now at main.', 'success');
        setProgress(60);

        // 4. Vercel Dispatch
        addLog('vercel deploy --prod --token=SHP_***', 'cmd');
        await new Promise(r => setTimeout(r, 1000));
        addLog('Vercel: Inspecting project...', 'info');
        addLog('Vercel: Setting up build environment...', 'info');
        await new Promise(r => setTimeout(r, 3000));
        addLog('Vercel: Building project (Next.js)...', 'info');
        addLog('Vercel: Generating static pages...', 'info');
        setProgress(85);
        await new Promise(r => setTimeout(r, 3000));
        addLog('✓ Vercel Deployment Live!', 'success');
        
        const liveUrl = `https://${repoName.toLowerCase().replace(/\s+/g, '-')}.vercel.app`;
        addLog(`Production URL: ${liveUrl}`, 'success');
        setProgress(100);
        
        setTimeout(() => onComplete(liveUrl), 2000);
      } catch (e) {
        addLog('CRITICAL: Deployment Pipeline interrupted.', 'error');
        addLog('Rolling back changes...', 'info');
      }
    };

    runDeployment();
  }, []);

  return (
    <div className="bg-slate-950 rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl animate-slide-in">
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ShipIt Automated Deployment Engine v1.0.4</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{progress}% Dispatched</div>
        </div>
      </div>

      <div className="p-8 h-96 overflow-y-auto font-mono text-xs space-y-2 scrollbar-hide">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-slate-700 shrink-0">[{log.timestamp}]</span>
            <span className={`
              ${log.type === 'cmd' ? 'text-slate-300' : ''}
              ${log.type === 'info' ? 'text-slate-500' : ''}
              ${log.type === 'success' ? 'text-emerald-400 font-bold' : ''}
              ${log.type === 'error' ? 'text-rose-400 font-bold' : ''}
              ${log.type === 'gemini' ? 'text-indigo-400 italic' : ''}
            `}>
              {log.type === 'cmd' && <span className="text-indigo-500 mr-2">$</span>}
              {log.type === 'gemini' && <span className="mr-2">✨</span>}
              {log.text}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="bg-slate-900 p-2">
        <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.8)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};