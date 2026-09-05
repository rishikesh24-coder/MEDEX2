import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicineItem } from '../../types';
import { AdminOverrideModal } from '../../components/admin/AdminOverrideModal';
import { BillPreviewModal } from '../../components/hospital/BillPreviewModal';
import {
  Boxes,
  Building2,
  Search,
  ShieldAlert,
  FileText,
  AlertTriangle,
  Lock,
  ThermometerSnowflake,
  Filter
} from 'lucide-react';

export const GlobalRegistryPage: React.FC = () => {
  const { hospitals, medicines } = useApp();

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

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-rose-700 tracking-wider font-bold">
          Central Drug Surveillance Network
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Global Medicine Data Registry & Admin Override
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Inspect live pharmaceutical inventories across all participating healthcare facilities. Privileged administrative override mode for emergency quotas and batch recalls.
        </p>
      </div>

      {/* Hospital Directory Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all institutions by brand, molecule, or batch..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-600 bg-white font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700">Filter by Hospital:</span>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{med.brandName} ({med.strength})</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{med.genericComposition}</div>
                    <button
                      onClick={() => setBillMedicine(med)}
                      className="text-[10px] text-teal-700 hover:underline flex items-center gap-1 mt-1 font-semibold"
                    >
                      <FileText className="w-3 h-3" /> Supplier Invoice
                    </button>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-700" />
                      {med.hospitalName}
                    </div>
                    <div className="text-[10px] text-slate-500">{med.hospitalLocation}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    <div className="font-bold text-slate-800">{med.batchNumber}</div>
                    <div className={`text-[10px] ${med.isNearExpiry ? 'text-rose-700 font-bold' : 'text-slate-500'}`}>
                      Exp: {med.expiryDate}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-mono ${
                      med.storageCondition.includes('Cold') ? 'text-cyan-800 font-bold' : 'text-slate-700'
                    }`}>
                      {med.storageCondition.includes('Cold') && <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />}
                      {med.storageCondition}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                    {med.availableUnits} / {med.totalUnits}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-teal-800 font-bold">
                    ₹{med.transferPricePerUnit.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {med.status === 'regulatory_lockout' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">
                        LOCKOUT
                      </span>
                    ) : med.status === 'routed_to_disposal' ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                        DISPOSAL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                        ACTIVE
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setOverrideMedicine(med)}
                      className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Admin Override</span>
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
