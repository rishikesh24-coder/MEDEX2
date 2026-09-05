import React from 'react';
import { useApp } from '../../context/AppContext';
import { BiomedicalVault3D } from '../../components/3d/BiomedicalVault3D';
import { DestructionCertModal } from '../../components/admin/DestructionCertModal';
import { BiomedicalWasteManifest } from '../../types';
import { downloadBlobFile } from '../../utils/exportUtils';
import {
  Flame,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download
} from 'lucide-react';

export const WasteManagementPage: React.FC = () => {
  const { currentHospital, wasteManifests, addToast } = useApp();
  const [selectedCertManifest, setSelectedCertManifest] = React.useState<BiomedicalWasteManifest | null>(null);

  const hospitalWaste = wasteManifests.filter((m) => m.hospitalId === currentHospital.id);
  const totalWeightKg = hospitalWaste.reduce((acc, m) => acc + m.weightKg, 0);

  const handleExportForm4Csv = () => {
    if (hospitalWaste.length === 0) {
      addToast('No biomedical waste manifests found to export.', 'info');
      return;
    }
    const headers = ['Manifest ID', 'Date/Time', 'Condemned Pharmaceutical', 'Batch', 'Weight (kg)', 'Units', 'Expiry Date', 'Disposal Reason', 'Destruction Facility', 'Method', 'Custody Status', 'Destruction Certificate No.'];
    const rows = hospitalWaste.map((m) => [
      m.manifestNumber,
      `"${m.gpsTimestamp}"`,
      `"${m.medicineName}"`,
      m.batchNumber,
      m.weightKg,
      m.quantity,
      m.expiryDate,
      `"${m.reason}"`,
      `"${m.treatmentFacility}"`,
      `"${m.destructionMethod}"`,
      m.status.toUpperCase(),
      m.certificateNumber || 'PENDING'
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    downloadBlobFile(csvContent, `cpcb_form4_annual_return_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    addToast('CPCB Form-IV annual biomedical waste return exported successfully (CSV).', 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-amber-400 tracking-wider font-bold">
            Hospital Biomedical Waste Terminal • CPCB Schedule I
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
            Hazardous Waste Management & 3D Containment Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hermetic containment terminal for near-expiry and breached pharmaceuticals. Initiates airlock seals before hazardous carrier dispatch to 1200°C incineration.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportForm4Csv}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export CPCB Annual Biowaste Return (Form-IV CSV)</span>
        </button>
      </div>

      {/* 3D Canister Vault Terminal */}
      <BiomedicalVault3D manifests={hospitalWaste.length > 0 ? hospitalWaste : wasteManifests} />

      {/* Active Hospital Disposal Manifests Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xs">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Active Hospital Disposal Batches ({hospitalWaste.length})
            </h3>
            <p className="text-xs text-slate-400">
              Total condemned mass: <strong className="text-amber-300">{totalWeightKg.toFixed(1)} kg</strong>
            </p>
          </div>
          <span className="text-xs font-mono bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2.5 py-1 rounded font-bold">
            CPCB HAZARDOUS STREAM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-800 font-medium">
              {hospitalWaste.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {m.manifestNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-100">{m.medicineName}</div>
                    <div className="text-[10px] text-slate-500">{m.treatmentFacility.split('(')[0]}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    <div>{m.batchNumber}</div>
                    <div className="text-[10px] text-rose-400">Exp: {m.expiryDate}</div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100">
                    {m.weightKg} kg
                  </td>
                  <td className="py-3.5 px-3 text-rose-300 font-semibold">
                    {m.reason}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {m.status === 'certified' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 1200°C INCINERATED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/50 text-amber-300 border border-amber-800/60 text-[10px] font-mono font-bold animate-pulse">
                        <Flame className="w-3 h-3 text-amber-400" /> IN CUSTODY TRANSIT
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCertManifest(m)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Inspect CPCB Destruction Certificate (PDF)</span>
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
