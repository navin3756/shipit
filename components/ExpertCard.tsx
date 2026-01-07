
import React, { useState } from 'react';
import { Expert, BookingDuration, PLATFORM_COMMISSION_RATE, DURATION_MULTIPLIERS } from '../types';

interface ExpertCardProps {
  expert: Expert;
  onHire: (expert: Expert, duration: BookingDuration) => void;
  onConsult: (expert: Expert, duration: BookingDuration, isFree?: boolean) => void;
  isRecommended?: boolean;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onHire, onConsult, isRecommended }) => {
  const [duration, setDuration] = useState<BookingDuration>('60m');
  const [mode, setMode] = useState<'shipment' | 'consultation'>('shipment');

  // Uber-style Pricing: (Base Fee + (Hourly Rate * Dynamic Multiplier)) * 1.20 Service Fee
  const techSubtotal = expert.baseFee + (expert.hourlyRate * DURATION_MULTIPLIERS[duration]);
  const serviceFee = techSubtotal * PLATFORM_COMMISSION_RATE;
  const totalCost = Math.round(techSubtotal + serviceFee);

  const durationOptions = Object.keys(DURATION_MULTIPLIERS) as BookingDuration[];

  return (
    <div className={`group relative bg-white rounded-[32px] p-6 border-2 transition-all hover:shadow-2xl ${isRecommended ? 'border-indigo-600' : 'border-slate-100 hover:border-indigo-200'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative shrink-0">
          <img src={expert.avatar} alt={expert.name} className="w-16 h-16 rounded-[20px] object-cover ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all" />
          {expert.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-black text-slate-900 truncate flex items-center gap-1">
            {expert.name}
            <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
          </h4>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="text-amber-500">★ {expert.rating}</span>
            <span>•</span>
            <span>{expert.completedJobs} Missions</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-slate-50 p-1.5 rounded-[18px]">
        <button 
          onClick={() => setMode('shipment')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'shipment' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Dev Delivery
        </button>
        <button 
          onClick={() => setMode('consultation')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'consultation' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Consult
        </button>
      </div>

      <div className="bg-slate-50 rounded-[24px] p-4 mb-6">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Duration</label>
        <div className="grid grid-cols-4 gap-1.5">
          {durationOptions.map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`py-2 rounded-xl text-xs font-black transition-all ${
                duration === d ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between opacity-60">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Technician Fare</span>
             <span className="text-xs font-black text-slate-600">${techSubtotal.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between opacity-60">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ShipIt Service (20%)</span>
             <span className="text-xs font-black text-slate-600">${serviceFee.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Shipment Quote</span>
            <span className="text-xl font-black text-indigo-600">${totalCost}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => mode === 'shipment' ? onHire(expert, duration) : onConsult(expert, duration, false)}
        className={`w-full py-4 text-white font-black rounded-[20px] transition-all shadow-xl active:scale-95 text-sm ${mode === 'shipment' ? 'bg-slate-900 hover:bg-indigo-600 shadow-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
      >
        {mode === 'shipment' ? 'Book Delivery Mission' : `Start Consultation (${duration})`}
      </button>
    </div>
  );
};
