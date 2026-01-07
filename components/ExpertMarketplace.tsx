
import React, { useState, useMemo } from 'react';
import { Expert, Project, BookingDuration } from '../types';
import { ExpertCard } from './ExpertCard';

const MOCK_EXPERTS: Expert[] = [
  {
    id: 'e1',
    name: 'Sarah Chen',
    specialty: ['Deployment', 'Vercel', 'Custom Domains'],
    rating: 4.9,
    completedJobs: 142,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128',
    bio: 'The "Get it Live" expert. I help non-tech founders set up Vercel, DNS, and Env variables in under 30 minutes.',
    hourlyRate: 150,
    baseFee: 50,
    isOnline: true,
    responseTime: '5m',
    location: 'Remote',
    freeConsultationAvailable: true,
    providesInfrastructure: true,
    infrastructureCertification: ['Vercel Certified'],
    expertTier: 'Senior Technician'
  },
  {
    id: 'e2',
    name: 'Marcus Thorne',
    specialty: ['Supabase', 'Auth', 'UI Polishing'],
    rating: 5.0,
    completedJobs: 89,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&h=128',
    bio: 'I specialize in fixing the final 20% of AI-generated dashboards. Clean UIs and production databases.',
    hourlyRate: 120,
    baseFee: 75,
    isOnline: true,
    responseTime: '12m',
    location: 'Remote',
    freeConsultationAvailable: true,
    providesInfrastructure: true,
    infrastructureCertification: ['Supabase Expert', 'AWS Architect'],
    expertTier: 'Lead Architect'
  },
  {
    id: 'e3',
    name: 'Elena Rodriguez',
    specialty: ['Security', 'Cloudflare', 'AWS'],
    rating: 4.8,
    completedJobs: 210,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128',
    bio: 'I ensure your AI apps are safe for real users. Hardening headers, firewalls, and production SSL.',
    hourlyRate: 180,
    baseFee: 100,
    isOnline: true,
    responseTime: '1h',
    location: 'Remote',
    freeConsultationAvailable: false,
    providesInfrastructure: false,
    infrastructureCertification: ['Cloudflare Security'],
    expertTier: 'Senior Technician'
  }
];

interface ExpertMarketplaceProps {
  onHire: (expert: Expert, duration: BookingDuration) => void;
  onBookConsultation: (expert: Expert, duration: BookingDuration, isFree?: boolean) => void;
  hiringProject?: Project;
}

export const ExpertMarketplace: React.FC<ExpertMarketplaceProps> = ({ onHire, onBookConsultation, hiringProject }) => {
  const [filter, setFilter] = useState('');
  
  const filteredExperts = useMemo(() => {
    if (!filter) return MOCK_EXPERTS;
    return MOCK_EXPERTS.filter(e => 
      e.name.toLowerCase().includes(filter.toLowerCase()) || 
      e.specialty.some(s => s.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:py-12 md:px-6 animate-slide-in">
      {/* Expectation Management Header */}
      <div className="mb-12 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">AI built it. <br/><span className="text-indigo-600">Humans ship it.</span></h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-6">
              Book a <strong>Shipment Session</strong>. Our experts provide the infrastructure, licenses, and DevOps hours to move your AI artifacts into production. 
              <span className="block mt-2 text-rose-500 text-xs font-black uppercase">Service fee includes escrow and delivery guarantee.</span>
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
             <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Pricing Breakdown</div>
             <ul className="space-y-4">
                <li className="flex gap-3">
                   <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                   <p className="text-xs font-medium text-slate-600"><strong>Base Fee:</strong> Covers server spin-up and repo analysis.</p>
                </li>
                <li className="flex gap-3">
                   <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                   <p className="text-xs font-medium text-slate-600"><strong>Session Rate:</strong> Time spent hands-on in the console.</p>
                </li>
                <li className="flex gap-3">
                   <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                   <p className="text-xs font-medium text-slate-600"><strong>Service Fee:</strong> 20% flat commission for the platform.</p>
                </li>
             </ul>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h3 className="text-2xl font-black text-slate-900">Expert Technicians</h3>
           <p className="text-sm text-slate-500">Find the right guide for your production cargo.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search (Vercel, Supabase, AWS...)" 
            className="w-full md:w-80 pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-[20px] shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredExperts.map((expert) => (
          <ExpertCard 
            key={expert.id} 
            expert={expert} 
            onHire={onHire}
            onConsult={onBookConsultation}
          />
        ))}
      </div>
    </div>
  );
};
