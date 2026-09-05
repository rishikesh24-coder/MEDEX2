import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hero3DCapsule } from '../../components/3d/Hero3DCapsule';
import { Tilt3DCard } from '../../components/3d/Tilt3DCard';
import {
  ArrowRight,
  ShieldCheck,
  Flame,
  Truck,
  CheckCircle2,
  ThermometerSnowflake,
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, setRole } = useApp();

  // Interactive Route Decision Simulator state
  const [simDaysToExpiry, setSimDaysToExpiry] = useState(45);
  const [simTempBreach, setSimTempBreach] = useState(false);

  const isLockout = simDaysToExpiry <= 30 || simTempBreach;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Clean Minimal Hero Section */}
      <section className="relative py-20 md:py-28 border-b border-slate-200/80 bg-white/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Single Minimal Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-teal-800 text-xs font-medium tracking-normal shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                <span>Redistribution & Bio-Waste Network</span>
              </div>

              {/* Crisp Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight font-display leading-[1.12]">
                Surplus Redistribution meets <span className="text-teal-800">Safe Biomedical Waste</span>.
              </h1>

              {/* Body Copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Connecting verified hospitals, administrative drug controllers, and certified hazardous disposal fleets to eliminate critical pharmaceutical expiry waste while enforcing strict CPCB incineration custody.
              </p>

              {/* Two Streamlined Actions Max */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => navigate('/auth/register-hospital')}
                  className="px-6 py-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm shadow-xs flex items-center gap-2 transition-colors btn-3d"
                >
                  <span>Get Started / Register Hospital</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setRole('hospital');
                    navigate('/hospital/dashboard');
                  }}
                  className="px-5 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm transition-colors shadow-2xs"
                >
                  Explore Live Demo
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-2 flex items-center gap-6 text-xs text-slate-500 font-mono flex-wrap">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> CDSCO Form 20B/21B
                </span>
                <span className="flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" /> IoT 2-8°C Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" /> CPCB 1200°C Incineration
                </span>
              </div>
            </div>

            {/* Right: Borderless 3D Zero-Gravity Glass Capsule */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="w-full max-w-lg relative">
                <Hero3DCapsule />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Operational Metrics Ribbon with Clean Depth */}
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
              <div className="text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">184,500+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Medicine Units Diverted
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Surplus Transferred Safely</div>
            </div>

            <div className="border-r border-slate-800/80 pr-4">
              <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">14,280 kg</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Bio-Waste Incinerated
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">CPCB Yellow Stream 1200°C</div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">₹2.48 Cr</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Hospital Capital Conserved
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Across Peer Purchases</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Decision Engine Simulator */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-teal-700 font-bold">
            Interactive Regulatory Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1 tracking-tight">
            Statutory Route Decision Logic
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Try adjusting days-to-expiry or simulated cold-chain breach below to observe how the platform automatically routes pharmaceuticals.
          </p>
        </div>

        <Tilt3DCard maxTilt={5} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-spatial shimmer-sweep">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase font-mono">
                  Days Remaining Until Expiry Date
                </label>
                <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                  simDaysToExpiry <= 30
                    ? 'bg-rose-100 text-rose-900 border border-rose-200'
                    : 'bg-teal-100 text-teal-900 border border-teal-200'
                }`}>
                  {simDaysToExpiry} Days
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                value={simDaysToExpiry}
                onChange={(e) => setSimDaysToExpiry(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>Critical Expiry (5d)</span>
                <span className="text-rose-700 font-bold">30-Day Lockout Threshold</span>
                <span>Fresh Stock (180d)</span>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4">
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase font-mono">
                  Cold-Chain IoT Simulation
                </div>
                <div className="text-[11px] text-slate-500">
                  Simulate refrigeration temperature excursion (&gt; 8.0°C)
                </div>
              </div>
              <button
                onClick={() => setSimTempBreach(!simTempBreach)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  simTempBreach
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                {simTempBreach ? 'Excursion Detected (14.2°C)' : 'Normal (4.2°C)'}
              </button>
            </div>
          </div>

          {/* Real-time Branching Visualizer */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Input Analysis */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/80">
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                  01
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Formulary Intake</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Meronex 1000mg Injection</h4>
              <p className="text-xs text-slate-600 mt-1">Batch: BT-2024-889 • Origin: Apollo Hospital</p>
              <div className="mt-3 text-[11px] font-mono text-slate-500 space-y-1">
                <div>MRP: ₹2,450 • Concession: 35%</div>
                <div>Storage: 2-8°C Refrigerated</div>
              </div>
            </div>

            {/* Step 2: Regulatory Validation */}
            <div className={`p-5 rounded-xl border transition-all ${
              isLockout ? 'border-rose-300 bg-rose-50/50' : 'border-teal-300 bg-teal-50/50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center ${
                  isLockout ? 'bg-rose-700 text-white' : 'bg-teal-700 text-white'
                }`}>
                  02
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                  Regulatory Engine
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

      {/* Institutional Governance Pillars */}
      <section id="compliance" className="py-14 bg-white/80 border-t border-slate-200 relative z-10">
        <div id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Tilt3DCard maxTilt={6} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-spatial shimmer-sweep">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">Institutional Verification</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Only hospitals with valid state drug wholesale licenses (Form 20B/21B), active NABH accreditations, and verified Nodal Pharmacy Officers are permitted to trade.
              </p>
            </Tilt3DCard>

            <Tilt3DCard maxTilt={6} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-spatial shimmer-sweep">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center mb-4 shadow-xs">
                <ThermometerSnowflake className="w-6 h-6 text-cyan-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">Continuous Cold-Chain IoT</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Refrigerated biologics and insulins are guarded by calibrated IoT temperature sensors streaming continuous telemetry every 60 seconds from pickup to receiving dock.
              </p>
            </Tilt3DCard>

            <Tilt3DCard maxTilt={6} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-spatial-amber shimmer-sweep">
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
            <button
              onClick={() => {
                setRole('admin');
                navigate('/admin/dashboard');
              }}
              className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
            >
              CDSCO Officer Portal →
            </button>
            <span>•</span>
            <span>TLS 1.3 Encrypted</span>
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
