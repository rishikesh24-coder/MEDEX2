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
        <div className="text-xs font-mono uppercase text-teal-700 tracking-wider font-bold">
          Central Regulatory Ombudsman
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Hospital Feedback & Dispute Desk
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit shipment temperature discrepancies, packaging non-compliance, escrow inquiries, or system feedback directly to CDSCO and MedEx administration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Direct Submission Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            File New Regulatory Report
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HospitalFeedback['category'])}
                className="w-full font-medium p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              >
                <option value="Cold Chain Breach Report">Cold Chain Breach Report</option>
                <option value="Platform Usability">Platform Usability</option>
                <option value="Escrow & Billing Query">Escrow & Billing Query</option>
                <option value="Delivery Discrepancy">Delivery Discrepancy</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Priority Severity *
              </label>
              <div className="grid grid-cols-3 gap-1.5 font-mono">
                {(['routine', 'high', 'critical'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-1.5 px-2 rounded-lg border text-center uppercase text-[10px] font-bold transition-all ${
                      priority === lvl
                        ? lvl === 'critical'
                          ? 'bg-rose-700 text-white border-rose-700'
                          : lvl === 'high'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject / Consignment ID *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Temperature spike during TRK-9941 intake"
                className="w-full font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Detailed Observation *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail batch codes, temperature readings, sensor IDs, or platform inquiries..."
                className="w-full font-medium p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Submit to Compliance Desk
            </button>
          </form>
        </div>

        {/* Right: Existing Tickets Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Your Filed Tickets & Administration Inquiries ({myTickets.length})
            </h2>
            <span className="text-xs font-mono text-slate-500">SLA Response: &lt; 2 hours</span>
          </div>

          {myTickets.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs">
              No dispute or feedback tickets filed by your hospital node.
            </div>
          ) : (
            myTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{tkt.ticketNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        tkt.priority === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : tkt.priority === 'high'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tkt.priority}
                      </span>
                      <span className="text-[11px] text-slate-500">({tkt.category})</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{tkt.subject}</h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold shrink-0 ${
                    tkt.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                  }`}>
                    {tkt.status === 'resolved' ? 'RESOLVED' : 'UNDER INVESTIGATION'}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {tkt.description}
                </p>

                {tkt.adminNotes && (
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-950 space-y-1">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> CDSCO Central Admin Resolution Note:
                    </div>
                    <p className="text-teal-900/90 leading-relaxed text-[11px]">{tkt.adminNotes}</p>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 font-mono text-right">
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
