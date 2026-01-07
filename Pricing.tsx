
import React from 'react';
import { ShipmentTier } from './types';

interface PricingProps {
  onSelectPlan?: (tier: ShipmentTier) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const handleSelect = (tier: ShipmentTier) => {
    if (onSelectPlan) {
      onSelectPlan(tier);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 animate-slide-in">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Transparent "Fare" Pricing</h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Just like a delivery app, we calculate your fare based on complexity, distance, and infrastructure needs.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-10 bg-white border border-slate-100 rounded-[48px] shadow-sm hover:shadow-2xl transition-all border-t-8 border-t-indigo-500">
          <h3 className="text-2xl font-black mb-2">Basic Shipment</h3>
          <p className="text-slate-500 mb-8 font-medium">Perfect for simple frontends or landing pages.</p>
          <div className="text-4xl font-black mb-10">$50 <span className="text-sm font-bold text-slate-400">starting fare</span></div>
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-indigo-600">✓</span> Vercel/Netlify Setup</li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-indigo-600">✓</span> Custom Domain</li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-indigo-600">✓</span> Basic Env Config</li>
          </ul>
          <button onClick={() => handleSelect('basic')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-colors">Book Shipment</button>
        </div>

        <div className="p-10 bg-indigo-600 text-white rounded-[48px] shadow-2xl relative overflow-hidden transform scale-105">
          <div className="absolute top-0 right-0 p-4 bg-white/20 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest">Most Popular</div>
          <h3 className="text-2xl font-black mb-2">Pro Delivery</h3>
          <p className="text-indigo-100 mb-8 font-medium">Full-stack apps with DB and Auth.</p>
          <div className="text-4xl font-black mb-10">$150 <span className="text-sm font-bold text-indigo-300">starting fare</span></div>
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-sm font-bold text-indigo-100"><span>✓</span> Everything in Basic</li>
            <li className="flex items-center gap-3 text-sm font-bold text-indigo-100"><span>✓</span> Supabase/Firebase Link</li>
            <li className="flex items-center gap-3 text-sm font-bold text-indigo-100"><span>✓</span> API Integration</li>
            <li className="flex items-center gap-3 text-sm font-bold text-indigo-100"><span>✓</span> Security Audit</li>
          </ul>
          <button onClick={() => handleSelect('pro')} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-colors">Book Shipment</button>
        </div>

        <div className="p-10 bg-white border border-slate-100 rounded-[48px] shadow-sm hover:shadow-2xl transition-all border-t-8 border-t-slate-900">
          <h3 className="text-2xl font-black mb-2">Enterprise Log</h3>
          <p className="text-slate-500 mb-8 font-medium">Complex architecture and custom infra.</p>
          <div className="text-4xl font-black mb-10">$500 <span className="text-sm font-bold text-slate-400">starting fare</span></div>
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-indigo-600">✓</span> Dedicated Cluster</li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-indigo-600">✓</span> 24/7 Monitoring</li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><span className="text-indigo-600">✓</span> White-Glove Handover</li>
          </ul>
          <button onClick={() => handleSelect('enterprise')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-colors">Contact Us</button>
        </div>
      </div>
      
      <div className="mt-20 text-center">
         <p className="text-sm font-black text-slate-400 uppercase tracking-widest">A 20% flat service fee is applied to all technician fares.</p>
      </div>
    </div>
  );
};
