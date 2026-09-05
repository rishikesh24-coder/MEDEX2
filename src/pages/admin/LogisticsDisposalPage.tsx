import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BiomedicalWasteManifest, ShipmentTracking } from '../../types';
import { DestructionCertModal } from '../../components/admin/DestructionCertModal';
import { downloadBlobFile } from '../../utils/exportUtils';
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
  Printer,
  Download,
  Activity
} from 'lucide-react';
import { BiomedicalVault3D } from '../../components/3d/BiomedicalVault3D';
import { IsometricRouteTracker3D } from '../../components/3d/IsometricRouteTracker3D';

export const LogisticsDisposalPage: React.FC = () => {
  const { trackingList, wasteManifests, addToast, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'transfers' | 'biowaste'>('biowaste');
  const [selectedManifest, setSelectedManifest] = useState<BiomedicalWasteManifest | null>(null);

  const totalWasteKg = wasteManifests.reduce((acc, m) => acc + m.weightKg, 0);
  const certifiedCount = wasteManifests.filter((m) => m.status === 'certified').length;

  const handleExportWasteCsv = () => {
    const headers = ['Manifest Number', 'Medicine Name', 'Batch Number', 'Hospital', 'Weight (kg)', 'Units', 'Reason', 'Destruction Method', 'Status', 'Timestamp'];
    const rows = wasteManifests.map((m) => [
      m.manifestNumber,
      m.medicineName,
      m.batchNumber,
      m.hospitalName,
      m.weightKg,
      m.quantity,
      m.reason,
      m.destructionMethod,
      m.status,
      m.gpsTimestamp
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    downloadBlobFile(csv, 'cpcb-biomedical-waste-audit.csv', 'text/csv;charset=utf-8;');
    addToast('Downloaded official Form-IV regional biomedical waste ledger as CSV.', 'success');
  };

  const handleExportTransfersCsv = () => {
    const headers = ['Shipment ID', 'Medicine Name', 'Batch', 'Quantity', 'Origin', 'Destination', 'Courier', 'Current Temp (C)', 'Expected Delivery'];
    const rows = trackingList.map((t) => [
      t.shipmentId,
      t.medicineName,
      t.batchNumber,
      t.quantity,
      t.originHospital,
      t.destinationHospital,
      t.courierPartner,
      t.currentTemp,
      t.expectedDelivery
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    downloadBlobFile(csv, 'inter-hospital-fleet-logistics.csv', 'text/csv;charset=utf-8;');
    addToast('Downloaded inter-hospital cold-chain shipment log as CSV.', 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-amber-400 tracking-wider font-bold">
            CPCB Bio-Medical Waste Stream & Inter-Hospital Fleet
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
            Logistics & Hazardous Disposal Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enforcing temperature continuity for active surplus transfers and strict chain-of-custody for 1200°C bio-medical incineration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {activeTab === 'biowaste' ? (
            <button
              onClick={handleExportWasteCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:bg-slate-800 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export CPCB Waste Audit (CSV)</span>
            </button>
          ) : (
            <button
              onClick={handleExportTransfersCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:bg-slate-800 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Export Fleet Log (CSV)</span>
            </button>
          )}

          {/* Tab Switcher */}
          <div className="inline-flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('biowaste')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'biowaste'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>CPCB Biomedical Waste Stream ({wasteManifests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('transfers')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'transfers'
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Inter-Hospital Medicine Fleet ({trackingList.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Biomedical Waste Tracking (Strict Regulatory Flow) */}
      {activeTab === 'biowaste' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-amber-800/60 bg-amber-950/20 backdrop-blur-xs">
              <div className="text-[10px] uppercase font-mono font-bold text-amber-400">
                Total Biological Mass Manifested
              </div>
              <div className="text-2xl font-bold font-mono text-amber-200 mt-1">
                {totalWasteKg.toFixed(1)} kg
              </div>
              <div className="text-[11px] text-amber-400/80 mt-0.5">Under CPCB Yellow-Category Rules</div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 backdrop-blur-xs">
              <div className="text-[10px] uppercase font-mono font-bold text-emerald-400">
                Certified Incinerated (1200°C)
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-200 mt-1">
                {certifiedCount} Batches
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">Digital Destruction Certificates Stamped</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-xs">
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
                Authorized Central Facility
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1 line-clamp-1">
                Delhi Metro CBWTF Unit 4 (Okhla)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Dual-Chamber Continuous Flue Monitored</div>
            </div>
          </div>

          {/* 3D Interactive Containment Vault Terminal */}
          <BiomedicalVault3D manifests={wasteManifests} />

          {/* Waste Manifests Ledger */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
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
                <tbody className="divide-y divide-slate-800 font-medium">
                  {wasteManifests.map((m) => {
                    const isCert = m.status === 'certified';

                    return (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-200">{m.manifestNumber}</div>
                          <div className="text-[10px] text-slate-500">{m.gpsTimestamp}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-100">{m.medicineName}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Batch: {m.batchNumber} • Exp: {m.expiryDate}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-200 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {m.hospitalName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">Carrier: {m.courierPartner}</div>
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100">
                          <div>{m.weightKg} kg</div>
                          <div className="text-[10px] text-slate-400">{m.quantity} units</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="text-rose-400 font-semibold">{m.reason}</span>
                          <div className="text-[10px] text-slate-400">{m.destructionMethod}</div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {isCert ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-800/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> INCINERATED (1200°C)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/50 text-amber-300 text-[10px] font-mono font-bold border border-amber-800/60 animate-pulse">
                              <Flame className="w-3 h-3 text-amber-400" /> CUSTODY IN TRANSIT
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedManifest(m)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isCert
                                ? 'bg-teal-600 hover:bg-teal-500 text-white'
                                : 'bg-amber-600 hover:bg-amber-500 text-white'
                            }`}
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{isCert ? 'Inspect CPCB Certificate (PDF)' : 'Digitally Sign & Certify Incineration'}</span>
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

          <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Shipment ID</th>
                  <th className="py-3 px-3">Medicine & Quantity</th>
                  <th className="py-3 px-3">Origin Institution</th>
                  <th className="py-3 px-3">Destination Node</th>
                  <th className="py-3 px-3">Carrier & Telemetry</th>
                  <th className="py-3 px-3 text-center">Temp Logger</th>
                  <th className="py-3 px-3">Delivery SLA</th>
                  <th className="py-3 px-4 text-right">Live Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {trackingList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      {t.shipmentId}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-100">{t.medicineName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {t.quantity} units • Batch: {t.batchNumber}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-200">{t.originHospital.split(',')[0]}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-200">{t.destinationHospital.split(',')[0]}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-200 font-semibold">{t.courierPartner.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Sens: {t.sensorId}</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-800/80">
                        <ThermometerSnowflake className="w-3 h-3 text-cyan-400" />
                        {t.currentTemp}°C NORMAL
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold text-xs">
                      {t.expectedDelivery}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate('/hospital/tracking')}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Track Live Telemetry</span>
                      </button>
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
