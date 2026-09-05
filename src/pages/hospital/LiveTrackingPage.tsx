import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShipmentTracking } from '../../types';
import {
  Truck,
  ThermometerSnowflake,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Radio,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { IsometricRouteTracker3D } from '../../components/3d/IsometricRouteTracker3D';
import { Tilt3DCard } from '../../components/3d/Tilt3DCard';

export const LiveTrackingPage: React.FC = () => {
  const { trackingList } = useApp();
  const [selectedShipment, setSelectedShipment] = useState<ShipmentTracking>(trackingList[0] || null);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-teal-700 tracking-wider font-bold">
          Inter-Hospital Cold-Chain Logistics Hub
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Live Shipment & Temperature Telemetry
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time GPS tracking and continuous IoT temperature monitoring (&lt; 8.0°C) for biological and surplus medicine transfers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Active Shipments */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active Consignments ({trackingList.length})
          </div>

          {trackingList.map((shipment) => {
            const isSelected = selectedShipment?.id === shipment.id;

            return (
              <Tilt3DCard
                key={shipment.id}
                maxTilt={8}
                onClick={() => setSelectedShipment(shipment)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/70 shadow-spatial ring-2 ring-teal-500/40'
                    : 'border-slate-200 bg-white/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {shipment.shipmentId}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100/90 text-cyan-950 border border-cyan-300/80 shadow-xs">
                    <ThermometerSnowflake className="w-3 h-3 text-cyan-700" />
                    {shipment.currentTemp}°C
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-800 mt-2">
                  {shipment.medicineName}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {shipment.quantity} units • Batch: {shipment.batchNumber}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[150px]">{shipment.destinationHospital.split(' ')[0]}</span>
                  <span className="text-teal-700 font-bold">{shipment.expectedDelivery.split('(')[0]}</span>
                </div>
              </Tilt3DCard>
            );
          })}
        </div>

        {/* Right Active Consignment Telemetry Console */}
        {selectedShipment && (
          <div className="lg:col-span-2 space-y-6">
            {/* Top Telemetry Bar */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-teal-400 text-xs font-bold uppercase">
                      ACTIVE SATELLITE TELEMETRY
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    Shipment: {selectedShipment.shipmentId}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Logger Temp</div>
                    <div className="text-xl font-bold font-mono text-cyan-300">
                      {selectedShipment.currentTemp}°C
                    </div>
                  </div>
                </div>
              </div>

              {/* Origin -> Destination Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Consignor (Origin)</div>
                  <div className="font-bold text-slate-100 mt-0.5">{selectedShipment.originHospital}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Consignee (Destination)</div>
                  <div className="font-bold text-slate-100 mt-0.5">{selectedShipment.destinationHospital}</div>
                </div>
              </div>

              {/* Courier Fleet Details */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-teal-400" />
                  <span>{selectedShipment.courierPartner}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>{selectedShipment.courierContact}</span>
                </div>
              </div>
            </div>

            {/* Interactive 3D Isometric Route & Cold-Chain Corridor */}
            <IsometricRouteTracker3D shipment={selectedShipment} />

            {/* 4-Stop Chain-of-Custody Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700" />
                Chain-of-Custody Verification Checkpoints
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
                {selectedShipment.checkpoints.map((cp, idx) => (
                  <div key={idx} className="relative z-10 flex items-start gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      cp.done
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                    }`}>
                      {cp.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${cp.done ? 'text-slate-900' : 'text-slate-500'}`}>
                          {cp.title}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{cp.timestamp}</span>
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">{cp.location}</div>
                      {cp.tempRecorded && (
                        <div className="font-mono text-[10px] text-cyan-800 font-semibold mt-1">
                          Sensor Logged: {cp.tempRecorded}°C {cp.verifiedBy && `• Signed: ${cp.verifiedBy}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
