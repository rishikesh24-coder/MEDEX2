import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BiomedicalWasteManifest } from '../../types';
import { useApp } from '../../context/AppContext';
import { Flame, ShieldCheck, Printer, CheckCircle2, QrCode, Download } from 'lucide-react';
import { downloadSimulatedPdf } from '../../utils/exportUtils';

interface DestructionCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifest: BiomedicalWasteManifest | null;
}

export const DestructionCertModal: React.FC<DestructionCertModalProps> = ({ isOpen, onClose, manifest }) => {
  const { signOffBiomedicalWaste, addToast } = useApp();
  const [certInput, setCertInput] = useState(`CPCB-CERT-${Date.now().toString().slice(-5)}`);
  const [officerName, setOfficerName] = useState('Er. R.K. Bhargava, Certified CPCB Environmental Inspector');

  if (!manifest) return null;

  const isCertified = manifest.status === 'certified';

  const handleSignOff = () => {
    signOffBiomedicalWaste(manifest.id, certInput, officerName);
    onClose();
  };

  const handleDownloadCertificate = () => {
    downloadSimulatedPdf(
      `CPCB-CERTIFICATE-${manifest.manifestNumber}.txt`,
      'CERTIFICATE OF SAFE BIOMEDICAL DEACTIVATION & INCINERATION',
      {
        'Manifest Number': manifest.manifestNumber,
        'Certificate Number': manifest.certificateNumber || certInput,
        'Origin Healthcare Facility': manifest.hospitalName,
        'Condemned Formulation': manifest.medicineName,
        'Batch Number': manifest.batchNumber,
        'Total Mass Destroyed': `${manifest.weightKg} kg (${manifest.quantity} units)`,
        'Reason for Condemnation': manifest.reason,
        'Treatment Facility': manifest.treatmentFacility,
        'Incineration Temperature': '1200°C (Dual Chamber Flue Monitored)',
        'Carrier Log': manifest.courierPartner,
        'Status': isCertified ? 'CERTIFIED DESTROYED & BIODEACTIVATED' : 'IN-PROGRESS CPCB AUDIT',
        'Signed Off By': manifest.signedOffBy || officerName,
        'Certification Timestamp': manifest.certifiedAt || new Date().toISOString()
      }
    );
    addToast(`Downloaded official CPCB Destruction Certificate for Manifest ${manifest.manifestNumber}.`, 'success');
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
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/95 shadow-2xl space-y-4 font-sans relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/5 rounded-full pointer-events-none" />

          {/* Official Emblem & Header */}
          <div className="text-center border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-700/50 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              CENTRAL POLLUTION CONTROL BOARD • BIOHAZARD PROTOCOL
            </div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight">
              Certificate of Safe Biomedical Deactivation & High-Temperature Incineration
            </h2>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Issued in compliance with Bio-Medical Waste Management Rules 2016, Rule 13 & Schedule I (Yellow Category)
            </p>
          </div>

          {/* Key Identification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 text-[10px] block">Manifest Number:</span>
              <strong className="text-slate-100">{manifest.manifestNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Net Mass Destroyed:</span>
              <strong className="text-slate-100">{manifest.weightKg} kg</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Incineration Temp:</span>
              <strong className="text-amber-400">1200°C (Dual Chamber)</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Disposal Status:</span>
              <strong className={isCertified ? 'text-emerald-400' : 'text-amber-400'}>
                {isCertified ? 'CERTIFIED DESTROYED' : 'IN CUSTODY TRANSIT'}
              </strong>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Origin Healthcare Facility</div>
              <div className="font-bold text-slate-100 text-sm mt-0.5">{manifest.hospitalName}</div>
              <div className="text-slate-400 mt-1">
                Discarded Pharmaceutical: <strong className="text-slate-200">{manifest.medicineName}</strong>
              </div>
              <div className="text-slate-400">Batch Code: <span className="font-mono text-slate-300">{manifest.batchNumber}</span></div>
              <div className="text-slate-400">Units: <span className="font-mono text-slate-300">{manifest.quantity} units</span></div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Authorized Treatment Facility (CBWTF)</div>
              <div className="font-bold text-slate-100 text-sm mt-0.5">{manifest.treatmentFacility}</div>
              <div className="text-slate-400 mt-1">Carrier: {manifest.courierPartner}</div>
              <div className="text-slate-400">Reason for Condemnation: <strong className="text-rose-400">{manifest.reason}</strong></div>
              <div className="text-slate-400">Destruction Method: {manifest.destructionMethod}</div>
            </div>
          </div>

          {/* Certification Seal or Sign-Off Action */}
          {isCertified ? (
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between bg-emerald-950/40 p-3.5 rounded-lg border border-emerald-800/60">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <div className="font-bold text-emerald-200">Officially Certified & Stamped</div>
                  <div className="font-mono text-[11px] text-emerald-300">
                    Certificate No: {manifest.certificateNumber}
                  </div>
                  <div className="text-[10px] text-emerald-400">Signed Off By: {manifest.signedOffBy}</div>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-400">
                TIMESTAMP: {manifest.certifiedAt || manifest.gpsTimestamp}
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-slate-800 bg-amber-950/30 p-3.5 rounded-lg border border-amber-800/50 space-y-3">
              <div className="font-semibold text-amber-200">
                Pending Final Destruction Sign-Off (Admin / Facility Inspector Action)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                    Assign Official Certificate Number
                  </label>
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    className="w-full text-xs font-mono font-bold px-3 py-1.5 rounded-md border border-slate-700 bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                    Certified CPCB Inspector Name
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-1.5 rounded-md border border-slate-700 bg-slate-950 text-slate-100"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSignOff}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  Digitally Sign & Certify Thermal Destruction
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleDownloadCertificate}
            className="px-4 py-2 rounded-lg border border-amber-500/40 bg-amber-950/60 hover:bg-amber-900/80 text-xs font-semibold text-amber-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" /> Download Certified CPCB Certificate (PDF)
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-200 hover:bg-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-300" /> Print CPCB Certificate
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Certificate Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
};
