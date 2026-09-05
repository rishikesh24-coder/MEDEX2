import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { MedicineItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

interface AdminOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: MedicineItem | null;
}

export const AdminOverrideModal: React.FC<AdminOverrideModalProps> = ({ isOpen, onClose, medicine }) => {
  const { adminOverrideMedicine } = useApp();

  const [availableUnits, setAvailableUnits] = useState(medicine?.availableUnits || 0);
  const [concessionPercentage, setConcessionPercentage] = useState(medicine?.concessionPercentage || 30);
  const [status, setStatus] = useState<MedicineItem['status']>(medicine?.status || 'available');
  const [overrideReason, setOverrideReason] = useState('Regulatory Emergency Allocation / Quota Balancing');

  if (!medicine) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransferPrice = Math.round(medicine.mrpPerUnit * (1 - concessionPercentage / 100) * 100) / 100;
    adminOverrideMedicine(medicine.id, {
      availableUnits: Number(availableUnits),
      concessionPercentage: Number(concessionPercentage),
      transferPricePerUnit: newTransferPrice,
      status
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CDSCO Master Administrative Override"
      subtitle={`Batch: ${medicine.batchNumber} • Institution: ${medicine.hospitalName}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300">Privileged Regulatory Action:</strong> Administrative modifications override the hospital's local ledger and are permanently recorded in the National Drug Surveillance Audit Trail.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Active Available Units
            </label>
            <input
              type="number"
              min="0"
              required
              value={availableUnits}
              onChange={(e) => setAvailableUnits(Number(e.target.value))}
              className="w-full text-xs font-mono font-medium px-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Concession Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="90"
              required
              value={concessionPercentage}
              onChange={(e) => setConcessionPercentage(Number(e.target.value))}
              className="w-full text-xs font-mono font-medium px-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Batch Status Override
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MedicineItem['status'])}
            className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100"
          >
            <option value="available">Available (Public Network Visible)</option>
            <option value="reserved">Reserved (Emergency ICU Quota Hold)</option>
            <option value="regulatory_lockout">Regulatory Lockout (Halt Commercial Circulation)</option>
            <option value="routed_to_disposal">Routed to Safe Biomedical Disposal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Surveillance Audit Justification *
          </label>
          <textarea
            rows={3}
            required
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            className="w-full text-xs font-medium p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100"
            placeholder="State regulatory justification, e.g. batch recall alert, emergency regional shortage, or verified hospital discrepancy..."
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Cancel & Discard Changes
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Commit Regulatory Override & Update National Registry
          </button>
        </div>
      </form>
    </Modal>
  );
};
