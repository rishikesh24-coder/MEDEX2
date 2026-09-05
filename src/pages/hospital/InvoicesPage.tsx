import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutboundRequest } from '../../types';
import { InvoiceModal } from '../../components/hospital/InvoiceModal';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Search,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const { currentHospital, requests } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<OutboundRequest | null>(null);

  // Paid orders with payment details
  const paidRequests = requests.filter(
    (r) =>
      (r.requesterHospitalId === currentHospital.id || r.sellerHospitalId === currentHospital.id) &&
      r.paymentDetails
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-teal-700 tracking-wider font-bold">
          Statutory Financial Compliance
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Payment Receipts & GST Tax Invoices
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cryptographically signed Razorpay Escrow vouchers, GST Form GSTR-1 input credit reports, and inter-hospital delivery manifests.
        </p>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-3">Razorpay Order & Payment ID</th>
                <th className="py-3 px-3">Medicine & Batch</th>
                <th className="py-3 px-3">Transacting Peer</th>
                <th className="py-3 px-3 text-right">Taxable Value (₹)</th>
                <th className="py-3 px-3 text-right">Concession Saved</th>
                <th className="py-3 px-4 text-right">Receipt Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {paidRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No settled invoices found in the current billing cycle.
                  </td>
                </tr>
              ) : (
                paidRequests.map((req) => {
                  const payment = req.paymentDetails!;
                  const isBuyer = req.requesterHospitalId === currentHospital.id;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <div>{payment.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {new Date(payment.paidAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        <div className="text-slate-800 font-semibold">{payment.paymentId}</div>
                        <div className="text-[10px] text-slate-500">{payment.orderId}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800">{req.medicineName}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {req.quantity} units • Batch: {req.batchNumber}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-teal-700" />
                          {isBuyer ? req.sellerHospitalName : req.requesterHospitalName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {isBuyer ? 'Seller Peer' : 'Buyer Peer'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{(req.totalAmount + payment.taxAmount).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-emerald-700 font-bold">
                        ₹{payment.concessionSaved.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> View & Print
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  );
};
