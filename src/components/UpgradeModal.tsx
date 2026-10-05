import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Sparkles, X, CreditCard, Lock, Building, User, Gift } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureHint?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, featureHint }) => {
  const { upgradeToPro, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [category, setCategory] = useState<'personal' | 'business'>('personal');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  if (!isOpen) return null;

  const handleSimulatedPayment = (planName: string, price: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeToPro();
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  const proPrice = billingCycle === 'monthly' ? '$3.99' : '$2.59';
  const proBilledPeriod = billingCycle === 'monthly' ? '/month' : '/month (billed annually)';
  const bizPrice = billingCycle === 'monthly' ? '$9.99' : '$6.49';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Unlock Pro Power
          </h2>
          {featureHint ? (
            <div className="inline-block rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-800">
              👑 {featureHint}
            </div>
          ) : (
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Upgrade to PRO ($3.99/mo) to unlock Enhanced rewriting, academic & business purposes, and unlimited humanizations.
            </p>
          )}
        </div>

        {/* Pakistani Free Notice */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-[11px] text-emerald-800 flex items-center gap-2">
          <span className="text-base">🇵🇰</span>
          <span>
            <strong>Pakistani Users:</strong> Phone numbers starting with <strong>+92</strong> enjoy 100% free unlimited lifetime access. No payment is required.
          </span>
        </div>

        {/* Plan Category Tabs */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-100/70 p-1">
          <button
            type="button"
            onClick={() => setCategory('personal')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
              category === 'personal'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Personal Plans
          </button>
          <button
            type="button"
            onClick={() => setCategory('business')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
              category === 'business'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            Business / EDU Plans
          </button>
        </div>

        {/* Billing Cycle Switcher: Monthly vs Annually */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annually')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'annually'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annually
            </button>
          </div>

          {billingCycle === 'annually' && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[11px] font-bold text-purple-700 animate-in fade-in">
              <Gift className="h-3.5 w-3.5" />
              <span>35% off annually. It's like 128 days free 😍</span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        {category === 'personal' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Free Trial Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trial</span>
                <div className="text-2xl font-extrabold text-slate-800 font-mono">$0</div>
                <div className="text-[11px] text-slate-500">1 Free Humanization for International</div>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  1 document humanization trial
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  Basic AI Detection Score
                </li>
              </ul>
            </div>

            {/* PRO Card ($3.99 /month) */}
            <div className="relative rounded-2xl border-2 border-indigo-500 bg-gradient-to-b from-indigo-50/50 to-white p-5 space-y-4 shadow-lg shadow-indigo-500/10">
              <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-xs">
                Most Popular
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">PRO</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{proPrice}</span>
                  <span className="text-xs text-slate-500">{proBilledPeriod}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {billingCycle === 'annually' ? 'Billed annually ($31.00/yr)' : 'Billed monthly · cancel anytime'}
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-indigo-100">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>Unlimited 0.0% AI text humanizations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>All 3 Modes: Simple, Standard & Enhanced</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>PDF Document & Image OCR Extraction</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>Strict ZeroGPT, GPTZero & Turnitin Bypass</span>
                </li>
              </ul>

              <button
                onClick={() => handleSimulatedPayment('PRO', proPrice)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Activating PRO...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Subscribe to PRO ({proPrice})
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Business / EDU Plans */
          <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/40 to-white p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-indigo-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Business / EDU Plan
                </span>
                <h3 className="text-lg font-bold text-slate-900">Academic & Team License</h3>
                <p className="text-xs text-slate-500">For university students, researchers, agencies, and content teams</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-slate-900 font-mono">{bizPrice}</div>
                <div className="text-xs text-slate-500">{billingCycle === 'annually' ? '/month (billed annually)' : '/month'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Unlimited humanizations & OCR scans</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Bulk PDF & Document Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Up to 10 Team & Student Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Turnitin & Institutional Clearance</span>
              </div>
            </div>

            <button
              onClick={() => handleSimulatedPayment('Business / EDU', bizPrice)}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Activating Business / EDU...' : `Activate Business / EDU (${bizPrice})`}
            </button>
          </div>
        )}

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
          <Lock className="h-3 w-3" />
          <span>Encrypted 256-bit secure checkout · Cancel anytime with 1 click</span>
        </div>
      </div>
    </div>
  );
};
