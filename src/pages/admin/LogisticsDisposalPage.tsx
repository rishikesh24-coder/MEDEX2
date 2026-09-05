import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BiomedicalWasteManifest, ShipmentTracking } from '../../types';
import { DestructionCertModal } from '../../components/admin/DestructionCertModal';
import {
  Truck,
  Flame,
  ThermometerSnowflake,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Printer
} from 'lucide-react';
import { BiomedicalVault3D } from '../../components/3d/BiomedicalVault3D';
import { IsometricRouteTracker3D } from '../../components/3d/IsometricRouteTracker3D';

export const LogisticsDisposalPage: React.FC = () => {
  const { trackingList, wasteManifests } = useApp();
  const [activeTab, setActiveTab] = useState<'transfers' | 'biowaste'>('biowaste');
  const [selectedManifest, setSelectedManifest] = useState<BiomedicalWasteManifest | null>(null);

  const totalWasteKg = wasteManifests.reduce((acc, m) => acc + m.weightKg, 0);
  const certifiedCount = wasteManifests.filter((m) => m.status === 'certified').length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-amber-700 tracking-wider font-bold">
            CPCB Bio-Medical Waste Stream & Inter-Hospital Fleet
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
            Logistics & Hazardous Disposal Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enforcing temperature continuity for active surplus transfers and strict chain-of-custody for 1200°C bio-medical incineration.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl bg-slate-200/80 p-1 border border-slate-300 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('biowaste')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'biowaste'
                ? 'bg-amber-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Biomedical Waste Stream ({wasteManifests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'transfers'
                ? 'bg-teal-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Inter-Hospital Transfers ({trackingList.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Biomedical Waste Tracking (Strict Regulatory Flow) */}
      {activeTab === 'biowaste' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="text-[10px] uppercase font-mono font-bold text-amber-800">
                Total Biological Mass Manifested
              </div>
              <div className="text-2xl font-bold font-mono text-amber-950 mt-1">
                {totalWasteKg.toFixed(1)} kg
              </div>
              <div className="text-[11px] text-amber-800/80 mt-0.5">Under CPCB Yellow-Category Rules</div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="text-[10px] uppercase font-mono font-bold text-emerald-800">
                Certified Incinerated (1200°C)
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-950 mt-1">
                {certifiedCount} Batches
              </div>
              <div className="text-[11px] text-emerald-800/80 mt-0.5">Digital Destruction Certificates Stamped</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-[10px] uppercase font-mono font-bold text-slate-500">
                Authorized Central Facility
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1 line-clamp-1">
                Delhi Metro CBWTF Unit 4 (Okhla)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Dual-Chamber Continuous Flue Monitored</div>
            </div>
          </div>

          {/* 3D Interactive Containment Vault Terminal */}
          <BiomedicalVault3D manifests={wasteManifests} />

          {/* Waste Manifests Ledger */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">CPCB Manifest No.</th>
                    <th className="py-3 px-3">Discarded Formulation</th>
                    <th className="py-3 px-3">Origin Healthcare Node</th>
                    <th className="py-3 px-3 text-right">Mass / Units</th>
                    <th className="py-3 px-3">Condemnation Reason</th>
                    <th className="py-3 px-3 text-center">Incineration Custody</th>
                    <th className="py-3 px-4 text-right">Destruction Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {wasteManifests.map((m) => {
                    const isCert = m.status === 'certified';

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-900">{m.manifestNumber}</div>
                          <div className="text-[10px] text-slate-400">{m.gpsTimestamp}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-800">{m.medicineName}</div>
                          <div className="text-[10px] font-mono text-slate-500">
                            Batch: {m.batchNumber} • Exp: {m.expiryDate}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {m.hospitalName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">Carrier: {m.courierPartner}</div>
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                          <div>{m.weightKg} kg</div>
                          <div className="text-[10px] text-slate-400">{m.quantity} units</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="text-rose-700 font-semibold">{m.reason}</span>
                          <div className="text-[10px] text-slate-400">{m.destructionMethod}</div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {isCert ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> INCINERATED (1200°C)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-300 animate-pulse">
                              <Flame className="w-3 h-3 text-amber-700" /> CUSTODY IN TRANSIT
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedManifest(m)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-colors ${
                              isCert
                                ? 'bg-teal-700 hover:bg-teal-800 text-white'
                                : 'bg-amber-700 hover:bg-amber-800 text-white'
                            }`}
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{isCert ? 'View Certificate' : 'Inspect & Sign-off'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Inter-Hospital Medicine Transfers */}
      {activeTab === 'transfers' && (
        <div className="space-y-6">
          <IsometricRouteTracker3D shipment={trackingList[0]} />

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Shipment ID</th>
                  <th className="py-3 px-3">Medicine & Quantity</th>
                  <th className="py-3 px-3">Origin Institution</th>
                  <th className="py-3 px-3">Destination Node</th>
                  <th className="py-3 px-3">Carrier & Telemetry</th>
                  <th className="py-3 px-3 text-center">Temp Logger</th>
                  <th className="py-3 px-4 text-right">Delivery SLA Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {trackingList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {t.shipmentId}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{t.medicineName}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {t.quantity} units • Batch: {t.batchNumber}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{t.originHospital.split(',')[0]}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{t.destinationHospital.split(',')[0]}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-800 font-semibold">{t.courierPartner.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Sens: {t.sensorId}</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-900 text-[10px] font-mono font-bold border border-cyan-300">
                        <ThermometerSnowflake className="w-3 h-3 text-cyan-700" />
                        {t.currentTemp}°C NORMAL
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono text-emerald-700 font-bold text-xs">
                        {t.expectedDelivery}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* Destruction Certificate Modal */}
      <DestructionCertModal
        isOpen={!!selectedManifest}
        onClose={() => setSelectedManifest(null)}
        manifest={selectedManifest}
      />
    </div>
  );
};
