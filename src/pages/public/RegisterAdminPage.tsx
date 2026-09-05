import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RegisterAdminPage: React.FC = () => {
  const { navigate, addToast, setRole } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Drug Regulatory & Form 20B Enforcement');
  const [masterKey, setMasterKey] = useState('');

  const handlePrefillAdmin = () => {
    setName('Dr. Rajesh Verma, IAS');
    setEmail('rajesh.verma@cdsco.gov.in');
    setPhone('+91 11 2323 5588');
    setDepartment('Drug Regulatory & Form 20B Enforcement');
    setMasterKey('CDSCO-2026-KEY');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterKey.length < 6) {
      addToast('Master authorization key invalid.', 'error');
      return;
    }
    addToast('Admin officer credentials registered. Regulatory session active.', 'success');
    setRole('admin');
    navigate('/admin/dashboard');
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-xl mx-auto text-slate-100">
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xs">
        <div className="p-6 bg-slate-950 text-white text-center border-b border-slate-800">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 font-mono text-[10px] font-bold tracking-wider mb-2 border border-rose-800/60">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            REGULATORY SURVEILLANCE DIRECTORY
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Register Central Administration Officer
          </h2>
          <p className="text-xs text-slate-400 mt-1 mb-3">
            Restricted to Ministry of Health, CDSCO, and State Pollution Control Board officers
          </p>

          <button
            type="button"
            onClick={handlePrefillAdmin}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-700 hover:border-rose-500 text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer"
          >
            ⚡ Fill Demo CDSCO Officer Credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Authority Officer Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Verma, IAS / Deputy Drug Controller"
              className="w-full font-medium px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Official Government / Entity Email (.gov.in or .nic.in) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer.name@cdsco.gov.in"
              className="w-full font-medium px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Official Phone / Direct Extension *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 11 2323 0000"
              className="w-full font-medium px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Regulatory Oversight Department *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full font-medium px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            >
              <option value="Drug Regulatory & Form 20B Enforcement">Drug Regulatory & Form 20B Enforcement</option>
              <option value="Cold-Chain & Biological Logistics Surveillance">Cold-Chain & Biological Logistics Surveillance</option>
              <option value="CPCB Biomedical Waste & Incineration Compliance">CPCB Biomedical Waste & Incineration Compliance</option>
              <option value="National Emergency ICU Shortage Reallocation">National Emergency ICU Shortage Reallocation</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Master Access Clearance Key / Authorization Passphrase *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                placeholder="Enter regulatory master key"
                className="w-full font-mono font-medium px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-rose-300 placeholder:text-slate-600 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Default demo key: <code className="font-mono text-rose-400 font-bold">CDSCO-2026-KEY</code>
            </span>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/auth/signin')}
              className="px-4 py-3 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel & Return to Sign In
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Authorize Officer & Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
