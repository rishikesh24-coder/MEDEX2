import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  MapPin,
  FileCheck,
  ShieldCheck,
  Upload,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lock,
  ThermometerSnowflake
} from 'lucide-react';

export const RegisterHospitalPage: React.FC = () => {
  const { registerHospital, navigate } = useApp();

  // Form states
  const [hospitalName, setHospitalName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [officerDesignation, setOfficerDesignation] = useState('Chief Medical Superintendent');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi NCR');
  const [pinCode, setPinCode] = useState('110001');
  const [coldStorageFacility, setColdStorageFacility] = useState(true);

  // Files
  const [regCert, setRegCert] = useState<string>('NABH-REG-ACCREDITATION-2024.pdf');
  const [drugLicense, setDrugLicense] = useState<string>('FORM-20B-WHOLESALE-LICENSE.pdf');
  const [gstinCert, setGstinCert] = useState<string>('GSTIN-REGISTRATION-PROOF.pdf');
  const [boardAuth, setBoardAuth] = useState<string>('BOARD-RESOLUTION-APPOINTMENT.pdf');

  // Security
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Strength Rules
  const passwordRules = useMemo(() => {
    return {
      minLength: password.length >= 10,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      match: password.length > 0 && password === confirmPassword
    };
  }, [password, confirmPassword]);

  const allRulesPassed =
    passwordRules.minLength &&
    passwordRules.hasUpper &&
    passwordRules.hasLower &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecial &&
    passwordRules.match;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRulesPassed) return;

    registerHospital({
      hospitalName,
      regNo,
      officerName,
      officerDesignation,
      email,
      phone,
      address,
      city,
      state,
      pinCode,
      coldStorageFacility
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          Institutional Accreditation Application
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          Hospital Network Registration & Compliance Dossier
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Complete the statutory 4-stage enrollment. All credentials are cross-referenced with State Drug Licensing Authorities prior to activation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
        {/* Section A: Institutional Info */}
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
            <Building2 className="w-4 h-4 text-teal-700" />
            Section A: Healthcare Institution Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hospital / Medical Center Legal Name *
              </label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. Manipal Super Speciality Hospital"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                State Registration / NABH Accreditation No. *
              </label>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                placeholder="e.g. NABH-DEL-2024-1188"
                className="w-full font-mono font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Authorized Nodal Pharmacy Officer *
              </label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="Dr. Full Name, Medical Degree"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Officer Designation / Title *
              </label>
              <input
                type="text"
                required
                value={officerDesignation}
                onChange={(e) => setOfficerDesignation(e.target.value)}
                placeholder="Chief Medical Superintendent / Nodal Pharmacist"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Institutional Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pharmacy.nodal@hospital.org"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Direct Emergency Contact Line *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 11 2000 0000"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section B: Physical Facilities & Cold-Chain Capacity */}
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
            <MapPin className="w-4 h-4 text-teal-700" />
            Section B: Physical Location & Cold Storage Infrastructure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">
                Official Campus Street Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot / Sector / Landmark / Gate No"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State / Province *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Postal PIN Code *</label>
              <input
                type="text"
                required
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full font-mono font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div className="sm:col-span-3 pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-lg border border-teal-200 bg-teal-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coldStorageFacility}
                  onChange={(e) => setColdStorageFacility(e.target.checked)}
                  className="rounded border-teal-400 text-teal-700 focus:ring-teal-600 w-4 h-4"
                />
                <div className="text-xs">
                  <div className="font-bold text-teal-950 flex items-center gap-1.5">
                    <ThermometerSnowflake className="w-4 h-4 text-teal-700" />
                    Verified Dedicated Cold Storage Facility (2-8°C & -20°C Cryo)
                  </div>
                  <div className="text-teal-800/80 mt-0.5">
                    Institution maintains continuous temperature-logged thermal chambers for insulin, vaccines, and monoclonal biologics.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section C: Compliance Document Vault */}
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
            <FileCheck className="w-4 h-4 text-teal-700" />
            Section C: Statutory Compliance Document Vault (Dropzones)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload valid notarized institutional credentials in PDF format.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
            <DocUploadField
              label="Hospital Registration Certificate *"
              fileName={regCert}
              onSelect={setRegCert}
            />
            <DocUploadField
              label="Form 20B / 21B Wholesale Drug License *"
              fileName={drugLicense}
              onSelect={setDrugLicense}
            />
            <DocUploadField
              label="Entity GSTIN Certificate *"
              fileName={gstinCert}
              onSelect={setGstinCert}
            />
            <DocUploadField
              label="Institutional Board Authorization Letter *"
              fileName={boardAuth}
              onSelect={setBoardAuth}
            />
          </div>
        </div>

        {/* Section D: Account Security & Rules */}
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
            <Lock className="w-4 h-4 text-teal-700" />
            Section D: Cryptographic Security & Passphrase Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Authorized Account Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter 10+ char strong password"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>
          </div>

          {/* Live Strength Checklist */}
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Live Regulatory Security Requirements:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <RuleItem met={passwordRules.minLength} label="At least 10 characters" />
              <RuleItem met={passwordRules.hasUpper} label="Uppercase letter (A-Z)" />
              <RuleItem met={passwordRules.hasLower} label="Lowercase letter (a-z)" />
              <RuleItem met={passwordRules.hasNumber} label="Numeric digit (0-9)" />
              <RuleItem met={passwordRules.hasSpecial} label="Special symbol (@, #, $)" />
              <RuleItem met={passwordRules.match} label="Passwords match" />
            </div>
          </div>
        </div>

        {/* Declaration & Submission */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            By submitting, you certify that all uploaded pharmaceutical licenses are authentic under Section 18 of the Drugs and Cosmetics Act.
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/auth/signin')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allRulesPassed || !hospitalName || !regNo}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <span>Submit for Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const DocUploadField: React.FC<{
  label: string;
  fileName: string;
  onSelect: (name: string) => void;
}> = ({ label, fileName, onSelect }) => (
  <div>
    <label className="block font-semibold text-slate-700 mb-1">{label}</label>
    <label className="cursor-pointer flex items-center justify-between p-3 rounded-lg border border-dashed border-slate-300 hover:border-teal-600 bg-slate-50 hover:bg-teal-50/40 transition-colors">
      <div className="flex items-center gap-2 overflow-hidden">
        <Upload className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="truncate font-mono text-[11px] text-slate-700">{fileName}</span>
      </div>
      <span className="text-[10px] font-semibold text-teal-700 shrink-0 ml-2">Replace</span>
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onSelect(e.target.files[0].name);
          }
        }}
      />
    </label>
  </div>
);

const RuleItem: React.FC<{ met: boolean; label: string }> = ({ met, label }) => (
  <div className={`flex items-center gap-1.5 ${met ? 'text-teal-800 font-semibold' : 'text-slate-400'}`}>
    {met ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
    <span>{label}</span>
  </div>
);
