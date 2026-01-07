
import React, { useState } from 'react';
import { Expert, PLATFORM_COMMISSION_RATE } from '../types';

interface ExpertOnboardingProps {
  onComplete: (expert: Partial<Expert>) => void;
}

export const ExpertOnboarding: React.FC<ExpertOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    specialties: [] as string[],
    infrastructure: [] as string[],
    hourlyRate: 120,
    baseFee: 40,
    bio: ''
  });

  const specs = ['Next.js', 'React', 'Python', 'Go', 'AWS', 'Vercel', 'Supabase', 'Docker', 'Kubernetes', 'Auth0', 'Stripe'];
  const infra = [
    'Managed Production Hosting',
    'Enterprise IDE Licensing (VS Code/JetBrains)',
    'Custom CI/CD Pipelines',
    'Production SSL/DNS Management',
    'Database Cluster Provisioning',
    'Zero-Trust Security Shield'
  ];

  const toggleItem = (list: string[], item: string, key: 'specialties' | 'infrastructure') => {
    const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    setFormData({ ...formData, [key]: newList });
  };

  const calculatedEarnings = {
    gross: formData.baseFee + formData.hourlyRate,
    commission: (formData.baseFee + formData.hourlyRate) * PLATFORM_COMMISSION_RATE,
    net: (formData.baseFee + formData.hourlyRate) * (1 - PLATFORM_COMMISSION_RATE)
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <div className="mb-12 text-center">
        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Onboarding Step {step}/3</div>
        <h2 className="text-4xl font-black text-white tracking-tighter">Certify your Arsenal</h2>
      </div>

      <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100 text-slate-900">
        {step === 1 && (
          <div className="animate-slide-in space-y-8">
            <div>
              <label className="block text-sm font-black mb-4 text-slate-900">Your Name / Handle</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                placeholder="Technician X"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-black mb-4 text-slate-900">Deployment Specialties</label>
              <div className="flex flex-wrap gap-2">
                {specs.map(s => (
                  <button 
                    key={s} 
                    onClick={() => toggleItem(formData.specialties, s, 'specialties')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${formData.specialties.includes(s) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg">Next: Hardware/Software Offering</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-in space-y-8">
            <div>
              <label className="block text-sm font-black mb-2 text-slate-900">The "Founder's Gap" Offering</label>
              <p className="text-xs text-slate-500 mb-6 italic">Which tools do you provide for the non-technical customer?</p>
              <div className="grid gap-3">
                {infra.map(i => (
                  <button 
                    key={i} 
                    onClick={() => toggleItem(formData.infrastructure, i, 'infrastructure')}
                    className={`flex items-center gap-4 p-5 rounded-2xl text-left transition-all border-2 ${formData.infrastructure.includes(i) ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-slate-50 opacity-60'}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.infrastructure.includes(i) ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-white'}`}>
                      {formData.infrastructure.includes(i) ? '✓' : ''}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{i}</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(3)} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg">Next: Business Model</button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-in space-y-8">
            <div className="p-8 bg-slate-900 rounded-[32px] text-white mb-8">
              <div className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-widest text-center">Earnings Transparency (1h Session)</div>
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Technician Base Fee</label>
                   <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-xl"
                      value={formData.baseFee}
                      onChange={e => setFormData({ ...formData, baseFee: parseInt(e.target.value) || 0 })}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Technician Hourly</label>
                   <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-xl"
                      value={formData.hourlyRate}
                      onChange={e => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
                   />
                </div>
              </div>
              <div className="space-y-3 border-t border-white/10 pt-6">
                 <div className="flex justify-between items-center text-sm font-medium">
                   <span className="text-slate-400">Shipment Subtotal</span>
                   <span>${calculatedEarnings.gross.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-medium">
                   <span className="text-rose-400">ShipIt Commission (20%)</span>
                   <span>-${calculatedEarnings.commission.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-white/5">
                   <span className="text-emerald-400 font-black">Your Net Take Home</span>
                   <span className="text-2xl font-black">${calculatedEarnings.net.toFixed(2)}</span>
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black mb-4 text-slate-900">Brief Bio for Founders</label>
              <textarea 
                rows={4}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                placeholder="I am the last mile specialist for Python backends..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            <button 
              onClick={() => onComplete(formData)} 
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl"
            >
              Request Technician License
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
