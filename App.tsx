
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { BlueprintWizard } from './components/BlueprintWizard';
import { Dashboard } from './components/Dashboard';
import { ExpertMarketplace } from './components/ExpertMarketplace';
import { ExpertPortalLanding } from './components/ExpertPortalLanding';
import { ExpertOnboarding } from './components/ExpertOnboarding';
import { ExpertPortalDashboard } from './components/ExpertPortalDashboard';
import { IntegrationHub } from './components/IntegrationHub';
import { Pricing } from './Pricing';
import { HowItWorks } from './HowItWorks';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { 
  ViewState, Project, Expert, ProjectStatus, 
  BookingDuration, PLATFORM_COMMISSION_RATE, DURATION_MULTIPLIERS, ShipmentTier, Message, VaultItem
} from './types';

// Utility to map DB snake_case to UI camelCase
const mapProjectFromDb = (dbProject: any): Project => ({
  id: dbProject.id,
  sourceType: dbProject.source_type,
  techProfile: dbProject.tech_profile,
  repoName: dbProject.repo_name,
  repoOwner: dbProject.repo_owner,
  description: dbProject.description,
  status: dbProject.status,
  blueprint: dbProject.blueprint,
  expertId: dbProject.expert_id,
  createdAt: dbProject.created_at,
  milestones: dbProject.milestones || [],
  vault: dbProject.vault || [],
  artifacts: dbProject.artifacts || [],
  totalBookingCost: dbProject.total_booking_cost,
  platformFee: dbProject.platform_fee,
  technicianFee: dbProject.technician_fee,
  isGitHubConnected: Boolean(dbProject.repo_owner),
  liveSessionStart: dbProject.live_session_start,
  activityLogs: [],
  messages: dbProject.messages || []
});

