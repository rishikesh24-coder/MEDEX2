import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Truck,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { setRole, navigate, addToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<'hospital' | 'admin' | 'courier'>('hospital');

  const [email, setEmail] = useState('pharmacy.super@apollo-metro.med.in');
  const [password, setPassword] = useState('••••••••••••');
  const [securityPin, setSecurityPin] = useState('440192');

  const handleRoleChange = (r: 'hospital' | 'admin' | 'courier') => {
    setSelectedRole(r);
    if (r === 'hospital') {
      setEmail('pharmacy.super@apollo-metro.med.in');
      setSecurityPin('440192');
    } else if (r === 'admin') {
      setEmail('surveillance.chief@cdsco.gov.in');
      setSecurityPin('992810');
    } else {
      setEmail('dispatch.coldchain@bluedart-bio.com');
      setSecurityPin('311048');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'hospital') {
      setRole('hospital');
      navigate('/hospital/dashboard');
    } else if (selectedRole === 'admin') {
      setRole('admin');
      navigate('/admin/dashboard');
    } else {
      // Courier maps to Hospital tracking
      setRole('hospital');
      navigate('/hospital/tracking');
      addToast('Authenticated as Logistics Dispatch Courier Partner.', 'info');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-clinical-grid">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Institutional Header */}
        <div className="p-6 bg-slate-900 text-white text-center border-b border-slate-800">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold tracking-wider mb-2">
            <Lock className="w-3 h-3 text-teal-400" />
            256-BIT ENCRYPTED CREDENTIAL GATEWAY
          </div>
          <h2 className="text-xl font-bold font-display tracking-tight text-white">
            MedEx Secure Institutional Sign In
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access authorized formulary redistribution & biomedical waste manifest desk
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleChange('hospital')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
              selectedRole === 'hospital'
                ? 'border-teal-700 text-teal-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hospital</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
              selectedRole === 'admin'
                ? 'border-rose-700 text-rose-950 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Desk</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('courier')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
              selectedRole === 'courier'
                ? 'border-blue-700 text-blue-950 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Logistics</span>
          </button>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered Official Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white shadow-xs"
              placeholder="e.g. nodal.pharmacy@hospital.org"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Authorized Password *
              </label>
              <span className="text-[11px] text-teal-700 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              2FA Security PIN / Hardware Token *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                className="w-full text-xs font-mono font-bold tracking-widest px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white shadow-xs"
                placeholder="440192"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Pre-filled for authorized session testing
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Authenticate & Access Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Jump Helpers */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 mb-2 text-center">
              Instant 1-Click Evaluation Credentials:
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  handleRoleChange('hospital');
                  setRole('hospital');
                  navigate('/hospital/dashboard');
                }}
                className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-teal-50/60 border border-slate-200 flex items-center justify-between text-slate-700 group transition-colors"
              >
                <div>
                  <span className="font-semibold text-teal-900 block">Dr. Ananya Sharma (Apollo Metro)</span>
                  <span className="text-[10px] text-slate-500 font-mono">NABH-DEL-2018-941 • Hospital Lead</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleChange('admin');
                  setRole('admin');
                  navigate('/admin/dashboard');
                }}
                className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-rose-50/60 border border-slate-200 flex items-center justify-between text-slate-700 group transition-colors"
              >
                <div>
                  <span className="font-semibold text-rose-950 block">CDSCO Central Directorate Oversight</span>
                  <span className="text-[10px] text-slate-500 font-mono">GOVT-CDSCO-ADMIN-01 • Master Regulator</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Unregistered healthcare institution? </span>
            <button
              type="button"
              onClick={() => navigate('/auth/register-hospital')}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Apply for Hospital Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
