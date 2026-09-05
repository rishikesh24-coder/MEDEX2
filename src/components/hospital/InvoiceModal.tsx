import React from 'react';
import { Modal } from '../common/Modal';
import { OutboundRequest } from '../../types';
import { Printer, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: OutboundRequest | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, request }) => {
  if (!request || !request.paymentDetails) return null;

  const payment = request.paymentDetails;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="B2B Pharmaceutical Tax Invoice & Escrow Receipt"
      subtitle={`Invoice #${payment.invoiceNumber} • Razorpay Order: ${payment.orderId}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs text-xs font-sans space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                MEDEX FEDERATED PLATFORM TAX INVOICE
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Inter-Hospital Transfer Manifest</h2>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Issued under CGST/SGST Act 2017 & CDSCO Inter-Hospital Redistribution Guidelines
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm font-bold text-slate-900">{payment.invoiceNumber}</div>
              <div className="text-[10px] text-slate-500">Date: {new Date(payment.paidAt).toLocaleDateString()}</div>
              <div className="text-[10px] text-teal-700 font-semibold mt-1">ESCROW SETTLED</div>
            </div>
          </div>

          {/* Parties Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Supplier (Seller Hospital):</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{request.sellerHospitalName}</div>
              <div className="text-slate-600">GSTIN: 06AAACF1299P1Z3</div>
              <div className="text-slate-600">Drug License: DL-HR-FORM20-8849</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Recipient (Buyer Hospital):</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{request.requesterHospitalName}</div>
              <div className="text-slate-600">GSTIN: 07AAAAA0000A1Z5</div>
              <div className="text-slate-600">Drug License: DL-DEL-20B-9410</div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th className="p-2.5">Particulars</th>
                <th className="p-2.5">Batch</th>
                <th className="p-2.5 text-right">Qty</th>
                <th className="p-2.5 text-right">Unit Rate</th>
                <th className="p-2.5 text-right">Taxable Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-medium text-slate-800">
                  <div>{request.medicineName}</div>
                  <div className="text-[10px] text-slate-500">{request.genericComposition}</div>
                </td>
                <td className="p-2.5 font-mono text-slate-700">{request.batchNumber}</td>
                <td className="p-2.5 font-mono text-right text-slate-800">{request.quantity}</td>
                <td className="p-2.5 font-mono text-right text-slate-800">₹{request.unitPrice}</td>
                <td className="p-2.5 font-mono text-right font-bold text-slate-900">
                  ₹{request.totalAmount.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="p-2.5 text-slate-600">
                  Cold-Chain Dedicated Logistics & GPS Sensor Telemetry
                </td>
                <td className="p-2.5 font-mono text-right font-bold text-slate-900">₹850</td>
              </tr>
              <tr>
                <td colSpan={4} className="p-2.5 text-slate-600">
                  IGST / CGST+SGST (5% on Pharma formulation)
                </td>
                <td className="p-2.5 font-mono text-right font-bold text-slate-900">
                  ₹{payment.taxAmount.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-slate-50 text-slate-900 font-bold">
                <td colSpan={4} className="p-3 text-right">Total Net Paid (INR):</td>
                <td className="p-3 font-mono text-right text-teal-800 text-sm">
                  ₹{(request.totalAmount + payment.taxAmount + 850).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment & Savings Ribbon */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-950">
            <div>
              <div className="text-[10px] uppercase font-semibold text-teal-700">Razorpay Payment ID:</div>
              <div className="font-mono font-bold">{payment.paymentId}</div>
              <div className="text-[10px] text-teal-800">{payment.method}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-semibold text-teal-700">Capital Conserved via Surplus:</div>
              <div className="font-mono text-base font-bold text-teal-900">
                ₹{payment.concessionSaved.toLocaleString()}
              </div>
              <div className="text-[10px] text-teal-700">Diverted from manufacturer standard procurement</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Tax Invoice
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
