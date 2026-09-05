import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicineItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Tilt3DCard } from '../../components/3d/Tilt3DCard';
import { BillPreviewModal } from '../../components/hospital/BillPreviewModal';
import {
  Search,
  Building2,
  MapPin,
  ThermometerSnowflake,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  TrendingUp,
  AlertTriangle,
  CalendarClock,
  PackageCheck,
  FileText
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
  const [previewMedicine, setPreviewMedicine] = useState<MedicineItem | null>(null);

  // Helper: days until expiry
  const getDaysUntilExpiry = (expiryDateStr: string): number => {
    const expiry = new Date(expiryDateStr);
    const now = new Date('2026-09-05');
    const diffTime = expiry.getTime() - now.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Helper: parse distance from location string
  const getDistanceKm = (locationStr: string): number => {
    const match = locationStr.match(/\((\d+(\.\d+)?)\s*km\s*away\)/i);
    return match ? parseFloat(match[1]) : 15;
  };

  // Format expiry date readable e.g. "Apr 2027"
  const formatExpiryDate = (expiryDateStr: string): string => {
    const date = new Date(expiryDateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  // Filtered marketplace medicines (exclude own hospital, unavailable stock)
  const marketplaceMedicines = useMemo(() => {
    return medicines.filter(
      (m) => m.hospitalId !== currentHospital.id && m.status === 'available'
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
        (selectedProximity === 'ncr' && getDistanceKm(m.hospitalLocation) <= 25);

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
    <div className="py-10 px-6 max-w-7xl mx-auto space-y-8">

      {/* ── 1. PAGE HEADER & SIH IMPACT COUNTER ── */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        <div className="flex-1">
          {/* Eyebrow compliance badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/60 border border-teal-700/50 text-teal-300 text-sm font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Verified Inter-Hospital Exchange • CDSCO & CPCB Compliant
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-4 leading-tight">
            Surplus Medicine Marketplace
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-normal leading-relaxed mt-2 max-w-2xl">
            Acquire verified surplus medicines at regulated concessions to prevent expiry wastage and reduce patient drug costs.
          </p>
        </div>

        {/* SIH Impact Counter — clickable audit view */}
        <button
          onClick={() => setShowImpactModal(true)}
          className="group bg-slate-900/90 hover:bg-slate-850 rounded-2xl border border-slate-800 hover:border-teal-500/50 px-6 py-5 shadow-xl flex items-center gap-6 self-start transition-all duration-200 text-left cursor-pointer"
          title="Click to view SIH Hackathon Impact Audit"
        >
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-slate-400">Units Saved</div>
            <div className="text-2xl font-extrabold text-teal-300 tracking-tight mt-0.5">4,210</div>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-slate-400">Cost Saved</div>
            <div className="text-2xl font-extrabold text-emerald-300 tracking-tight mt-0.5">₹14.8L</div>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-slate-400">Expiries Diverted</div>
            <div className="text-2xl font-extrabold text-teal-400 tracking-tight mt-0.5">Zero</div>
          </div>
          <div className="hidden xl:flex items-center gap-1 text-teal-400 text-sm font-semibold pl-4 border-l border-slate-800 group-hover:translate-x-1 transition-transform duration-200">
            Audit View <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* ── 2. SEARCH & FILTER BAR ── */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Search row */}
        <div className="flex flex-wrap items-center gap-4 p-5 border-b border-slate-800">
          {/* Search input — h-14 equivalent */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by salt name, brand, or nearby hospital..."
              className="w-full h-14 pl-12 pr-4 text-base rounded-xl border border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-slate-950 font-medium text-slate-100 placeholder:text-slate-500 transition-all outline-none"
            />
          </div>

          {/* Filter dropdowns — h-14 */}
          <select
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            className="h-14 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm font-medium text-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none cursor-pointer"
            aria-label="Storage Protocol"
          >
            <option value="all">Storage Protocol</option>
            <option value="Cold-Chain">Cold-Chain (2–8°C)</option>
            <option value="Ambient">Room Temp (15–25°C)</option>
          </select>

          <select
            value={selectedDosage}
            onChange={(e) => setSelectedDosage(e.target.value)}
            className="h-14 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm font-medium text-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none cursor-pointer"
            aria-label="Formulation"
          >
            <option value="all">Formulation</option>
            <option value="Vial / Injection">Vials / Injections</option>
            <option value="Cartridge / Pen">Cartridges / Pens</option>
            <option value="Prefilled Syringe">Prefilled Syringes</option>
            <option value="Infusion Bag">Infusion Bags</option>
          </select>

          <select
            value={selectedProximity}
            onChange={(e) => setSelectedProximity(e.target.value)}
            className="h-14 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm font-medium text-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none cursor-pointer"
            aria-label="Radius"
          >
            <option value="all">Radius: All India</option>
            <option value="ncr">Local Fleet (≤ 25 km)</option>
          </select>
        </div>

        {/* Quick Filter Chips */}
        <div className="px-5 py-4 flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-semibold text-slate-400 mr-1 shrink-0">Quick Filters:</span>

          {[
            { key: 'all' as QuickFilterType, label: `All Items (${marketplaceMedicines.length})`, color: 'teal', icon: null },
            { key: 'cold' as QuickFilterType, label: 'Cold-Chain Only', color: 'cyan', icon: <ThermometerSnowflake className="w-4 h-4" /> },
            { key: 'concession' as QuickFilterType, label: 'High Concession (> 30% Off)', color: 'emerald', icon: <TrendingUp className="w-4 h-4" /> },
            { key: 'near-expiry' as QuickFilterType, label: 'Near Expiry Salvage (< 90 Days)', color: 'amber', icon: <AlertTriangle className="w-4 h-4" /> },
            { key: 'proximity' as QuickFilterType, label: 'Within 25 km', color: 'teal', icon: <MapPin className="w-4 h-4" /> },
          ].map(({ key, label, color, icon }) => {
            const active = quickFilter === key;
            const activeClasses: Record<string, string> = {
              teal: 'bg-teal-600 text-white border-teal-500 shadow-md',
              cyan: 'bg-cyan-600 text-white border-cyan-500 shadow-md',
              emerald: 'bg-emerald-600 text-white border-emerald-500 shadow-md',
              amber: 'bg-amber-600 text-white border-amber-500 shadow-md',
            };
            return (
              <button
                key={key}
                onClick={() => setQuickFilter(key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 cursor-pointer ${
                  active
                    ? activeClasses[color]
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. MEDICINE CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredMedicines.length === 0 ? (
          <div className="col-span-3 py-20 text-center bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-lg font-semibold text-white">No surplus medicines found</div>
            <p className="text-sm text-slate-400 mt-1.5">Try resetting the quick filters or adjusting your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setQuickFilter('all');
                setSelectedStorage('all');
                setSelectedDosage('all');
                setSelectedProximity('all');
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMedicines.map((med) => {
            const daysLeft = getDaysUntilExpiry(med.expiryDate);
            const monthsLeft = Math.max(1, Math.round(daysLeft / 30));
            const distance = getDistanceKm(med.hospitalLocation);
            const isNearExpiry = daysLeft <= 90;
            const isLongExpiry = monthsLeft >= 6;
            const expiryLabel = isNearExpiry
              ? `Near Expiry — ${daysLeft} days`
              : `Expires: ${formatExpiryDate(med.expiryDate)}`;
            const isColdChain = med.storageCondition.includes('Cold');

            return (
              <Tilt3DCard
                key={med.id}
                maxTilt={3}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:border-teal-500/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* ── TOP UTILITY ROW ── */}
                  <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-800/60 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-slate-100 truncate leading-tight">
                          {med.hospitalName}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="text-sm text-slate-400">{distance} km away</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold shrink-0 ml-3">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      NABH Verified
                    </div>
                  </div>

                  {/* ── CORE CLINICAL IDENTITY ── */}
                  <div className="px-7 my-5">
                    <h3 className="text-2xl font-bold text-white leading-snug">
                      {med.brandName}
                    </h3>
                    <p className="text-sm md:text-base text-slate-400 font-medium leading-normal mt-1.5 line-clamp-2">
                      {med.genericComposition}
                    </p>
                  </div>

                  {/* ── ATTRIBUTE TAG RIBBON ── */}
                  <div className="px-7 flex flex-wrap items-center gap-2.5 pb-1">
                    {/* Temperature / Storage Tag */}
                    {isColdChain ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-sm font-semibold">
                        <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
                        Cold-Chain (2°C – 8°C)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-sm font-semibold">
                        Room Temp (15–25°C)
                      </span>
                    )}

                    {/* Form / Strength Tag */}
                    <span className="px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-sm font-semibold">
                      {med.dosageForm.includes('Vial') ? `${med.strength} IV Vial` : `${med.dosageForm} • ${med.strength}`}
                    </span>

                    {/* Expiry Badge with traffic-light color dot */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold ${
                      isNearExpiry
                        ? 'bg-amber-950/60 border-amber-800/60 text-amber-300'
                        : isLongExpiry
                        ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        isNearExpiry ? 'bg-amber-400' : isLongExpiry ? 'bg-emerald-400' : 'bg-slate-500'
                      }`} />
                      <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                      {expiryLabel}
                    </span>

                    {/* Batch number — monospace only for regulatory ID */}
                    <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
                      Batch #{med.batchNumber}
                    </span>
                  </div>
                </div>

                {/* ── COMMERCIAL & CONVERSION FOOTER ── */}
                <div className="mx-7 mt-6 mb-7 bg-slate-950/80 rounded-2xl border border-slate-800 p-5">
                  <div className="flex items-end justify-between gap-4">
                    {/* Pricing block */}
                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-3xl font-extrabold text-teal-300 tracking-tight">
                          ₹{med.transferPricePerUnit.toLocaleString()}
                        </span>
                        <span className="text-base text-slate-400 font-normal">/ unit</span>
                      </div>
                      <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                        <span className="text-base text-slate-500 line-through">
                          MRP ₹{med.mrpPerUnit.toLocaleString()}
                        </span>
                        <span className="text-sm font-bold bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 px-3 py-1 rounded-full">
                          Save {med.concessionPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Stock + CTA block */}
                    <div className="flex flex-col items-end gap-2.5 shrink-0">
                      <div className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
                        <PackageCheck className="w-4 h-4 text-teal-400" />
                        <strong className="text-white font-semibold">{med.availableUnits}</strong> units left
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewMedicine(med)}
                          className="h-12 px-3.5 text-xs font-semibold rounded-xl border border-slate-700 hover:border-teal-500 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          title="Inspect Original Supplier Invoice (PDF)"
                        >
                          <FileText className="w-4 h-4 text-teal-400" />
                          <span>Inspect Invoice</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenRequest(med)}
                          className="h-12 px-5 text-sm font-semibold rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-md flex items-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                        >
                          <span>Initiate Purchase Requisition</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tilt3DCard>
            );
          })
        )}
      </div>

      {/* ── SIH IMPACT AUDIT MODAL ── */}
      <Modal
        isOpen={showImpactModal}
        onClose={() => setShowImpactModal(false)}
        title="SIH Impact Audit • Social, Economic & Regulatory Metrics"
        subtitle="Live algorithmic impact accounting for inter-hospital medicine redistribution"
        maxWidth="xl"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/60 text-teal-200">
              <div className="text-xs uppercase font-semibold tracking-wider text-teal-400">Total Units Saved</div>
              <div className="text-2xl font-extrabold text-teal-300 mt-1">4,210 Units</div>
              <div className="text-sm text-teal-400 mt-1">Across 18 regional hospital nodes</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200">
              <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400">Net Cost Conserved</div>
              <div className="text-2xl font-extrabold text-emerald-300 mt-1">₹14.82 Lakhs</div>
              <div className="text-sm text-emerald-400 mt-1">Direct savings for patients & hospitals</div>
            </div>
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
              <div className="text-xs uppercase font-semibold tracking-wider text-cyan-400">Zero Expiry Wastage</div>
              <div className="text-2xl font-extrabold text-cyan-300 mt-1">0 to Landfill</div>
              <div className="text-sm text-cyan-400 mt-1">100% salvaged or bioremediated</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              Why the MedEx Model Works for Smart India Hackathon
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              In standard procurement, critical formulations (such as IV Ceftriaxone, Meropenem, and Enoxaparin) often expire unused in one tertiary hospital while neighbouring secondary centers experience acute stockouts. MedEx automates inter-hospital inventory visibility with strict CDSCO compliance and cold-chain temperature monitoring.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800">
              {[
                'CDSCO Form 20B/21B Wholesale Compliance',
                'CPCB Biomedical Waste Neutralization Logging',
                'Automated 30-Day Expiry Regulatory Lockout',
                'IoT Cold-Chain Telemetry Verification (2°C – 8°C)',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => setShowImpactModal(false)}
              className="h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Close Audit View
            </button>
          </div>
        </div>
      </Modal>

      {/* ── REQUEST TRANSFER MODAL ── */}
      <Modal
        isOpen={!!selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        title="Initiate Inter-Hospital Surplus Transfer Requisition"
        subtitle={`Procuring from ${selectedMedicine?.hospitalName}`}
        maxWidth="lg"
      >
        {selectedMedicine && (
          <form onSubmit={handleConfirmRequest} className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="font-bold text-white text-base">{selectedMedicine.brandName} ({selectedMedicine.strength})</div>
              <div className="text-sm text-slate-400 mt-0.5">{selectedMedicine.genericComposition}</div>
              <div className="font-mono text-slate-500 text-xs mt-2">
                Batch: {selectedMedicine.batchNumber} • Expiry: {selectedMedicine.expiryDate} • Storage: {selectedMedicine.storageCondition}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Requested Quantity (Units) *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max={selectedMedicine.availableUnits}
                  required
                  value={requestedUnits}
                  onChange={(e) => setRequestedUnits(Math.min(selectedMedicine.availableUnits, Math.max(1, Number(e.target.value))))}
                  className="w-36 font-bold text-base px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-white outline-none"
                />
                <span className="text-sm text-slate-400">
                  Max available: <strong className="text-white">{selectedMedicine.availableUnits}</strong> units
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/60 text-teal-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Unit Rate:</span>
                <span className="font-semibold text-white">₹{selectedMedicine.transferPricePerUnit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Base Requisition Total:</span>
                <span className="font-bold text-white">₹{(selectedMedicine.transferPricePerUnit * requestedUnits).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-teal-400">
                <span>Platform Compliance & Escrow Fee (2%):</span>
                <span>₹{Math.round(selectedMedicine.transferPricePerUnit * requestedUnits * 0.02).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-teal-800/60 flex justify-between font-bold text-base text-teal-300">
                <span>Estimated Net Payable:</span>
                <span>₹{Math.round(selectedMedicine.transferPricePerUnit * requestedUnits * 1.02).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-200 text-sm flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Requisition is sent directly to the seller hospital's Chief Pharmacist. Upon approval, pay via Razorpay Escrow to trigger immediate refrigerated dispatch.
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedMedicine(null)}
                className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer"
              >
                Cancel & Close Requisition
              </button>
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Confirm & Dispatch Purchase Requisition
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Bill Preview Modal */}
      <BillPreviewModal
        isOpen={!!previewMedicine}
        onClose={() => setPreviewMedicine(null)}
        medicine={previewMedicine}
      />
    </div>
  );
};
