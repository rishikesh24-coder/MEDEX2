import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutboundRequest } from '../../types';
import { RazorpayModal } from '../../components/hospital/RazorpayModal';
import { InvoiceModal } from '../../components/hospital/InvoiceModal';
import { downloadBlobFile } from '../../utils/exportUtils';
import {
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  Building2,
  FileText,
  Search,
  Download,
  Ban
} from 'lucide-react';

export const MyRequestsPage: React.FC = () => {
  const { currentHospital, requests, rejectRequest, navigate, addToast } = useApp();

  const [activeRazorpayReq, setActiveRazorpayReq] = useState<OutboundRequest | null>(null);
  const [activeInvoiceReq, setActiveInvoiceReq] = useState<OutboundRequest | null>(null);

  // Outbound purchases made by current hospital
  const outboundRequests = requests.filter((r) => r.requesterHospitalId === currentHospital.id);

  const handleExportCsv = () => {
    if (outboundRequests.length === 0) {
      addToast('No purchase orders to export.', 'info');
      return;
    }
    const headers = ['Order Number', 'Date', 'Medicine Name', 'Batch', 'Storage', 'Seller Hospital', 'Quantity', 'Amount (INR)', 'Status'];
    const rows = outboundRequests.map((r) => [
      r.orderNumber,
      new Date(r.requestedAt).toLocaleDateString(),
      `"${r.medicineName}"`,
      r.batchNumber,
      `"${r.storageCondition}"`,
      `"${r.sellerHospitalName}"`,
      r.quantity,
      r.totalAmount,
      r.status.toUpperCase()
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    downloadBlobFile(csvContent, `my_purchase_orders_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    addToast('Purchase orders exported successfully (CSV).', 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-teal-400 tracking-wider font-bold">
            Outbound Acquisition Orders
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight mt-0.5">
            My Purchase Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track requisition status across peer hospital sellers, execute Razorpay Escrow payments, and inspect delivery telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Purchase Orders (CSV)</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/hospital/marketplace')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Browse Available Surplus Batches</span>
          </button>
        </div>
      </div>

      {/* Requests Ledger */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order & Medicine Details</th>
                <th className="py-3 px-3">Seller Institution</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Amount (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action / Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {outboundRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    You have not placed any outbound surplus purchase requests yet.
                  </td>
                </tr>
              ) : (
                outboundRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-300 text-[11px]">
                          #{req.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-bold text-white mt-0.5">{req.medicineName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Batch: {req.batchNumber} • {req.storageCondition}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-400" />
                        {req.sellerHospitalName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">NABH Peer Node</div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-white font-bold">
                      {req.quantity} units
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono">
                      <div className="font-bold text-white">₹{req.totalAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">Rate: ₹{req.unitPrice}/u</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 text-[10px] font-mono font-semibold border border-amber-700/50">
                          <Clock className="w-3 h-3" /> PENDING PEER APPROVAL
                        </span>
                      )}
                      {req.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-300 text-[10px] font-mono font-bold border border-blue-700/50">
                          <CheckCircle2 className="w-3 h-3" /> ACCEPTED • UNPAID
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-300 text-[10px] font-mono font-semibold border border-rose-700/50">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      )}
                      {(req.status === 'paid' || req.status === 'in_transit' || req.status === 'delivered') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-700/50">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ESCROW SECURED
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'accepted' && (
                        <button
                          type="button"
                          onClick={() => setActiveRazorpayReq(req)}
                          className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 ml-auto transition-all animate-pulse cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay via Razorpay Escrow</span>
                        </button>
                      )}

                      {(req.status === 'paid' || req.status === 'in_transit' || req.status === 'delivered') && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => navigate('/hospital/tracking')}
                            className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Inspect Cold-Chain Live GPS & Temperature Log"
                          >
                            <Truck className="w-3 h-3 text-teal-400" />
                            <span>Track Cold-Chain GPS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInvoiceReq(req)}
                            className="px-2.5 py-1 rounded-md bg-teal-950/60 hover:bg-teal-900/80 text-teal-300 text-[11px] font-semibold border border-teal-700/50 flex items-center gap-1 cursor-pointer transition-colors"
                            title="View & Download Official GST Tax Invoice"
                          >
                            <FileText className="w-3 h-3 text-teal-400" />
                            <span>View Official Tax Invoice (PDF)</span>
                          </button>
                        </div>
                      )}

                      {req.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[11px] text-slate-400 italic">Awaiting Seller Review</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you wish to withdraw and cancel purchase requisition #${req.orderNumber}?`)) {
                                rejectRequest(req.id, 'Withdrawn by requesting hospital node');
                                addToast(`Requisition #${req.orderNumber} successfully withdrawn.`, 'info');
                              }
                            }}
                            className="px-2.5 py-1 rounded-md bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-[11px] font-semibold border border-rose-800/60 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Withdraw and cancel this requisition"
                          >
                            <Ban className="w-3 h-3 text-rose-400" />
                            <span>Withdraw Requisition</span>
                          </button>
                        </div>
                      )}

                      {req.status === 'rejected' && (
                        <span className="text-[11px] text-rose-400 font-mono">
                          {req.rejectionReason || 'Stock committed to ICU'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Razorpay Escrow Modal */}
      <RazorpayModal
        isOpen={!!activeRazorpayReq}
        onClose={() => setActiveRazorpayReq(null)}
        request={activeRazorpayReq}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={!!activeInvoiceReq}
        onClose={() => setActiveInvoiceReq(null)}
        request={activeInvoiceReq}
      />
    </div>
  );
};
