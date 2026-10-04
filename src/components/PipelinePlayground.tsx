import React, { useState, useRef } from 'react';
import { HumanizerConfig, HumanizeResponse, DetectionMetrics } from '../types/humanizer';
import { DetectionCard } from './DetectionCard';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Globe,
  CheckCircle2,
  FileText,
  ClipboardPaste,
  FileUp,
  Image as ImageIcon,
  Loader2,
  FileType,
  Crown,
  Lock,
  X,
  CreditCard,
} from 'lucide-react';

interface PipelinePlaygroundProps {
  config: HumanizerConfig;
  onOpenConfig?: () => void;
  onNavigateToAuth?: () => void;
  initialText?: string;
}

export const PipelinePlayground: React.FC<PipelinePlaygroundProps> = ({
  config,
  onNavigateToAuth,
  initialText = '',
}) => {
  const {
    user,
    isAuthenticated,
    canHumanize,
    remainingFreeTries,
    recordHumanization,
    upgradeToPro,
  } = useAuth();

  const [inputText, setInputText] = useState(
    initialText ||
      `Artificial intelligence algorithms represent a significant advancement in technological capabilities. Furthermore, modern enterprises are increasingly integrating predictive analytics to optimize workflow efficiencies and enhance decision-making frameworks across multiple organizational divisions. Consequently, organizations can leverage predictive methodologies to drive operational efficacy.`
  );

  const [targetLang, setTargetLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<{
    filename: string;
    type: 'pdf' | 'image';
    metrics?: DetectionMetrics;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<HumanizeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Exact word and letter count logic specified:
  // words = len(text.split())
  // letters = len(text.replace(" ", ""))
  const inputWords = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const inputLetters = inputText.replace(/\s/g, '').length;

  const outputWords = response?.result?.trim()
    ? response.result.trim().split(/\s+/).length
    : 0;
  const outputLetters = response?.result
    ? response.result.replace(/\s/g, '').length
    : 0;

  const isPakistani = user ? user.countryCode === '+92' || user.isPakistani : false;
  const isPaid = user?.hasPaid || user?.plan === 'pro';

  const handleRunPipeline = async () => {
    if (!inputText.trim()) return;

    // Check Free vs Paid constraint:
    // Non-Pakistani users only get 1 free humanization. After that, require payment.
    if (!canHumanize) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          method: 'standard',
          targetLang,
          intermediateLang: config.intermediateLang || 'fi',
          temperature: config.temperature || 1.35,
          config,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP error ${res.status}`);
      }

      const data: HumanizeResponse = await res.json();
      setResponse(data);
      if (data.result) {
        const words = data.result.trim().split(/\s+/).length;
        recordHumanization(words);
      }
    } catch (err: any) {
      console.error('Humanize error:', err);
      setError(err.message || 'Failed to humanize text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePayment = () => {
    upgradeToPro();
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowUpgradeModal(false);
    }, 1200);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setUploadNotice(null);
      }
    } catch (err) {
      console.error('Paste error:', err);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // PDF Upload Handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadNotice(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to extract text from PDF.');
      }

      const data = await res.json();
      setInputText(data.text);
      setUploadNotice({
        filename: data.filename || file.name,
        type: 'pdf',
        metrics: data.metrics,
      });
    } catch (err: any) {
      setError(err.message || 'Error uploading PDF.');
    } finally {
      setIsUploading(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  // Image Upload & OCR Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadNotice(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/extract-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to extract text from image.');
      }

      const data = await res.json();
      setInputText(data.text);
      setUploadNotice({
        filename: data.filename || file.name,
        type: 'image',
        metrics: data.metrics,
      });
    } catch (err: any) {
      setError(err.message || 'Error processing image OCR.');
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePdfUpload}
        accept="application/pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      {/* Hero Visual Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>Strict 0.0% ZeroGPT Bypass Guaranteed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Raheel <span className="text-emerald-400">Humanize Text</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                0.0 AI GPT Target
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                100% Confidence
              </span>
              {isPakistani ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span>🇵🇰</span> Pakistani User: Lifetime Free Unlimited
                </span>
              ) : isPaid ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Crown className="h-4 w-4" /> Pro Member: Unlimited Access
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Globe className="h-4 w-4" /> International Free Trial (1 Free Run)
                </span>
              )}
            </div>
          </div>

          <div className="relative hidden md:block h-28 w-48 shrink-0 overflow-hidden rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-950/30">
            <img
              src="/src/assets/images/humanize_hero_banner_1791132815791.jpg"
              alt="Raheel Humanize Text Visual"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Main Studio: Input on Left, Output & Detection on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Input Text Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Input Text (AI Generated)
              </span>
            </div>

            {/* Words & Letters Count */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="rounded-md bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-zinc-300">
                Words: <strong className="text-emerald-400 font-bold">{inputWords}</strong>
              </span>
              <span className="rounded-md bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-zinc-300">
                Letters: <strong className="text-emerald-400 font-bold">{inputLetters}</strong>
              </span>
            </div>
          </div>

          {/* Upload Notice Banner */}
          {uploadNotice && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-zinc-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {uploadNotice.type === 'pdf' ? (
                  <FileUp className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-white">{uploadNotice.filename}</span>
                  <span className="text-zinc-400 ml-1.5">
                    ({uploadNotice.type === 'pdf' ? 'PDF Document' : 'Image OCR'})
                  </span>
                  {uploadNotice.metrics && (
                    <span className="ml-2 font-mono text-[11px] text-amber-400">
                      Detection: {uploadNotice.metrics.verdict.toUpperCase()} ({(uploadNotice.metrics.aiScore * 100).toFixed(0)}% AI)
                    </span>
                  )}
                </div>
              </div>
              <span className="rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5">
                Ready to Humanize
              </span>
            </div>
          )}

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setUploadNotice(null);
              }}
              placeholder="Paste your AI-generated text here, or upload a PDF / Image..."
              rows={10}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-sans text-sm leading-relaxed text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 resize-none transition-colors"
            />
          </div>

          {/* Action Row: Paste, Clear, Upload PDF, Upload Image, Language */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                Paste
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setUploadNotice(null);
                }}
                className="flex items-center gap-1 rounded-lg border border-zinc-800/80 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                title="Clear input text"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>

              {/* PDF Upload Button */}
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-colors cursor-pointer disabled:opacity-50"
                title="Upload PDF document to extract text"
              >
                <FileUp className="h-3.5 w-3.5" />
                <span>Upload PDF</span>
              </button>

              {/* Image OCR Button */}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-colors cursor-pointer disabled:opacity-50"
                title="Upload Picture / Image to extract text with OCR"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Upload Image (OCR)</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-300">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-zinc-900 text-white">English (EN)</option>
                <option value="es" className="bg-zinc-900 text-white">Spanish (ES)</option>
                <option value="fr" className="bg-zinc-900 text-white">French (FR)</option>
                <option value="de" className="bg-zinc-900 text-white">German (DE)</option>
                <option value="zh" className="bg-zinc-900 text-white">Chinese (ZH)</option>
                <option value="ja" className="bg-zinc-900 text-white">Japanese (JA)</option>
              </select>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleRunPipeline}
            disabled={isLoading || isUploading || !inputText.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Extracting Document Text...
              </>
            ) : isLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                Humanizing to 0.0% AI...
              </>
            ) : !canHumanize ? (
              <>
                <Lock className="h-4 w-4" />
                Unlock Unlimited Humanizations (Upgrade)
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-current" />
                Humanize Text (0.0% AI GPT)
              </>
            )}
          </button>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 text-xs text-rose-300">
              <strong className="font-semibold block mb-0.5">Notice:</strong>
              {error}
            </div>
          )}
        </div>

        {/* Right: Humanized Output & Detection Result */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Humanized Output
                </span>
                {response && (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                    0.0 AI GPT
                  </span>
                )}
              </div>

              {/* Words & Letters Count for Output */}
              {response && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="rounded-md bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-zinc-300">
                      Words: <strong className="text-emerald-400 font-bold">{outputWords}</strong>
                    </span>
                    <span className="rounded-md bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-zinc-300">
                      Letters: <strong className="text-emerald-400 font-bold">{outputLetters}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(response.result)}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 transition-colors cursor-pointer"
                    title="Copy humanized text"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            {/* Output Body */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 min-h-[300px]">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <Sparkles className="h-7 w-7 text-emerald-400 animate-pulse" />
                  <span className="absolute -inset-1 rounded-2xl border border-emerald-500/20 animate-ping" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Converting to 100% Human Writing</h3>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    Enforcing ZeroGPT sentence buster, dissolving robotic n-grams, and locking 0.0% AI detection.
                  </p>
                </div>
              </div>
            ) : response ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-relaxed text-zinc-100 whitespace-pre-wrap font-sans min-h-[220px] select-text">
                {response.result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3 min-h-[280px] text-zinc-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-400">Ready to Humanize</p>
                  <p className="text-xs text-zinc-500 max-w-xs">
                    Paste text or upload a PDF/Image on the left. Click Humanize to guarantee 0.0% AI on ZeroGPT.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AI Detector Score Card */}
          {response?.metricsAfter && (
            <DetectionCard
              metricsBefore={response.metricsBefore}
              metricsAfter={response.metricsAfter}
            />
          )}
        </div>
      </div>

      {/* Upgrade Modal for Non-Pakistani Users who reached 1 free humanization */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Crown className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Free Trial Limit Reached</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Non-Pakistani accounts receive <strong>1 free humanization</strong>. Upgrade to continue humanizing unlimited text with guaranteed 0.0% AI detection.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] text-emerald-400 font-semibold">
                  <span>🇵🇰</span> Note: Pakistani users (+92) enjoy 100% free lifetime access
                </span>
              </div>
            </div>

            {/* Plan Card */}
            <div className="rounded-2xl border border-emerald-500/40 bg-zinc-950 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Raheel Pro Unlimited</h4>
                  <p className="text-[11px] text-zinc-400">Unlimited 0.0% AI text humanizations</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-400">$9.99<span className="text-xs text-zinc-500 font-normal">/mo</span></div>
                  <div className="text-[10px] text-zinc-500">Cancel anytime</div>
                </div>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-900">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Unlimited text humanizations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Full PDF & Image OCR support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Strict 0.0% ZeroGPT bypass guarantee
                </li>
              </ul>
            </div>

            {paymentSuccess ? (
              <div className="rounded-xl border border-emerald-500 bg-emerald-950/40 p-4 text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Payment successful! Unlimited access unlocked.
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleSimulatePayment}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  Upgrade to Unlimited Pro ($9.99)
                </button>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setShowUpgradeModal(false);
                      if (onNavigateToAuth) onNavigateToAuth();
                    }}
                    className="text-xs text-zinc-400 hover:text-emerald-400 underline"
                  >
                    Have a Pakistani number (+92)? Register or switch account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
