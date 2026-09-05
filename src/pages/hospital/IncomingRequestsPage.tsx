import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutboundRequest } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  ArrowDownLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Send
} from 'lucide-react';

export const IncomingRequestsPage: React.FC = () => {
  const { currentHospital, requests, acceptRequest, rejectRequest, medicines } = useApp();

  const [rejectingReq, setRejectingReq] = useState<OutboundRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('Stock locally committed to Emergency ICU trauma wing');

  // Inbound requests for Apollo's inventory
  const inboundRequests = requests.filter((r) => r.sellerHospitalId === currentHospital.id);

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReq) return;
    rejectRequest(rejectingReq.id, rejectReason);
    setRejectingReq(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-emerald-700 tracking-wider font-bold">
          Inbound Surplus Requisitions
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Incoming Peer Purchase Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Peer hospitals requesting allocation from your listed surplus inventory. Review requester accreditations and accept to reserve stock for dispatch.
        </p>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID & Medicine</th>
                <th className="py-3 px-3">Requester Institution</th>
                <th className="py-3 px-3 text-right">Requested Qty</th>
                <th className="py-3 px-3 text-right">Batch Stock Left</th>
                <th className="py-3 px-3 text-right">Transfer Payout (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Pharmacy Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {inboundRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No peer hospitals have requested your surplus inventory currently.
                  </td>
                </tr>
              ) : (
                inboundRequests.map((req) => {
                  const currentMed = medicines.find((m) => m.id === req.medicineId);
                  const availableUnits = currentMed?.availableUnits ?? 0;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-[11px]">
                            #{req.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="font-bold text-slate-800 mt-0.5">{req.medicineName}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          Batch: {req.batchNumber} • {req.storageCondition}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-teal-700" />
                          {req.requesterHospitalName}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono font-semibold">
                          <ShieldCheck className="w-3 h-3" /> Form 20B Verified
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-800 font-bold text-sm">
                        {req.quantity} units
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                        {availableUnits} units left
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono">
                        <div className="font-bold text-emerald-700">₹{req.totalAmount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">Net recovery</div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {req.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono font-bold border border-amber-200 animate-pulse">
                            <Clock className="w-3 h-3" /> ACTION REQUIRED
                          </span>
                        )}
                        {req.status === 'accepted' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-mono font-semibold border border-blue-200">
                            <CheckCircle2 className="w-3 h-3" /> ACCEPTED (Awaiting Escrow)
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-mono font-semibold border border-rose-200">
                            <XCircle className="w-3 h-3" /> REJECTED
                          </span>
                        )}
                        {(req.status === 'paid' || req.status === 'in_transit') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-mono font-bold border border-emerald-200">
                            ESCROW PAID • READY FOR PICKUP
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => acceptRequest(req.id)}
                              className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors"
                            >
                              Accept Request
                            </button>
                            <button
                              onClick={() => setRejectingReq(req)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">
                            Logged in manifest
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={!!rejectingReq}
        onClose={() => setRejectingReq(null)}
        title="Decline Surplus Transfer Requisition"
        subtitle={`Order #${rejectingReq?.orderNumber}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
          <p className="text-slate-600">
            Please specify the compliance or inventory reason for declining this request from <strong>{rejectingReq?.requesterHospitalName}</strong>:
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Rejection Justification *
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-600 bg-white"
            >
              <option value="Stock locally committed to Emergency ICU trauma wing">
                Stock locally committed to Emergency ICU trauma wing
              </option>
              <option value="Cold-chain temperature deviation detected in local storage vault">
                Cold-chain temperature deviation detected in local storage vault
              </option>
              <option value="Batch requested for Central Ministry emergency quarantine">
                Batch requested for Central Ministry emergency quarantine
              </option>
              <option value="Insufficient units available to fulfill minimum packing unit">
                Insufficient units available to fulfill minimum packing unit
              </option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejectingReq(null)}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
