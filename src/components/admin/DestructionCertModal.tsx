import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BiomedicalWasteManifest } from '../../types';
import { useApp } from '../../context/AppContext';
import { Flame, ShieldCheck, Printer, CheckCircle2, QrCode } from 'lucide-react';

interface DestructionCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifest: BiomedicalWasteManifest | null;
}

export const DestructionCertModal: React.FC<DestructionCertModalProps> = ({ isOpen, onClose, manifest }) => {
  const { signOffBiomedicalWaste } = useApp();
  const [certInput, setCertInput] = useState(`CPCB-CERT-${Date.now().toString().slice(-5)}`);
  const [officerName, setOfficerName] = useState('Er. R.K. Bhargava, Certified CPCB Environmental Inspector');

  if (!manifest) return null;

  const isCertified = manifest.status === 'certified';

  const handleSignOff = () => {
    signOffBiomedicalWaste(manifest.id, certInput, officerName);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CPCB Biomedical Waste Destruction Certificate"
      subtitle={`Bio-Medical Waste Management Rules 2016 • Manifest: ${manifest.manifestNumber}`}
      maxWidth="3xl"
    >
      <div className="space-y-5 text-xs">
        {/* Certificate Container */}
        <div className="p-6 rounded-xl border-2 border-slate-300 bg-white shadow-sm space-y-4 font-sans relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full pointer-events-none" />

          {/* Official Emblem & Header */}
          <div className="text-center border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-700" />
              CENTRAL POLLUTION CONTROL BOARD • BIOHAZARD PROTOCOL
            </div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              Certificate of Safe Biomedical Deactivation & High-Temperature Incineration
            </h2>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Issued in compliance with Bio-Medical Waste Management Rules 2016, Rule 13 & Schedule I (Yellow Category)
            </p>
          </div>

          {/* Key Identification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 text-[10px] block">Manifest Number:</span>
              <strong className="text-slate-900">{manifest.manifestNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Net Mass Destroyed:</span>
              <strong className="text-slate-900">{manifest.weightKg} kg</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Incineration Temp:</span>
              <strong className="text-amber-700">1200°C (Dual Chamber)</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Disposal Status:</span>
              <strong className={isCertified ? 'text-emerald-700' : 'text-amber-600'}>
                {isCertified ? 'CERTIFIED DESTROYED' : 'IN CUSTODY TRANSIT'}
              </strong>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Origin Healthcare Facility</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{manifest.hospitalName}</div>
              <div className="text-slate-500 mt-1">
                Discarded Pharmaceutical: <strong className="text-slate-700">{manifest.medicineName}</strong>
              </div>
              <div className="text-slate-500">Batch Code: <span className="font-mono">{manifest.batchNumber}</span></div>
              <div className="text-slate-500">Units: <span className="font-mono">{manifest.quantity} units</span></div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Authorized Treatment Facility (CBWTF)</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{manifest.treatmentFacility}</div>
              <div className="text-slate-500 mt-1">Carrier: {manifest.courierPartner}</div>
              <div className="text-slate-500">Reason for Condemnation: <strong className="text-rose-700">{manifest.reason}</strong></div>
              <div className="text-slate-500">Destruction Method: {manifest.destructionMethod}</div>
            </div>
          </div>

          {/* Certification Seal or Sign-Off Action */}
          {isCertified ? (
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="font-bold text-emerald-950">Officially Certified & Stamped</div>
                  <div className="font-mono text-[11px] text-emerald-800">
                    Certificate No: {manifest.certificateNumber}
                  </div>
                  <div className="text-[10px] text-emerald-700">Signed Off By: {manifest.signedOffBy}</div>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-500">
                TIMESTAMP: {manifest.certifiedAt || manifest.gpsTimestamp}
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-slate-200 bg-amber-50 p-3.5 rounded-lg border border-amber-200 space-y-3">
              <div className="font-semibold text-amber-900">
                Pending Final Destruction Sign-Off (Admin / Facility Inspector Action)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                    Assign Official Certificate Number
                  </label>
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    className="w-full text-xs font-mono font-bold px-3 py-1.5 rounded-md border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                    Certified CPCB Inspector Name
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-1.5 rounded-md border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSignOff}
                  className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                >
                  <Flame className="w-4 h-4" />
                  Confirm Destruction & Digitally Sign
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print CPCB Certificate
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
