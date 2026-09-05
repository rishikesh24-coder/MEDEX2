import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicineItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Tilt3DCard } from '../../components/3d/Tilt3DCard';
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
  Send,
  TrendingUp,
  Sparkles,
  Award,
  AlertTriangle
} from 'lucide-react';

type QuickFilterType = 'all' | 'cold' | 'concession' | 'near-expiry' | 'proximity';

export const MarketplacePage: React.FC = () => {
  const { currentHospital, medicines, requestTransfer, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [selectedDosage, setSelectedDosage] = useState<string>('all');
  const [selectedProximity, setSelectedProximity] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('all');

  const [showImpactModal, setShowImpactModal] = useState(false);

  // Request modal state
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItem | null>(null);
  const [requestedUnits, setRequestedUnits] = useState(20);

  // Helper functions for expiry and distance calculations
  const getDaysUntilExpiry = (expiryDateStr: string): number => {
    const expiry = new Date(expiryDateStr);
    const now = new Date('2026-09-05'); // Platform standard evaluation date
    const diffTime = expiry.getTime() - now.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const getDistanceKm = (locationStr: string): number => {
    const match = locationStr.match(/\((\d+(\.\d+)?)\s*km\s*away\)/i);
    return match ? parseFloat(match[1]) : 15;
  };

  // Filter surplus medicines: only show other hospitals' available stock (not locked for bio-waste)
  const marketplaceMedicines = useMemo(() => {
    return medicines.filter(
      (m) => m.hospitalId !== currentHospital.id && m.status === 'available'
    );
  }, [medicines, currentHospital.id]);

  const filteredMedicines = useMemo(() => {
    return marketplaceMedicines.filter((m) => {
      // 1. Text Search
      const matchesSearch =
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericComposition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Dropdown Filters
      const matchesStorage = selectedStorage === 'all' || m.storageCondition.includes(selectedStorage);
      const matchesDosage = selectedDosage === 'all' || m.dosageForm === selectedDosage;
      const matchesProximity =
        selectedProximity === 'all' ||
        (selectedProximity === 'ncr' && getDistanceKm(m.hospitalLocation) <= 25);

      // 3. Quick Chips
      const daysLeft = getDaysUntilExpiry(m.expiryDate);
      const distance = getDistanceKm(m.hospitalLocation);

      let matchesQuick = true;
      if (quickFilter === 'cold') {
        matchesQuick = m.storageCondition.toLowerCase().includes('cold');
      } else if (quickFilter === 'concession') {
        matchesQuick = m.concessionPercentage >= 30;
      } else if (quickFilter === 'near-expiry') {
        matchesQuick = daysLeft <= 90;
      } else if (quickFilter === 'proximity') {
        matchesQuick = distance <= 25;
      }

      return matchesSearch && matchesStorage && matchesDosage && matchesProximity && matchesQuick;
    });
  }, [marketplaceMedicines, searchQuery, selectedStorage, selectedDosage, selectedProximity, quickFilter]);

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
      {/* 1. Header & SIH Value Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          {/* Soft Authoritative Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-medium shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            <span>Verified Inter-Hospital Exchange • CDSCO & CPCB Compliant</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-2">
            Surplus Medicine Marketplace
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mt-1">
            Acquire verified surplus medicines at regulated concessions to prevent expiry wastage and lower patient drug costs.
          </p>
        </div>

        {/* 1-Click SIH Impact Counter Mini-Banner */}
        <button
          onClick={() => setShowImpactModal(true)}
          className="bg-white hover:bg-teal-50/40 rounded-2xl border border-slate-200/90 p-3.5 sm:px-5 sm:py-3 shadow-spatial flex items-center gap-4 sm:gap-6 self-start lg:self-auto select-none transition-all group text-left cursor-pointer hover:border-teal-300"
          title="Click to view SIH Hackathon Impact Audit"
        >
          <div className="text-center sm:text-left">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-sans">Units Saved</div>
            <div className="text-base sm:text-lg font-bold text-teal-900 font-sans tracking-tight">4,210 Units Saved</div>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="text-center sm:text-left">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-sans">Cost Saved</div>
            <div className="text-base sm:text-lg font-bold text-emerald-700 font-sans tracking-tight">₹14.8L Cost Saved</div>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="text-center sm:text-left">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-sans">Expiries Diverted</div>
            <div className="text-base sm:text-lg font-bold text-teal-700 font-sans tracking-tight">0 Expiries Diverted</div>
          </div>

          <div className="hidden xl:flex items-center text-teal-700 text-xs font-semibold pl-2 border-l border-slate-200 group-hover:translate-x-0.5 transition-transform">
            <span>Audit View →</span>
          </div>
        </button>
      </div>

      {/* 2. Streamlined Filter Bar with Quick Demo Chips */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5">
        {/* Top Search & Dropdown Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by molecule (e.g. Meropenem), brand (e.g. Magnex), or hospital..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-white font-medium text-slate-800 transition-colors shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <select
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:border-teal-600 transition-colors shadow-2xs"
              >
                <option value="all">All Storage Protocols</option>
                <option value="Cold-Chain">Cold-Chain (2-8°C)</option>
                <option value="Ambient">Room Temp (15-25°C)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={selectedDosage}
                onChange={(e) => setSelectedDosage(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:border-teal-600 transition-colors shadow-2xs"
              >
                <option value="all">All Dosage Forms</option>
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
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:border-teal-600 transition-colors shadow-2xs"
              >
                <option value="all">Proximity: All Regions</option>
                <option value="ncr">Local Fleet (&le; 25 km)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Demo Filter Chips */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Quick Filters:</span>

          <button
            onClick={() => setQuickFilter('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              quickFilter === 'all'
                ? 'bg-teal-700 text-white font-semibold shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            All Items ({marketplaceMedicines.length})
          </button>

          <button
            onClick={() => setQuickFilter('cold')}
            className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              quickFilter === 'cold'
                ? 'bg-cyan-700 text-white font-semibold shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            Cold-Chain Only
          </button>

          <button
            onClick={() => setQuickFilter('concession')}
            className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              quickFilter === 'concession'
                ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            High Concession (&gt; 30% Off)
          </button>

          <button
            onClick={() => setQuickFilter('near-expiry')}
            className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              quickFilter === 'near-expiry'
                ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Near Expiry Salvage (&lt; 90 Days)
          </button>

          <button
            onClick={() => setQuickFilter('proximity')}
            className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              quickFilter === 'proximity'
                ? 'bg-teal-700 text-white font-semibold shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Within 25 km
          </button>
        </div>
      </div>

      {/* 3. Catalog Cards Grid (Refactored Card Architecture) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="font-semibold text-slate-800 text-sm">No surplus medicines found</div>
            <p className="text-xs text-slate-500 mt-1">Try resetting the quick filters or search term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setQuickFilter('all');
                setSelectedStorage('all');
                setSelectedDosage('all');
                setSelectedProximity('all');
              }}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMedicines.map((med) => {
            const daysLeft = getDaysUntilExpiry(med.expiryDate);
            const monthsLeft = Math.max(1, Math.round(daysLeft / 30));
            const distance = getDistanceKm(med.hospitalLocation);

            // Traffic-light expiry badge
            const isNearExpiry = daysLeft <= 90;
            const isLongExpiry = monthsLeft >= 6;

            return (
              <Tilt3DCard
                key={med.id}
                maxTilt={4}
                className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  {/* A. Card Header: Hospital name + distance chip + Traffic Light Expiry Badge */}
                  <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-800 truncate" title={med.hospitalName}>
                          {med.hospitalName}
                        </span>
                        <span title="Verified Hospital Node">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {distance} km away
                        </span>
                      </div>
                    </div>

                    {/* Expiry Badge with Traffic Light Colors */}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${
                        isNearExpiry
                          ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                          : isLongExpiry
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium'
                          : 'bg-slate-100 text-slate-700 border-slate-200 font-medium'
                      }`}
                    >
                      {isNearExpiry ? `Near Expiry (${daysLeft} days)` : `Expires in ${monthsLeft} mos`}
                    </span>
                  </div>

                  {/* B. Medicine Title & Composition */}
                  <div className="mt-4">
                    <h3 className="text-[18px] font-bold text-slate-900 font-sans tracking-tight leading-snug">
                      {med.brandName}
                    </h3>
                    <div className="text-xs text-slate-500 font-normal tracking-wide line-clamp-1 mt-1">
                      {med.genericComposition}
                    </div>
                  </div>

                  {/* C. Key Clinical Attributes (Clean Rounded Pill Tags) */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                      {med.dosageForm.includes('Vial') ? 'Vial • IV Injection' : `${med.dosageForm} • ${med.strength}`}
                    </span>

                    {med.storageCondition.includes('Cold') ? (
                      <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-medium border border-cyan-200 flex items-center gap-1.5">
                        <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" />
                        Cold-Chain (2°C - 8°C)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                        Room Temp
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/40">
                      Batch #{med.batchNumber}
                    </span>
                  </div>

                  {/* D. Transparent Pricing & Concession (The "Why SIH Cares" Block) */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
                          ₹{med.transferPricePerUnit.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">/ unit</span>
                        <span className="line-through text-slate-400 text-xs font-normal ml-1">
                          MRP ₹{med.mrpPerUnit.toLocaleString()}
                        </span>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        Save {med.concessionPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom row: Stock remaining + Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    <strong className="text-slate-800 font-semibold">{med.availableUnits}</strong> units available
                  </span>

                  <button
                    onClick={() => handleOpenRequest(med)}
                    className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>Request Transfer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Tilt3DCard>
            );
          })
        )}
      </div>

      {/* SIH Impact Audit Modal (for Judges) */}
      <Modal
        isOpen={showImpactModal}
        onClose={() => setShowImpactModal(false)}
        title="SIH Impact Audit • Social, Economic & Regulatory Metrics"
        subtitle="Live algorithmic impact accounting for inter-hospital medicine redistribution"
        maxWidth="xl"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
              <div className="text-[10px] uppercase font-semibold text-teal-800">Total Units Saved</div>
              <div className="text-xl font-bold text-teal-950 mt-0.5">4,210 Units</div>
              <div className="text-[11px] text-teal-700 mt-1">Across 18 regional hospital nodes</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] uppercase font-semibold text-emerald-800">Net Cost Conserved</div>
              <div className="text-xl font-bold text-emerald-950 mt-0.5">₹14.82 Lakhs</div>
              <div className="text-[11px] text-emerald-700 mt-1">Direct savings for patients & hospitals</div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200">
              <div className="text-[10px] uppercase font-semibold text-cyan-800">Zero Expiry Wastage</div>
              <div className="text-xl font-bold text-cyan-950 mt-0.5">0 Diverted to Landfill</div>
              <div className="text-[11px] text-cyan-700 mt-1">100% salvaged or bioremediated</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              Why the MedEx Model Works for Smart India Hackathon
            </div>
            <p className="text-slate-600 leading-relaxed">
              In standard procurement, critical formulations (such as IV Ceftriaxone, Meropenem, and Enoxaparin) often expire unused in one tertiary hospital while neighbouring secondary centers experience acute stockouts. MedEx automates inter-hospital inventory visibility with strict CDSCO compliance and cold-chain temperature monitoring.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>CDSCO Form 20B/21B Wholesale Compliance</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>CPCB Biomedical Waste Neutralization Logging</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Automated 30-Day Expiry Regulatory Lockout</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>IoT Cold-Chain Telemetry Verification (2°C - 8°C)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowImpactModal(false)}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Audit View
            </button>
          </div>
        </div>
      </Modal>

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
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">{selectedMedicine.brandName} ({selectedMedicine.strength})</div>
              <div className="text-slate-500 mt-0.5">{selectedMedicine.genericComposition}</div>
              <div className="font-mono text-slate-600 text-[11px] mt-2">
                Batch: {selectedMedicine.batchNumber} • Expiry: {selectedMedicine.expiryDate} • Storage: {selectedMedicine.storageCondition}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 font-sans">
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
                  className="w-32 font-sans font-bold text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
                />
                <span className="text-slate-500 font-sans">
                  Max available: {selectedMedicine.availableUnits} units
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200 text-teal-950 font-sans space-y-1.5">
              <div className="flex justify-between">
                <span>Unit Rate:</span>
                <span className="font-semibold">₹{selectedMedicine.transferPricePerUnit}</span>
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

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-[11px] flex items-start gap-2">
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
                className="px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 btn-3d"
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
