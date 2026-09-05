import React from 'react';
import { useApp } from '../../context/AppContext';
import { BiomedicalVault3D } from '../../components/3d/BiomedicalVault3D';
import { DestructionCertModal } from '../../components/admin/DestructionCertModal';
import { BiomedicalWasteManifest } from '../../types';
import {
  Flame,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const WasteManagementPage: React.FC = () => {
  const { currentHospital, wasteManifests } = useApp();
  const [selectedCertManifest, setSelectedCertManifest] = React.useState<BiomedicalWasteManifest | null>(null);

  const hospitalWaste = wasteManifests.filter((m) => m.hospitalId === currentHospital.id);
  const totalWeightKg = hospitalWaste.reduce((acc, m) => acc + m.weightKg, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-amber-700 tracking-wider font-bold">
          Hospital Biomedical Waste Terminal • CPCB Schedule I
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Hazardous Waste Management & 3D Containment Vault
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hermetic containment terminal for near-expiry and breached pharmaceuticals. Initiates airlock seals before hazardous carrier dispatch to 1200°C incineration.
        </p>
      </div>

      {/* 3D Canister Vault Terminal */}
      <BiomedicalVault3D manifests={hospitalWaste.length > 0 ? hospitalWaste : wasteManifests} />

      {/* Active Hospital Disposal Manifests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-spatial overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Hospital Disposal Batches ({hospitalWaste.length})
            </h3>
            <p className="text-xs text-slate-500">
              Total condemned mass: <strong className="text-amber-800">{totalWeightKg.toFixed(1)} kg</strong>
            </p>
          </div>
          <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-bold">
            CPCB HAZARDOUS STREAM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Manifest ID</th>
                <th className="py-3 px-3">Discarded Pharmaceutical</th>
                <th className="py-3 px-3">Batch & Expiry</th>
                <th className="py-3 px-3 text-right">Mass (kg)</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3 text-center">Incineration Custody</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {hospitalWaste.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {m.manifestNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800">{m.medicineName}</div>
                    <div className="text-[10px] text-slate-400">{m.treatmentFacility.split('(')[0]}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    <div>{m.batchNumber}</div>
                    <div className="text-[10px] text-rose-700">Exp: {m.expiryDate}</div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                    {m.weightKg} kg
                  </td>
                  <td className="py-3.5 px-3 text-rose-700 font-semibold">
                    {m.reason}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {m.status === 'certified' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 1200°C INCINERATED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold animate-pulse">
                        <Flame className="w-3 h-3 text-amber-700" /> IN CUSTODY TRANSIT
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCertManifest(m)}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-1"
                    >
                      <FileCheck className="w-3.5 h-3.5" /> View Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DestructionCertModal
        isOpen={!!selectedCertManifest}
        onClose={() => setSelectedCertManifest(null)}
        manifest={selectedCertManifest}
      />
    </div>
  );
};
