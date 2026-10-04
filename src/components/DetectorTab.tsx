import React, { useState } from 'react';
import { analyzeTextWithStatisticalDetector } from '../services/statisticalDetector';
import { DetectionMetrics } from '../types/humanizer';
import { DetectionCard } from './DetectionCard';
import { ShieldCheck, Search, RotateCcw, ClipboardPaste } from 'lucide-react';

export const DetectorTab: React.FC = () => {
  const [detectText, setDetectText] = useState(
    `Furthermore, the implementation of automated cognitive frameworks empowers modern enterprise workflows to scale seamlessly across distributed cloud infrastructures. Consequently, organizations can leverage predictive methodologies to drive operational efficacy and maximize computational ROI.`
  );

  const [metrics, setMetrics] = useState<DetectionMetrics | null>(() =>
    analyzeTextWithStatisticalDetector(detectText)
  );

  const handleAnalyze = () => {
    if (!detectText.trim()) return;
    const res = analyzeTextWithStatisticalDetector(detectText);
    setMetrics(res);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDetectText(text);
        setMetrics(analyzeTextWithStatisticalDetector(text));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800/80 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          Statistical AI Text Detector
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Analyzes text for sentence burstiness, vocabulary diversity, and statistical AI fingerprints matching ZeroGPT, GPTZero, and Turnitin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Text Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Text to Analyze
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ClipboardPaste className="h-3 w-3" />
                  Paste
                </button>
                <button
                  onClick={() => {
                    setDetectText('');
                    setMetrics(null);
                  }}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={detectText}
              onChange={(e) => setDetectText(e.target.value)}
              placeholder="Paste any text to check AI probability score..."
              rows={11}
              className="mt-3 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 font-sans text-xs leading-relaxed text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none resize-none"
            />

            <button
              onClick={handleAnalyze}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-bold text-zinc-950 shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Search className="h-4 w-4" />
              Analyze Text for AI Patterns
            </button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-[11px] text-zinc-400 space-y-2">
            <div className="font-semibold text-zinc-300">Statistical Features Measured:</div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
              <li>Type-Token Ratio (Lexical Diversity)</li>
              <li>Coefficient of Variation (Burstiness & Sentence Length Variance)</li>
              <li>Hapax Legomena (Infrequent vocabulary distribution)</li>
              <li>Banned AI Clichés & Machine Indicators</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Score & Visual Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {metrics ? (
            <DetectionCard
              metricsBefore={metrics}
              singleMode={true}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
              Paste text and click Analyze to view detection metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
