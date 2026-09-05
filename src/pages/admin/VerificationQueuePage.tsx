import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hospital } from '../../types';
import { Modal } from '../../components/common/Modal';
import { downloadSimulatedPdf } from '../../utils/exportUtils';
import {
  CheckCircle2,
  XCircle,
  FileCheck,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Send,
  Eye,
  ThermometerSnowflake,
  Clock,
  Download
} from 'lucide-react';

export const VerificationQueuePage: React.FC = () => {
  const { hospitals, adminApproveHospital, adminRejectHospital } = useApp();

  const [rejectHospitalModal, setRejectHospitalModal] = useState<Hospital | null>(null);
  const [rejectNotice, setRejectNotice] = useState('Missing Form 20B renewal endorsement for current fiscal year.');

  const pendingHospitals = hospitals.filter((h) => h.status === 'pending');

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectHospitalModal) return;
    adminRejectHospital(rejectHospitalModal.id, rejectNotice);
    setRejectHospitalModal(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-amber-400 tracking-wider font-bold">
          CDSCO Onboarding Inbox
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
          Hospital Institutional Verification Queue
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Perform statutory background checks, cross-examine state drug licenses, and grant network redistribution trading authorization.
        </p>
      </div>

      {pendingHospitals.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-3 backdrop-blur-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-100">Verification Queue is Clear</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All submitted hospital applications have been adjudicated. New hospital registrations will automatically surface here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-slate-900/90 rounded-2xl border-2 border-amber-500/50 p-6 shadow-xl space-y-6 backdrop-blur-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 font-mono text-[10px] font-bold uppercase border border-amber-800/80">
                      PENDING AUDIT
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Reg: {hosp.regNo}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 mt-1 font-display">
                    {hosp.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {hosp.address}, {hosp.city}, {hosp.state} - {hosp.pinCode}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectHospitalModal(hosp)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 text-rose-300 hover:border-rose-700 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline & Issue Statutory Deficiency Notice</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => adminApproveHospital(hosp.id)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Authorize Hospital Trading Credentials</span>
                  </button>
                </div>
              </div>

              {/* Statutory Checklist Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Left: Officer & Facilities */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
                    Institutional Profile & Facilities
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Authorized Nodal Officer:</span>
                      <strong className="text-slate-100">{hosp.officerName}</strong> ({hosp.officerDesignation})
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Direct Line & Official Email:</span>
                      <span className="font-mono text-slate-300">{hosp.phone} • {hosp.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Cold-Chain Infrastructure:</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-teal-300">
                        <ThermometerSnowflake className="w-3.5 h-3.5 text-teal-400" />
                        {hosp.coldStorageFacility ? 'Dedicated 2-8°C & -20°C Vaults Installed' : 'Ambient Only'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Uploaded Legal Documents */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
                    Uploaded Statutory Document Filings
                  </div>

                  <div className="space-y-2">
                    <DocItem label="Hospital Registration / NABH" filename={hosp.complianceDocs.regCertUrl} hospitalName={hosp.name} />
                    <DocItem label="Wholesale Drug License Form 20B/21B" filename={hosp.complianceDocs.drugLicenseUrl} hospitalName={hosp.name} />
                    <DocItem label="Entity GSTIN Certificate" filename={hosp.complianceDocs.gstinCertUrl} hospitalName={hosp.name} />
                    <DocItem label="Board Authorization Letter" filename={hosp.complianceDocs.boardResolutionUrl} hospitalName={hosp.name} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Notice Modal */}
      <Modal
        isOpen={!!rejectHospitalModal}
        onClose={() => setRejectHospitalModal(null)}
        title="Issue Statutory Rejection Notice"
        subtitle={`Applicant: ${rejectHospitalModal?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
          <p className="text-slate-300">
            State the formal regulatory deficiency preventing immediate network onboarding:
          </p>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Select Deficiency Notice *
            </label>
            <textarea
              rows={4}
              required
              value={rejectNotice}
              onChange={(e) => setRejectNotice(e.target.value)}
              className="w-full font-medium p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-rose-500 bg-slate-950 text-slate-100"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejectHospitalModal(null)}
              className="px-4 py-2 font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel & Keep Application in Queue
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors"
            >
              Dispatch Statutory Deficiency Notice & Reject Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const DocItem: React.FC<{ label: string; filename: string; hospitalName: string }> = ({ label, filename, hospitalName }) => {
  const { addToast } = useApp();

  return (
    <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
      <div className="overflow-hidden mr-2">
        <div className="font-semibold text-slate-200 text-[11px] truncate">{label}</div>
        <div className="font-mono text-[10px] text-slate-500 truncate">{filename}</div>
      </div>
      <button
        type="button"
        onClick={() => {
          downloadSimulatedPdf(
            filename,
            label.toUpperCase(),
            [
              ['Document Title', label],
              ['Hospital Entity', hospitalName],
              ['Verification Status', 'FILED & PENDING ONBOARDING REVIEW'],
              ['Regulatory Body', 'State Drug Controller Licensing Department (Form 20B/21B)'],
              ['Audit Timestamp', new Date().toISOString()]
            ]
          );
          addToast(`Downloaded statutory application document: ${filename}`, 'success');
        }}
        className="text-[10px] font-mono font-bold text-teal-300 hover:text-teal-200 px-2 py-0.5 rounded bg-teal-950/60 hover:bg-teal-900/60 border border-teal-800/60 shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
        title="Inspect & Download Document"
      >
        <Eye className="w-3 h-3 text-teal-400" />
        <span>Inspect & Verify (PDF)</span>
      </button>
    </div>
  );
};
