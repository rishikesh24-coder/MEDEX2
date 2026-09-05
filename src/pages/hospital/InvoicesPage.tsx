import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutboundRequest } from '../../types';
import { InvoiceModal } from '../../components/hospital/InvoiceModal';
import { downloadBlobFile } from '../../utils/exportUtils';
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
  const { currentHospital, requests, addToast } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<OutboundRequest | null>(null);

  // Paid orders with payment details
  const paidRequests = requests.filter(
    (r) =>
      (r.requesterHospitalId === currentHospital.id || r.sellerHospitalId === currentHospital.id) &&
      r.paymentDetails
  );

  const handleExportGstr1Csv = () => {
    if (paidRequests.length === 0) {
      addToast('No settled tax invoices found to export.', 'info');
      return;
    }
    const headers = ['Invoice Number', 'Payment Date', 'Razorpay Payment ID', 'Medicine Name', 'Batch', 'Buyer/Seller Hospital', 'Taxable Value (INR)', 'GST Amount (INR)', 'Concession Saved (INR)'];
    const rows = paidRequests.map((r) => {
      const p = r.paymentDetails!;
      const isBuyer = r.requesterHospitalId === currentHospital.id;
      return [
        p.invoiceNumber,
        new Date(p.paidAt).toLocaleDateString(),
        p.paymentId,
        `"${r.medicineName}"`,
        r.batchNumber,
        `"${isBuyer ? r.sellerHospitalName : r.requesterHospitalName}"`,
        r.totalAmount,
        p.taxAmount,
        p.concessionSaved
      ];
    });
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    downloadBlobFile(csvContent, `gstr1_consolidated_ledger_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    addToast('GSTR-1 tax invoice ledger exported successfully (CSV).', 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-teal-400 tracking-wider font-bold">
            Statutory Financial Compliance
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
            Payment Receipts & GST Tax Invoices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically signed Razorpay Escrow vouchers, GST Form GSTR-1 input credit reports, and inter-hospital delivery manifests.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportGstr1Csv}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Export Consolidated GSTR-1 Ledger (CSV)</span>
        </button>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-800 font-medium">
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
                    <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                        <div>{payment.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {new Date(payment.paidAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        <div className="text-slate-200 font-semibold">{payment.paymentId}</div>
                        <div className="text-[10px] text-slate-400">{payment.orderId}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-100">{req.medicineName}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {req.quantity} units • Batch: {req.batchNumber}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-teal-400" />
                          {isBuyer ? req.sellerHospitalName : req.requesterHospitalName}
                        </div>
                        <div className="text-[10px] text-teal-400 font-mono">
                          {isBuyer ? 'Seller Peer' : 'Buyer Peer'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100">
                        ₹{(req.totalAmount + payment.taxAmount).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-emerald-400 font-bold">
                        ₹{payment.concessionSaved.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Inspect & Print Tax Invoice (PDF)</span>
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
