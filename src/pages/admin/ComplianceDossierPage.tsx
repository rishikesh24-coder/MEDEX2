import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hospital } from '../../types';
import { Modal } from '../../components/common/Modal';
import { downloadSimulatedPdf } from '../../utils/exportUtils';
import {
  ShieldCheck,
  Building2,
  FileCheck,
  Edit,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Save,
  MapPin,
  ThermometerSnowflake
} from 'lucide-react';

export const ComplianceDossierPage: React.FC = () => {
  const { hospitals, updateHospitalDetails, addToast } = useApp();
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(hospitals[0]);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [officerName, setOfficerName] = useState(selectedHospital.officerName);
  const [officerDesignation, setOfficerDesignation] = useState(selectedHospital.officerDesignation);
  const [email, setEmail] = useState(selectedHospital.email);
  const [phone, setPhone] = useState(selectedHospital.phone);
  const [activeDocPreview, setActiveDocPreview] = useState<{ title: string; filename: string } | null>(null);

  const handleSelectHospital = (h: Hospital) => {
    setSelectedHospital(h);
    setOfficerName(h.officerName);
    setOfficerDesignation(h.officerDesignation);
    setEmail(h.email);
    setPhone(h.phone);
    setIsEditing(false);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalDetails(selectedHospital.id, {
      officerName,
      officerDesignation,
      email,
      phone
    });
    setIsEditing(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-teal-400 tracking-wider font-bold">
          National Drug Controller Compliance Registry
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
          Hospital Compliance & Document Dossier
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Institutional accreditation inspection view, inline statutory credential previewer, and bidirectional nodal officer directory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Hospital Selector */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Registered Institutions ({hospitals.length})
          </div>

          {hospitals.map((h) => {
            const isSelected = selectedHospital.id === h.id;

            return (
              <div
                key={h.id}
                onClick={() => handleSelectHospital(h)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-500/80 bg-teal-950/40 shadow-spatial ring-1 ring-teal-500/50'
                    : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 backdrop-blur-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-slate-100 line-clamp-1">{h.name}</div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                    h.status === 'verified'
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                      : h.status === 'pending'
                      ? 'bg-amber-950/50 text-amber-300 border border-amber-800/60'
                      : 'bg-rose-950/50 text-rose-300 border border-rose-800/60'
                  }`}>
                    {h.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Reg No: {h.regNo}</div>
                <div className="text-[11px] text-slate-400 mt-2 truncate">{h.officerName}</div>
              </div>
            );
          })}
        </div>

        {/* Right Dossier View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Institutional Dossier Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6 backdrop-blur-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/80">
                    {selectedHospital.regNo}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> State Drug Controller Verified
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mt-1 font-display">
                  {selectedHospital.name}
                </h2>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {selectedHospital.address}, {selectedHospital.city}, {selectedHospital.state} - {selectedHospital.pinCode}
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 bg-slate-900 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-teal-400" />
                  <span>Edit Authorized Nodal Officer Details</span>
                </button>
              )}
            </div>

            {/* Nodal Officer Credentials (Bidirectional Editor) */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Authorized Nodal Officer & Contact Directory</span>
                {isEditing && (
                  <span className="text-teal-400 text-[11px] font-semibold">Editing Mode Active</span>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Nodal Officer Name</label>
                    <input
                      type="text"
                      required
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full font-medium px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Designation</label>
                    <input
                      type="text"
                      required
                      value={officerDesignation}
                      onChange={(e) => setOfficerDesignation(e.target.value)}
                      className="w-full font-medium px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full font-medium px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full font-medium px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Cancel Editing
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Updated Officer Details</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Nodal Officer:</span>
                    <div className="font-bold text-slate-100 mt-0.5">{selectedHospital.officerName}</div>
                    <div className="text-slate-400">{selectedHospital.officerDesignation}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Contact Channels:</span>
                    <div className="font-mono text-slate-200 mt-0.5">{selectedHospital.email}</div>
                    <div className="font-mono text-slate-200">{selectedHospital.phone}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Documents Inline Vault Previewer */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Statutory Compliance Document Vault (4 Critical Verifications)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <DocumentCard
                  title="Hospital Registration / NABH Certificate"
                  filename={selectedHospital.complianceDocs.regCertUrl}
                  hospitalName={selectedHospital.name}
                  onPreview={() =>
                    setActiveDocPreview({
                      title: 'Hospital Registration & Accreditation Certificate',
                      filename: selectedHospital.complianceDocs.regCertUrl
                    })
                  }
                />
                <DocumentCard
                  title="Form 20B / 21B Wholesale Drug License"
                  filename={selectedHospital.complianceDocs.drugLicenseUrl}
                  hospitalName={selectedHospital.name}
                  onPreview={() =>
                    setActiveDocPreview({
                      title: 'Form 20B Wholesale Drug License',
                      filename: selectedHospital.complianceDocs.drugLicenseUrl
                    })
                  }
                />
                <DocumentCard
                  title="Goods & Services Tax (GSTIN) Certificate"
                  filename={selectedHospital.complianceDocs.gstinCertUrl}
                  hospitalName={selectedHospital.name}
                  onPreview={() =>
                    setActiveDocPreview({
                      title: 'GSTIN Entity Registration Proof',
                      filename: selectedHospital.complianceDocs.gstinCertUrl
                    })
                  }
                />
                <DocumentCard
                  title="Board Authorization & Resolution Letter"
                  filename={selectedHospital.complianceDocs.boardResolutionUrl}
                  hospitalName={selectedHospital.name}
                  onPreview={() =>
                    setActiveDocPreview({
                      title: 'Board Authorization for Nodal Officer',
                      filename: selectedHospital.complianceDocs.boardResolutionUrl
                    })
                  }
                />
              </div>

              {selectedHospital.complianceDocs.notes && (
                <div className="mt-4 p-3 bg-teal-950/40 border border-teal-800/60 rounded-lg text-xs text-teal-200">
                  <strong className="text-teal-400">Auditor Inspection Note:</strong> {selectedHospital.complianceDocs.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Document Preview Modal */}
      <Modal
        isOpen={!!activeDocPreview}
        onClose={() => setActiveDocPreview(null)}
        title={activeDocPreview?.title || 'Document Inspection'}
        subtitle={`Viewing file: ${activeDocPreview?.filename}`}
        maxWidth="2xl"
      >
        <div className="p-8 rounded-xl border border-slate-800 bg-slate-950/90 text-center space-y-4">
          <FileCheck className="w-12 h-12 text-teal-400 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">{activeDocPreview?.filename}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Cryptographically verified by Government State Drug Licensing Authority Portal.
            </p>
          </div>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-left font-mono text-xs text-slate-300 space-y-1">
            <div>Document Hash: <span className="text-teal-300">sha256:8892a00f...192b</span></div>
            <div>Signer Entity: <span className="text-slate-100">National Health Interoperability Grid</span></div>
            <div>Status: <span className="text-emerald-400 font-bold">VALID & ACTIVE TILL 2029</span></div>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (!activeDocPreview) return;
                downloadSimulatedPdf(
                  activeDocPreview.filename,
                  activeDocPreview.title.toUpperCase(),
                  [
                    ['Document Title', activeDocPreview.title],
                    ['Hospital Node', selectedHospital.name],
                    ['Registration Number', selectedHospital.regNo],
                    ['Authorized Nodal Officer', selectedHospital.officerName],
                    ['Accreditation Body', 'National Accreditation Board for Hospitals & Healthcare Providers (NABH)'],
                    ['State Drug Licensing Department', 'Directorate General of Health Services (DGHS) Form 20B'],
                    ['Cryptographic Signature', 'VALIDATED-BY-CDSCO-OMBUDSMAN-PORTAL'],
                    ['Verification Timestamp', new Date().toISOString()]
                  ]
                );
                addToast(`Downloaded verified document: ${activeDocPreview.filename}`, 'success');
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Download Verified File (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDocPreview(null)}
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Close Document Inspector
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const DocumentCard: React.FC<{
  title: string;
  filename: string;
  hospitalName: string;
  onPreview: () => void;
}> = ({ title, filename, hospitalName, onPreview }) => {
  const { addToast } = useApp();

  return (
    <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800/60 transition-colors flex items-center justify-between">
      <div className="overflow-hidden mr-2">
        <div className="font-semibold text-slate-200 text-[11px] truncate">{title}</div>
        <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{filename}</div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onPreview}
          className="p-1.5 rounded-md hover:bg-slate-800 text-teal-400 hover:shadow-xs border border-transparent hover:border-slate-700 transition-all cursor-pointer"
          title="Inspect Document Online"
          aria-label="Inspect Document Online"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            downloadSimulatedPdf(
              filename,
              title.toUpperCase(),
              [
                ['Document Title', title],
                ['Institution Name', hospitalName],
                ['Licensing Authority', 'Government of India CDSCO & State Health Directorate'],
                ['Formulary Verification ID', `VERIF-${Date.now().toString().slice(-6)}`],
                ['Digital Seal Stamp', 'SEALED & COUNTERSIGNED']
              ]
            );
            addToast(`Downloaded: ${filename}`, 'success');
          }}
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-teal-400 hover:shadow-xs border border-transparent hover:border-slate-700 transition-all cursor-pointer"
          title="Download Document (PDF)"
          aria-label="Download Document (PDF)"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
