import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { StorageCondition, DosageForm, MedicineItem } from '../../types';
import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  Calculator,
  Upload,
  FileCheck,
  Calendar,
  Layers,
  ThermometerSnowflake
} from 'lucide-react';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose }) => {
  const { addMedicine } = useApp();

  const [brandName, setBrandName] = useState('Meronex 1000 IV');
  const [genericComposition, setGenericComposition] = useState('Meropenem Trihydrate IP 1000mg');
  const [dosageForm, setDosageForm] = useState<DosageForm>('Vial / Injection');
  const [strength, setStrength] = useState('1g IV Vial');
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('Ambient (15-25°C)');
  const [batchNumber, setBatchNumber] = useState('BT-2024-998');
  const [manufacturingDate, setManufacturingDate] = useState('2024-04-15');
  const [expiryDate, setExpiryDate] = useState('2027-05-30');
  const [totalUnits, setTotalUnits] = useState(250);
  const [mrpPerUnit, setMrpPerUnit] = useState(2450);
  const [concessionPercentage, setConcessionPercentage] = useState(35);
  const [billNumber, setBillNumber] = useState('INV-PFIZER-2024-912');
  const [billFileName, setBillFileName] = useState('PFIZER-ORIGINAL-TAX-INVOICE.pdf');
  const [category, setCategory] = useState<MedicineItem['category']>('Critical Care / Antibiotic');

  // Calculate days to expiry
  const { daysUntilExpiry, isNearExpiry } = useMemo(() => {
    if (!expiryDate) return { daysUntilExpiry: 999, isNearExpiry: false };
    const expiryTimestamp = new Date(expiryDate).getTime();
    const currentSimulatedTime = new Date('2026-09-05').getTime();
    const days = Math.round((expiryTimestamp - currentSimulatedTime) / (1000 * 60 * 60 * 24));
    return {
      daysUntilExpiry: days,
      isNearExpiry: days <= 30
    };
  }, [expiryDate]);

  // Dynamic price calculation
  const transferPricePerUnit = useMemo(() => {
    const calculated = mrpPerUnit * (1 - concessionPercentage / 100);
    return Math.max(0, Math.round(calculated * 100) / 100);
  }, [mrpPerUnit, concessionPercentage]);

  const totalBatchTransferValue = useMemo(() => {
    return Math.round(transferPricePerUnit * totalUnits);
  }, [transferPricePerUnit, totalUnits]);

  const totalSavingsForBuyer = useMemo(() => {
    return Math.round((mrpPerUnit - transferPricePerUnit) * totalUnits);
  }, [mrpPerUnit, transferPricePerUnit, totalUnits]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicine({
      brandName,
      genericComposition,
      dosageForm,
      strength,
      storageCondition,
      batchNumber,
      manufacturingDate,
      expiryDate,
      totalUnits: Number(totalUnits),
      mrpPerUnit: Number(mrpPerUnit),
      concessionPercentage: Number(concessionPercentage),
      billNumber,
      billPdfUrl: billFileName,
      category
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Surplus Medicine or Biomedical Waste Manifest"
      subtitle="Federated Formulary Exchange • CDSCO Form 20B Validation Gate"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Regulatory Expiry Alert Ticker */}
        {isNearExpiry ? (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3 animate-in fade-in">
            <Flame className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <span>⚠️ REGULATORY LOCKOUT ACTIVE (Expiry &lt; 30 Days)</span>
                <span className="px-1.5 py-0.5 bg-rose-200 text-rose-900 rounded font-mono text-[10px]">
                  {daysUntilExpiry} days remaining
                </span>
              </div>
              <p className="text-rose-900/90 leading-relaxed">
                Under CDSCO Rule 65 & Biomedical Waste Management Rules 2016, pharmaceuticals with less than 30 days of shelf life are prohibited from inter-hospital commercial redistribution. 
              </p>
              <p className="font-medium text-rose-800">
                Action converted: This batch will be securely routed to an authorized central incineration facility (1200°C) with CPCB chain-of-custody tracking.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-teal-50/80 border border-teal-200 text-teal-950 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Shelf Life Compliant: <strong>{daysUntilExpiry} days</strong> until expiry. Eligible for hospital network trading.</span>
            </div>
            <span className="font-mono text-[11px] bg-teal-200/80 text-teal-900 px-2 py-0.5 rounded font-semibold">
              EXCHANGE READY
            </span>
          </div>
        )}

        {/* Section 1: Pharmaceutical Specifications */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-teal-700" />
            1. Pharmaceutical Formulation & Specifications
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand / Trade Name *
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
                placeholder="e.g. Meronex 1000 IV"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Generic Scientific Composition *
              </label>
              <input
                type="text"
                required
                value={genericComposition}
                onChange={(e) => setGenericComposition(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
                placeholder="e.g. Meropenem Trihydrate IP 1000mg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dosage Form *
              </label>
              <select
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value as DosageForm)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
              >
                <option value="Vial / Injection">Vial / Injection</option>
                <option value="Cartridge / Pen">Cartridge / Pen</option>
                <option value="Prefilled Syringe">Prefilled Syringe</option>
                <option value="Infusion Bag">Infusion Bag</option>
                <option value="Tablets / Blister">Tablets / Blister</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Strength & Power *
              </label>
              <input
                type="text"
                required
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
                placeholder="e.g. 1g IV Vial or 100 IU/mL"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage & Cold Chain Protocol *
              </label>
              <div className="relative">
                <select
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
                >
                  <option value="Ambient (15-25°C)">Ambient (15-25°C)</option>
                  <option value="Cold-Chain (2-8°C)">Cold-Chain (2-8°C) — IoT Logger Required</option>
                  <option value="Ultra-Cryo (-20°C)">Ultra-Cryo (-20°C) — Biologics Carrier</option>
                </select>
                {storageCondition.includes('Cold') && (
                  <ThermometerSnowflake className="w-4 h-4 text-cyan-600 absolute right-3 top-2.5 pointer-events-none" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Therapeutic Formulary Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MedicineItem['category'])}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
              >
                <option value="Critical Care / Antibiotic">Critical Care / Antibiotic</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Anticoagulant">Anticoagulant</option>
                <option value="Oncology">Oncology</option>
                <option value="Cardiology">Cardiology</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Batch Ledger & Expiry Verification */}
        <div className="border-t border-slate-200 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            2. Batch Ledger & Quality Audit
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Manufacturer Batch Number *
              </label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
                className="w-full text-xs font-mono font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs uppercase"
                placeholder="BT-2024-889"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Manufacturing Date *
              </label>
              <input
                type="date"
                required
                value={manufacturingDate}
                onChange={(e) => setManufacturingDate(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={`w-full text-xs font-medium px-3 py-2 rounded-lg border focus:outline-hidden focus:ring-2 focus:border-transparent bg-white shadow-xs ${
                  isNearExpiry
                    ? 'border-rose-400 text-rose-700 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-teal-600'
                }`}
              />
              <span className={`text-[10px] mt-1 block font-mono ${isNearExpiry ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                {daysUntilExpiry > 0 ? `${daysUntilExpiry} days to expiry` : 'Already expired'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Dynamic Concession & Price Calculator */}
        {!isNearExpiry && (
          <div className="border-t border-slate-200 pt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5 text-teal-700" />
              3. Dynamic Concession & Transfer Price Calculator
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Available Units for Transfer *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs font-mono font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Original Purchase MRP (₹/unit) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={mrpPerUnit}
                  onChange={(e) => setMrpPerUnit(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs font-mono font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Concession Offered (%) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={concessionPercentage}
                    onChange={(e) => setConcessionPercentage(Number(e.target.value))}
                    className="flex-1 accent-teal-700"
                  />
                  <span className="font-mono text-xs font-bold text-teal-800 w-12 text-right">
                    {concessionPercentage}%
                  </span>
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {[20, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setConcessionPercentage(pct)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                        concessionPercentage === pct
                          ? 'bg-teal-700 text-white border-teal-700 font-bold'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-Time Mathematical Pricing Ledger Card */}
            <div className="p-4 rounded-lg bg-slate-900 text-white font-mono text-xs space-y-2.5">
              <div className="flex justify-between items-center text-slate-400 text-[11px] pb-2 border-b border-slate-800">
                <span>FORMULA: TRANSFER_PRICE = MRP × (1 - CONCESSION%)</span>
                <span className="text-teal-400 font-semibold">DYNAMIC ENGINE</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Transfer Price / Unit</div>
                  <div className="text-base font-bold text-teal-300">
                    ₹{transferPricePerUnit.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">From ₹{mrpPerUnit} MRP</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Total Batch Recovery</div>
                  <div className="text-base font-bold text-emerald-400">
                    ₹{totalBatchTransferValue.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">For {totalUnits} units</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Buyer Peer Savings</div>
                  <div className="text-base font-bold text-amber-300">
                    ₹{totalSavingsForBuyer.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">Capital conserved</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Original Bill & Compliance Verification */}
        <div className="border-t border-slate-200 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <FileCheck className="w-3.5 h-3.5 text-teal-700" />
            4. Original Purchase Bill & Batch Test Certificate
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Original Purchase Invoice / Bill No. *
              </label>
              <input
                type="text"
                required
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="w-full text-xs font-mono font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white shadow-xs"
                placeholder="INV-PUR-2024-9102"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Bill & Quality Release Slip (PDF) *
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 hover:border-teal-600 bg-slate-50 hover:bg-teal-50/50 transition-colors text-xs text-slate-600">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{billFileName}</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setBillFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          {isNearExpiry ? (
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-lg bg-rose-700 hover:bg-rose-800 text-white shadow-md border border-rose-800 flex items-center gap-2 transition-all"
            >
              <Flame className="w-4 h-4" />
              Route to Safe Biomedical Disposal Stream
            </button>
          ) : (
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-md border border-teal-800 flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Publish to Verified Hospital Network
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};
