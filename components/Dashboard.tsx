
import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, ViewState, Consultation, Artifact, PLATFORM_COMMISSION_RATE } from '../types';
import { ServiceChat } from './ServiceChat';
import { SecretVault } from './SecretVault';
import { DeploymentEngine } from './DeploymentEngine';

interface DashboardProps {
  projects: Project[];
  consultations: Consultation[];
  onFindExpert: (project: Project) => void;
  onSendMessage: (projectId: string, text: string) => void;
  onAddSecret: (projectId: string, key: string, value: string) => void;
  onApproveMilestone: (projectId: string, milestoneId: string) => void;
  onUpdateStatus: (projectId: string, status: ProjectStatus) => void;
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  projects, 
  onFindExpert, 
  onSendMessage, 
  onAddSecret,
  onApproveMilestone,
  onUpdateStatus,
  onNavigate
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'status' | 'chat' | 'artifacts' | 'infrastructure'>('status');
  const [valueDelivered, setValueDelivered] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Production-Grade Value Ticker
  // Uses absolute timestamps to ensure consistency across page reloads.
  useEffect(() => {
    let interval: number;

    const calculateMetrics = () => {
      if (!selectedProject?.liveSessionStart) {
        setElapsedTime(0);
        setValueDelivered(selectedProject?.status === ProjectStatus.DEPLOYED ? (selectedProject.totalBookingCost || 0) : 0);
        return;
      }

      const start = new Date(selectedProject.liveSessionStart).getTime();
      const now = Date.now();
      const secondsElapsed = Math.floor((now - start) / 1000);
      const totalValue = selectedProject.totalBookingCost || 150;
      
      // Calculate linear delivery over a hypothetical 30 min window for visualization
      // In a real app, this would come from the expert logging hours.
      // We cap it at the total value so it doesn't overflow.
      const simulatedDurationSeconds = 1800; // 30 mins
      const percentComplete = Math.min(secondsElapsed / simulatedDurationSeconds, 1);
      
      setElapsedTime(secondsElapsed);
      setValueDelivered(
        selectedProject.status === ProjectStatus.DEPLOYED 
        ? totalValue 
        : totalValue * percentComplete
      );
    };

    if (selectedProject?.status === ProjectStatus.INSTALLING && !isDeploying) {
      calculateMetrics(); // Initial call
      interval = window.setInterval(calculateMetrics, 1000);
    } else {
       // Static view for completed or non-started projects
       calculateMetrics();
    }

    return () => clearInterval(interval);
  }, [selectedProject?.id, selectedProject?.status, selectedProject?.liveSessionStart, isDeploying, selectedProject?.totalBookingCost]);

