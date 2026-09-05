import React, { useState } from 'react';
import { ShipmentTracking } from '../../types';
import {
  Truck,
  ThermometerSnowflake,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Radio,
  Flame,
  CheckCircle2,
  Navigation,
  Compass
} from 'lucide-react';

interface IsometricRouteTracker3DProps {
  shipment: ShipmentTracking;
}

export const IsometricRouteTracker3D: React.FC<IsometricRouteTracker3DProps> = ({ shipment }) => {
  const [activeWaypoint, setActiveWaypoint] = useState<number>(2); // Default to in-transit
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const waypoints = [
    {
      id: 0,
      title: 'Origin Dispensary Vault',
      location: shipment.originHospital,
      status: 'VERIFIED DISPATCH',
      temp: 3.8,
      timestamp: '09:30 AM',
      icon: Building2,
      color: 'teal'
    },
    {
      id: 1,
      title: 'Thermal Packout & Courier Handoff',
      location: `${shipment.courierPartner.split(' ')[0]} Hub Bay 4`,
      status: 'SEAL LOCKED',
      temp: 4.1,
      timestamp: '11:15 AM',
      icon: ShieldCheck,
      color: 'cyan'
    },
    {
      id: 2,
      title: 'Active Cold Corridor In Transit',
      location: shipment.currentLocation,
      status: 'TELEMETRY STREAMING',
      temp: shipment.currentTemp,
      timestamp: 'Live Active',
      icon: Truck,
      color: 'emerald',
      isActive: true
    },
    {
      id: 3,
      title: 'Destination Receiving Quarantine',
      location: shipment.destinationHospital,
      status: 'ESTIMATED ARRIVAL',
      temp: 4.0,
      timestamp: shipment.expectedDelivery.split('(')[0],
      icon: Building2,
      color: 'blue'
    }
  ];

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-white shadow-spatial overflow-hidden p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-mono uppercase font-bold text-teal-800">
              3D ISOMETRIC LOGISTICS CORRIDOR
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Consignment #{shipment.shipmentId} • {shipment.medicineName}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-700 animate-pulse" />
            <span>{shipment.currentTemp}°C OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* 3D Isometric Route Stage Visualizer */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 p-6 flex flex-col justify-between select-none">
        {/* Ambient Grid & Background Lighting */}
        <div className="absolute inset-0 bg-clinical-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-4 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top HUD Row */}
        <div className="relative z-20 flex justify-between items-center text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
            <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="text-teal-300 font-semibold">Sensor: {shipment.sensorId}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            SPEED: 42 km/h • GPS: {shipment.latitude}°N, {shipment.longitude}°E
          </div>
        </div>

        {/* 3D Isometric Map Stage with Perspective Tilt */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div
            className="relative w-full max-w-2xl h-44 flex items-center justify-between px-4 sm:px-10"
            style={{
              transform: 'perspective(900px) rotateX(24deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Base Isometric Neon Highway Track */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-4 bg-slate-800/90 rounded-full border border-slate-700 shadow-inner overflow-hidden">
              {/* Laser Stream Pulse */}
              <div className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 w-3/4 rounded-full relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#2dd4bf] animate-ping" />
              </div>
            </div>

            {/* Waypoint Isometric Nodes */}
            {waypoints.map((wp, idx) => {
              const isPastOrCurrent = idx <= 2;
              const isCurrent = idx === 2;
              const Icon = wp.icon;

              return (
                <div
                  key={wp.id}
                  onClick={() => setActiveWaypoint(idx)}
                  onMouseEnter={() => setHoveredNode(idx)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ transform: 'translateZ(30px)' }}
                  className="relative z-20 flex flex-col items-center cursor-pointer group"
                >
                  {/* Floating 3D Temperature Gauge Badge (above active node) */}
                  {isCurrent && (
                    <div
                      style={{ transform: 'translateZ(40px)' }}
                      className="absolute -top-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce"
                    >
                      <div className="px-3 py-1.5 rounded-xl bg-teal-900/95 border border-teal-400/80 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.5)] text-white font-mono text-xs flex items-center gap-1.5 whitespace-nowrap">
                        <ThermometerSnowflake className="w-4 h-4 text-cyan-300" />
                        <span className="font-bold text-cyan-300">{wp.temp}°C</span>
                        <span className="text-[10px] text-teal-200">OPTIMAL</span>
                      </div>
                      <div className="w-1.5 h-4 bg-gradient-to-b from-teal-400 to-transparent" />
                      <div className="w-2 h-2 rounded-full bg-teal-400 shadow-md" />
                    </div>
                  )}

                  {/* Node Pillar / Pedestal */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.7)] scale-110 border-2 border-white'
                        : isPastOrCurrent
                        ? 'bg-slate-800 text-teal-300 border border-teal-600/50 shadow-md hover:scale-105'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Node Tag */}
                  <div className="mt-3 text-center">
                    <div className={`font-mono text-xs font-bold ${isCurrent ? 'text-teal-300' : 'text-slate-300'}`}>
                      {wp.title.split(' ')[0]} {wp.title.split(' ')[1] || ''}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {wp.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Interactive Telemetry Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Inspecting Node:</span>
            <strong className="text-teal-300">
              {waypoints[activeWaypoint].title} ({waypoints[activeWaypoint].status})
            </strong>
          </div>
          <div className="text-slate-400 text-[11px]">
            Thermal Envelope: <span className="text-cyan-400">2.0°C – 8.0°C</span> | Courier: {shipment.courierPartner.split(' ')[0]}
          </div>
        </div>
      </div>

      {/* Staggered Telemetry Checkpoint Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        {waypoints.map((wp, idx) => {
          const isSelected = activeWaypoint === idx;
          return (
            <div
              key={wp.id}
              onClick={() => setActiveWaypoint(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-1 ring-teal-600'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                <span>STAGE 0{idx + 1}</span>
                <span className="font-bold text-teal-800">{wp.temp}°C</span>
              </div>
              <div className="font-bold text-slate-900 truncate">{wp.title}</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{wp.location}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
