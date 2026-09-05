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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase">
            <span>Healthcare Node:</span>
            <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {currentHospital.regNo}
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> NABH Verified Node
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-display tracking-tight">
            {currentHospital.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentHospital.officerName} ({currentHospital.officerDesignation}) • Form 20B / Form 21B Licensed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/hospital/marketplace')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors btn-3d"
          >
            Browse Peer Marketplace
          </button>
          <button
            onClick={onOpenAddMedicine}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-spatial flex items-center gap-1.5 transition-colors btn-3d"
          >
            <Plus className="w-4 h-4" /> List Surplus Medicine
          </button>
        </div>
      </div>

      {/* Critical Expiry Alerts Ticker (< 30 days) */}
      {nearExpiryStocks.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 shadow-spatial-rose animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Flame className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2">
                  <span>CRITICAL EXPIRY ALERT: {nearExpiryStocks.length} BATCHES REACHING &lt; 30 DAYS</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-mono text-[10px]">
                    REGULATORY ACTION MANDATED
                  </span>
                </div>
                <p className="text-xs text-rose-900/90 mt-1 leading-relaxed">
                  The following stock has entered the pre-expiry quarantine threshold and cannot be commercially distributed. Route immediately to CPCB-authorized high-temperature hazardous destruction:
                </p>

                {/* Listing of near-expiry medicines */}
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {nearExpiryStocks.map((stock) => (
                    <div
                      key={stock.id}
                      className="p-2.5 rounded-xl bg-white border border-rose-200 text-xs flex items-center gap-3 shadow-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{stock.brandName} ({stock.strength})</div>
                        <div className="text-[10px] font-mono text-rose-700">
                          Batch: {stock.batchNumber} • Exp: {stock.expiryDate} • {stock.availableUnits} units
                        </div>
                      </div>
                      <button
                        onClick={() => routeToDisposal(stock.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors btn-3d"
                      >
                        <Flame className="w-3.5 h-3.5" /> Route to Safe Disposal
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Metric Ribbon with Parallax Tilt */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Tilt3DCard maxTilt={6} className="p-5 rounded-2xl border border-slate-200/90 bg-white/95 shadow-spatial shimmer-sweep">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Listed Medicines
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shadow-xs">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">{activeListedCount} Batches</div>
          <div className="mt-1 text-[11px] text-teal-700 flex items-center gap-1 font-medium">
            <span>Verified in regional exchange</span>
          </div>
        </Tilt3DCard>

        <Tilt3DCard maxTilt={6} className="p-5 rounded-2xl border border-slate-200/90 bg-white/95 shadow-spatial shimmer-sweep">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Purchases Count
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shadow-xs">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">{myPurchases.length} Requisitions</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Outbound acquisitions from peer ICUs
          </div>
        </Tilt3DCard>

        <Tilt3DCard maxTilt={6} className="p-5 rounded-2xl border border-slate-200/90 bg-white/95 shadow-spatial shimmer-sweep">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Sales Count
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">{mySales.length} Orders</div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            Surplus stock offloaded to peers
          </div>
        </Tilt3DCard>

        <Tilt3DCard maxTilt={6} className="p-5 rounded-2xl border border-slate-200/90 bg-white/95 shadow-spatial-amber shimmer-sweep">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Inbound Transfers
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono">{pendingInboundCount} Requisitions</div>
          <div className="mt-1 text-[11px] text-amber-700 font-semibold">
            {pendingInboundCount > 0 ? 'Requires immediate action' : 'All incoming cleared'}
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
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-600 cursor-pointer shadow-spatial transition-all group shimmer-sweep"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900 group-hover:text-teal-700">
              Smart Inventory Ledger
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, check storage conditions, and add new surplus batches with dynamic pricing.
          </p>
        </Tilt3DCard>

        <Tilt3DCard
          maxTilt={5}
          onClick={() => navigate('/hospital/tracking')}
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-600 cursor-pointer shadow-spatial transition-all group shimmer-sweep"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900 group-hover:text-teal-700">
              3D Live Cold-Chain Tracker
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inspect real-time GPS coordinates, vehicle cold sensors (&lt; 8°C), and delivery signatures.
          </p>
        </Tilt3DCard>

        <Tilt3DCard
          maxTilt={5}
          onClick={() => navigate('/hospital/waste-management')}
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-600 cursor-pointer shadow-spatial-amber transition-all group shimmer-sweep"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900 group-hover:text-amber-700">
              3D Containment Vault
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cycle airlock decompression seals and generate CPCB hazardous destruction barcodes.
          </p>
        </Tilt3DCard>
      </div>
    </div>
  );
};
