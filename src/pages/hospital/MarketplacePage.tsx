import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicineItem, StorageCondition, DosageForm } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Search,
  Building2,
  MapPin,
  ThermometerSnowflake,
  ShieldCheck,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { Tilt3DCard } from '../../components/3d/Tilt3DCard';

export const MarketplacePage: React.FC = () => {
  const { currentHospital, medicines, requestTransfer, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [selectedDosage, setSelectedDosage] = useState<string>('all');
  const [selectedProximity, setSelectedProximity] = useState<string>('all');

  // Request modal state
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItem | null>(null);
  const [requestedUnits, setRequestedUnits] = useState(20);

  // Filter surplus medicines: only show other hospitals' available stock (not locked or disposed)
  const marketplaceMedicines = useMemo(() => {
    return medicines.filter(
      (m) => m.hospitalId !== currentHospital.id && m.status === 'available' && !m.isNearExpiry
    );
  }, [medicines, currentHospital.id]);

  const filteredMedicines = useMemo(() => {
    return marketplaceMedicines.filter((m) => {
      const matchesSearch =
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericComposition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStorage = selectedStorage === 'all' || m.storageCondition.includes(selectedStorage);
      const matchesDosage = selectedDosage === 'all' || m.dosageForm === selectedDosage;
      const matchesProximity =
        selectedProximity === 'all' ||
        (selectedProximity === 'ncr' && m.hospitalLocation.includes('km away'));

      return matchesSearch && matchesStorage && matchesDosage && matchesProximity;
    });
  }, [marketplaceMedicines, searchQuery, selectedStorage, selectedDosage, selectedProximity]);

  const handleOpenRequest = (med: MedicineItem) => {
    setSelectedMedicine(med);
    setRequestedUnits(Math.min(25, med.availableUnits));
  };

  const handleConfirmRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;
    requestTransfer(selectedMedicine.id, requestedUnits);
    setSelectedMedicine(null);
    navigate('/hospital/my-requests');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-teal-700 tracking-wider font-bold">
          Verified Peer-to-Peer Redistribution Exchange
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Surplus Medicine Marketplace
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Procure genuine, cold-chain verified surplus pharmaceuticals directly from accredited network hospitals at regulated concessions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active listings by molecule, trade name, or seller hospital..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white font-medium"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="all">All Storage Protocols</option>
              <option value="Cold-Chain">Cold-Chain (2-8°C) Only</option>
              <option value="Ambient">Ambient (15-25°C) Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={selectedDosage}
              onChange={(e) => setSelectedDosage(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="all">All Formulations</option>
              <option value="Vial / Injection">Vials / Injections</option>
              <option value="Cartridge / Pen">Cartridges / Pens</option>
              <option value="Prefilled Syringe">Prefilled Syringes</option>
              <option value="Infusion Bag">Infusion Bags</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={selectedProximity}
              onChange={(e) => setSelectedProximity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="all">Proximity: All India</option>
              <option value="ncr">NCR Local Fleet (&lt; 25km)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            No surplus stocks found matching your current filter criteria.
          </div>
        ) : (
          filteredMedicines.map((med) => (
            <Tilt3DCard
              key={med.id}
              maxTilt={7}
              className="bg-white/95 rounded-xl border border-slate-200/80 shadow-spatial hover:border-teal-500/70 transition-all p-5 flex flex-col justify-between shimmer-sweep"
            >
              <div>
                {/* Top Seller Institution Badge */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs shadow-xs">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 line-clamp-1">
                        {med.hospitalName}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {med.hospitalLocation}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 shadow-xs">
                    NABH VERIFIED
                  </span>
                </div>

                {/* Medicine Identity */}
                <div className="mt-3">
                  <h3 className="font-bold text-sm text-slate-900">{med.brandName}</h3>
                  <div className="text-xs text-slate-500 font-medium line-clamp-2 mt-0.5">
                    {med.genericComposition}
                  </div>
                </div>

                {/* Technical Specs Ribbon */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/80">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Strength & Form:</span>
                    <span className="font-semibold text-slate-800">{med.strength}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Storage Protocol:</span>
                    <span className={`font-semibold flex items-center gap-1 ${
                      med.storageCondition.includes('Cold') ? 'text-cyan-700' : 'text-slate-700'
                    }`}>
                      {med.storageCondition.includes('Cold') && <ThermometerSnowflake className="w-3 h-3" />}
                      {med.storageCondition.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Batch Number:</span>
                    <span className="font-semibold text-slate-800">{med.batchNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Expiry Date:</span>
                    <span className="font-semibold text-slate-800">{med.expiryDate}</span>
                  </div>
                </div>

                {/* Price Matrix */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Transfer Price</div>
                    <div className="text-lg font-bold text-teal-800 font-mono">
                      ₹{med.transferPricePerUnit.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400"> / unit</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-[10px] text-slate-400 line-through">MRP ₹{med.mrpPerUnit}</div>
                    <div className="text-xs font-bold text-emerald-600">
                      Save {med.concessionPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  <strong className="text-slate-800">{med.availableUnits}</strong> units available
                </span>

                <button
                  onClick={() => handleOpenRequest(med)}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors btn-3d"
                >
                  <Send className="w-3.5 h-3.5" /> Request Transfer
                </button>
              </div>
            </Tilt3DCard>
          ))
        )}
      </div>

      {/* Request Transfer Action Modal */}
      <Modal
        isOpen={!!selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        title="Initiate Inter-Hospital Surplus Transfer Requisition"
        subtitle={`Procuring from ${selectedMedicine?.hospitalName}`}
        maxWidth="lg"
      >
        {selectedMedicine && (
          <form onSubmit={handleConfirmRequest} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">{selectedMedicine.brandName} ({selectedMedicine.strength})</div>
              <div className="text-slate-500 mt-0.5">{selectedMedicine.genericComposition}</div>
              <div className="font-mono text-slate-600 text-[11px] mt-2">
                Batch: {selectedMedicine.batchNumber} • Expiry: {selectedMedicine.expiryDate} • Storage: {selectedMedicine.storageCondition}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Requested Quantity (Units) *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max={selectedMedicine.availableUnits}
                  required
                  value={requestedUnits}
                  onChange={(e) => setRequestedUnits(Math.min(selectedMedicine.availableUnits, Math.max(1, Number(e.target.value))))}
                  className="w-32 font-mono font-bold text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
                />
                <span className="text-slate-500 font-mono">
                  Max available: {selectedMedicine.availableUnits} units
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-lg bg-teal-50/80 border border-teal-200 text-teal-950 font-mono space-y-1.5">
              <div className="flex justify-between">
                <span>Unit Rate:</span>
                <span>₹{selectedMedicine.transferPricePerUnit}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Requisition Total:</span>
                <span className="font-bold">₹{(selectedMedicine.transferPricePerUnit * requestedUnits).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-teal-700 text-[11px]">
                <span>Platform Compliance & Escrow Fee (2%):</span>
                <span>₹{Math.round(selectedMedicine.transferPricePerUnit * requestedUnits * 0.02)}</span>
              </div>
              <div className="pt-2 border-t border-teal-200 flex justify-between font-bold text-sm text-teal-950">
                <span>Estimated Net Payable:</span>
                <span>₹{Math.round(selectedMedicine.transferPricePerUnit * requestedUnits * 1.02).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 text-[11px] flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Requisition is sent directly to the seller hospital's Chief Pharmacist. Upon approval, you can pay via Razorpay Escrow to trigger immediate refrigerated dispatch.
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedMedicine(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Requisition
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
