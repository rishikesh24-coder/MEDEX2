import React from 'react';
import { Modal } from '../common/Modal';
import { OutboundRequest } from '../../types';
import { Printer, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { downloadSimulatedPdf } from '../../utils/exportUtils';
import { useApp } from '../../context/AppContext';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: OutboundRequest | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, request }) => {
  const { addToast } = useApp();
  if (!request || !request.paymentDetails) return null;

  const payment = request.paymentDetails;

  const handleDownloadInvoice = () => {
    downloadSimulatedPdf(
      `TAX-INVOICE-${payment.invoiceNumber}.txt`,
      'B2B PHARMACEUTICAL TAX INVOICE & ESCROW RECEIPT',
      {
        'Invoice Number': payment.invoiceNumber,
        'Order Number': request.orderNumber,
        'Razorpay Payment ID': payment.paymentId,
        'Settlement Date': new Date(payment.paidAt).toLocaleDateString(),
        'Seller Hospital': request.sellerHospitalName,
        'Purchaser Hospital': request.requesterHospitalName,
        'Item Description': request.medicineName,
        'Batch Number': request.batchNumber,
        'Quantity Transferred': `${request.quantity} units`,
        'Transfer Rate / Unit': `INR ${request.unitPrice}`,
        'Base Amount': `INR ${request.totalAmount.toLocaleString()}`,
        'Pharma GST (5%)': `INR ${payment.taxAmount.toLocaleString()}`,
        'Cold-Chain Telemetry Fee': `INR 850`,
        'Net Paid in Escrow': `INR ${(request.totalAmount + payment.taxAmount + 850).toLocaleString()}`,
        'Capital Conserved': `INR ${payment.concessionSaved.toLocaleString()}`,
        'Payment Method': payment.method,
        'Escrow Status': 'HELD IN NODAL ESCROW PENDING COLD-CHAIN RELEASE'
      }
    );
    addToast(`Tax Invoice #${payment.invoiceNumber} downloaded successfully.`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="B2B Pharmaceutical Tax Invoice & Escrow Receipt"
      subtitle={`Invoice #${payment.invoiceNumber} • Razorpay Order: ${payment.orderId}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl text-xs font-sans space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                MEDEX FEDERATED PLATFORM TAX INVOICE
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Inter-Hospital Transfer Manifest</h2>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Issued under CGST/SGST Act 2017 & CDSCO Inter-Hospital Redistribution Guidelines
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm font-bold text-teal-300">{payment.invoiceNumber}</div>
              <div className="text-[10px] text-slate-400">Date: {new Date(payment.paidAt).toLocaleDateString()}</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-1">ESCROW SETTLED</div>
            </div>
          </div>

          {/* Parties Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Supplier (Seller Hospital):</span>
              <div className="font-bold text-slate-100 text-sm mt-0.5">{request.sellerHospitalName}</div>
              <div className="text-slate-400">GSTIN: 06AAACF1299P1Z3</div>
              <div className="text-slate-400">Drug License: DL-HR-FORM20-8849</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Recipient (Buyer Hospital):</span>
              <div className="font-bold text-slate-100 text-sm mt-0.5">{request.requesterHospitalName}</div>
              <div className="text-slate-400">GSTIN: 07AAAAA0000A1Z5</div>
              <div className="text-slate-400">Drug License: DL-DEL-20B-9410</div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-2.5">Particulars</th>
                <th className="p-2.5">Batch</th>
                <th className="p-2.5 text-right">Qty</th>
                <th className="p-2.5 text-right">Unit Rate</th>
                <th className="p-2.5 text-right">Taxable Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/30">
                <td className="p-2.5 font-medium text-slate-200">
                  <div>{request.medicineName}</div>
                  <div className="text-[10px] text-slate-400">{request.genericComposition}</div>
                </td>
                <td className="p-2.5 font-mono text-slate-300">{request.batchNumber}</td>
                <td className="p-2.5 font-mono text-right text-slate-200">{request.quantity}</td>
                <td className="p-2.5 font-mono text-right text-slate-200">₹{request.unitPrice}</td>
                <td className="p-2.5 font-mono text-right font-bold text-white">
                  ₹{request.totalAmount.toLocaleString()}
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td colSpan={4} className="p-2.5 text-slate-400">
                  Cold-Chain Dedicated Logistics & GPS Sensor Telemetry
                </td>
                <td className="p-2.5 font-mono text-right font-bold text-white">₹850</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td colSpan={4} className="p-2.5 text-slate-400">
                  IGST / CGST+SGST (5% on Pharma formulation)
                </td>
                <td className="p-2.5 font-mono text-right font-bold text-white">
                  ₹{payment.taxAmount.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-slate-950/80 text-white font-bold border-t border-slate-700">
                <td colSpan={4} className="p-3 text-right text-slate-300">Total Net Paid (INR):</td>
                <td className="p-3 font-mono text-right text-teal-300 text-sm">
                  ₹{(request.totalAmount + payment.taxAmount + 850).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment & Savings Ribbon */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg bg-teal-950/40 border border-teal-800/60 text-teal-200">
            <div>
              <div className="text-[10px] uppercase font-semibold text-teal-400">Razorpay Payment ID:</div>
              <div className="font-mono font-bold text-teal-200">{payment.paymentId}</div>
              <div className="text-[10px] text-teal-300">{payment.method}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-semibold text-teal-400">Capital Conserved via Surplus:</div>
              <div className="font-mono text-base font-bold text-teal-300">
                ₹{payment.concessionSaved.toLocaleString()}
              </div>
              <div className="text-[10px] text-teal-400">Diverted from manufacturer standard procurement</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleDownloadInvoice}
            className="px-4 py-2 rounded-lg border border-teal-500/40 bg-teal-950/60 hover:bg-teal-900/80 text-xs font-semibold text-teal-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-400" /> Download Official GST Invoice (PDF)
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-200 hover:bg-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-300" /> Print Tax Invoice
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Invoice Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
};
