import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  ShieldAlert,
  Activity,
  Boxes,
  Truck,
  FileText,
  MessageSquare,
  Sparkles,
  Search,
  Plus,
  ArrowRightLeft,
  Flame,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface HeaderProps {
  onOpenAddMedicine?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddMedicine }) => {
  const { role, setRole, activePath, navigate, currentHospital, requests, feedbackTickets } = useApp();

  const pendingInbound = requests.filter(
    (r) => r.sellerHospitalId === currentHospital.id && r.status === 'pending'
  ).length;

  const pendingAdminTickets = feedbackTickets.filter((f) => f.status === 'open').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Topmost Institutional Telemetry & Quick Persona Switcher Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-mono px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-teal-400 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            MEDEX FEDERATED GATEWAY 4.2
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400 inline" /> CDSCO G.S.R. 1337(E) & BMW 2016 COMPLIANT
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            TIME: 2026-09-05 11:04 IST • TLS 1.3 SECURE
          </span>
        </div>

        {/* Global Instant Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider font-sans font-medium mr-1">
            Active Persona:
          </span>
          <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => setRole('public')}
              className={`px-2.5 py-1 text-[11px] rounded font-sans transition-all flex items-center gap-1.5 ${
                role === 'public'
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Public Door
            </button>
            <button
              onClick={() => setRole('hospital')}
              className={`px-2.5 py-1 text-[11px] rounded font-sans transition-all flex items-center gap-1.5 ${
                role === 'hospital'
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Building2 className="w-3 h-3 text-teal-200" />
              Hospital (Apollo)
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-2.5 py-1 text-[11px] rounded font-sans transition-all flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-rose-700 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-300" />
              Admin Command
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(role === 'hospital' ? '/hospital/dashboard' : role === 'admin' ? '/admin/dashboard' : '/')}
              className="flex items-center gap-3 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center text-white shadow-md border border-teal-600/30 group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-display">MedEx</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                    Clinical Network
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                  Medicine Redistribution & Biomedical Waste Stream
                </p>
              </div>
            </button>

            {/* Current Active Hospital Indicator (if in Hospital view) */}
            {role === 'hospital' && (
              <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">{currentHospital.name}</span>
                  <span className="text-slate-400 ml-1 font-mono text-[10px]">[{currentHospital.regNo}]</span>
                </div>
              </div>
            )}

            {/* Current Admin Indicator (if in Admin view) */}
            {role === 'admin' && (
              <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <div className="text-xs">
                  <span className="font-semibold text-rose-950">Central Drug Regulatory Directorate</span>
                  <span className="text-rose-600 ml-1 font-mono text-[10px]">[CDSCO Master Oversight]</span>
                </div>
              </div>
            )}
          </div>

          {/* Role-Specific Actions */}
          <div className="flex items-center gap-3">
            {role === 'hospital' && (
              <>
                <button
                  onClick={onOpenAddMedicine}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 shadow-xs border border-teal-800 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  List Surplus Medicine
                </button>
                <button
                  onClick={() => navigate('/hospital/incoming-requests')}
                  className="relative p-2 text-slate-600 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Incoming Requisitions"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                  {pendingInbound > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                      {pendingInbound}
                    </span>
                  )}
                </button>
              </>
            )}

            {role === 'admin' && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                  <Lock className="w-3.5 h-3.5 text-rose-600" /> CDSCO SECURE SESSION
                </span>
                {pendingAdminTickets > 0 && (
                  <button
                    onClick={() => navigate('/admin/feedback-console')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-900 border border-amber-300"
                  >
                    <span>{pendingAdminTickets} Open Disputes</span>
                  </button>
                )}
              </div>
            )}

            {role === 'public' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/auth/signin')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth/register-hospital')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs border border-teal-800 transition-colors"
                >
                  Register Hospital
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Clinical Navigation Bar (Sub-Routes) */}
      <div className="bg-slate-100/90 border-t border-slate-200 px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max">
          {role === 'hospital' && (
            <>
              <NavButton
                active={activePath === '/hospital/dashboard'}
                onClick={() => navigate('/hospital/dashboard')}
                icon={<Activity className="w-3.5 h-3.5" />}
                label="Executive Dashboard"
              />
              <NavButton
                active={activePath === '/hospital/inventory'}
                onClick={() => navigate('/hospital/inventory')}
                icon={<Boxes className="w-3.5 h-3.5" />}
                label="Smart Inventory"
              />
              <NavButton
                active={activePath === '/hospital/marketplace'}
                onClick={() => navigate('/hospital/marketplace')}
                icon={<Search className="w-3.5 h-3.5" />}
                label="Peer Marketplace"
              />
              <NavButton
                active={activePath === '/hospital/my-requests'}
                onClick={() => navigate('/hospital/my-requests')}
                icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                label="My Requests (Outbound)"
              />
              <NavButton
                active={activePath === '/hospital/incoming-requests'}
                onClick={() => navigate('/hospital/incoming-requests')}
                icon={<Building2 className="w-3.5 h-3.5" />}
                label="Incoming Requests"
                badge={pendingInbound > 0 ? String(pendingInbound) : undefined}
              />
              <NavButton
                active={activePath === '/hospital/history'}
                onClick={() => navigate('/hospital/history')}
                icon={<FileText className="w-3.5 h-3.5" />}
                label="Dual History"
              />
              <NavButton
                active={activePath === '/hospital/tracking'}
                onClick={() => navigate('/hospital/tracking')}
                icon={<Truck className="w-3.5 h-3.5" />}
                label="Live Tracking"
              />
              <NavButton
                active={activePath === '/hospital/invoices'}
                onClick={() => navigate('/hospital/invoices')}
                icon={<FileText className="w-3.5 h-3.5" />}
                label="Payments & Invoices"
              />
              <NavButton
                active={activePath === '/hospital/waste-management'}
                onClick={() => navigate('/hospital/waste-management')}
                icon={<Flame className="w-3.5 h-3.5 text-amber-600" />}
                label="3D Waste Vault"
              />
              <NavButton
                active={activePath === '/hospital/feedback'}
                onClick={() => navigate('/hospital/feedback')}
                icon={<MessageSquare className="w-3.5 h-3.5" />}
                label="Feedback Center"
              />
            </>
          )}

          {role === 'admin' && (
            <>
              <NavButton
                active={activePath === '/admin/dashboard'}
                onClick={() => navigate('/admin/dashboard')}
                icon={<Activity className="w-3.5 h-3.5 text-rose-600" />}
                label="Admin Dashboard & Radar"
              />
              <NavButton
                active={activePath === '/admin/registry'}
                onClick={() => navigate('/admin/registry')}
                icon={<Boxes className="w-3.5 h-3.5" />}
                label="Global Medicine Registry"
              />
              <NavButton
                active={activePath === '/admin/compliance'}
                onClick={() => navigate('/admin/compliance')}
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
                label="Compliance & Dossier"
              />
              <NavButton
                active={activePath === '/admin/verification-queue'}
                onClick={() => navigate('/admin/verification-queue')}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                label="Verification Queue"
              />
              <NavButton
                active={activePath === '/admin/logistics'}
                onClick={() => navigate('/admin/logistics')}
                icon={<Flame className="w-3.5 h-3.5 text-amber-600" />}
                label="Logistics & Biomedical Waste"
              />
              <NavButton
                active={activePath === '/admin/feedback-console'}
                onClick={() => navigate('/admin/feedback-console')}
                icon={<MessageSquare className="w-3.5 h-3.5" />}
                label="Central Feedback Console"
                badge={pendingAdminTickets > 0 ? String(pendingAdminTickets) : undefined}
              />
            </>
          )}

          {role === 'public' && (
            <>
              <NavButton
                active={activePath === '/'}
                onClick={() => navigate('/')}
                icon={<Sparkles className="w-3.5 h-3.5 text-teal-600" />}
                label="Platform Mission & Overview"
              />
              <NavButton
                active={activePath === '/auth/signin'}
                onClick={() => navigate('/auth/signin')}
                icon={<Lock className="w-3.5 h-3.5" />}
                label="Unified Sign In"
              />
              <NavButton
                active={activePath === '/auth/register-hospital'}
                onClick={() => navigate('/auth/register-hospital')}
                icon={<Building2 className="w-3.5 h-3.5" />}
                label="Hospital Registration"
              />
              <NavButton
                active={activePath === '/auth/register-admin'}
                onClick={() => navigate('/auth/register-admin')}
                icon={<ShieldAlert className="w-3.5 h-3.5" />}
                label="Admin Portal Registration"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
      active
        ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
    }`}
  >
    {icon}
    <span>{label}</span>
    {badge && (
      <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full">
        {badge}
      </span>
    )}
  </button>
);
