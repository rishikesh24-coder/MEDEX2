import React, { useState } from 'react';
import { BiomedicalWasteManifest } from '../../types';
import {
  Flame,
  ShieldAlert,
  Lock,
  Unlock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Gauge,
  Wind
} from 'lucide-react';

interface BiomedicalVault3DProps {
  manifests: BiomedicalWasteManifest[];
  onSealBatch?: (manifestId: string) => void;
}

export const BiomedicalVault3D: React.FC<BiomedicalVault3DProps> = ({ manifests }) => {
  const [selectedManifestId, setSelectedManifestId] = useState<string>(manifests[0]?.id || '');
  const [isDepressurizing, setIsDepressurizing] = useState(false);
  const [isSealed, setIsSealed] = useState(true);
  const [sealHash, setSealHash] = useState('CPCB-CANISTER-HASH-772091');
  const [pressurePsi, setPressurePsi] = useState(14.7);

  const activeManifest = manifests.find((m) => m.id === selectedManifestId) || manifests[0];

  const handleCycleAirlock = () => {
    setIsDepressurizing(true);
    setPressurePsi(28.4);
    setTimeout(() => {
      setPressurePsi(0.2); // near vacuum containment
      setIsSealed(true);
      setIsDepressurizing(false);
      setSealHash(`CPCB-VAULT-${Date.now().toString().slice(-6)}`);
    }, 1800);
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
      {/* Top Biohazard Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-700/50 font-mono text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            CPCB HAZARDOUS BIO-MEDICAL DECONTAMINATION TERMINAL
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-2">
            3D Pressurized Containment Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hermetically sealed hazardous lockbox preventing bio-leakage prior to 1200°C dual-chamber incineration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs flex items-center gap-2 shadow-md">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>CHAMBER: {pressurePsi.toFixed(1)} PSI</span>
          </div>
        </div>
      </div>

      {/* Main 3D Spatial Canister Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Isometric Visual Representation of the Canister */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden select-none">
          {/* Ambient Lighting */}
          <div className="absolute top-0 w-full h-32 bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 w-full h-32 bg-rose-500/10 blur-3xl pointer-events-none" />

          {/* 3D Canister Body */}
          <div
            className="relative flex flex-col items-center transition-all duration-700"
            style={{
              transform: 'perspective(1000px) rotateX(8deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Top Pressurized Cap with Locking Bolts */}
            <div className={`w-36 h-10 rounded-t-2xl bg-gradient-to-r from-slate-700 via-amber-500 to-slate-700 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center relative transition-all ${
              isDepressurizing ? 'translate-y-[-10px]' : ''
            }`}>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-950">
                <Lock className="w-3 h-3 text-slate-950" />
                <span>VALVE SEALED</span>
              </div>
            </div>

            {/* Glowing Laser Collar */}
            <div className="w-40 h-3 bg-amber-400/80 border border-amber-300 shadow-[0_0_15px_#f59e0b] animate-pulse" />

            {/* Main Cylindrical Chamber (Translucent Heavy-Duty Shield) */}
            <div className="w-36 h-48 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-x-4 border-amber-500/60 shadow-2xl relative flex flex-col items-center justify-between p-3 overflow-hidden">
              {/* Internal Hazardous Specimen Silhouette */}
              <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-transparent pointer-events-none" />

              {/* Biohazard Symbol Watermark */}
              <div className="text-amber-500/25 my-auto">
                <Flame className="w-20 h-20 animate-pulse" />
              </div>

              {/* Holographic Digital Readout on Glass */}
              <div className="relative z-10 w-full bg-slate-900/90 border border-amber-500/40 rounded p-1.5 text-center font-mono text-[9px] text-amber-300">
                <div>TEMP ENVELOPE: 18.2°C</div>
                <div className="text-[8px] text-slate-400">HERMETIC INTEGRITY: 100%</div>
              </div>

              <div className="relative z-10 text-[9px] font-mono text-amber-400/80 uppercase">
                SCHEDULE I YELLOW HAZARD
              </div>
            </div>

            {/* Heavy-Duty Base Pedestal */}
            <div className="w-44 h-12 rounded-b-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-2 border-slate-600 shadow-2xl flex items-center justify-between px-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-[9px] text-slate-300 font-bold tracking-widest">
                CPCB MODEL-B2
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping" />
            </div>
          </div>

          {/* Depressurization Steam Effect Overlay */}
          {isDepressurizing && (
            <div className="absolute inset-0 z-30 bg-white/10 backdrop-blur-xs flex flex-col items-center justify-center animate-in fade-in">
              <Wind className="w-12 h-12 text-amber-400 animate-spin" />
              <div className="font-mono text-xs font-bold text-amber-300 mt-2">
                DEPRESSURIZING AIRLOCK CHAMBER...
              </div>
            </div>
          )}

          <div className="mt-6 font-mono text-[11px] text-slate-400 text-center">
            Digital Chain-of-Custody Hash: <span className="text-amber-300 font-bold">{sealHash}</span>
          </div>
        </div>

        {/* Right: Active Disposal Batch Details & Airlock Control */}
        <div className="lg:col-span-6 space-y-5 text-xs">
          {/* Batch Selector */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
              Select Waste Batch for Containment Vault Verification:
            </label>
            <select
              value={selectedManifestId}
              onChange={(e) => setSelectedManifestId(e.target.value)}
              className="w-full font-medium p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-mono text-xs focus:ring-2 focus:ring-amber-500"
            >
              {manifests.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.manifestNumber} — {m.medicineName} ({m.weightKg} kg)
                </option>
              ))}
            </select>
          </div>

          {activeManifest && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-white">{activeManifest.medicineName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Batch: {activeManifest.batchNumber} • Expiry: {activeManifest.expiryDate}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-700/50">
                  {activeManifest.weightKg} KG MASS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Condemnation Reason:</span>
                  <strong className="text-rose-400">{activeManifest.reason}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Target Neutralization:</span>
                  <strong className="text-amber-400">{activeManifest.destructionMethod}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Treatment Facility:</span>
                  <span className="text-slate-300">{activeManifest.treatmentFacility.split('(')[0]}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Authorized Carrier:</span>
                  <span className="text-slate-300">{activeManifest.courierPartner.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="font-bold text-amber-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Hermetic Safety Valve Active
              </div>
              <span className="font-mono text-[10px] text-amber-300 font-bold">VACUUM VERIFIED</span>
            </div>

            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              Initiate an airlock purge to simulate chamber depressurization and generate a cryptographic tamper-evident CPCB seal before dispatch to the incinerator.
            </p>

            <button
              type="button"
              disabled={isDepressurizing}
              onClick={handleCycleAirlock}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isDepressurizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Depressurizing & Purging Chamber...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Cycle Airlock & Generate Digital CPCB Seal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
