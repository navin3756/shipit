import React, { useState, useRef } from 'react';
import { generateDeploymentBlueprint } from '../services/geminiService';
import { Blueprint, Project, ProjectStatus, CodeSourceType, Artifact, TechProfile } from '../types';
import { GitHubConnector } from './GitHubConnector';

interface BlueprintWizardProps {
  onComplete: (project: Project) => void;
}

export const BlueprintWizard: React.FC<BlueprintWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); 
  const [techProfile, setTechProfile] = useState<TechProfile>('non-tech-founder');
  const [sourceType, setSourceType] = useState<CodeSourceType | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoOwner, setRepoOwner] = useState('');
  const [pastedCode, setPastedCode] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('nextjs');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const inputContent = sourceType === 'github' ? githubUrl : pastedCode;
    const result = await generateDeploymentBlueprint(inputContent, stack, description);
    
    if (techProfile === 'non-tech-founder') {
      result.fare.infrastructureSurcharge = 80;
      result.fare.whiteGloveSurcharge = 45;
      result.fare.total += 125;
      result.infrastructureNeeds = [
        { id: '1', label: 'Pro Managed Hosting', description: 'Expert hosts your app on their production cluster. No AWS account needed.', costEstimate: '$15/mo', isIncluded: true },
        { id: '2', label: 'Development IDE License', description: 'Technician uses their licensed VS Code/PyCharm. You save $200/yr.', costEstimate: '$0', isIncluded: true },
        { id: '3', label: 'Domain & SSL Setup', description: 'One-click routing to your .com address.', costEstimate: '$12/yr', isIncluded: true }
      ];
      result.checklist.unshift("Provision Managed Container", "Generate Production SSL");
    }

    setBlueprint(result);
    setIsAnalyzing(false);
    setStep(2);
  };

  const handleConfirm = () => {
    if (!blueprint) return;
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      sourceType: sourceType || 'not-sure',
      techProfile,
      githubUrl: sourceType === 'github' ? githubUrl : undefined,
      pastedCode: sourceType === 'paste' || sourceType === 'upload' ? pastedCode : undefined,
      repoName: repoName || 'Untitled Shipment',
      repoOwner: repoOwner || 'Client',
      description: description || 'No description provided.',
      status: ProjectStatus.BLUEPRINT_READY,
      blueprint,
      createdAt: new Date().toISOString(),
      activityLogs: [],
      isGitHubConnected: sourceType === 'github',
      messages: [],
      vault: [],
      milestones: [],
      artifacts: [],
      totalBookingCost: blueprint.fare.total
    };
    onComplete(newProject);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {step === 0 && (
        <div className="animate-slide-in space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 italic">Identify your Cargo</h2>
            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">We adjust our delivery tools based on your technical arsenal.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <button 
              onClick={() => { setTechProfile('non-tech-founder'); setStep(1); }}
              className="p-10 bg-white border-2 border-slate-100 rounded-[48px] text-left hover:border-indigo-600 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-[24px] flex items-center justify-center text-2xl font-black mb-6 shadow-xl shadow-indigo-100">💡</div>
              <h3 className="text-2xl font-black mb-2 text-slate-900 tracking-tight">Non-Tech Founder</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">"I have the idea and AI code, but no local dev environment, no AWS, and no deployment skills."</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                <span>Select Persona</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </div>
            </button>
            <button 
              onClick={() => { setTechProfile('solo-dev'); setStep(1); }}
              className="p-10 bg-white border-2 border-slate-100 rounded-[48px] text-left hover:border-indigo-600 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center text-2xl font-black mb-6 shadow-xl shadow-slate-200">⌨️</div>
              <h3 className="text-2xl font-black mb-2 text-slate-900 tracking-tight">Solo Developer</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">"I build the features, but I hate DevOps. I need help pushing my repo live safely and securely."</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                <span>Select Persona</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </div>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8 animate-slide-in">
          <div className="text-center mb-10">
            <button onClick={() => setStep(0)} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 mb-4 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              Back to Personas
            </button>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Manifest your Code</h2>
            <p className="text-slate-500 text-sm font-medium">How should our couriers collect your software cargo?</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <button 
              onClick={() => setSourceType('github')} 
              className={`p-6 bg-white border-2 rounded-[32px] text-left transition-all group ${sourceType === 'github' ? 'border-indigo-600 shadow-xl' : 'border-slate-100 hover:border-indigo-200'}`}
             >
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </div>
                <h3 className="font-black text-sm text-slate-900 mb-1">GitHub</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sync Repo</p>
             </button>

             <button 
              onClick={() => setSourceType('paste')} 
              className={`p-6 bg-white border-2 rounded-[32px] text-left transition-all group ${sourceType === 'paste' ? 'border-indigo-600 shadow-xl' : 'border-slate-100 hover:border-indigo-200'}`}
             >
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <h3 className="font-black text-sm text-slate-900 mb-1">Paste</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Raw Artifact</p>
             </button>

             <button 
              onClick={() => setSourceType('upload')} 
              className={`p-6 bg-white border-2 rounded-[32px] text-left transition-all group ${sourceType === 'upload' ? 'border-indigo-600 shadow-xl' : 'border-slate-100 hover:border-indigo-200'}`}
             >
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                </div>
                <h3 className="font-black text-sm text-slate-900 mb-1">Upload</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Zip/Source</p>
             </button>

             <button 
              onClick={() => setSourceType('ai-sync')} 
              className={`p-6 bg-white border-2 rounded-[32px] text-left transition-all group ${sourceType === 'ai-sync' ? 'border-indigo-600 shadow-xl' : 'border-slate-100 hover:border-indigo-200'}`}
             >
                <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 className="font-black text-sm text-slate-900 mb-1">AI Sync</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Chat Link</p>
             </button>
          </div>

          <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-xl space-y-8 min-h-[400px]">
            {sourceType === 'github' && (
              <div className="animate-slide-in">
                <GitHubConnector 
                  selectedRepoName={repoName}
                  onSelect={(repo) => {
                    setRepoName(repo.name);
                    setRepoOwner(repo.full_name.split('/')[0]);
                    setGithubUrl(`https://github.com/${repo.full_name}`);
                  }} 
                />
              </div>
            )}

            {sourceType === 'paste' && (
              <div className="animate-slide-in space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400">Pasted Artifact Content</label>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Detection Active</span>
                </div>
                <textarea 
                  rows={8}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[24px] font-mono text-xs focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  placeholder="// Paste your Gemini/ChatGPT code block here..."
                  value={pastedCode}
                  onChange={(e) => setPastedCode(e.target.value)}
                />
              </div>
            )}

            {sourceType === 'upload' && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="animate-slide-in h-64 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all bg-slate-50/50"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => setUploadedFileName(e.target.files?.[0]?.name || null)} 
                />
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                </div>
                <h4 className="font-black text-slate-900">{uploadedFileName || 'Drop source files here'}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1">Accepts .zip, .tar, .js, .py, .ts</p>
              </div>
            )}

            {sourceType === 'ai-sync' && (
              <div className="animate-slide-in space-y-6 flex flex-col items-center justify-center h-64 text-center">
                 <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                    <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>
                 </div>
                 <h4 className="font-black text-slate-900">AI Sync is in Preview</h4>
                 <p className="text-sm text-slate-500 max-w-xs font-medium">Connect your OpenAI/Google account to instantly pull code artifacts from your recent chats.</p>
                 <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">Authenticate with Gemini</button>
              </div>
            )}

            {!sourceType && (
              <div className="h-64 flex flex-col items-center justify-center opacity-30">
                <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="font-bold">Select a source to begin loading.</p>
              </div>
            )}

            {sourceType && (
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-6 animate-slide-in">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Shipment Description</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                    placeholder="e.g. A SaaS landing page with Stripe integration..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || (!githubUrl && !pastedCode && !uploadedFileName)}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Calculating Logistics...
                    </>
                  ) : 'Calculate Managed Fare'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && blueprint && (
        <div className="animate-slide-in space-y-8">
           <div className="bg-slate-900 rounded-[48px] p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl"></div>
              <div className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-[0.2em]">Total Shipment Quote</div>
              <div className="text-7xl font-black tracking-tighter mb-4">${blueprint.fare.total.toFixed(2)}</div>
              <div className="p-5 bg-white/5 rounded-[24px] border border-white/10 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl shadow-lg">🚀</div>
                 <div>
                    <p className="text-xs text-indigo-200 font-bold mb-0.5">Includes End-to-End Delivery</p>
                    <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-widest">Managed Cloud + Expert Technician + Escalation Support</p>
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              {blueprint.infrastructureNeeds.map(need => (
                <div key={need.id} className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">🛠️</div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">Pro-Managed</span>
                   </div>
                   <h4 className="text-lg font-black text-slate-900 mb-2">{need.label}</h4>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{need.description}</p>
                   <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Operating Fee</span>
                     <span className="text-xs font-black text-indigo-600">{need.costEstimate}</span>
                   </div>
                </div>
              ))}
           </div>

           <button onClick={handleConfirm} className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl hover:bg-indigo-600 transition-all shadow-xl active:scale-95">Match Delivery Specialist</button>
        </div>
      )}
    </div>
  );
};
