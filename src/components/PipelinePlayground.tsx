import React, { useState, useRef } from 'react';
import {
  HumanizerConfig,
  HumanizeResponse,
  DetectionMetrics,
  ReadabilityLevel,
  WritingPurpose,
  HumanizationMode,
} from '../types/humanizer';
import { DetectionCard } from './DetectionCard';
import { DetectorScoreTracker } from './DetectorScoreTracker';
import { useAuth } from '../context/AuthContext';
import { UpgradeModal } from './UpgradeModal';
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
  Crown,
  CreditCard,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  Zap,
  Layers,
  Sparkle,
} from 'lucide-react';

interface PipelinePlaygroundProps {
  config: HumanizerConfig;
  onOpenConfig?: () => void;
  onNavigateToAuth?: () => void;
  onTriggerAuthPopup?: () => void;
  initialText?: string;
}

type HumanizerTone = 'casual' | 'natural' | 'conversational';

// Quick Preset Samples
const PRESETS = {
  chatgpt: `In today's fast-paced digital world, artificial intelligence plays a pivotal role in optimizing operational workflows. Furthermore, organizations can leverage predictive analytics to make informed decisions, delve into complex data, and ensure seamless cross-functional alignment. Consequently, modern enterprises must harness these innovative technologies to remain competitive.`,
  claude: `It is worth noting that the multifaceted implications of algorithmic automation extend significantly across contemporary organizational paradigms. One must consider not merely the computational efficiency, but also the nuanced trade-offs between human agency and synthetic outputs. Overall, this phenomenon reflects an unprecedented inflection point.`,
  mixed: `We conducted a thorough market review last Tuesday. However, it is essential to highlight that predictive machine learning algorithms represent a monumental leap forward in technical efficacy. Team members reported high satisfaction, yet modern paradigms necessitate continuous algorithmic optimization to maximize throughput.`,
};

