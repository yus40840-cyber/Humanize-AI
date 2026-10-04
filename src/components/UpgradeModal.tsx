import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Check, Sparkles, X, CreditCard, Lock } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { upgradeToPro, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('monthly');

  if (!isOpen) return null;

  const handleSimulatedPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeToPro();
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Upgrade to Raheel Humanize Pro
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            You have used your 1 free international humanization credit. Upgrade to continue enjoying unlimited 0.0% AI text humanization.
          </p>
        </div>

        {/* Notice for Pakistani users */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-[11px] text-emerald-300">
          <strong>Pakistani Users Free Notice:</strong> Pakistani users with a valid <strong>+92</strong> phone number get 100% free unlimited lifetime access. If you have a Pakistani number, update your profile or log in with +92.
        </div>

        {/* Plan Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
              selectedPlan === 'monthly'
                ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
            }`}
          >
            <div className="text-xs font-semibold text-zinc-400 uppercase">Monthly Pro</div>
            <div className="mt-1 text-2xl font-extrabold text-white font-mono">$9.99</div>
            <div className="text-[10px] text-zinc-500">per month · cancel anytime</div>
          </div>

          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
              selectedPlan === 'lifetime'
                ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Lifetime</span>
              <span className="rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5">
                Best Value
              </span>
            </div>
            <div className="mt-1 text-2xl font-extrabold text-white font-mono">$19.99</div>
            <div className="text-[10px] text-zinc-500">one-time · unlimited lifetime</div>
          </div>
        </div>

        {/* Features Checklist */}
        <ul className="space-y-2 text-xs text-zinc-300">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Guaranteed 0.0% AI score on ZeroGPT and Turnitin</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Unlimited words and document humanization</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>PDF and Image OCR text extraction</span>
          </li>
        </ul>

        {/* Payment CTA */}
        <button
          onClick={handleSimulatedPayment}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition-all cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
              Activating Membership...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay {selectedPlan === 'monthly' ? '$9.99' : '$19.99'} & Unlock Pro
            </>
          )}
        </button>

        <div className="text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
          <Lock className="h-3 w-3" />
          <span>Encrypted 256-bit secure checkout</span>
        </div>
      </div>
    </div>
  );
};
