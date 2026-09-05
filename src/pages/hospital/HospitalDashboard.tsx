import React from 'react';
import { useApp } from '../../context/AppContext';
import { IsometricBarChart3D } from '../../components/3d/IsometricBarChart3D';
import { Tilt3DCard } from '../../components/3d/Tilt3DCard';
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Flame,
  ShieldCheck,
  ArrowRight,
  Plus
} from 'lucide-react';

interface HospitalDashboardProps {
  onOpenAddMedicine: () => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ onOpenAddMedicine }) => {
  const { currentHospital, medicines, requests, navigate, routeToDisposal } = useApp();

  // Metric computations
  const hospitalMedicines = medicines.filter((m) => m.hospitalId === currentHospital.id);
  const activeListedCount = hospitalMedicines.filter((m) => m.status === 'available').length;

  const nearExpiryStocks = hospitalMedicines.filter((m) => m.isNearExpiry && m.status !== 'routed_to_disposal');

  const myPurchases = requests.filter((r) => r.requesterHospitalId === currentHospital.id);
  const mySales = requests.filter((r) => r.sellerHospitalId === currentHospital.id);

  const pendingInboundCount = mySales.filter((r) => r.status === 'pending').length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome & Institutional Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
            <span>Healthcare Node:</span>
            <span className="font-bold text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-700/50">
              {currentHospital.regNo}
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> NABH Verified Node
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-display tracking-tight">
            {currentHospital.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentHospital.officerName} ({currentHospital.officerDesignation}) • Form 20B / Form 21B Licensed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/hospital/marketplace')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Browse Peer Medicine Marketplace
          </button>
          <button
            onClick={onOpenAddMedicine}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> List New Surplus Medicine Batch
          </button>
        </div>
      </div>

      {/* Critical Expiry Alerts Ticker (< 30 days) */}
      {nearExpiryStocks.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Flame className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-rose-300 flex items-center gap-2">
                  <span>CRITICAL EXPIRY ALERT: {nearExpiryStocks.length} BATCHES REACHING &lt; 30 DAYS</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-200 border border-rose-700/60 font-mono text-[10px]">
                    REGULATORY ACTION MANDATED
                  </span>
                </div>
                <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                  The following stock has entered the pre-expiry quarantine threshold and cannot be commercially distributed. Route immediately to CPCB-authorized high-temperature hazardous destruction:
                </p>

                {/* Listing of near-expiry medicines */}
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {nearExpiryStocks.map((stock) => (
                    <div
                      key={stock.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-900/60 text-xs flex items-center gap-3 shadow-md"
                    >
                      <div>
                        <div className="font-bold text-white">{stock.brandName} ({stock.strength})</div>
                        <div className="text-[10px] font-mono text-rose-400">
                          Batch: {stock.batchNumber} • Exp: {stock.expiryDate} • {stock.availableUnits} units
                        </div>
                      </div>
                      <button
                        onClick={() => routeToDisposal(stock.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Flame className="w-3.5 h-3.5" /> Route Batch to Safe Disposal
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Metric Ribbon with Clickable Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Tilt3DCard
          maxTilt={6}
          onClick={() => navigate('/hospital/inventory')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl cursor-pointer hover:border-teal-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-teal-400">
              Active Listed Medicines
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-950/60 text-teal-400 border border-teal-800/60 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">{activeListedCount} Batches</div>
          <div className="mt-1 text-[11px] text-teal-400 flex items-center gap-1 font-medium">
            <span>View Smart Inventory Ledger →</span>
          </div>
        </Tilt3DCard>

        <Tilt3DCard
          maxTilt={6}
          onClick={() => navigate('/hospital/my-requests')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl cursor-pointer hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-blue-400">
              Monthly Purchases Count
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">{myPurchases.length} Requisitions</div>
          <div className="mt-1 text-[11px] text-blue-400 font-medium">
            View My Purchase Requests →
          </div>
        </Tilt3DCard>

        <Tilt3DCard
          maxTilt={6}
          onClick={() => navigate('/hospital/history')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-emerald-400">
              Monthly Sales Count
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">{mySales.length} Orders</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">
            View Transaction History →
          </div>
        </Tilt3DCard>

        <Tilt3DCard
          maxTilt={6}
          onClick={() => navigate('/hospital/incoming-requests')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl cursor-pointer hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-amber-400">
              Pending Inbound Transfers
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">{pendingInboundCount} Requisitions</div>
          <div className="mt-1 text-[11px] text-amber-400 font-semibold">
            {pendingInboundCount > 0 ? 'Action Required: Review Inbound →' : 'All incoming cleared →'}
          </div>
        </Tilt3DCard>
      </div>

      {/* 3D Isometric Frosted Glass Profitability Visualizer */}
      <IsometricBarChart3D />

      {/* 3D Quick Jump Routing Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Tilt3DCard
          maxTilt={5}
          onClick={() => navigate('/hospital/inventory')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-teal-500 cursor-pointer shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-white group-hover:text-teal-300">
              Manage Smart Inventory Ledger
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, check storage conditions, and add new surplus batches with dynamic pricing.
          </p>
        </Tilt3DCard>

        <Tilt3DCard
          maxTilt={5}
          onClick={() => navigate('/hospital/tracking')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-teal-500 cursor-pointer shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-white group-hover:text-teal-300">
              Inspect Live Cold-Chain Tracker
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inspect real-time GPS coordinates, vehicle cold sensors (&lt; 8°C), and delivery signatures.
          </p>
        </Tilt3DCard>

        <Tilt3DCard
          maxTilt={5}
          onClick={() => navigate('/hospital/waste-management')}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-amber-500 cursor-pointer shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-white group-hover:text-amber-300">
              Access 3D Hazardous Containment Vault
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cycle airlock decompression seals and generate CPCB hazardous destruction barcodes.
          </p>
        </Tilt3DCard>
      </div>
    </div>
  );
};