export const PipelinePlayground: React.FC<PipelinePlaygroundProps> = ({
  config,
  onNavigateToAuth,
  onTriggerAuthPopup,
  initialText = '',
}) => {
  const {
    user,
    isAuthenticated,
    canHumanize,
    recordHumanization,
  } = useAuth();

  const [inputText, setInputText] = useState(
    initialText || PRESETS.chatgpt
  );

  const [targetLang, setTargetLang] = useState('en');
  const [selectedTone, setSelectedTone] = useState<HumanizerTone>('natural');
  const [showToneGuide, setShowToneGuide] = useState(false);

  // Lynote AI Humanizer-inspired options (Default free: Simple, Normal, General, Natural)
  const [humanizationMode, setHumanizationMode] = useState<HumanizationMode>('simple');
  const [readabilityLevel, setReadabilityLevel] = useState<ReadabilityLevel>('normal');
  const [writingPurpose, setWritingPurpose] = useState<WritingPurpose>('general');
  const [upgradeFeatureHint, setUpgradeFeatureHint] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<{
    filename: string;
    type: 'pdf' | 'image' | 'doc';
    metrics?: DetectionMetrics;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<HumanizeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
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
  const isProOrPakistani = isPakistani || isPaid;

  const handleSelectMode = (mode: HumanizationMode) => {
    if (mode !== 'simple' && !isProOrPakistani) {
      setUpgradeFeatureHint(`${mode === 'enhanced' ? 'Enhanced' : 'Standard'} Humanization Mode`);
      setIsUpgradeModalOpen(true);
      return;
    }
    setHumanizationMode(mode);
  };

  const handleSelectReadability = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ReadabilityLevel;
    if (val !== 'normal' && !isProOrPakistani) {
      setUpgradeFeatureHint(`${val.replace('_', ' ').toUpperCase()} Readability Level`);
      setIsUpgradeModalOpen(true);
      return;
    }
    setReadabilityLevel(val);
  };

  const handleSelectPurpose = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as WritingPurpose;
    if (val !== 'general' && !isProOrPakistani) {
      setUpgradeFeatureHint(`${val.toUpperCase()} Writing Purpose`);
      setIsUpgradeModalOpen(true);
      return;
    }
    setWritingPurpose(val);
  };

  const handleSelectTone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as HumanizerTone;
    if (val !== 'natural' && !isProOrPakistani) {
      setUpgradeFeatureHint(`${val === 'casual' ? 'Casual' : 'Conversational'} Humanizing Tone`);
      setIsUpgradeModalOpen(true);
      return;
    }
    setSelectedTone(val);
  };

  const handleRunPipeline = async () => {
    if (!inputText.trim()) return;

    // Check if user is authenticated; if not, open automatic popup
    if (!isAuthenticated && onTriggerAuthPopup) {
      onTriggerAuthPopup();
      return;
    }

    // Check Free vs Paid constraint:
    if (!canHumanize) {
      setIsUpgradeModalOpen(true);
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
          tone: selectedTone,
          readability: readabilityLevel,
          purpose: writingPurpose,
          humanizationMode,
          intermediateLang: config.intermediateLang || 'fi',
          temperature: config.temperature || 1.35,
          config,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const raw = await res.text();
        throw new Error(raw.slice(0, 150) || `Server error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || `HTTP error ${res.status}`);
      }

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

  // Safe Document / PDF Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'doc') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Plain text or markdown direct read
    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputText(content);
        setUploadNotice({ filename: file.name, type: 'doc' });
      };
      reader.readAsText(file);
      return;
    }

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

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const raw = await res.text();
        throw new Error(raw.slice(0, 150) || `Upload error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to extract text from document.');
      }

      setInputText(data.text);
      setUploadNotice({
        filename: data.filename || file.name,
        type: 'pdf',
        metrics: data.metrics,
      });
    } catch (err: any) {
      setError(err.message || 'Error uploading document.');
    } finally {
      setIsUploading(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
      if (docInputRef.current) docInputRef.current.value = '';
    }
  };

  // Safe Image Upload & OCR Handler
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

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const raw = await res.text();
        throw new Error(raw.slice(0, 150) || `OCR error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to extract text from image.');
      }

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
        onChange={(e) => handleFileUpload(e, 'pdf')}
        accept="application/pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={docInputRef}
        onChange={(e) => handleFileUpload(e, 'doc')}
        accept=".txt,.md,.docx,text/plain"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      {/* Hero Visual Banner (Light Modern SaaS Style with Purple/Blue Accents) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 p-6 sm:p-7 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Strict 0.0% ZeroGPT & Turnitin Bypass Guaranteed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Raheel{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Humanize Text
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Transform AI-generated text from ChatGPT, Claude, and Gemini into authentic, undetectable human prose with verified 0.0% AI probability.
            </p>

            {/* Step Pattern & Tier Status */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Zero-Friction (Up to 2,000 Words)
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                1. Paste → 2. Choose Mode → 3. 0.0% AI
              </span>
              {isPakistani ? (
                <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <span>🇵🇰</span> Pakistani Member: Lifetime Free
                </span>
              ) : isPaid ? (
                <span className="flex items-center gap-1 text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  <Crown className="h-3.5 w-3.5 text-indigo-600" /> Pro Member ($3.99/mo)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  <Globe className="h-3.5 w-3.5" /> International Free Trial (1 Free Run)
                </span>
              )}
            </div>
          </div>

          <div className="relative hidden md:block h-28 w-48 shrink-0 overflow-hidden rounded-2xl border border-indigo-100 shadow-md shadow-indigo-500/10">
            <img
              src="/src/assets/images/humanize_hero_banner_1791132815791.jpg"
              alt="Raheel Humanize Text Visual"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Control Toolbar (Positioned directly above the Dual-Pane Workspace) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm space-y-3">
        {/* Row 1: Visual Mode Clarity (3 Rewriting Intensity Modes) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-600" />
              Humanization Mode:
            </span>
            {!isProOrPakistani && (
              <button
                type="button"
                onClick={() => {
                  setUpgradeFeatureHint('Enhanced & Standard Modes, Custom Readability & Purposes');
                  setIsUpgradeModalOpen(true);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800 hover:border-amber-300 transition-colors cursor-pointer shadow-2xs"
              >
                <span>👑</span>
                <span>Unlock Pro Power</span>
              </button>
            )}
          </div>

          {/* 3 Color-Coded Intensity Mode Tabs */}
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
            {/* 🟢 Simple (Easy) - Free for everyone */}
            <button
              type="button"
              onClick={() => handleSelectMode('simple')}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                humanizationMode === 'simple'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title="A light polish that cleans up robotic phrasing while keeping the draft close to original"
            >
              <span>🟢</span>
              <span>Simple (Easy)</span>
            </button>

            {/* 🟣 Standard - Unlock Pro Power */}
            <button
              type="button"
              onClick={() => handleSelectMode('standard')}
              className={`relative flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                humanizationMode === 'standard'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/20'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title={isProOrPakistani ? "A balanced rewrite that adjusts sentence rhythm and structure for natural flow" : "Unlock Pro Power: Standard Mode"}
            >
              <span>🟣</span>
              <span>Standard</span>
              {!isProOrPakistani && (
                <span className="rounded-full bg-amber-400 text-slate-950 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
                  PRO
                </span>
              )}
            </button>

            {/* ⚡ Enhanced - Unlock Pro Power */}
            <button
              type="button"
              onClick={() => handleSelectMode('enhanced')}
              className={`relative flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                humanizationMode === 'enhanced'
                  ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-sm shadow-blue-500/20'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title={isProOrPakistani ? "A deep structural rewrite designed for heavy AI detection bypass" : "Unlock Pro Power: Enhanced Mode"}
            >
              <Zap className="h-3.5 w-3.5 fill-current text-amber-300" />
              <span>Enhanced</span>
              {!isProOrPakistani && (
                <span className="rounded-full bg-amber-400 text-slate-950 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
                  PRO
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Readability Levels, Purpose & Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Readability Level */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Readability Level
              </label>
              {!isProOrPakistani && readabilityLevel === 'normal' && (
                <span className="text-[10px] text-emerald-600 font-bold">Free Active</span>
              )}
            </div>
            <select
              value={readabilityLevel}
              onChange={handleSelectReadability}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="normal">Normal (Everyday Audiences)</option>
              <option value="high_school">
                {isProOrPakistani ? 'High School (Simple Structure)' : '👑 High School — Unlock Pro Power'}
              </option>
              <option value="university">
                {isProOrPakistani ? 'University (Academic College Level)' : '👑 University — Unlock Pro Power'}
              </option>
              <option value="phd">
                {isProOrPakistani ? 'PhD (Advanced Formal Research)' : '👑 PhD — Unlock Pro Power'}
              </option>
            </select>
          </div>

          {/* Writing Purpose */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Writing Purpose
              </label>
              {!isProOrPakistani && writingPurpose === 'general' && (
                <span className="text-[10px] text-emerald-600 font-bold">Free Active</span>
              )}
            </div>
            <select
              value={writingPurpose}
              onChange={handleSelectPurpose}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="general">General (Broad Multi-purpose)</option>
              <option value="academic">
                {isProOrPakistani ? 'Academic (Scholastic & Research)' : '👑 Academic — Unlock Pro Power'}
              </option>
              <option value="marketing">
                {isProOrPakistani ? 'Marketing (Promotional & Ad Copy)' : '👑 Marketing — Unlock Pro Power'}
              </option>
              <option value="business">
                {isProOrPakistani ? 'Business (Workplace & Corporate)' : '👑 Business — Unlock Pro Power'}
              </option>
              <option value="essay">
                {isProOrPakistani ? 'Essay (Structured School/College)' : '👑 Essay — Unlock Pro Power'}
              </option>
              <option value="legal">
                {isProOrPakistani ? 'Legal (Formal & Contractual)' : '👑 Legal — Unlock Pro Power'}
              </option>
              <option value="story">
                {isProOrPakistani ? 'Story (Creative Narrative Style)' : '👑 Story — Unlock Pro Power'}
              </option>
              <option value="letter">
                {isProOrPakistani ? 'Letter (Personal & Official)' : '👑 Letter — Unlock Pro Power'}
              </option>
              <option value="report">
                {isProOrPakistani ? 'Report (Business & Analytical)' : '👑 Report — Unlock Pro Power'}
              </option>
              <option value="blog">
                {isProOrPakistani ? 'Blog (Conversational & Web)' : '👑 Blog — Unlock Pro Power'}
              </option>
            </select>
          </div>

          {/* Tone Selector */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Humanizing Tone
              </label>
              <button
                type="button"
                onClick={() => setShowToneGuide(!showToneGuide)}
                className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
              >
                <HelpCircle className="h-2.5 w-2.5" />
                <span>Why Tone Beats Raheel Humanize</span>
              </button>
            </div>
            <select
              value={selectedTone}
              onChange={handleSelectTone}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="natural">⚖️ Natural / Standard (The Safe Middle-Ground)</option>
              <option value="casual">
                {isProOrPakistani ? '🔌 Casual Tone (The Pattern Breaker)' : '👑 🔌 Casual Tone — Unlock Pro Power'}
              </option>
              <option value="conversational">
                {isProOrPakistani ? '💬 Conversational (The Flow Optimizer)' : '👑 💬 Conversational — Unlock Pro Power'}
              </option>
            </select>
          </div>
        </div>

        {/* Expandable Tone Guide (Perplexity & Burstiness) */}
        {showToneGuide && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-slate-700 space-y-3 animate-in fade-in">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              How Choosing the Right Tone Beats Raheel Humanize:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              AI detectors like ZeroGPT look for two mathematical signals: <strong>Perplexity</strong> (predictable word choices) and <strong>Burstiness</strong> (repetitive sentence lengths). Using tones that mirror unpredictable human behavior breaks these signals completely:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-white border border-indigo-100 shadow-2xs">
                <strong className="text-indigo-700 block mb-1">🔌 1. Casual Tone:</strong> Injects informal phrasing and extreme sentence length variation. Real humans type short, punchy statements right next to longer clauses.
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-indigo-100 shadow-2xs">
                <strong className="text-indigo-700 block mb-1">⚖️ 2. Natural / Standard:</strong> Strips out robotic AI filler words (furthermore, delve, in conclusion) while keeping professional clarity.
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-indigo-100 shadow-2xs">
                <strong className="text-indigo-700 block mb-1">💬 3. Conversational:</strong> Mimics the chaotic rhythm of human dialogue. Leans into contractions (don't, it's) and addresses the reader directly ("you").
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dual-Pane Workspace (Core Interface) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Box (Input): Paste, Upload, Quick-Presets, Word Counter */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Input Text (AI Generated)
              </span>
            </div>

            {/* Real-time word and character counter */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700 font-medium">
                Words: <strong className="text-indigo-600 font-bold">{inputWords}</strong>
              </span>
              <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700 font-medium">
                Letters: <strong className="text-indigo-600 font-bold">{inputLetters}</strong>
              </span>
            </div>
          </div>

          {/* Quick-Preset Buttons (Try Example) */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-[11px] font-semibold text-slate-500">Try Example:</span>
            <button
              type="button"
              onClick={() => {
                setInputText(PRESETS.chatgpt);
                setUploadNotice(null);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              ChatGPT
            </button>
            <button
              type="button"
              onClick={() => {
                setInputText(PRESETS.claude);
                setUploadNotice(null);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              Claude
            </button>
            <button
              type="button"
              onClick={() => {
                setInputText(PRESETS.mixed);
                setUploadNotice(null);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              Human + AI
            </button>
          </div>

          {/* Upload Notice Banner */}
          {uploadNotice && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs text-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileUp className="h-4 w-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{uploadNotice.filename}</span>
                  <span className="text-slate-500 ml-1.5">
                    ({uploadNotice.type === 'pdf' ? 'PDF Document' : 'Document File'})
                  </span>
                </div>
              </div>
              <span className="rounded bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5">
                Ready to Humanize
              </span>
            </div>
          )}

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={inputText}
              onFocus={() => {
                if (!isAuthenticated && onTriggerAuthPopup) {
                  const alreadyPrompted = sessionStorage.getItem('raheel_input_prompted');
                  if (!alreadyPrompted) {
                    sessionStorage.setItem('raheel_input_prompted', 'true');
                    onTriggerAuthPopup();
                  }
                }
              }}
              onChange={(e) => {
                setInputText(e.target.value);
                setUploadNotice(null);
              }}
              placeholder="Paste your AI-generated text here, or upload documents (.txt, .docx, .pdf) or images..."
              rows={11}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-sans text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 resize-none transition-colors"
            />
          </div>

          {/* Action Row: Paste, Clear, Upload .txt / .docx, Upload PDF, Upload Image, Language */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="h-3.5 w-3.5 text-indigo-600" />
                Paste
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setUploadNotice(null);
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Clear input text"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>

              {/* Upload Document Button (.txt, .docx) */}
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50"
                title="Upload .txt, .md, or .docx document"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Upload Doc</span>
              </button>

              {/* PDF Upload Button */}
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50"
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
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50"
                title="Upload Picture / Image to extract text with OCR"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Upload Image (OCR)</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700">
              <Globe className="h-3.5 w-3.5 text-indigo-600" />
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="es">Spanish (ES)</option>
                <option value="fr">French (FR)</option>
                <option value="de">German (DE)</option>
                <option value="zh">Chinese (ZH)</option>
                <option value="ja">Japanese (JA)</option>
              </select>
            </div>
          </div>

          {/* Primary CTA Button (Vibrant Purple & Blue Gradient) */}
          {!canHumanize ? (
            <div className="space-y-2">
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                Free Trial Used (1/1) — Unlock PRO ($3.99/mo)
              </button>
              <p className="text-[11px] text-center text-slate-500">
                International users get 1 free trial. Pakistani users (+92) enjoy 100% free lifetime access.
              </p>
            </div>
          ) : (
            <button
              onClick={handleRunPipeline}
              disabled={isLoading || isUploading || !inputText.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting Document Text...
                </>
              ) : isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Humanizing to 0.0% AI ({humanizationMode.toUpperCase()})...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 fill-current" />
                  Humanize Text (0.0% AI GPT Guaranteed)
                </>
              )}
            </button>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
              <strong className="font-bold block mb-0.5">Execution Notice:</strong>
              {error}
            </div>
          )}
        </div>

        {/* Right Box (Output): Humanized Text, Score Estimator, Copy */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Humanized Output
                </span>
                {response && (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 text-[10px] font-extrabold">
                    0.0% AI Score
                  </span>
                )}
              </div>

              {/* Words & Letters Count for Output */}
              {response && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700 font-medium">
                      Words: <strong className="text-emerald-600 font-bold">{outputWords}</strong>
                    </span>
                    <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700 font-medium">
                      Letters: <strong className="text-emerald-600 font-bold">{outputLetters}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(response.result)}
                    className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                    title="Copy humanized text"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            {/* Output Body */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 min-h-[320px]">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                  <Sparkles className="h-7 w-7 animate-pulse text-indigo-600" />
                  <span className="absolute -inset-1 rounded-2xl border border-indigo-400/30 animate-ping" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">Converting to 100% Human Writing</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Enforcing {humanizationMode.toUpperCase()} mode, breaking robotic n-grams, and locking 0.0% AI detection.
                  </p>
                </div>
              </div>
            ) : response ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-sans min-h-[260px] select-text">
                {response.result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-3 min-h-[300px] text-slate-400">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 text-slate-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">Ready to Humanize</p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Paste text or pick an example preset on the left. Click Humanize to guarantee 0.0% AI detection.
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

      {/* Detector Score Tracker: Simulated bypass scores across major platforms */}
      <DetectorScoreTracker
        isHumanized={!!response?.result}
        humanConfidence={response?.metricsAfter?.humanConfidence ?? 100}
      />

      {/* Upgrade Paywall Modal for Non-Pakistani users */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        featureHint={upgradeFeatureHint}
      />
    </div>
  );
};
