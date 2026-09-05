import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutboundRequest } from '../../types';
import { InvoiceModal } from '../../components/hospital/InvoiceModal';
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
  const { currentHospital, requests } = useApp();
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

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-teal-700 tracking-wider font-bold">
            Settlement Audit & Compliance Logs
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
            Dual Transaction History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete bi-directional ledger of pharmaceutical sales manifests and peer procurement receipts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl bg-slate-200/80 p-1 border border-slate-300 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'sales'
                ? 'bg-white text-emerald-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>Sales History ({salesHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'purchases'
                ? 'bg-white text-teal-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-teal-600" />
            <span>Purchase History ({purchaseHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Total Surplus Capital Recovered (Sales)
            </div>
            <div className="text-2xl font-extrabold text-emerald-950 font-mono mt-0.5">
              ₹{totalSalesRevenue.toLocaleString()}
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded font-bold">
            SETTLED IN ESCROW
          </span>
        </div>

        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
              Total Capital Conserved (Procurement)
            </div>
            <div className="text-2xl font-extrabold text-teal-950 font-mono mt-0.5">
              ₹{totalPurchaseSavings.toLocaleString()}
            </div>
          </div>
          <span className="text-[10px] font-mono bg-teal-200 text-teal-900 px-2.5 py-1 rounded font-bold">
            CONCESSION GAIN
          </span>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-200 font-medium">
              {(activeTab === 'sales' ? salesHistory : purchaseHistory).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900">#{req.orderNumber}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800">{req.medicineName}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Batch: {req.batchNumber} • {req.storageCondition}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-700" />
                      {activeTab === 'sales' ? req.requesterHospitalName : req.sellerHospitalName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Form 20B Certified</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">
                    {req.quantity} units
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono">
                    <div className="font-bold text-slate-900">₹{req.totalAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-teal-700">Razorpay Escrow</div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> SEAL & QC PASSED
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {req.paymentDetails ? (
                      <button
                        onClick={() => setSelectedInvoiceReq(req)}
                        className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-900 text-[11px] font-semibold border border-teal-200 flex items-center gap-1 ml-auto"
                      >
                        <FileText className="w-3 h-3 text-teal-700" /> View Tax Invoice
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Invoice Pending</span>
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
