import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalFeedback } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  MessageSquare,
  ShieldCheck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Reply
} from 'lucide-react';

export const FeedbackConsolePage: React.FC = () => {
  const { feedbackTickets, resolveFeedback } = useApp();

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [resolvingTicket, setResolvingTicket] = useState<HospitalFeedback | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredTickets = feedbackTickets.filter((t) => {
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesPriority && matchesStatus;
  });

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket) return;
    resolveFeedback(resolvingTicket.id, resolutionNote || 'Adjudicated and cleared by Central Regulatory Desk.');
    setResolvingTicket(null);
    setResolutionNote('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase text-rose-700 tracking-wider font-bold">
          Central Grievance & Cold-Chain Ombudsman
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight mt-0.5">
          Central Hospital Feedback & Dispute Console
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Triage, audit, and resolve operational complaints, temperature excursions, and billing inquiries submitted by member institutions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Filter Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="routine">Routine Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open / Unresolved</option>
              <option value="investigating">Under Investigation</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="font-mono text-slate-500 text-xs">
          Showing <strong>{filteredTickets.length}</strong> tickets
        </div>
      </div>

      {/* Tickets Feed */}
      <div className="space-y-4">
        {filteredTickets.map((tkt) => {
          const isCrit = tkt.priority === 'critical';
          const isResolved = tkt.status === 'resolved';

          return (
            <div
              key={tkt.id}
              className={`p-6 rounded-2xl border bg-white shadow-xs space-y-4 text-xs transition-all ${
                isCrit && !isResolved ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {tkt.ticketNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isCrit
                        ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse'
                        : tkt.priority === 'high'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {tkt.priority} PRIORITY
                    </span>
                    <span className="text-slate-500 font-semibold">•</span>
                    <span className="text-slate-600 font-semibold">{tkt.category}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-1.5">{tkt.subject}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-700" />
                    <span className="font-semibold text-slate-800">{tkt.hospitalName}</span>
                    <span>•</span>
                    <span className="font-mono">{new Date(tkt.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <span className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold ${
                    isResolved
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {isResolved ? 'RESOLVED' : 'INVESTIGATION ACTIVE'}
                  </span>

                  {!isResolved && (
                    <button
                      onClick={() => {
                        setResolvingTicket(tkt);
                        setResolutionNote(
                          tkt.adminNotes ||
                            'Cold chain telemetry validated. Fluctuation within safe kinetic envelope. Clearance released.'
                        );
                      }}
                      className="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5" /> Adjudicate Ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                {tkt.description}
              </div>

              {/* Resolution Note */}
              {tkt.adminNotes && (
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 space-y-1">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> CDSCO Central Ombudsman Stamped Resolution:
                  </div>
                  <p className="text-teal-900/90 leading-relaxed text-xs">{tkt.adminNotes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resolve Action Modal */}
      <Modal
        isOpen={!!resolvingTicket}
        onClose={() => setResolvingTicket(null)}
        title="Adjudicate Dispute & Log Statutory Resolution"
        subtitle={`Ticket #${resolvingTicket?.ticketNumber} • ${resolvingTicket?.hospitalName}`}
        maxWidth="lg"
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Resolution & Quality Release Note *
            </label>
            <textarea
              rows={4}
              required
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full font-medium p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              placeholder="State regulatory resolution, telemetry verification result, or escrow adjustment..."
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setResolvingTicket(null)}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold"
            >
              Confirm & Resolve Dispute
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
