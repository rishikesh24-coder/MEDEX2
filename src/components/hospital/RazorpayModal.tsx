import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { OutboundRequest } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CreditCard,
  Building,
  QrCode,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: OutboundRequest | null;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({ isOpen, onClose, request }) => {
  const { payWithRazorpay } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'netbanking' | 'upi' | 'card'>('netbanking');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank Corporate');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!request) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payWithRazorpay(
        request.id,
        paymentMethod === 'netbanking'
          ? `NetBanking - ${selectedBank}`
          : paymentMethod === 'upi'
          ? 'Corporate UPI Auto-Pay'
          : 'Corporate Purchase Card (VISA)'
      );
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  const gstTax = Math.round(request.totalAmount * 0.05);
  const logisticsEscrowFee = 850;
  const netPayable = request.totalAmount + gstTax + logisticsEscrowFee;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Razorpay B2B Escrow Checkout"
      subtitle={`Secured Transfer Order #${request.orderNumber}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Razorpay Institutional Header */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-black text-xl text-blue-300">
              ₹
            </div>
            <div>
              <div className="text-xs text-blue-200 uppercase tracking-widest font-mono font-semibold">
                Razorpay Enterprise Escrow
              </div>
              <div className="text-xl font-bold font-mono text-white">
                ₹{netPayable.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
              CDSCO VERIFIED NODE
            </span>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Seller: {request.sellerHospitalName.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Itemized Order Breakdown */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="font-semibold text-slate-800 pb-1 border-b border-slate-200 flex justify-between">
            <span>Requisition Item</span>
            <span className="font-mono text-slate-500">{request.quantity} units</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{request.medicineName} (Batch: {request.batchNumber})</span>
            <span className="font-mono">₹{request.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Cold-Chain IoT & GPS Verified Courier Dispatch</span>
            <span className="font-mono">₹{logisticsEscrowFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Statutory Pharma GST (5%)</span>
            <span className="font-mono">₹{gstTax.toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
            <span>Total Escrow Amount</span>
            <span className="font-mono text-teal-800">₹{netPayable.toLocaleString()}</span>
          </div>
        </div>

        {/* Escrow Protection Notice */}
        <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>100% Escrow Protection:</strong> Funds will be held in Razorpay Nodal Escrow until your receiving pharmacist signs off on the arrival temperature log (&lt; 8.0°C) and batch integrity.
          </p>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Corporate Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 rounded-lg border text-xs font-medium text-left flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'netbanking'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Building className="w-5 h-5 text-blue-700" />
              <span>NetBanking</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-lg border text-xs font-medium text-left flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'upi'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <QrCode className="w-5 h-5 text-purple-700" />
              <span>Corporate UPI</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-lg border text-xs font-medium text-left flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <CreditCard className="w-5 h-5 text-teal-700" />
              <span>Corporate Card</span>
            </button>
          </div>
        </div>

        {paymentMethod === 'netbanking' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Scheduled Institutional Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="HDFC Bank Corporate">HDFC Bank Institutional Banking</option>
              <option value="State Bank of India (SBI Global)">State Bank of India (SBI Global Trade)</option>
              <option value="ICICI Bank Corporate">ICICI Bank Corporate Solutions</option>
              <option value="Axis Bank Treasury">Axis Bank Corporate Treasury</option>
            </select>
          </div>
        )}

        {/* Submit & Simulate Razorpay Flow */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-BIT ENCRYPTION</span>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Capturing Razorpay Escrow...</span>
              </>
            ) : (
              <>
                <span>Authorize ₹{netPayable.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
