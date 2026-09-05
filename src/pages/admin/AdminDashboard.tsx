import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMAND_PREDICTIONS } from '../../data/mockData';
import {
  ShieldAlert,
  Building2,
  Boxes,
  ArrowRightLeft,
  Activity,
  Flame,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Compass,
  FileCheck,
  Truck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { hospitals, medicines, requests, wasteManifests, navigate } = useApp();

  const totalRegisteredHospitals = hospitals.length;
  const verifiedHospitalsCount = hospitals.filter((h) => h.status === 'verified').length;
  const pendingQueueCount = hospitals.filter((h) => h.status === 'pending').length;

  const totalTransfers = requests.filter((r) => r.status === 'paid' || r.status === 'delivered').length;
  const activeDisposalKg = wasteManifests.reduce((acc, m) => acc + m.weightKg, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-700 uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            Central Regulatory Oversight Directorate (CDSCO)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
            Master Health Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time surveillance of inter-hospital pharmaceutical flows, regional stockout alarms, and CPCB hazardous destruction streams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingQueueCount > 0 && (
            <button
              onClick={() => navigate('/admin/verification-queue')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs flex items-center gap-2 animate-bounce"
            >
              <FileCheck className="w-4 h-4" />
              <span>{pendingQueueCount} Pending Hospital Registrations</span>
            </button>
          )}

          <button
            onClick={() => navigate('/admin/registry')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs"
          >
            Global Registry
          </button>
        </div>
      </div>

      {/* Top Health Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Registered Hospitals
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">
            {totalRegisteredHospitals} Nodes
          </div>
          <div className="mt-1 text-[11px] text-teal-700 font-medium">
            {verifiedHospitalsCount} Verified • {pendingQueueCount} in Queue
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Medicine Transfers
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">
            {requests.length} Manifests
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            ₹3,48,000 Transacted this cycle
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cumulative Transferred
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">
            320,400 Units
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            $4.8M Total Capital Diverted
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Platform SLA & Bio-Waste Stream
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">
            {activeDisposalKg.toFixed(1)} kg Destructed
          </div>
          <div className="mt-1 text-[11px] text-amber-800 font-medium">
            99.98% Uptime • 100% Thermal Logged
          </div>
        </div>
      </div>

      {/* AI-Powered Demand Predictor / Hot-Selling Radar */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-mono text-[10px] font-bold uppercase mb-1">
              <Zap className="w-3 h-3 text-rose-600" />
              PREDICTIVE ICU SURVEILLANCE ENGINE
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Compass className="w-5 h-5 text-rose-700" />
              AI-Powered Regional Demand Radar & Shortage Alarms
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Algorithm scanning consumption velocity across member hospital ICUs to forecast regional deficits and trigger emergency surplus redistribution.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 font-bold">
              CRITICAL: 2 DRUGS
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold">
              HIGH: 2 DRUGS
            </span>
          </div>
        </div>

        {/* Dense Tabular Radar */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Critical Pharmaceutical</th>
                <th className="py-3 px-3 text-right">Monthly Requisitions</th>
                <th className="py-3 px-3 text-right">Surplus Listed</th>
                <th className="py-3 px-3 text-right">Regional Deficit</th>
                <th className="py-3 px-3 text-center">Velocity Index</th>
                <th className="py-3 px-3 text-center">Stockout Window</th>
                <th className="py-3 px-4">CDSCO Rebalancing Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {DEMAND_PREDICTIONS.map((item, idx) => {
                const isCrit = item.riskLevel === 'critical_shortage';
                const isHigh = item.riskLevel === 'high_demand';

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {isCrit && <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />}
                        <span>{item.drugName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{item.generic}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      {item.monthlyRequisitions.toLocaleString()} u
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {item.availableSurplusUnits.toLocaleString()} u
                    </td>

                    <td className="py-3 px-3 text-right font-mono">
                      <span className={`font-bold ${isCrit ? 'text-rose-700' : isHigh ? 'text-amber-700' : 'text-slate-700'}`}>
                        {item.deficit > 0 ? `-${item.deficit.toLocaleString()} u` : 'Balanced'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono text-xs">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${item.velocityIndex}%` }}
                            className={`h-full ${
                              isCrit ? 'bg-rose-600' : isHigh ? 'bg-amber-500' : 'bg-teal-600'
                            }`}
                          />
                        </div>
                        <span className="font-bold">{item.velocityIndex}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCrit
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : isHigh
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {item.projectedStockoutDays} DAYS
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-700">
                      <div className="line-clamp-2">{item.recommendedAction}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Administrative Quick Action Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/admin/registry')}
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-rose-600 cursor-pointer shadow-xs transition-all group"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-rose-700">
            Global Medicine Registry
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inspect all medicine batches nationwide and trigger administrative override adjustments.
          </p>
        </div>

        <div
          onClick={() => navigate('/admin/compliance')}
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-rose-600 cursor-pointer shadow-xs transition-all group"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-rose-700">
            Hospital Compliance Dossier
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review uploaded Form 20B/21B licenses, board resolutions, and edit operational credentials.
          </p>
        </div>

        <div
          onClick={() => navigate('/admin/logistics')}
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-rose-600 cursor-pointer shadow-xs transition-all group"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-rose-700">
            Biomedical Waste Tracking (CPCB)
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit 1200°C incineration chain-of-custody and stamp digital destruction certificates.
          </p>
        </div>
      </div>
    </div>
  );
};
