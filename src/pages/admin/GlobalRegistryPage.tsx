import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicineItem } from '../../types';
import { AdminOverrideModal } from '../../components/admin/AdminOverrideModal';
import { BillPreviewModal } from '../../components/hospital/BillPreviewModal';
import { downloadBlobFile } from '../../utils/exportUtils';
import {
  Boxes,
  Building2,
  Search,
  ShieldAlert,
  FileText,
  AlertTriangle,
  Lock,
  ThermometerSnowflake,
  Filter,
  Download
} from 'lucide-react';

export const GlobalRegistryPage: React.FC = () => {
  const { hospitals, medicines, addToast } = useApp();

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [overrideMedicine, setOverrideMedicine] = useState<MedicineItem | null>(null);
  const [billMedicine, setBillMedicine] = useState<MedicineItem | null>(null);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesHospital = selectedHospitalId === 'all' || m.hospitalId === selectedHospitalId;
      const matchesSearch =
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericComposition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesHospital && matchesSearch;
    });
  }, [medicines, selectedHospitalId, searchQuery]);

  const handleExportRegistryCsv = () => {
    if (filteredMedicines.length === 0) {
      addToast('No medicines to export in registry.', 'info');
      return;
    }
    const headers = ['Brand Name', 'Generic Scientific Name', 'Hospital Institution', 'Batch Number', 'Expiry Date', 'Storage Condition', 'Available Units', 'Total Units', 'Transfer Rate (INR)', 'Status'];
    const rows = filteredMedicines.map((m) => [
      `"${m.brandName}"`,
      `"${m.genericComposition}"`,
      `"${m.hospitalName}"`,
      m.batchNumber,
      m.expiryDate,
      `"${m.storageCondition}"`,
      m.availableUnits,
      m.totalUnits,
      m.transferPricePerUnit,
      m.status.toUpperCase()
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    downloadBlobFile(csvContent, `national_drug_registry_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    addToast('National medicine registry exported successfully (CSV).', 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-rose-400 tracking-wider font-bold">
            Central Drug Surveillance Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
            Global Medicine Data Registry & Admin Override
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect live pharmaceutical inventories across all participating healthcare facilities. Privileged administrative override mode for emergency quotas and batch recalls.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportRegistryCsv}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-rose-400" />
          <span>Export National Drug Registry (CSV)</span>
        </button>
      </div>

      {/* Hospital Directory Filter Bar */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs backdrop-blur-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all institutions by brand, molecule, or batch..."
            className="w-full px-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-rose-500 bg-slate-950 text-slate-100 placeholder:text-slate-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-300">Filter by Hospital:</span>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 font-medium"
          >
            <option value="all">All Hospitals (National Master View)</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} [{h.regNo}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Registry Table */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Brand & Generic Molecule</th>
                <th className="py-3 px-3">Institution Node</th>
                <th className="py-3 px-3">Batch & Expiry</th>
                <th className="py-3 px-3">Storage Protocol</th>
                <th className="py-3 px-3 text-right">Available Qty</th>
                <th className="py-3 px-3 text-right">Transfer Rate</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100">{med.brandName} ({med.strength})</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{med.genericComposition}</div>
                    <button
                      type="button"
                      onClick={() => setBillMedicine(med)}
                      className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center gap-1 mt-1 font-semibold cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Inspect Original Supplier Invoice (PDF)</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-400" />
                      {med.hospitalName}
                    </div>
                    <div className="text-[10px] text-slate-400">{med.hospitalLocation}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    <div className="font-bold text-slate-200">{med.batchNumber}</div>
                    <div className={`text-[10px] ${med.isNearExpiry ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                      Exp: {med.expiryDate}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-mono ${
                      med.storageCondition.includes('Cold') ? 'text-cyan-300 font-bold' : 'text-slate-300'
                    }`}>
                      {med.storageCondition.includes('Cold') && <ThermometerSnowflake className="w-3 h-3 text-cyan-400" />}
                      {med.storageCondition}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100">
                    {med.availableUnits} / {med.totalUnits}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-teal-400 font-bold">
                    ₹{med.transferPricePerUnit.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {med.status === 'regulatory_lockout' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-950/50 text-rose-300 border border-rose-800/60 text-[10px] font-mono font-bold">
                        LOCKOUT
                      </span>
                    ) : med.status === 'routed_to_disposal' ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-semibold">
                        DISPOSAL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono font-semibold">
                        ACTIVE
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setOverrideMedicine(med)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Open Regulatory Override Panel</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Override Modal */}
      <AdminOverrideModal
        isOpen={!!overrideMedicine}
        onClose={() => setOverrideMedicine(null)}
        medicine={overrideMedicine}
      />

      {/* Bill Preview Modal */}
      <BillPreviewModal
        isOpen={!!billMedicine}
        onClose={() => setBillMedicine(null)}
        medicine={billMedicine}
      />
    </div>
  );
};
