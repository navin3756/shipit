
import React from 'react';
import { Project, PLATFORM_COMMISSION_RATE } from '../types';

interface ExpertPortalDashboardProps {
  openProjects: Project[];
  activeDeliveries: Project[];
  onPickup: (project: Project) => void;
}

export const ExpertPortalDashboard: React.FC<ExpertPortalDashboardProps> = ({ openProjects, activeDeliveries, onPickup }) => {
  // Calculate lifetime earnings from active/completed deliveries
  const totalNetEarnings = activeDeliveries.reduce((sum, p) => sum + (p.technicianFee || 0), 2450);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Command Center</h2>
          <p className="text-slate-400 font-medium italic">Unmanifested Cargo awaiting production deployment.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl border border-slate-800">
             <div className="text-[10px] font-black uppercase text-indigo-400">Net Take-Home</div>
             <div className="text-xl font-black">${totalNetEarnings.toLocaleString()}</div>
             <div className="text-[8px] text-slate-500 mt-1 uppercase font-bold italic">After 20% ShipIt Fee</div>
          </div>
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl border border-indigo-500">
             <div className="text-[10px] font-black uppercase text-indigo-100">Live Missions</div>
             <div className="text-xl font-black">{activeDeliveries.length}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Unmanifested Cargo (Available Jobs)</h3>
           <div className="space-y-4">
             {openProjects.length === 0 ? (
               <div className="text-center py-20 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[48px]">
                  <p className="font-bold italic text-slate-500">No cargo currently in transit. Check back later.</p>
               </div>
             ) : (
               openProjects.map(p => (
                 <div key={p.id} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-[24px] flex items-center justify-center font-black text-2xl shrink-0 group-hover:bg-indigo-600 transition-colors">
                      {p.repoName[0] || 'A'}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="bg-indigo-50 text-indigo-600 text-[8px] font-black px-2 py-0.5 rounded uppercase">{p.blueprint?.stack}</span>
                          <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-2 py-0.5 rounded uppercase">Complexity: {p.blueprint?.technicalDistanceScore} units</span>
                       </div>
                       <h4 className="text-xl font-black text-slate-900 mb-1">{p.repoName}</h4>
                       <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                       <div className="text-2xl font-black text-slate-900">${((p.totalBookingCost || 0) * (1 - PLATFORM_COMMISSION_RATE)).toFixed(2)}</div>
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-4 italic">Your Payout (Net)</p>
                       <button onClick={() => onPickup(p)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-indigo-600 transition-all">Manifest Cargo</button>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mission Log</h3>
          <div className="space-y-3">
             {activeDeliveries.map(p => (
               <div key={p.id} className="p-6 bg-indigo-900 text-white rounded-[32px] shadow-xl relative overflow-hidden group cursor-pointer border border-indigo-800">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-800 rounded-full -mr-12 -mt-12 opacity-50"></div>
                  <h5 className="font-black mb-1 truncate">{p.repoName}</h5>
                  <div className="flex items-center justify-between mt-4">
                     <span className="text-[8px] font-black uppercase text-indigo-300">Net Earn: ${(p.technicianFee || 0).toFixed(0)}</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
               </div>
             ))}
             {activeDeliveries.length === 0 && <p className="text-center text-xs text-slate-500 italic py-10 border border-dashed border-slate-800 rounded-2xl">No active deliveries.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
