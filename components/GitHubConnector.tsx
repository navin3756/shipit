import React, { useState } from 'react';

interface Repo {
  name: string;
  full_name: string;
  description: string;
  language: string;
}

interface GitHubConnectorProps {
  onSelect: (repo: Repo) => void;
  selectedRepoName?: string;
}

export const GitHubConnector: React.FC<GitHubConnectorProps> = ({ onSelect, selectedRepoName }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const mockRepos: Repo[] = [
    { name: 'ai-saas-starter', full_name: 'john-doe/ai-saas-starter', description: 'Next.js + OpenAI boilerplate', language: 'TypeScript' },
    { name: 'python-backend-api', full_name: 'john-doe/python-backend-api', description: 'FastAPI microservice for AI processing', language: 'Python' },
    { name: 'chatgpt-clone', full_name: 'john-doe/chatgpt-clone', description: 'Simple UI for LLM interactions', language: 'JavaScript' },
  ];

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate OAuth delay
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500);
  };

  if (!isConnected) {
    return (
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-300 transition-colors bg-slate-50">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </div>
        <h4 className="font-bold text-slate-900 mb-2">Connect your GitHub</h4>
        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">ShipIt requests read-only access to analyze your AI-generated code and build your deployment plan.</p>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all active:scale-95 disabled:opacity-50"
        >
          {isConnecting ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Connect via GitHub App'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-bold text-emerald-800">GitHub Connected (john-doe)</span>
        </div>
        <button onClick={() => setIsConnected(false)} className="text-xs text-slate-400 hover:text-slate-600">Disconnect</button>
      </div>

      <div className="grid gap-3">
        {mockRepos.map((repo) => (
          <button
            key={repo.full_name}
            onClick={() => onSelect(repo)}
            className={`flex items-center justify-between p-4 border rounded-xl transition-all text-left ${
              selectedRepoName === repo.name
              ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
              : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <h5 className="font-bold text-slate-900">{repo.name}</h5>
              <p className="text-xs text-slate-500">{repo.description}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded text-slate-500">
              {repo.language}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
