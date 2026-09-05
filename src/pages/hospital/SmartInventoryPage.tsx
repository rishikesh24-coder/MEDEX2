import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicineItem } from '../../types';
import { BillPreviewModal } from '../../components/hospital/BillPreviewModal';
import {
  Boxes,
  Search,
  Plus,
  Flame,
  FileText,
  AlertTriangle,
  CheckCircle,
  ThermometerSnowflake,
  Filter,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { downloadBlobFile } from '../../utils/exportUtils';

interface SmartInventoryPageProps {
  onOpenAddMedicine: () => void;
}

export const SmartInventoryPage: React.FC<SmartInventoryPageProps> = ({ onOpenAddMedicine }) => {
  const { currentHospital, medicines, routeToDisposal, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [activeBillMedicine, setActiveBillMedicine] = useState<MedicineItem | null>(null);

  // Filter medicines for current hospital
  const hospitalMedicines = useMemo(() => {
    return medicines.filter((m) => m.hospitalId === currentHospital.id);
  }, [medicines, currentHospital.id]);

  const filteredMedicines = useMemo(() => {
    return hospitalMedicines.filter((m) => {
      const matchesSearch =
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericComposition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesStorage = selectedStorage === 'all' || m.storageCondition.includes(selectedStorage);

      return matchesSearch && matchesCat && matchesStorage;
    });
  }, [hospitalMedicines, searchQuery, selectedCategory, selectedStorage]);

  const handleExportCsv = () => {
    const headers = [
      'Brand Name',
      'Generic Formulation',
      'Dosage Form',
      'Strength',
      'Batch Number',
      'Manufacturing Date',
      'Expiry Date',
      'Available Units',
      'Total Units',
      'MRP (INR)',
      'Concession (%)',
      'Transfer Price (INR)',
      'Storage Protocol',
      'Category',
      'Status'
    ];
    const rows = filteredMedicines.map((m) => [
      `"${m.brandName}"`,
      `"${m.genericComposition}"`,
      `"${m.dosageForm}"`,
      `"${m.strength}"`,
      `"${m.batchNumber}"`,
      `"${m.manufacturingDate}"`,
      `"${m.expiryDate}"`,
      m.availableUnits,
      m.totalUnits,
      m.mrpPerUnit,
      m.concessionPercentage,
      m.transferPricePerUnit,
      `"${m.storageCondition}"`,
      `"${m.category}"`,
      `"${m.status}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadBlobFile(`SMART-INVENTORY-LEDGER-${currentHospital.regNo}.csv`, csvContent);
    addToast('Smart inventory ledger exported to CSV successfully.', 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Pharmacy Formulary Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight mt-0.5">
            Smart Inventory & Surplus Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking batch integrity, storage temperatures, original supplier invoices, and dynamic exchange concession pricing.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs shadow-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export Inventory Ledger (CSV)</span>
          </button>
          <button
            onClick={onOpenAddMedicine}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Surplus Medicine Batch</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, generic molecule, or batch number..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100 placeholder-slate-500 font-medium outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 font-medium outline-none cursor-pointer focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Therapeutic Classes</option>
              <option value="Critical Care / Antibiotic">Critical Care / Antibiotics</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Anticoagulant">Anticoagulants</option>
              <option value="Oncology">Oncology</option>
              <option value="Cardiology">Cardiology</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 font-medium outline-none cursor-pointer focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Storage Protocols</option>
              <option value="Ambient">Ambient (15-25°C)</option>
              <option value="Cold-Chain">Cold-Chain (2-8°C)</option>
              <option value="Cryo">Ultra-Cryo (-20°C)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dense Table Ledger */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Brand & Generic Formulation</th>
                <th className="py-3 px-3">Batch & Storage Protocol</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-right">Available / Total Units</th>
                <th className="py-3 px-3 text-right">MRP Rate (₹)</th>
                <th className="py-3 px-3 text-right">Transfer Rate (₹)</th>
                <th className="py-3 px-3 text-center">Exchange Status</th>
                <th className="py-3 px-4 text-right">Pharmacy Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No medicine batches found matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isLocked = med.status === 'regulatory_lockout' || med.isNearExpiry;
                  const isDisposed = med.status === 'routed_to_disposal';

                  return (
                    <tr key={med.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{med.brandName}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">
                            ({med.strength})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{med.genericComposition}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                            {med.category}
                          </span>
                          <button
                            onClick={() => setActiveBillMedicine(med)}
                            className="text-[10px] text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <FileText className="w-3 h-3" /> Inspect Original Supplier Invoice (PDF)
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-200 font-bold">{med.batchNumber}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          {med.storageCondition.includes('Cold') ? (
                            <span className="text-cyan-400 flex items-center gap-0.5 font-semibold">
                              <ThermometerSnowflake className="w-3 h-3 text-cyan-400" /> Cold-Chain 2-8°C
                            </span>
                          ) : (
                            <span>{med.storageCondition}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className={`font-mono font-semibold ${isLocked ? 'text-rose-400' : 'text-slate-200'}`}>
                          {med.expiryDate}
                        </div>
                        {isLocked && (
                          <div className="text-[10px] text-rose-400 font-semibold uppercase flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> &lt; 30d to Expiry
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        <span className="font-bold text-white">{med.availableUnits}</span>
                        <span className="text-slate-400"> / {med.totalUnits}</span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        ₹{med.mrpPerUnit.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        {isLocked ? (
                          <span className="text-slate-500 line-through">₹{med.transferPricePerUnit}</span>
                        ) : (
                          <div>
                            <span className="font-bold text-teal-300">
                              ₹{med.transferPricePerUnit.toLocaleString()}
                            </span>
                            <span className="text-[10px] block text-emerald-400 font-semibold">
                              -{med.concessionPercentage}% Concession
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isDisposed ? (
                          <span className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 text-[10px] font-mono font-semibold border border-slate-800">
                            BIO-WASTE ROUTED
                          </span>
                        ) : isLocked ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 text-[10px] font-mono font-bold border border-rose-700/60 animate-pulse">
                            LOCKOUT ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-700/60">
                            AVAILABLE FOR SALE
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {isDisposed ? (
                          <span className="text-[11px] text-slate-400 italic">Disposal In Progress</span>
                        ) : isLocked ? (
                          <button
                            onClick={() => routeToDisposal(med.id)}
                            className="px-2.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 ml-auto shadow-xs cursor-pointer"
                          >
                            <Flame className="w-3.5 h-3.5" /> Route Batch to Safe Disposal
                          </button>
                        ) : (
                          <button
                            onClick={() => routeToDisposal(med.id, 'Packaging Damage')}
                            className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-700/60 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title="Route damaged batch directly to safe CPCB bio-waste stream"
                          >
                            <Flame className="w-3 h-3 text-amber-400" /> Route to Safe Disposal
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Preview Modal */}
      <BillPreviewModal
        isOpen={!!activeBillMedicine}
        onClose={() => setActiveBillMedicine(null)}
        medicine={activeBillMedicine}
      />
    </div>
  );
};
