import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hero3DCapsule } from '../../components/3d/Hero3DCapsule';
import { Tilt3DCard } from '../../components/3d/Tilt3DCard';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Flame,
  Truck,
  CheckCircle2,
  ThermometerSnowflake,
  Play,
  Sparkles,
  Zap,
  RotateCw,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, setRole } = useApp();

  // Interactive Route Decision Simulator state
  const [simDaysToExpiry, setSimDaysToExpiry] = useState(45);
  const [simTempBreach, setSimTempBreach] = useState(false);

  const isLockout = simDaysToExpiry <= 30 || simTempBreach;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Dynamic Ambient Background Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute top-80 right-10 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-float-slow-delayed" />
      <div className="absolute bottom-40 left-10 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section with 3D Zero-Gravity Capsule */}
      <section className="relative pt-8 pb-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md bg-clinical-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/90 border border-teal-200/80 text-teal-900 text-xs font-semibold uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span>National Healthcare Logistics & Formulary Compliance</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.08]">
                Surplus Redistribution meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800">Safe Biomedical Waste Stream</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Connecting verified hospitals, administrative drug controllers, and certified hazardous disposal fleets to eliminate critical pharmaceutical expiry waste while enforcing strict CPCB incineration custody.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setRole('hospital');
                    navigate('/hospital/dashboard');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-spatial flex items-center gap-2.5 transition-all btn-3d"
                >
                  <Building2 className="w-4 h-4 text-teal-200" />
                  <span>Launch Hospital Portal (Apollo Demo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setRole('admin');
                    navigate('/admin/dashboard');
                  }}
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all btn-3d"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Admin Command (CDSCO)</span>
                </button>

                <button
                  onClick={() => navigate('/auth/register-hospital')}
                  className="px-4 py-3.5 rounded-xl bg-white/90 hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs sm:text-sm transition-colors btn-3d"
                >
                  Register New Hospital
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-mono flex-wrap">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> CDSCO Form 20B/21B
                </span>
                <span className="flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-4 h-4 text-cyan-600" /> IoT 2-8°C Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" /> CPCB 1200°C Incineration
                </span>
              </div>
            </div>

            {/* Right: The Interactive 3D Zero-Gravity Glass Capsule */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="w-full max-w-lg bg-gradient-to-b from-white/60 to-slate-50/60 rounded-3xl border border-white/80 backdrop-blur-xl shadow-spatial p-4 relative">
                <Hero3DCapsule />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Operational Metrics Ribbon with 3D Depth */}
      <section className="bg-slate-900 text-white py-8 border-b border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="border-r border-slate-800/80 pr-4">
              <div className="text-3xl font-extrabold text-teal-400 font-mono tracking-tight">142+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Verified Hospitals Onboarded
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">NABH & Form 20B Verified</div>
            </div>

            <div className="border-r border-slate-800/80 pr-4">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">184,500+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Medicine Units Diverted
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Saved from premature expiration</div>
            </div>

            <div className="border-r border-slate-800/80 pr-4">
              <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">14,280 kg</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Bio-Waste Certified Disposed
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">1200°C Incineration CPCB Manifested</div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-teal-300 font-mono tracking-tight">₹2.48 Cr</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Capital Conserved / Recovered
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Zero hospital bad-debt losses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Visualizer & 3D Route Simulator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-700 font-bold bg-teal-100/70 px-3 py-1 rounded-full shadow-xs">
            Autonomous Regulatory Logic
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3 font-display">
            How MedEx Safely Routes Every Dose
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Surplus stock undergoes continuous algorithmic qualification. If compliant, it moves to peer ICUs; if near expiry or breached, it is locked into hazardous waste destruction.
          </p>
        </div>

        {/* 3D Parallax Tilt Sandbox Card */}
        <Tilt3DCard maxTilt={4} className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-spatial p-6 sm:p-8 shimmer-sweep">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Play className="w-4 h-4 text-teal-700 fill-teal-700" />
                Live Decision Engine Simulator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust shelf life and storage conditions to observe the platform's automatic routing decision in real time.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Days to Expiry:</span>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={simDaysToExpiry}
                  onChange={(e) => setSimDaysToExpiry(Number(e.target.value))}
                  className="w-32 accent-teal-700"
                />
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  simDaysToExpiry <= 30 ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {simDaysToExpiry} days
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="tempBreachCheck"
                  checked={simTempBreach}
                  onChange={(e) => setSimTempBreach(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <label htmlFor="tempBreachCheck" className="font-semibold text-slate-700 cursor-pointer">
                  Simulate Cold-Chain Breach (&gt; 8°C)
                </label>
              </div>
            </div>
          </div>

          {/* Workflow Diagram Nodes with 3D Depth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/80 relative shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                  01
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                  Source Hospital
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">Hospital A Formulates Surplus</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Hospital pharmacy logs surplus inventory (e.g., 450 vials Meropenem 1g) with batch numbers and original supplier invoice PDF.
              </p>
              <div className="mt-3 text-[11px] font-mono text-slate-500 bg-white p-2 rounded border border-slate-200">
                Input: Shelf life = {simDaysToExpiry}d | Cold Chain = {simTempBreach ? 'BREACHED' : 'SECURE'}
              </div>
            </div>

            {/* Step 2: Quality & Regulatory Gate */}
            <div className="p-5 rounded-xl border-2 border-teal-600/60 bg-teal-50/40 relative shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-teal-700 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                  02
                </span>
                <span className="text-[10px] font-mono text-teal-800 uppercase font-bold">
                  Algorithmic Gate
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">National CDSCO Regulatory Audit</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Evaluates minimum shelf-life threshold (&ge; 30 days) and verified cold-chain IoT telemetry.
              </p>
              <div className="mt-3">
                {isLockout ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 font-mono text-[11px] font-bold border border-rose-300 animate-pulse">
                    <Flame className="w-3.5 h-3.5 text-rose-600" />
                    LOCKOUT: RE-ROUTE TO BIO-WASTE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-mono text-[11px] font-bold border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    QUALIFIED: REDISTRIBUTE SURPLUS
                  </span>
                )}
              </div>
            </div>

            {/* Step 3: Branching Target */}
            <div className={`p-5 rounded-xl border-2 transition-all ${
              isLockout
                ? 'border-rose-500 bg-rose-50/80 shadow-spatial-rose'
                : 'border-emerald-500 bg-emerald-50/80 shadow-spatial'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center ${
                  isLockout ? 'bg-rose-700 text-white' : 'bg-emerald-700 text-white'
                }`}>
                  03
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                  {isLockout ? 'Incineration Terminal' : 'Peer Hospital Destination'}
                </span>
              </div>

              {isLockout ? (
                <div>
                  <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-700" />
                    Authorized CPCB Destruction (1200°C)
                  </h4>
                  <p className="text-xs text-rose-900/80 mt-1 leading-relaxed">
                    Automatic chain-of-custody transfer to licensed hazardous courier. Digital Destruction Certificate generated upon thermal neutralization.
                  </p>
                  <div className="mt-3 text-[11px] font-mono bg-white text-rose-800 p-2 rounded border border-rose-200">
                    Manifest: BMW-DL-2026-SIM • Yellow Category
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    Peer Hospital Delivery & Razorpay Escrow
                  </h4>
                  <p className="text-xs text-emerald-900/80 mt-1 leading-relaxed">
                    Surplus listed on peer marketplace at 35% concession. Escrow captured; cold-chain shipment tracked live with GPS telemetry.
                  </p>
                  <div className="mt-3 text-[11px] font-mono bg-white text-emerald-800 p-2 rounded border border-emerald-200">
                    Escrow: Razorpay Protected • 2-8°C Monitored
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tilt3DCard>
      </section>

      {/* Institutional Governance Pillars with 3D Tilt Cards */}
      <section className="py-12 bg-white/80 border-t border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Tilt3DCard maxTilt={8} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-spatial shimmer-sweep">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">Institutional Verification</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Only hospitals with valid state drug wholesale licenses (Form 20B/21B), active NABH accreditations, and verified Nodal Pharmacy Officers are permitted to trade.
              </p>
            </Tilt3DCard>

            <Tilt3DCard maxTilt={8} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-spatial shimmer-sweep">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center mb-4 shadow-xs">
                <ThermometerSnowflake className="w-6 h-6 text-cyan-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">Continuous Cold-Chain IoT</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Refrigerated biologics and insulins are guarded by calibrated IoT temperature sensors streaming continuous telemetry every 60 seconds from pickup to receiving dock.
              </p>
            </Tilt3DCard>

            <Tilt3DCard maxTilt={8} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-spatial-amber shimmer-sweep">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 shadow-xs">
                <Flame className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">Zero Landfill Bio-Waste Stream</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Expired pharmaceuticals and breach-tainted batches are prohibited from landfill dumping, mandated into 1200°C central dual-chamber incineration under CPCB 2016 rules.
              </p>
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-white tracking-tight text-sm font-display">MedEx Institutional Gateway</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Governed by National CDSCO & Bio-Medical Waste Management Rules 2016
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>TLS 1.3 End-to-End Encrypted</span>
            <span>•</span>
            <span>Razorpay B2B Escrow</span>
            <span>•</span>
            <span>CPCB Monitored</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
