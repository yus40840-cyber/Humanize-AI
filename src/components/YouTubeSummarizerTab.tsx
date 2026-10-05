import React, { useState } from 'react';
import { Youtube, Sparkles, Copy, Check, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface YouTubeSummarizerTabProps {
  onSendToHumanizer?: (text: string) => void;
}

export const YouTubeSummarizerTab: React.FC<YouTubeSummarizerTabProps> = ({ onSendToHumanizer }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<{
    title: string;
    keyTakeaways: string[];
    fullSummary: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = () => {
    if (!videoUrl.trim() && !transcript.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSummary({
        title: videoUrl ? 'YouTube Video Analysis: The Future of Neural Intelligence' : 'Transcript Synthesis',
        keyTakeaways: [
          'Modern large language models require asymmetric syntax to bypass perplexity algorithms.',
          'Traditional academic and corporate writing styles are heavily flagged by statistical detectors.',
          'Injecting contractions, varied sentence rhythms, and authentic idioms yields 0.0% AI detection.',
        ],
        fullSummary:
          'This presentation breaks down how modern linguistic algorithms evaluate text predictability. By understanding the core mechanics of burstiness and perplexity, writers can craft highly engaging, organic content that reads naturally and clears all detection systems effortlessly.',
      });
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-red-50 via-white to-purple-50 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-md shadow-red-500/20">
            <Youtube className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              YouTube Summarizer & Humanizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Summarize any YouTube video or lecture into concise bullet points, then humanize directly to 0.0% AI
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            YouTube Video URL or Title
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleSummarize}
              disabled={isProcessing || (!videoUrl.trim() && !transcript.trim())}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Summarizing...' : 'Summarize Video'}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 block">
            Or paste video transcript directly:
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste transcript timestamps or captions here..."
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Results */}
        {summary && (
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">{summary.title}</h3>
              <button
                onClick={() => handleCopy(summary.fullSummary)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Key Takeaways:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {summary.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Full Summary:
              </span>
              <p className="text-xs leading-relaxed text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                {summary.fullSummary}
              </p>
            </div>

            {onSendToHumanizer && (
              <div className="pt-2">
                <button
                  onClick={() => onSendToHumanizer(summary.fullSummary)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  Transfer Summary to AI Humanizer Studio (0.0% AI)
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
