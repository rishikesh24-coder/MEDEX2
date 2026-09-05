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
  ArrowUpDown
} from 'lucide-react';

interface SmartInventoryPageProps {
  onOpenAddMedicine: () => void;
}

export const SmartInventoryPage: React.FC<SmartInventoryPageProps> = ({ onOpenAddMedicine }) => {
  const { currentHospital, medicines, routeToDisposal } = useApp();

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

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-slate-500 tracking-wider">
            Pharmacy Formulary Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
            Smart Inventory & Surplus Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking batch integrity, storage temperatures, original supplier invoices, and dynamic exchange concession pricing.
          </p>
        </div>

        <button
          onClick={onOpenAddMedicine}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Surplus Medicine</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, generic molecule, or batch number..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
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
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="all">All Storage Specs</option>
              <option value="Ambient">Ambient (15-25°C)</option>
              <option value="Cold-Chain">Cold-Chain (2-8°C)</option>
              <option value="Cryo">Ultra-Cryo (-20°C)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dense Table Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Brand & Generic Formulation</th>
                <th className="py-3 px-3">Batch & Storage</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-right">Available / Total</th>
                <th className="py-3 px-3 text-right">MRP (₹)</th>
                <th className="py-3 px-3 text-right">Transfer Price (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Regulatory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No medicine batches found matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isLocked = med.status === 'regulatory_lockout' || med.isNearExpiry;
                  const isDisposed = med.status === 'routed_to_disposal';

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{med.brandName}</span>
                          <span className="font-mono text-[10px] text-slate-500 font-normal">
                            ({med.strength})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{med.genericComposition}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                            {med.category}
                          </span>
                          <button
                            onClick={() => setActiveBillMedicine(med)}
                            className="text-[10px] text-teal-700 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <FileText className="w-3 h-3" /> View Bill PDF
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-800 font-bold">{med.batchNumber}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          {med.storageCondition.includes('Cold') ? (
                            <span className="text-cyan-700 flex items-center gap-0.5 font-semibold">
                              <ThermometerSnowflake className="w-3 h-3 text-cyan-600" /> Cold-Chain 2-8°C
                            </span>
                          ) : (
                            <span>{med.storageCondition}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className={`font-mono font-semibold ${isLocked ? 'text-rose-700' : 'text-slate-800'}`}>
                          {med.expiryDate}
                        </div>
                        {isLocked && (
                          <div className="text-[10px] text-rose-600 font-semibold uppercase flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> &lt; 30d to Expiry
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        <span className="font-bold text-slate-900">{med.availableUnits}</span>
                        <span className="text-slate-400"> / {med.totalUnits}</span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        ₹{med.mrpPerUnit.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        {isLocked ? (
                          <span className="text-slate-400 line-through">₹{med.transferPricePerUnit}</span>
                        ) : (
                          <div>
                            <span className="font-bold text-teal-800">
                              ₹{med.transferPricePerUnit.toLocaleString()}
                            </span>
                            <span className="text-[10px] block text-emerald-600 font-semibold">
                              -{med.concessionPercentage}% Concession
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isDisposed ? (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold border border-slate-300">
                            BIO-WASTE ROUTED
                          </span>
                        ) : isLocked ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-mono font-bold border border-rose-300 animate-pulse">
                            LOCKOUT ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-semibold border border-emerald-300">
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
                            className="px-2.5 py-1.5 rounded-md bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] flex items-center gap-1 ml-auto shadow-xs"
                          >
                            <Flame className="w-3.5 h-3.5" /> Route to Bio-Waste
                          </button>
                        ) : (
                          <span className="text-[11px] text-teal-800 font-semibold">
                            Exchange Active
                          </span>
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
