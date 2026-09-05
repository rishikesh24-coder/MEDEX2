import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutboundRequest } from '../../types';
import { Modal } from '../../components/common/Modal';
import { downloadBlobFile, downloadSimulatedPdf } from '../../utils/exportUtils';
import {
  ArrowDownLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Send,
  Download,
  FileText
} from 'lucide-react';

export const IncomingRequestsPage: React.FC = () => {
  const { currentHospital, requests, acceptRequest, rejectRequest, medicines, addToast } = useApp();

  const [rejectingReq, setRejectingReq] = useState<OutboundRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('Stock locally committed to Emergency ICU trauma wing');

  // Inbound requests for Apollo's inventory
  const inboundRequests = requests.filter((r) => r.sellerHospitalId === currentHospital.id);

  const handleExportCsv = () => {
    if (inboundRequests.length === 0) {
      addToast('No inbound requisitions to export.', 'info');
      return;
    }
    const headers = ['Order Number', 'Date', 'Medicine Name', 'Batch', 'Requester Hospital', 'Quantity', 'Amount (INR)', 'Status'];
    const rows = inboundRequests.map((r) => [
      r.orderNumber,
      new Date(r.requestedAt).toLocaleDateString(),
      `"${r.medicineName}"`,
      r.batchNumber,
      `"${r.requesterHospitalName}"`,
      r.quantity,
      r.totalAmount,
      r.status.toUpperCase()
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    downloadBlobFile(csvContent, `inbound_requisitions_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    addToast('Inbound requisitions exported successfully (CSV).', 'success');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReq) return;
    rejectRequest(rejectingReq.id, rejectReason);
    setRejectingReq(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">
            Inbound Surplus Requisitions
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
            Incoming Peer Purchase Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Peer hospitals requesting allocation from your listed surplus inventory. Review requester accreditations and accept to reserve stock for dispatch.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Export Inbound Requisitions (CSV)</span>
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-800 font-medium">
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
                    <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-200 text-[11px]">
                            #{req.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="font-bold text-slate-100 mt-0.5">{req.medicineName}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Batch: {req.batchNumber} • {req.storageCondition}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-teal-400" />
                          {req.requesterHospitalName}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-semibold">
                          <ShieldCheck className="w-3 h-3" /> Form 20B Verified
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-100 font-bold text-sm">
                        {req.quantity} units
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                        {availableUnits} units left
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono">
                        <div className="font-bold text-emerald-400">₹{req.totalAmount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500">Net recovery</div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {req.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/40 text-amber-300 text-[10px] font-mono font-bold border border-amber-800/60 animate-pulse">
                            <Clock className="w-3 h-3" /> ACTION REQUIRED
                          </span>
                        )}
                        {req.status === 'accepted' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/40 text-blue-300 text-[10px] font-mono font-semibold border border-blue-800/60">
                            <CheckCircle2 className="w-3 h-3" /> ACCEPTED (Awaiting Escrow)
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/40 text-rose-300 text-[10px] font-mono font-semibold border border-rose-800/60">
                            <XCircle className="w-3 h-3" /> REJECTED
                          </span>
                        )}
                        {(req.status === 'paid' || req.status === 'in_transit') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-800/60">
                            ESCROW PAID • READY FOR PICKUP
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => acceptRequest(req.id)}
                              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                            >
                              Accept Requisition & Reserve Stock
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectingReq(req)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                            >
                              Decline Requisition
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              downloadSimulatedPdf(
                                `COLD-CHAIN-PACKING-SLIP-${req.orderNumber}.pdf`,
                                'INTER-HOSPITAL COLD-CHAIN DISPATCH MANIFEST',
                                [
                                  ['Order Requisition ID', req.orderNumber],
                                  ['Origin Hospital (Seller)', currentHospital.name],
                                  ['Destination Hospital (Buyer)', req.requesterHospitalName],
                                  ['Medicine Formulation', req.medicineName],
                                  ['Manufacturer Batch Number', req.batchNumber],
                                  ['Reserved Quantity', `${req.quantity} units`],
                                  ['Cold-Chain Protocol', req.storageCondition],
                                  ['Net Escrow Payout', `INR ${req.totalAmount.toLocaleString()}`],
                                  ['Status', req.status.toUpperCase()],
                                  ['Quality Inspection Seal', 'CDSCO FORM 20B VERIFIED']
                                ]
                              );
                              addToast('Cold-chain packing slip generated and downloaded (PDF).', 'success');
                            }}
                            className="px-2.5 py-1 rounded-md bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 text-[11px] font-semibold border border-teal-800/60 flex items-center gap-1 ml-auto cursor-pointer transition-colors"
                            title="Generate and download verified cold-chain packing slip"
                          >
                            <FileText className="w-3 h-3 text-teal-400" />
                            <span>Download Packing Slip (PDF)</span>
                          </button>
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
          <p className="text-slate-300">
            Please specify the compliance or inventory reason for declining this request from <strong className="text-slate-100">{rejectingReq?.requesterHospitalName}</strong>:
          </p>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Select Rejection Justification *
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full font-medium p-2.5 rounded-lg border border-slate-700 focus:ring-2 focus:ring-rose-500 bg-slate-950 text-slate-100"
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

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejectingReq(null)}
              className="px-4 py-2 font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel & Keep Requisition Pending
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors"
            >
              Confirm Statutory Rejection & Update Registry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