const mapProjectToDb = (p: Project) => ({
  id: p.id,
  source_type: p.sourceType,
  tech_profile: p.techProfile,
  repo_name: p.repoName,
  repo_owner: p.repoOwner,
  description: p.description,
  status: p.status,
  blueprint: p.blueprint,
  expert_id: p.expertId,
  milestones: p.milestones,
  vault: p.vault,
  artifacts: p.artifacts,
  total_booking_cost: p.totalBookingCost,
  platform_fee: p.platformFee,
  technician_fee: p.technicianFee,
  live_session_start: p.liveSessionStart,
  messages: p.messages
});

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('landing');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hiringForProject, setHiringForProject] = useState<Project | undefined>();
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('public:projects')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
          fetchProjects(); 
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const fetchProjects = async () => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('shipit_projects');
      if (saved) setProjects(JSON.parse(saved));
      return;
    }

    setIsSyncing(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error.message);
      const saved = localStorage.getItem('shipit_projects');
      if (saved) setProjects(JSON.parse(saved));
    } else if (data) {
      setProjects(data.map(mapProjectFromDb));
    }
    setIsSyncing(false);
  };

  // Generic helper to update a project in State + DB + LocalStorage
  const updateProjectState = async (updatedProject: Project) => {
    // 1. Optimistic UI update
    const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    localStorage.setItem('shipit_projects', JSON.stringify(updatedProjects));

    // 2. DB Sync
    if (isSupabaseConfigured) {
      setIsSyncing(true);
      const { error } = await supabase
        .from('projects')
        .update(mapProjectToDb(updatedProject))
        .eq('id', updatedProject.id);
      
      if (error) console.error("Sync error:", error);
      setIsSyncing(false);
    }
  };

  const handleProjectCreate = async (project: Project) => {
    setIsSyncing(true);
    const projectWithMilestones: Project = {
      ...project,
      milestones: [
        { id: 'm1', label: 'Pick up code from source', isCompleted: true, isApproved: false },
        { id: 'm2', label: 'Database & Backend connection', isCompleted: false, isApproved: false },
        { id: 'm3', label: 'Routing to Production Domain', isCompleted: false, isApproved: false },
        { id: 'm4', label: 'Handover Live Credentials', isCompleted: false, isApproved: false }
      ]
    };

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('projects')
        .insert([mapProjectToDb(projectWithMilestones)]);
      if (!error) await fetchProjects();
    } else {
      const updated = [projectWithMilestones, ...projects];
      setProjects(updated);
      localStorage.setItem('shipit_projects', JSON.stringify(updated));
    }
    
    setActiveView('dashboard');
    setIsSyncing(false);
  };

  const handleHireExpert = async (expert: Expert, duration: BookingDuration) => {
    if (!hiringForProject) return;

    const multiplier = DURATION_MULTIPLIERS[duration] || 1;
    const techSubtotal = expert.baseFee + (expert.hourlyRate * multiplier);
    const platformFee = techSubtotal * PLATFORM_COMMISSION_RATE;
    const totalCost = Math.round(techSubtotal + platformFee);

    const updatedProject: Project = {
      ...hiringForProject,
      expertId: expert.id,
      status: ProjectStatus.INSTALLING,
      totalBookingCost: totalCost,
      platformFee,
      technicianFee: techSubtotal,
      liveSessionStart: new Date().toISOString()
    };

    await updateProjectState(updatedProject);
    
    setHiringForProject(undefined);
    setActiveView('dashboard');
  };

  const handleUpdateStatus = async (projectId: string, status: ProjectStatus) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    await updateProjectState({ ...project, status });
  };

  const handleApproveMilestone = async (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const updatedMilestones = project.milestones.map(m => m.id === milestoneId ? { ...m, isApproved: true } : m);
    const allApproved = updatedMilestones.every(m => m.isApproved);
    const newStatus = allApproved ? ProjectStatus.DEPLOYED : project.status;

    await updateProjectState({ ...project, milestones: updatedMilestones, status: newStatus });
  };

  const handleSendMessage = async (projectId: string, text: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const updatedProject = {
      ...project,
      messages: [...(project.messages || []), newMessage]
    };

    await updateProjectState(updatedProject);

    // Simulate "Real-Time" Expert Reply
    setTimeout(async () => {
      const expertReply: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'expert',
        text: project.expertId 
          ? "I'm checking the logs now. Deployment pipelines look stable, just waiting for the SSL certificate to propagate."
          : "Thanks for the message. Please assign a technician from the 'Experts' tab so we can begin the handover.",
        timestamp: new Date().toISOString()
      };
      
      // Need to re-fetch latest state in case user typed more, but for simplicity we assume sequential
      // In a real app, we'd append to the DB directly.
      const currentProjectState = projects.find(p => p.id === projectId) || updatedProject;
      const projectWithReply = {
        ...currentProjectState,
        messages: [...(currentProjectState.messages || []), expertReply]
      };
      await updateProjectState(projectWithReply);
    }, 2500);
  };

  const handleAddSecret = async (projectId: string, key: string, value: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newSecret: VaultItem = {
      id: Math.random().toString(36).substr(2, 9),
      key,
      value, // Value is already encrypted by the SecretVault component
      isRevealed: false
    };

    const updatedProject = {
      ...project,
      vault: [...(project.vault || []), newSecret]
    };

    await updateProjectState(updatedProject);
  };

  const handleSelectPlan = async (tier: ShipmentTier) => {
    // If we have a project currently in draft/blueprint, upgrade it
    // If not, go to onboarding to start one
    const activeProject = projects[0]; // Simplification for demo
    
    if (activeProject && activeProject.status !== ProjectStatus.DEPLOYED) {
      if (activeProject.blueprint) {
         const updatedProject = {
            ...activeProject,
            blueprint: {
               ...activeProject.blueprint,
               shipmentTier: tier
            }
         };
         await updateProjectState(updatedProject);
      }
      setActiveView('dashboard');
    } else {
      setActiveView('onboarding');
    }
  };

  const handlePickupCargo = async (project: Project) => {
    const technicianId = 'technician_01';
    const timestamp = new Date().toISOString();
    
    const updatedProject = { 
      ...project, 
      expertId: technicianId, 
      status: ProjectStatus.INSTALLING,
      liveSessionStart: timestamp 
    };

    await updateProjectState(updatedProject);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'landing': 
        return <Hero 
          onStart={() => setActiveView('onboarding')} 
          onExplore={() => setActiveView('how-it-works')} 
        />;
      case 'onboarding': return <BlueprintWizard onComplete={handleProjectCreate} />;
      case 'dashboard': 
        return <Dashboard 
          projects={projects} 
          consultations={[]} 
          onFindExpert={(p) => { setHiringForProject(p); setActiveView('experts'); }} 
          onSendMessage={handleSendMessage} 
          onAddSecret={handleAddSecret} 
          onApproveMilestone={handleApproveMilestone} 
          onUpdateStatus={handleUpdateStatus} 
          onNavigate={setActiveView} 
        />;
      case 'experts': return <ExpertMarketplace onHire={handleHireExpert} onBookConsultation={() => {}} hiringProject={hiringForProject} />;
      case 'pricing': return <Pricing onSelectPlan={handleSelectPlan} />;
      case 'integrations': return <IntegrationHub />;
      case 'how-it-works': return <HowItWorks onStart={() => setActiveView('onboarding')} />;
      case 'expert-landing': return <ExpertPortalLanding onJoin={() => setActiveView('expert-onboarding')} />;
      case 'expert-onboarding': return <ExpertOnboarding onComplete={() => setActiveView('expert-portal')} />;
      case 'expert-portal': 
        return <ExpertPortalDashboard 
          openProjects={projects.filter(p => !p.expertId)} 
          activeDeliveries={projects.filter(p => p.expertId === 'technician_01')} 
          onPickup={handlePickupCargo} 
        />;
      default: return <Hero onStart={() => setActiveView('onboarding')} onExplore={() => setActiveView('how-it-works')} />;
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      <div className="fixed top-20 right-8 z-[60] flex flex-col gap-2 items-end">
        {isSyncing && (
          <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syncing PostgreSQL</span>
          </div>
        )}
      </div>
      {renderContent()}
    </Layout>
  );
};

export default App;
