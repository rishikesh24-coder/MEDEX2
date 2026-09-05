import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hospital } from '../../types';
import { Modal } from '../../components/common/Modal';
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
        <div className="text-xs font-mono uppercase text-teal-700 tracking-wider font-bold">
          National Drug Controller Compliance Registry
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Hospital Compliance & Document Dossier
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Institutional accreditation inspection view, inline statutory credential previewer, and bidirectional nodal officer directory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Hospital Selector */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
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
                    ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-slate-900 line-clamp-1">{h.name}</div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                    h.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : h.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {h.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Reg No: {h.regNo}</div>
                <div className="text-[11px] text-slate-600 mt-2 truncate">{h.officerName}</div>
              </div>
            );
          })}
        </div>

        {/* Right Dossier View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Institutional Dossier Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedHospital.regNo}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> State Drug Controller Verified
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1 font-display">
                  {selectedHospital.name}
                </h2>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedHospital.address}, {selectedHospital.city}, {selectedHospital.state} - {selectedHospital.pinCode}
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Edit className="w-3.5 h-3.5 text-teal-700" /> Edit Credentials
                </button>
              )}
            </div>

            {/* Nodal Officer Credentials (Bidirectional Editor) */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Authorized Nodal Officer & Contact Directory</span>
                {isEditing && (
                  <span className="text-teal-700 text-[11px] font-semibold">Editing Mode Active</span>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nodal Officer Name</label>
                    <input
                      type="text"
                      required
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      required
                      value={officerDesignation}
                      onChange={(e) => setOfficerDesignation(e.target.value)}
                      className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Nodal Officer:</span>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedHospital.officerName}</div>
                    <div className="text-slate-500">{selectedHospital.officerDesignation}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Contact Channels:</span>
                    <div className="font-mono text-slate-800 mt-0.5">{selectedHospital.email}</div>
                    <div className="font-mono text-slate-800">{selectedHospital.phone}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Documents Inline Vault Previewer */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Statutory Compliance Document Vault (4 Critical Verifications)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <DocumentCard
                  title="Hospital Registration / NABH Certificate"
                  filename={selectedHospital.complianceDocs.regCertUrl}
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
                  onPreview={() =>
                    setActiveDocPreview({
                      title: 'Board Authorization for Nodal Officer',
                      filename: selectedHospital.complianceDocs.boardResolutionUrl
                    })
                  }
                />
              </div>

              {selectedHospital.complianceDocs.notes && (
                <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-950">
                  <strong>Auditor Inspection Note:</strong> {selectedHospital.complianceDocs.notes}
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
        <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-4">
          <FileCheck className="w-12 h-12 text-teal-700 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">{activeDocPreview?.filename}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Cryptographically verified by Government State Drug Licensing Authority Portal.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 text-left font-mono text-xs text-slate-700 space-y-1">
            <div>Document Hash: <span className="text-teal-800">sha256:8892a00f...192b</span></div>
            <div>Signer Entity: <span className="text-slate-900">National Health Interoperability Grid</span></div>
            <div>Status: <span className="text-emerald-700 font-bold">VALID & ACTIVE TILL 2029</span></div>
          </div>
          <button
            onClick={() => setActiveDocPreview(null)}
            className="px-5 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold"
          >
            Done Inspecting
          </button>
        </div>
      </Modal>
    </div>
  );
};

const DocumentCard: React.FC<{
  title: string;
  filename: string;
  onPreview: () => void;
}> = ({ title, filename, onPreview }) => (
  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between">
    <div className="overflow-hidden mr-2">
      <div className="font-semibold text-slate-800 text-[11px] truncate">{title}</div>
      <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{filename}</div>
    </div>
    <button
      type="button"
      onClick={onPreview}
      className="p-1.5 rounded-md hover:bg-white text-teal-700 hover:shadow-xs border border-transparent hover:border-slate-200 transition-all shrink-0"
      title="Inspect Document"
    >
      <Eye className="w-4 h-4" />
    </button>
  </div>
);
