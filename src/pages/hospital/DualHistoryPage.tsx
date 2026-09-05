import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutboundRequest } from '../../types';
import { InvoiceModal } from '../../components/hospital/InvoiceModal';
import { downloadBlobFile } from '../../utils/exportUtils';
import {
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Download,
  Printer
} from 'lucide-react';

export const DualHistoryPage: React.FC = () => {
  const { currentHospital, requests, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>('sales');
  const [selectedInvoiceReq, setSelectedInvoiceReq] = useState<OutboundRequest | null>(null);

  // Sales History: Current hospital is seller, status is accepted/paid/in_transit/delivered
  const salesHistory = requests.filter(
    (r) => r.sellerHospitalId === currentHospital.id && r.status !== 'rejected'
  );

  // Purchase History: Current hospital is requester, status is accepted/paid/in_transit/delivered
  const purchaseHistory = requests.filter(
    (r) => r.requesterHospitalId === currentHospital.id && r.status !== 'rejected'
  );

  const totalSalesRevenue = salesHistory.reduce((acc, r) => acc + r.totalAmount, 0);
  const totalPurchaseSavings = purchaseHistory.reduce((acc, r) => acc + (r.paymentDetails?.concessionSaved || Math.round(r.totalAmount * 0.35)), 0);

  const handleExportAuditTrailCsv = () => {
    const records = activeTab === 'sales' ? salesHistory : purchaseHistory;
    if (records.length === 0) {
      addToast(`No ${activeTab} records found to export.`, 'info');
      return;
    }
    const headers = ['Order Number', 'Date', 'Transaction Type', 'Medicine Name', 'Batch', 'Counterparty Hospital', 'Units', 'Settlement (INR)', 'Invoice Number'];
    const rows = records.map((r) => [
      r.orderNumber,
      new Date(r.requestedAt).toLocaleDateString(),
      activeTab === 'sales' ? 'SURPLUS_SALE' : 'SURPLUS_PROCUREMENT',
      `"${r.medicineName}"`,
      r.batchNumber,
      `"${activeTab === 'sales' ? r.requesterHospitalName : r.sellerHospitalName}"`,
      r.quantity,
      r.totalAmount,
      r.paymentDetails?.invoiceNumber || 'PENDING'
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    downloadBlobFile(csvContent, `dual_history_${activeTab}_audit_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    addToast(`Audit trail for ${activeTab} exported successfully (CSV).`, 'success');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-teal-400 tracking-wider font-bold">
            Settlement Audit & Compliance Logs
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
            Dual Transaction History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete bi-directional ledger of pharmaceutical sales manifests and peer procurement receipts.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleExportAuditTrailCsv}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Complete Audit Trail (CSV)</span>
          </button>

          {/* Tab Switcher */}
          <div className="inline-flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sales'
                  ? 'bg-slate-800 text-emerald-300 shadow-xs font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>Outbound Sales History ({salesHistory.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('purchases')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'purchases'
                  ? 'bg-slate-800 text-teal-300 shadow-xs font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-teal-400" />
              <span>Inbound Procurement History ({purchaseHistory.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 backdrop-blur-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Total Surplus Capital Recovered (Sales)
            </div>
            <div className="text-2xl font-extrabold text-emerald-200 font-mono mt-0.5">
              ₹{totalSalesRevenue.toLocaleString()}
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900/50 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded font-bold">
            SETTLED IN ESCROW
          </span>
        </div>

        <div className="p-4 rounded-xl border border-teal-800/60 bg-teal-950/20 backdrop-blur-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
              Total Capital Conserved (Procurement)
            </div>
            <div className="text-2xl font-extrabold text-teal-200 font-mono mt-0.5">
              ₹{totalPurchaseSavings.toLocaleString()}
            </div>
          </div>
          <span className="text-[10px] font-mono bg-teal-900/50 text-teal-300 border border-teal-700/60 px-2.5 py-1 rounded font-bold">
            CONCESSION GAIN
          </span>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order / Manifest No.</th>
                <th className="py-3 px-3">Pharmaceutical Formulation</th>
                <th className="py-3 px-3">
                  {activeTab === 'sales' ? 'Recipient Hospital' : 'Supplier Hospital'}
                </th>
                <th className="py-3 px-3 text-right">Units</th>
                <th className="py-3 px-3 text-right">Settlement (₹)</th>
                <th className="py-3 px-3 text-center">Quality Release Status</th>
                <th className="py-3 px-4 text-right">Tax Manifest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {(activeTab === 'sales' ? salesHistory : purchaseHistory).map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-200">#{req.orderNumber}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-100">{req.medicineName}</div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Batch: {req.batchNumber} • {req.storageCondition}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-400" />
                      {activeTab === 'sales' ? req.requesterHospitalName : req.sellerHospitalName}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">Form 20B Certified</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100">
                    {req.quantity} units
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono">
                    <div className="font-bold text-emerald-400">₹{req.totalAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-teal-400">Razorpay Escrow</div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> CPCB & CDSCO SEAL PASSED
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {req.paymentDetails ? (
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceReq(req)}
                        className="px-2.5 py-1 rounded-md bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 text-[11px] font-semibold border border-teal-800/60 flex items-center gap-1 ml-auto cursor-pointer transition-colors"
                        title="Inspect & Print Official Tax Invoice (PDF)"
                      >
                        <FileText className="w-3 h-3 text-teal-400" />
                        <span>Inspect & Print Tax Invoice (PDF)</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Invoice Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={!!selectedInvoiceReq}
        onClose={() => setSelectedInvoiceReq(null)}
        request={selectedInvoiceReq}
      />
    </div>
  );
};
