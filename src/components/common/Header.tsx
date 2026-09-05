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
  Search,
  Plus,
  ArrowRightLeft,
  Flame,
  CheckCircle2,
  Lock,
  LogOut
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

  // 1. Ultra-Minimal Landing Page Header
  if (activePath === '/') {
    return (
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Clean MedEx logo + subtle badge "Clinical Network" */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left focus:outline-hidden group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="w-4.5 h-4.5 text-teal-200" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">MedEx</span>
                <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                  Clinical Network
                </span>
              </div>
            </button>

            {/* Right: Clean links, outline Sign In, solid emerald Register Hospital */}
            <div className="flex items-center gap-3 sm:gap-6">
              <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
                <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
                <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
                <a href="#compliance" className="hover:text-slate-900 transition-colors">Compliance</a>
              </nav>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate('/auth/signin')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth/register-hospital')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
                >
                  Register Hospital
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // 2. Clean Auth Pages Header
  if (activePath.startsWith('/auth/')) {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center text-white shadow-xs">
                <ArrowRightLeft className="w-4.5 h-4.5 text-teal-200" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">MedEx</span>
                <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                  Clinical Network
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate('/')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Overview
            </button>
          </div>
        </div>
      </header>
    );
  }

  // 3. In-App Clinical Navigation (Hospital Workspace & Admin Command)
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Clinical Node Identity */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(role === 'hospital' ? '/hospital/dashboard' : '/admin/dashboard')}
              className="flex items-center gap-3 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="w-4.5 h-4.5 text-teal-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-display">MedEx</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {role === 'hospital' ? 'Hospital Node' : 'CDSCO Command'}
                  </span>
                </div>
              </div>
            </button>

            {/* Current Active Hospital Indicator (if in Hospital view) */}
            {role === 'hospital' && (
              <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="text-xs flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{currentHospital.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                    NABH Accredited
                  </span>
                </div>
              </div>
            )}

            {/* Current Admin Indicator (if in Admin view) */}
            {role === 'admin' && (
              <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <div className="text-xs">
                  <span className="font-semibold text-rose-950">Central Drug Regulatory Directorate</span>
                  <span className="text-rose-600 ml-1 font-mono text-[10px]">[Master Oversight]</span>
                </div>
              </div>
            )}
          </div>

          {/* Role-Specific Action Controls */}
          <div className="flex items-center gap-3">
            {role === 'hospital' && (
              <>
                <button
                  onClick={onOpenAddMedicine}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 shadow-xs transition-all"
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

            {/* Discrete Exit / Public Door button */}
            <button
              onClick={() => {
                setRole('public');
                navigate('/');
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Return to Public Overview"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Clinical Navigation Bar (4 Grouped Sections for Hospital) */}
      <div className="bg-slate-100/90 border-t border-slate-200 px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5 min-w-max">
          {role === 'hospital' && (
            <>
              {/* 4 Clean Primary Domain Pills */}
              <div className="flex items-center gap-1.5">
                <SectionButton
                  active={activePath === '/hospital/dashboard'}
                  onClick={() => navigate('/hospital/dashboard')}
                  icon={<Activity className="w-3.5 h-3.5" />}
                  label="Overview"
                />

                <SectionButton
                  active={['/hospital/marketplace', '/hospital/my-requests', '/hospital/incoming-requests'].includes(activePath)}
                  onClick={() => navigate('/hospital/marketplace')}
                  icon={<Search className="w-3.5 h-3.5" />}
                  label="Marketplace & Requests"
                  badge={pendingInbound > 0 ? String(pendingInbound) : undefined}
                />

                <SectionButton
                  active={['/hospital/inventory', '/hospital/waste-management'].includes(activePath)}
                  onClick={() => navigate('/hospital/inventory')}
                  icon={<Boxes className="w-3.5 h-3.5" />}
                  label="Inventory & Waste"
                />

                <SectionButton
                  active={['/hospital/tracking', '/hospital/invoices', '/hospital/history', '/hospital/feedback'].includes(activePath)}
                  onClick={() => navigate('/hospital/tracking')}
                  icon={<Truck className="w-3.5 h-3.5" />}
                  label="Logistics & Records"
                />
              </div>

              {/* Contextual Sub-Tab Ribbon based on Active Domain */}
              <div className="flex items-center gap-1 pl-3 md:border-l md:border-slate-300">
                {['/hospital/marketplace', '/hospital/my-requests', '/hospital/incoming-requests'].includes(activePath) && (
                  <>
                    <SubTabButton
                      active={activePath === '/hospital/marketplace'}
                      onClick={() => navigate('/hospital/marketplace')}
                      label="Peer Market"
                    />
                    <SubTabButton
                      active={activePath === '/hospital/incoming-requests'}
                      onClick={() => navigate('/hospital/incoming-requests')}
                      label="Inbound"
                      badge={pendingInbound > 0 ? String(pendingInbound) : undefined}
                    />
                    <SubTabButton
                      active={activePath === '/hospital/my-requests'}
                      onClick={() => navigate('/hospital/my-requests')}
                      label="Outbound"
                    />
                  </>
                )}

                {['/hospital/inventory', '/hospital/waste-management'].includes(activePath) && (
                  <>
                    <SubTabButton
                      active={activePath === '/hospital/inventory'}
                      onClick={() => navigate('/hospital/inventory')}
                      label="Smart Stock"
                    />
                    <SubTabButton
                      active={activePath === '/hospital/waste-management'}
                      onClick={() => navigate('/hospital/waste-management')}
                      label="Bio-Waste Vault"
                    />
                  </>
                )}

                {['/hospital/tracking', '/hospital/invoices', '/hospital/history', '/hospital/feedback'].includes(activePath) && (
                  <>
                    <SubTabButton
                      active={activePath === '/hospital/tracking'}
                      onClick={() => navigate('/hospital/tracking')}
                      label="Live Tracking"
                    />
                    <SubTabButton
                      active={activePath === '/hospital/invoices'}
                      onClick={() => navigate('/hospital/invoices')}
                      label="Invoices"
                    />
                    <SubTabButton
                      active={activePath === '/hospital/history'}
                      onClick={() => navigate('/hospital/history')}
                      label="History"
                    />
                    <SubTabButton
                      active={activePath === '/hospital/feedback'}
                      onClick={() => navigate('/hospital/feedback')}
                      label="Disputes"
                    />
                  </>
                )}

                {activePath === '/hospital/dashboard' && (
                  <span className="text-[11px] text-slate-500 font-medium hidden lg:inline">
                    Clinical Resource Allocation & Near-Expiry Prevention Console
                  </span>
                )}
              </div>
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

interface SectionButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

const SectionButton: React.FC<SectionButtonProps> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
      active
        ? 'bg-white text-teal-900 shadow-xs border border-teal-600/30 font-semibold ring-1 ring-teal-500/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
    }`}
  >
    <span className={active ? 'text-teal-700' : 'text-slate-500'}>{icon}</span>
    <span>{label}</span>
    {badge && (
      <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

interface SubTabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: string;
}

const SubTabButton: React.FC<SubTabButtonProps> = ({ active, onClick, label, badge }) => (
  <button
    onClick={onClick}
    className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-all ${
      active
        ? 'bg-teal-700 text-white font-semibold shadow-2xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
    }`}
  >
    <span>{label}</span>
    {badge && (
      <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full">
        {badge}
      </span>
    )}
  </button>
);
