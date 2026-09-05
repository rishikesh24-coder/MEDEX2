import React from 'react';
import { Modal } from '../common/Modal';
import { MedicineItem } from '../../types';
import { FileText, ShieldCheck, Printer, CheckCircle, Download } from 'lucide-react';
import { downloadSimulatedPdf } from '../../utils/exportUtils';
import { useApp } from '../../context/AppContext';

interface BillPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: MedicineItem | null;
}

export const BillPreviewModal: React.FC<BillPreviewModalProps> = ({ isOpen, onClose, medicine }) => {
  const { addToast } = useApp();
  if (!medicine) return null;

  const handleDownloadPdf = () => {
    downloadSimulatedPdf(
      `ORIGINAL-INVOICE-${medicine.billNumber}.txt`,
      'PHARMACEUTICAL WHOLESALE TAX INVOICE & QC RELEASE SLIP',
      {
        'Invoice Number': medicine.billNumber,
        'Pharmaceutical Brand': medicine.brandName,
        'Generic Formulation': medicine.genericComposition,
        'Dosage & Strength': `${medicine.dosageForm} • ${medicine.strength}`,
        'Batch Number': medicine.batchNumber,
        'Manufacturing Date': medicine.manufacturingDate,
        'Expiry Date': medicine.expiryDate,
        'Purchasing Hospital': medicine.hospitalName,
        'Total Batch Units': medicine.totalUnits,
        'Unit MRP': `INR ${medicine.mrpPerUnit}`,
        'Total Invoiced Value': `INR ${(medicine.mrpPerUnit * medicine.totalUnits).toLocaleString()}`,
        'Storage Protocol': medicine.storageCondition,
        'QC Chemical Assay': '99.8% - Form 20B Verified Pass'
      }
    );
    addToast(`Downloaded verified invoice for ${medicine.brandName} (Batch: ${medicine.batchNumber}).`, 'success');
  };

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
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 shadow-2xl font-sans text-xs space-y-4">
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-teal-400 font-bold">
                PHARMACEUTICAL WHOLESALE TAX INVOICE
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Authorized Formulation Distribution Ltd.
              </h2>
              <p className="text-slate-400 text-[11px]">
                DL-FORM-20B-98412 • GSTIN: 07AAACA4410K1Z2 • Okhla Industrial Area Ph-III, New Delhi
              </p>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs font-bold text-slate-200">{medicine.billNumber}</div>
              <div className="text-[10px] text-slate-400">Date: {medicine.manufacturingDate}</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800 mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED GENUINE
              </span>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Purchaser Institution:</span>
              <div className="font-bold text-white">{medicine.hospitalName}</div>
              <div className="text-slate-400">{medicine.hospitalLocation}</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Quality Release Status:</span>
              <div className="font-bold text-teal-300 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" /> Batch QC Passed (Chemical Assay 99.8%)
              </div>
              <div className="text-slate-400 font-mono text-[10px]">Test Report #TR-{medicine.batchNumber}-QC</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold text-[11px] border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-2.5 font-medium">
                    <div className="text-white font-semibold">{medicine.brandName}</div>
                    <div className="text-[10px] text-slate-400">{medicine.genericComposition}</div>
                  </td>
                  <td className="p-2.5 font-mono text-slate-300">{medicine.batchNumber}</td>
                  <td className="p-2.5 font-mono text-slate-400">{medicine.manufacturingDate}</td>
                  <td className="p-2.5 font-mono text-slate-400">{medicine.expiryDate}</td>
                  <td className="p-2.5 font-mono text-right text-slate-200">{medicine.totalUnits}</td>
                  <td className="p-2.5 font-mono text-right text-slate-200">₹{medicine.mrpPerUnit}</td>
                  <td className="p-2.5 font-mono text-right font-bold text-teal-300">
                    ₹{(medicine.mrpPerUnit * medicine.totalUnits).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Digital Signature Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              <div>Storage Compliance: <strong className="text-slate-200">{medicine.storageCondition}</strong></div>
              <div>Digital Certificate Hash: <span className="font-mono text-[10px]">sha256:4f8e...99c2</span></div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-200">Authorized Signatory</div>
              <div className="text-[10px]">Head of Quality Assurance & Logistics</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-xl border border-teal-700/60 bg-teal-950/60 hover:bg-teal-900/60 text-xs font-semibold text-teal-300 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-teal-400" /> Download Verified Bill (PDF)
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Document
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Document Inspector
          </button>
        </div>
      </div>
    </Modal>
  );
};
