import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, ShieldAlert, Globe, ChevronUp, Check } from 'lucide-react';

export const DemoPersonaPill: React.FC = () => {
  const { role, setRole, navigate } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'public',
      label: 'Public Gateway',
      description: 'Public Landing & Statutory Portals',
      icon: <Globe className="w-3.5 h-3.5" />,
      color: 'text-slate-700',
      activeBg: 'bg-slate-900 text-white',
      onSelect: () => {
        setRole('public');
        navigate('/');
      }
    },
    {
      id: 'hospital',
      label: 'Apollo Hospital Node',
      description: 'Smart Formulary, Escrow & Telemetry',
      icon: <Building2 className="w-3.5 h-3.5" />,
      color: 'text-teal-700',
      activeBg: 'bg-teal-700 text-white',
      onSelect: () => {
        setRole('hospital');
        navigate('/hospital/dashboard');
      }
    },
    {
      id: 'admin',
      label: 'CDSCO Central Directorate',
      description: 'Surveillance, Incineration & Disputes',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      color: 'text-rose-700',
      activeBg: 'bg-rose-700 text-white',
      onSelect: () => {
        setRole('admin');
        navigate('/admin/dashboard');
      }
    }
  ] as const;

  const currentRole = roles.find((r) => r.id === role) || roles[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-2 p-2 bg-slate-900/98 backdrop-blur-2xl rounded-2xl border border-slate-700/90 shadow-2xl w-72 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Instant Persona Switcher
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="mt-1 space-y-1">
            {roles.map((item) => {
              const isSelected = item.id === role;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? `${item.activeBg} font-semibold shadow-xs`
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-white' : item.color}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/80 shadow-spatial flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-xs font-medium"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[11px] text-slate-300">Persona:</span>
        <span className="font-semibold text-white flex items-center gap-1.5">
          {currentRole.icon}
          {currentRole.label}
        </span>
        <ChevronUp className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
