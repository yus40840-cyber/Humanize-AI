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
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Statistical AI Text Detector
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Analyzes sentence burstiness, vocabulary diversity, and statistical AI fingerprints matching ZeroGPT, GPTZero, and Turnitin
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Text Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Text to Analyze
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer font-semibold"
                >
                  <ClipboardPaste className="h-3 w-3" />
                  Paste
                </button>
                <button
                  onClick={() => {
                    setDetectText('');
                    setMetrics(null);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={!detectText.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              Scan for AI Signatures
            </button>
          </div>
        </div>

        {/* Right Column: Score Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {metrics ? (
            <DetectionCard metricsBefore={metrics} singleMode={true} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
              <p className="text-xs">Paste text and click Scan to see forensic AI probability results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