  const handleDeploymentComplete = (url: string) => {
    if (selectedProject) {
      onUpdateStatus(selectedProject.id, ProjectStatus.DEPLOYED);
      setIsDeploying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-slide-in">
      {projects.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
           <div className="w-32 h-32 bg-slate-100 rounded-[48px] flex items-center justify-center mb-8 shadow-inner">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">No active ventures.</h2>
           <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">Your AI cargo is waiting at the port. Load your first project to begin the last mile delivery.</p>
           <button onClick={() => onNavigate('onboarding')} className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-100 hover:scale-105 transition-all">Start Shipment</button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Project Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Fleet</h3>
              <button onClick={() => onNavigate('onboarding')} className="text-indigo-600 font-black text-lg hover:scale-110 transition-transform">+</button>
            </div>
            <div className="space-y-3">
              {projects.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => { setSelectedProjectId(p.id); setIsDeploying(false); }}
                  className={`p-6 rounded-[32px] cursor-pointer transition-all border-2 relative overflow-hidden group ${selectedProjectId === p.id ? 'bg-white border-indigo-600 shadow-xl' : 'bg-slate-100/50 border-transparent opacity-60 hover:opacity-100 hover:bg-white'}`}
                >
                  {p.status === ProjectStatus.INSTALLING && (
                    <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500 animate-pulse"></div>
                  )}
                  {p.status === ProjectStatus.DEPLOYED && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></div>
                  )}
                  <h4 className="font-black text-slate-900 truncate mb-1">{p.repoName}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-indigo-600">{p.techProfile === 'non-tech-founder' ? 'Managed' : 'Expert Sync'}</span>
                    <span className="text-[9px] font-bold text-slate-400">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Dashboard Area */}
          <div className="lg:col-span-9">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Live Odometer Header */}
                {selectedProject.status === ProjectStatus.INSTALLING && !isDeploying && (
                  <div className="bg-slate-900 text-white rounded-[40px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-indigo-500/30">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-600 rounded-[20px] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(79,70,229,0.5)]">🚢</div>
                        <div>
                           <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Live Delivery Active</div>
                           <h3 className="text-2xl font-black">Mission: {selectedProject.repoName}</h3>
                           <div className="flex items-center gap-4 mt-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Elapsed: {formatTime(elapsedTime)}</span>
                              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">Status: In Transit</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Value Delivered</div>
                        <div className="text-5xl font-black tracking-tighter text-indigo-100 tabular-nums">
                          ${valueDelivered.toFixed(2)}
                        </div>
                        <p className="text-[8px] font-bold text-indigo-400 uppercase mt-2">of ${(selectedProject.totalBookingCost || 0).toFixed(0)} Fixed Quote</p>
                     </div>
                  </div>
                )}

                {/* Automated Deployment View */}
                {isDeploying ? (
                  <DeploymentEngine 
                    repoName={selectedProject.repoName} 
                    stack={selectedProject.blueprint?.stack || 'Next.js'} 
                    description={selectedProject.description} 
                    onComplete={handleDeploymentComplete} 
                  />
                ) : (
                  <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedProject.sourceType} artifact</span>
                            {selectedProject.status === ProjectStatus.DEPLOYED && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest italic flex items-center gap-1">Live on Vercel <div className="w-1 h-1 rounded-full bg-emerald-500"></div></span>}
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{selectedProject.repoName}</h2>
                      </div>
                      <div className="flex bg-slate-50 p-1.5 rounded-[24px] border border-slate-100">
                        <button onClick={() => setActiveTab('status')} className={`px-3 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Status</button>
                        <button onClick={() => setActiveTab('chat')} className={`px-3 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Comm Link</button>
                        <button onClick={() => setActiveTab('infrastructure')} className={`px-3 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'infrastructure' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Hardware</button>
                      </div>
                    </div>

                    {activeTab === 'status' && (
                      <div className="space-y-8 animate-slide-in">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="p-8 bg-slate-900 rounded-[40px] text-white">
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 italic">Delivery Route</div>
                            <div className="space-y-4">
                              {selectedProject.milestones.map((m, idx) => (
                                <div key={m.id} className="flex items-center gap-4 group">
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${m.isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-700 text-slate-600'}`}>
                                    {m.isCompleted ? '✓' : idx + 1}
                                  </div>
                                  <span className={`text-xs font-bold transition-all ${m.isCompleted ? 'text-white' : 'text-slate-500'}`}>{m.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 relative overflow-hidden group">
                                <h4 className="text-[10px] font-black text-indigo-700 uppercase mb-2 tracking-widest">Shipment Readiness</h4>
                                <p className="text-4xl font-black text-indigo-900">{selectedProject.status === ProjectStatus.DEPLOYED ? '100%' : '84%'}</p>
                                <div className="mt-4 h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-indigo-600 transition-all duration-1000 ${selectedProject.status === ProjectStatus.DEPLOYED ? 'w-full' : 'w-[84%]'} rounded-full`}></div>
                                </div>
                              </div>
                              <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 relative overflow-hidden group">
                                <h4 className="text-[10px] font-black text-emerald-700 uppercase mb-2 tracking-widest">Total Value</h4>
                                <p className="text-4xl font-black text-emerald-900">${(selectedProject.totalBookingCost || 0).toFixed(0)}</p>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase mt-4">Escrow Protected</p>
                              </div>
                            </div>
                            
                            {selectedProject.status === ProjectStatus.INSTALLING ? (
                              <div className="p-10 bg-indigo-600 rounded-[40px] text-white flex flex-col items-center text-center shadow-2xl">
                                <h4 className="text-2xl font-black mb-2">Automated Dispatch</h4>
                                <p className="text-indigo-100 text-sm font-medium mb-8">Ready to bypass manual technician work? Trigger our automated GitHub push and Vercel deployment engine.</p>
                                <button 
                                  onClick={() => setIsDeploying(true)}
                                  className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                >
                                  Initiate Auto-Ship to Vercel
                                </button>
                              </div>
                            ) : selectedProject.status === ProjectStatus.DEPLOYED ? (
                              <div className="p-10 bg-emerald-500 rounded-[40px] text-white flex flex-col items-center text-center shadow-2xl">
                                <h4 className="text-2xl font-black mb-2">Shipment Arrived</h4>
                                <p className="text-emerald-100 text-sm font-medium mb-8">Your software artifact is now live in production. View your live application via the link below.</p>
                                <a 
                                  href={`https://${selectedProject.repoName.toLowerCase().replace(/\s+/g, '-')}.vercel.app`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                >
                                  Open Production App
                                </a>
                              </div>
                            ) : !selectedProject.expertId ? (
                              <div className="p-10 bg-indigo-600 rounded-[40px] text-white flex flex-col items-center text-center shadow-2xl">
                                <h4 className="text-2xl font-black mb-2">Technician Required</h4>
                                <p className="text-indigo-100 text-sm font-medium mb-8">Assign a technician to start the meter and move your cargo to production.</p>
                                <button onClick={() => onFindExpert(selectedProject)} className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Assign Dispatcher</button>
                              </div>
                            ) : (
                              <div className="p-8 bg-white border-2 border-slate-100 rounded-[40px] flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center text-2xl font-black">
                                      {selectedProject.expertId[0].toUpperCase()}
                                  </div>
                                  <div>
                                      <h4 className="font-black text-slate-900 text-lg">Mission in Progress</h4>
                                      <p className="text-xs text-slate-500 font-medium">Technician {selectedProject.expertId} is active.</p>
                                  </div>
                                </div>
                                <button onClick={() => setActiveTab('chat')} className="p-4 bg-slate-50 rounded-2xl hover:text-indigo-600 transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'chat' && (
                      <div className="animate-slide-in grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-7">
                            <ServiceChat 
                              messages={selectedProject.messages || []} 
                              onSend={(text) => onSendMessage(selectedProject.id, text)} 
                              expertName={selectedProject.expertId || 'Technician'} 
                            />
                        </div>
                        <div className="md:col-span-5">
                            <SecretVault 
                              items={selectedProject.vault || []} 
                              onAdd={(key, val) => onAddSecret(selectedProject.id, key, val)} 
                            />
                        </div>
                      </div>
                    )}

                    {activeTab === 'infrastructure' && (
                      <div className="animate-slide-in space-y-8">
                        <div className="flex items-center justify-between px-2">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Provisioned Supply Chain</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedProject.blueprint?.infrastructureNeeds.map(need => (
                            <div key={need.id} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex items-start gap-6 group hover:bg-white transition-all">
                              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛠️</div>
                              <div>
                                <h4 className="font-black text-slate-900 text-lg mb-1">{need.label}</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{need.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[48px] bg-slate-50/50 text-slate-300 font-bold p-20 text-center">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">🚢</div>
                 <h4 className="text-xl font-black text-slate-900 mb-2">Select a Shipment</h4>
                 <p className="text-sm text-slate-400 max-w-xs">Select a venture from the sidebar to view logistics.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
