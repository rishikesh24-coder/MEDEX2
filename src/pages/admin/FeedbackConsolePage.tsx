import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalFeedback } from '../../types';
import { Modal } from '../../components/common/Modal';
import { downloadBlobFile } from '../../utils/exportUtils';
import {
  MessageSquare,
  ShieldCheck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Reply,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export const FeedbackConsolePage: React.FC = () => {
  const { feedbackTickets, resolveFeedback, addToast } = useApp();

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [resolvingTicket, setResolvingTicket] = useState<HospitalFeedback | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredTickets = feedbackTickets.filter((t) => {
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesPriority && matchesStatus;
  });

  const handleExportGrievancesCsv = () => {
    const headers = ['Ticket Number', 'Hospital Name', 'Category', 'Priority', 'Status', 'Subject', 'Created At', 'Admin Resolution'];
    const rows = feedbackTickets.map((t) => [
      t.ticketNumber,
      t.hospitalName,
      t.category,
      t.priority,
      t.status,
      t.subject,
      t.createdAt,
      t.adminNotes || 'Pending Adjudication'
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    downloadBlobFile(csv, 'cdsco-hospital-grievances-log.csv', 'text/csv;charset=utf-8;');
    addToast('Downloaded hospital dispute and grievance docket as CSV.', 'success');
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-rose-400 tracking-wider font-bold">
            Central Grievance & Cold-Chain Ombudsman
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
            Central Hospital Feedback & Dispute Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Triage, audit, and resolve operational complaints, temperature excursions, and billing inquiries submitted by member institutions.
          </p>
        </div>

        <button
          onClick={handleExportGrievancesCsv}
          className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:bg-slate-800 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-rose-400" />
          <span>Export Grievance Docket (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-xl flex items-center justify-between gap-4 text-xs backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-300">Filter Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="routine">Routine Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-300">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open / Unresolved</option>
              <option value="investigating">Under Investigation</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="font-mono text-slate-400 text-xs">
          Showing <strong className="text-slate-200">{filteredTickets.length}</strong> tickets
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
              className={`p-6 rounded-2xl border bg-slate-900/90 shadow-xl space-y-4 text-xs transition-all backdrop-blur-xs ${
                isCrit && !isResolved ? 'border-rose-700/70 bg-rose-950/20' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-100 text-sm">
                      {tkt.ticketNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isCrit
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60 animate-pulse'
                        : tkt.priority === 'high'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {tkt.priority} PRIORITY
                    </span>
                    <span className="text-slate-600 font-semibold">•</span>
                    <span className="text-slate-400 font-semibold">{tkt.category}</span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-base mt-1.5">{tkt.subject}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    <span className="font-semibold text-slate-200">{tkt.hospitalName}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{new Date(tkt.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <span className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold ${
                    isResolved
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                      : 'bg-amber-950/50 text-amber-300 border border-amber-800/60'
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
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Adjudicate & Issue Resolution Note</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
                {tkt.description}
              </div>

              {/* Resolution Note */}
              {tkt.adminNotes && (
                <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-teal-200 space-y-1">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> CDSCO Central Ombudsman Stamped Resolution:
                  </div>
                  <p className="text-teal-200/90 leading-relaxed text-xs">{tkt.adminNotes}</p>
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
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300">
                Official Resolution & Quality Release Note *
              </label>
              <span className="text-[11px] text-slate-500">Standardized Ombudsman Clauses</span>
            </div>

            {/* Quick Templates */}
            <div className="mb-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setResolutionNote(
                    'Cold-Chain Telemetry Breached: Datalogger confirmed excursion >8°C for 42 minutes. Escrow payment voided and 100% refunded to buyer node. Batch condemned to CPCB biowaste stream.'
                  )
                }
                className="px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/60 text-[10px] font-semibold cursor-pointer transition-colors"
              >
                + Breach Confirmed (Refund Buyer)
              </button>
              <button
                type="button"
                onClick={() =>
                  setResolutionNote(
                    'Kinetic Excursion Cleared: Independent CDSCO calibrated datalogger re-check verified sensor variance was momentary calibration blip. Drug stability intact. Release funds.'
                  )
                }
                className="px-2.5 py-1 rounded-md bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-800/60 text-[10px] font-semibold cursor-pointer transition-colors"
              >
                + Excursion Cleared (Release Funds)
              </button>
            </div>

            <textarea
              rows={4}
              required
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full font-medium p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-teal-500 bg-slate-950 text-slate-100 placeholder:text-slate-500"
              placeholder="State regulatory resolution, telemetry verification result, or escrow adjustment..."
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setResolvingTicket(null)}
              className="px-4 py-2 font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel & Keep Ticket Active
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer transition-colors"
            >
              Publish Statutory Resolution & Close Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
