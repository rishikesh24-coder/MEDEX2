import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutboundRequest } from '../../types';
import { RazorpayModal } from '../../components/hospital/RazorpayModal';
import { InvoiceModal } from '../../components/hospital/InvoiceModal';
import {
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  Building2,
  FileText,
  Search
} from 'lucide-react';

export const MyRequestsPage: React.FC = () => {
  const { currentHospital, requests, navigate } = useApp();

  const [activeRazorpayReq, setActiveRazorpayReq] = useState<OutboundRequest | null>(null);
  const [activeInvoiceReq, setActiveInvoiceReq] = useState<OutboundRequest | null>(null);

  // Outbound purchases made by current hospital
  const outboundRequests = requests.filter((r) => r.requesterHospitalId === currentHospital.id);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-teal-700 tracking-wider font-bold">
            Outbound Acquisition Orders
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
            My Purchase Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track requisition status across peer hospital sellers, execute Razorpay Escrow payments, and inspect delivery telemetry.
          </p>
        </div>

        <button
          onClick={() => navigate('/hospital/marketplace')}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors"
        >
          Browse More Surplus
        </button>
      </div>

      {/* Requests Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order & Medicine Details</th>
                <th className="py-3 px-3">Seller Institution</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Amount (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action / Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {outboundRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    You have not placed any outbound surplus purchase requests yet.
                  </td>
                </tr>
              ) : (
                outboundRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-[11px]">
                          #{req.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(req.requestedAt).toLocaleDateString()}
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
                        {req.sellerHospitalName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">NABH Peer Node</div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-800 font-bold">
                      {req.quantity} units
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono">
                      <div className="font-bold text-slate-900">₹{req.totalAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">Rate: ₹{req.unitPrice}/u</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono font-semibold border border-amber-200">
                          <Clock className="w-3 h-3" /> PENDING PEER APPROVAL
                        </span>
                      )}
                      {req.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-mono font-bold border border-blue-200">
                          <CheckCircle2 className="w-3 h-3" /> ACCEPTED • UNPAID
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-mono font-semibold border border-rose-200">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      )}
                      {(req.status === 'paid' || req.status === 'in_transit' || req.status === 'delivered') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-mono font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ESCROW SECURED
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'accepted' && (
                        <button
                          onClick={() => setActiveRazorpayReq(req)}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 ml-auto transition-all animate-pulse"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay with Razorpay</span>
                        </button>
                      )}

                      {(req.status === 'paid' || req.status === 'in_transit' || req.status === 'delivered') && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate('/hospital/tracking')}
                            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3 text-teal-700" /> Live GPS
                          </button>
                          <button
                            onClick={() => setActiveInvoiceReq(req)}
                            className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-900 text-[11px] font-semibold border border-teal-200 flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-teal-700" /> Tax Invoice
                          </button>
                        </div>
                      )}

                      {req.status === 'pending' && (
                        <span className="text-[11px] text-slate-400 italic">Awaiting Seller Review</span>
                      )}

                      {req.status === 'rejected' && (
                        <span className="text-[11px] text-rose-600 font-mono">
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
