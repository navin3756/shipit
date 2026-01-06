
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { BlueprintWizard } from './components/BlueprintWizard';
import { Dashboard } from './components/Dashboard';
import { ExpertMarketplace } from './components/ExpertMarketplace';
import { ExpertPortalLanding } from './components/ExpertPortalLanding';
import { ExpertOnboarding } from './components/ExpertOnboarding';
import { ExpertPortalDashboard } from './components/ExpertPortalDashboard';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { 
  ViewState, Project, Expert, ProjectStatus, 
  BookingDuration, PLATFORM_COMMISSION_RATE, DURATION_MULTIPLIERS 
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
  activityLogs: [],
  messages: []
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
  technician_fee: p.technicianFee
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
    setIsSyncing(true);

    const multiplier = DURATION_MULTIPLIERS[duration] || 1;
    const techSubtotal = expert.baseFee + (expert.hourlyRate * multiplier);
    const platformFee = techSubtotal * PLATFORM_COMMISSION_RATE;
    const totalCost = techSubtotal + platformFee;

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('projects')
        .update({ 
          expert_id: expert.id, 
          status: ProjectStatus.INSTALLING,
          total_booking_cost: totalCost,
          platform_fee: platformFee,
          technician_fee: techSubtotal
        })
        .eq('id', hiringForProject.id);

      if (error) console.error(error.message);
      await fetchProjects();
    } else {
      const updated = projects.map(p => p.id === hiringForProject.id ? { 
        ...p, 
        expertId: expert.id, 
        status: ProjectStatus.INSTALLING,
        totalBookingCost: totalCost,
        platformFee,
        technicianFee: techSubtotal
      } : p);
      setProjects(updated);
      localStorage.setItem('shipit_projects', JSON.stringify(updated));
    }
    
    setHiringForProject(undefined);
    setActiveView('dashboard');
    setIsSyncing(false);
  };

  const handlePickupCargo = async (project: Project) => {
    setIsSyncing(true);
    const technicianId = 'technician_01';

    if (isSupabaseConfigured) {
      await supabase.from('projects').update({ expert_id: technicianId, status: ProjectStatus.INSTALLING }).eq('id', project.id);
      await fetchProjects();
    } else {
      const updated = projects.map(p => p.id === project.id ? { ...p, expertId: technicianId, status: ProjectStatus.INSTALLING } : p);
      setProjects(updated);
      localStorage.setItem('shipit_projects', JSON.stringify(updated));
    }
    setIsSyncing(false);
  };

  const handleApproveMilestone = async (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const updatedMilestones = project.milestones.map(m => m.id === milestoneId ? { ...m, isApproved: true } : m);
    const allApproved = updatedMilestones.every(m => m.isApproved);
    const newStatus = allApproved ? ProjectStatus.DEPLOYED : project.status;

    if (isSupabaseConfigured) {
      await supabase.from('projects').update({ milestones: updatedMilestones, status: newStatus }).eq('id', projectId);
      await fetchProjects();
    } else {
      const updated = projects.map(p => p.id === projectId ? { ...p, milestones: updatedMilestones, status: newStatus } : p);
      setProjects(updated);
      localStorage.setItem('shipit_projects', JSON.stringify(updated));
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'landing': return <Hero onStart={() => setActiveView('onboarding')} onExplore={() => setActiveView('experts')} />;
      case 'onboarding': return <BlueprintWizard onComplete={handleProjectCreate} />;
      case 'dashboard': return <Dashboard projects={projects} consultations={[]} onFindExpert={(p) => { setHiringForProject(p); setActiveView('experts'); }} onSendMessage={() => {}} onAddSecret={() => {}} onApproveMilestone={handleApproveMilestone} onUpdateStatus={handleUpdateStatus} onNavigate={setActiveView} />;
      case 'experts': return <ExpertMarketplace onHire={handleHireExpert} onBookConsultation={() => {}} hiringProject={hiringForProject} />;
      case 'expert-landing': return <ExpertPortalLanding onJoin={() => setActiveView('expert-onboarding')} />;
      case 'expert-onboarding': return <ExpertOnboarding onComplete={() => setActiveView('expert-portal')} />;
      case 'expert-portal': 
        return <ExpertPortalDashboard 
          openProjects={projects.filter(p => !p.expertId)} 
          activeDeliveries={projects.filter(p => p.expertId === 'technician_01')} 
          onPickup={handlePickupCargo} 
        />;
      default: return <Hero onStart={() => setActiveView('onboarding')} onExplore={() => setActiveView('experts')} />;
    }
  };

  // Helper for dashboard to update local state (if using localStorage flow)
  const handleUpdateStatus = async (projectId: string, status: ProjectStatus) => {
     setIsSyncing(true);
     if (isSupabaseConfigured) {
       await supabase.from('projects').update({ status }).eq('id', projectId);
       await fetchProjects();
     } else {
       const updated = projects.map(p => p.id === projectId ? { ...p, status } : p);
       setProjects(updated);
       localStorage.setItem('shipit_projects', JSON.stringify(updated));
     }
     setIsSyncing(false);
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
