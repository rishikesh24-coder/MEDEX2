import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalFeedback } from '../../types';
import {
  MessageSquare,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { currentHospital, feedbackTickets, submitFeedback } = useApp();

  const [category, setCategory] = useState<HospitalFeedback['category']>('Cold Chain Breach Report');
  const [priority, setPriority] = useState<HospitalFeedback['priority']>('high');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const myTickets = feedbackTickets.filter((f) => f.hospitalId === currentHospital.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    submitFeedback({
      category,
      priority,
      subject,
      description
    });
    setSubject('');
    setDescription('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-teal-400 tracking-wider font-bold">
          Central Regulatory Ombudsman
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
          Hospital Feedback & Dispute Desk
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Submit shipment temperature discrepancies, packaging non-compliance, escrow inquiries, or system feedback directly to CDSCO and MedEx administration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Direct Submission Form */}
        <div className="lg:col-span-1 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xs">
          <h2 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            File New Regulatory Report
          </h2>

          {/* Quick Prefill Templates */}
          <div className="mt-3 flex flex-col gap-1.5 pb-3 border-b border-slate-800">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">1-Click Sample Reports:</span>
            <button
              type="button"
              onClick={() => {
                setCategory('Cold Chain Breach Report');
                setPriority('critical');
                setSubject('Temperature Spike (> 9.4°C) during Consignment #TRK-MED-8419 intake');
                setDescription('Chamber logger IOT-TEMP-SENS-7712 registered a sustained temperature excursion at 9.4°C for 42 minutes between transit gate and receiving bay. Immediate biological stability verification required.');
              }}
              className="text-left px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/60 text-rose-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Prefill: Cold-Chain Breach (&gt; 8°C)
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory('Escrow & Billing Query');
                setPriority('routine');
                setSubject('Razorpay Escrow Tax Credit Reconciliation for Order #REQ-2026-8819');
                setDescription('Requesting official GSTR-1 input tax credit memorandum for quarterly inter-hospital reconciliation of July 2026 surplus purchase.');
              }}
              className="text-left px-2.5 py-1.5 rounded-lg bg-teal-950/40 hover:bg-teal-900/40 border border-teal-800/60 text-teal-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Prefill: Escrow & Tax Reconciliation
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HospitalFeedback['category'])}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100"
              >
                <option value="Cold Chain Breach Report">Cold Chain Breach Report</option>
                <option value="Platform Usability">Platform Usability</option>
                <option value="Escrow & Billing Query">Escrow & Billing Query</option>
                <option value="Delivery Discrepancy">Delivery Discrepancy</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Priority Severity *
              </label>
              <div className="grid grid-cols-3 gap-1.5 font-mono">
                {[
                  { lvl: 'routine' as const, label: 'Routine (24h)' },
                  { lvl: 'high' as const, label: 'Elevated (6h)' },
                  { lvl: 'critical' as const, label: 'Critical (1h)' }
                ].map(({ lvl, label }) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-1.5 px-2 rounded-lg border text-center uppercase text-[10px] font-bold transition-all cursor-pointer ${
                      priority === lvl
                        ? lvl === 'critical'
                          ? 'bg-rose-600 text-white border-rose-500'
                          : lvl === 'high'
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-teal-600 text-white border-teal-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Subject / Consignment ID *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Temperature spike during TRK-9941 intake"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Detailed Observation *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail batch codes, temperature readings, sensor IDs, or platform inquiries..."
                className="w-full font-medium p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Formal Grievance to CDSCO Ombudsman</span>
            </button>
          </form>
        </div>

        {/* Right: Existing Tickets Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">
              Your Filed Tickets & Administration Inquiries ({myTickets.length})
            </h2>
            <span className="text-xs font-mono text-slate-400">SLA Response: &lt; 2 hours</span>
          </div>

          {myTickets.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-900/90 rounded-xl border border-slate-800 text-xs backdrop-blur-xs">
              No dispute or feedback tickets filed by your hospital node.
            </div>
          ) : (
            myTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-xs space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">{tkt.ticketNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        tkt.priority === 'critical'
                          ? 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
                          : tkt.priority === 'high'
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {tkt.priority}
                      </span>
                      <span className="text-[11px] text-slate-400">({tkt.category})</span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm mt-1">{tkt.subject}</h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold shrink-0 ${
                    tkt.status === 'resolved'
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                      : 'bg-blue-950/50 text-blue-300 border border-blue-800/60 animate-pulse'
                  }`}>
                    {tkt.status === 'resolved' ? 'RESOLVED' : 'UNDER INVESTIGATION'}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  {tkt.description}
                </p>

                {tkt.adminNotes && (
                  <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-800/60 text-teal-200 space-y-1">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> CDSCO Central Admin Resolution Note:
                    </div>
                    <p className="text-teal-200/90 leading-relaxed text-[11px]">{tkt.adminNotes}</p>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono text-right">
                  Filed: {new Date(tkt.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
