import React, { useState } from 'react';
import { SAVINGS_CHART_DATA } from '../../data/mockData';
import { TrendingUp, Sparkles, DollarSign, Layers } from 'lucide-react';

export const IsometricBarChart3D: React.FC = () => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const maxVal = Math.max(...SAVINGS_CHART_DATA.map((d) => Math.max(d.savedBySurplus, d.recoveredOffload)));

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 p-6 sm:p-8 shadow-spatial overflow-hidden space-y-6">
      {/* Background Ambient Mesh Light */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-mono text-[10px] font-bold uppercase mb-1">
            <Layers className="w-3 h-3 text-teal-600" />
            3D SPATIAL VALUE VISUALIZER
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-700" />
            Capital Conserved vs. Capital Recovered (5-Month 3D Pillars)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Volumetric comparison of capital saved through surplus procurement vs. revenue recovered from near-expiry inventory.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-teal-600 shadow-xs" />
            <span className="text-slate-700 font-semibold">Surplus Savings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-400 shadow-xs" />
            <span className="text-slate-700 font-semibold">Offload Recovery</span>
          </div>
        </div>
      </div>

      {/* 3D Isometric Stage */}
      <div className="relative z-10 pt-6 pb-2">
        <div className="grid grid-cols-5 gap-4 sm:gap-8 items-end h-72 px-4 border-b border-slate-200">
          {SAVINGS_CHART_DATA.map((item) => {
            const isHovered = hoveredMonth === item.month;
            const heightSavedPct = Math.max(12, Math.round((item.savedBySurplus / maxVal) * 100));
            const heightRecoveredPct = Math.max(10, Math.round((item.recoveredOffload / maxVal) * 100));

            return (
              <div
                key={item.month}
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
                className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Floating Holographic Metric Pill (hover or active) */}
                <div
                  className={`absolute -top-16 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-none ${
                    isHovered ? 'opacity-100 -translate-y-2 scale-105' : 'opacity-0 scale-95'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-900/95 text-white border border-teal-500/40 backdrop-blur-md shadow-2xl font-mono text-[10px] space-y-0.5 whitespace-nowrap">
                    <div className="text-teal-300 font-bold">
                      Saved: ₹{(item.savedBySurplus / 1000).toFixed(0)}k
                    </div>
                    <div className="text-emerald-400 font-bold">
                      Recovered: ₹{(item.recoveredOffload / 1000).toFixed(0)}k
                    </div>
                    <div className="text-slate-400 text-[9px] pt-0.5 border-t border-slate-800">
                      Volume: {item.unitsMoved} units
                    </div>
                  </div>
                </div>

                {/* The Dual 3D Isometric Pillars */}
                <div className="w-full flex items-end justify-center gap-1.5 sm:gap-3 h-full">
                  {/* Pillar 1: Saved (Teal) */}
                  <div
                    style={{ height: `${heightSavedPct}%` }}
                    className={`w-4 sm:w-8 relative transition-all duration-500 rounded-t-xs ${
                      isHovered ? 'scale-105 shadow-[0_0_20px_rgba(15,118,110,0.5)]' : ''
                    }`}
                  >
                    {/* Front Face */}
                    <div className="w-full h-full bg-gradient-to-t from-teal-800 to-teal-600 rounded-l-xs relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Top Diamond Cap */}
                    <div className="absolute -top-1.5 left-0 right-0 h-3 bg-teal-400 rounded-t-xs border-t border-white/50 transform -skew-x-12" />

                    {/* Side Face (Depth Shadow) */}
                    <div className="absolute top-0 -right-1.5 w-1.5 h-full bg-teal-950 rounded-r-xs opacity-75" />
                  </div>

                  {/* Pillar 2: Recovered (Emerald) */}
                  <div
                    style={{ height: `${heightRecoveredPct}%` }}
                    className={`w-4 sm:w-8 relative transition-all duration-500 rounded-t-xs ${
                      isHovered ? 'scale-105 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''
                    }`}
                  >
                    {/* Front Face */}
                    <div className="w-full h-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-l-xs relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/25 to-transparent pointer-events-none" />
                    </div>

                    {/* Top Diamond Cap */}
                    <div className="absolute -top-1.5 left-0 right-0 h-3 bg-emerald-300 rounded-t-xs border-t border-white/60 transform -skew-x-12" />

                    {/* Side Face (Depth Shadow) */}
                    <div className="absolute top-0 -right-1.5 w-1.5 h-full bg-emerald-950 rounded-r-xs opacity-75" />
                  </div>
                </div>

                {/* Month & Unit Count */}
                <div className="mt-3 text-center">
                  <span className={`text-xs font-bold font-mono transition-colors ${
                    isHovered ? 'text-teal-800' : 'text-slate-700'
                  }`}>
                    {item.month}
                  </span>
                  <div className="text-[10px] font-mono text-slate-400">
                    {item.unitsMoved}u
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Metrics Cards with 3D depth */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-200/80 shadow-spatial text-xs space-y-1">
            <span className="text-teal-800 font-bold uppercase text-[10px] tracking-wider block">
              Cumulative Procurement Savings
            </span>
            <div className="text-2xl font-bold font-mono text-teal-950">₹13,55,000</div>
            <p className="text-[11px] text-teal-800/80">36.4% avg concession across 16,500 surplus doses</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-200/80 shadow-spatial text-xs space-y-1">
            <span className="text-emerald-800 font-bold uppercase text-[10px] tracking-wider block">
              Direct Capital Salvaged
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-950">₹9,69,000</div>
            <p className="text-[11px] text-emerald-800/80">Offloaded to verified regional hospital ICUs</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-spatial text-xs space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
              Institutional Net Benefit
            </span>
            <div className="text-2xl font-bold font-mono text-teal-300">₹23,24,000</div>
            <p className="text-[11px] text-slate-400">100% audited via Razorpay Escrow statements</p>
          </div>
        </div>
      </div>
    </div>
  );
};
