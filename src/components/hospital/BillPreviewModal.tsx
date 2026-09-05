import React from 'react';
import { Modal } from '../common/Modal';
import { MedicineItem } from '../../types';
import { FileText, ShieldCheck, Printer, CheckCircle, Download } from 'lucide-react';

interface BillPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: MedicineItem | null;
}

export const BillPreviewModal: React.FC<BillPreviewModalProps> = ({ isOpen, onClose, medicine }) => {
  if (!medicine) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Original Purchase Invoice & Quality Release Slip"
      subtitle={`Verified Document: ${medicine.billPdfUrl}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Document Header */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs font-sans text-xs space-y-4">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-teal-700 font-bold">
                PHARMACEUTICAL WHOLESALE TAX INVOICE
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Authorized Formulation Distribution Ltd.
              </h2>
              <p className="text-slate-500 text-[11px]">
                DL-FORM-20B-98412 • GSTIN: 07AAACA4410K1Z2 • Okhla Industrial Area Ph-III, New Delhi
              </p>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs font-bold text-slate-800">{medicine.billNumber}</div>
              <div className="text-[10px] text-slate-500">Date: {medicine.manufacturingDate}</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED GENUINE
              </span>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Purchaser Institution:</span>
              <div className="font-bold text-slate-800">{medicine.hospitalName}</div>
              <div className="text-slate-600">{medicine.hospitalLocation}</div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Quality Release Status:</span>
              <div className="font-bold text-teal-800 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> Batch QC Passed (Chemical Assay 99.8%)
              </div>
              <div className="text-slate-600 font-mono text-[10px]">Test Report #TR-{medicine.batchNumber}-QC</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold text-[11px]">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">Batch</th>
                  <th className="p-2.5">Mfg</th>
                  <th className="p-2.5">Exp</th>
                  <th className="p-2.5 text-right">Units</th>
                  <th className="p-2.5 text-right">MRP (₹)</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-medium text-slate-800">
                    <div>{medicine.brandName}</div>
                    <div className="text-[10px] text-slate-500">{medicine.genericComposition}</div>
                  </td>
                  <td className="p-2.5 font-mono text-slate-700">{medicine.batchNumber}</td>
                  <td className="p-2.5 font-mono text-slate-600">{medicine.manufacturingDate}</td>
                  <td className="p-2.5 font-mono text-slate-600">{medicine.expiryDate}</td>
                  <td className="p-2.5 font-mono text-right text-slate-800">{medicine.totalUnits}</td>
                  <td className="p-2.5 font-mono text-right text-slate-800">₹{medicine.mrpPerUnit}</td>
                  <td className="p-2.5 font-mono text-right font-bold text-slate-900">
                    ₹{(medicine.mrpPerUnit * medicine.totalUnits).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Digital Signature Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <div>Storage Compliance: <strong className="text-slate-700">{medicine.storageCondition}</strong></div>
              <div>Digital Certificate Hash: <span className="font-mono text-[10px]">sha256:4f8e...99c2</span></div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-800">Authorized Signatory</div>
              <div className="text-[10px]">Head of Quality Assurance & Logistics</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Document
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
};
