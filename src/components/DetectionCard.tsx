import React, { useState } from 'react';
import { DetectionMetrics } from '../types/humanizer';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, ChevronRight, Activity, Sparkles, Check, Shield } from 'lucide-react';

interface DetectionCardProps {
  metricsBefore?: DetectionMetrics | null;
  metricsAfter?: DetectionMetrics | null;
  singleMode?: boolean;
}

export const DetectionCard: React.FC<DetectionCardProps> = ({
  metricsBefore,
  metricsAfter,
  singleMode = false,
}) => {
  const [showSentenceDetails, setShowSentenceDetails] = useState(false);

  const activeMetrics = metricsAfter || metricsBefore;
  if (!activeMetrics) return null;

  const renderGauge = (metrics: DetectionMetrics, label: string) => {
    const isZeroAi = metrics.aiScore <= 0.05;
    const isHuman = metrics.verdict === 'human' || isZeroAi;
    const isAi = metrics.verdict === 'ai' && metrics.aiScore > 0.50;
    const aiPercentage = isZeroAi ? '0.0' : (metrics.aiScore * 100).toFixed(1);
    const humanConfidence = isZeroAi ? 100 : Math.round(metrics.humanConfidence);
    const classification = isZeroAi ? 'Humanized' : metrics.verdict === 'human' ? 'Human' : metrics.verdict === 'ai' ? 'AI Generated' : 'Mixed';

    return (
      <div className={`rounded-xl border p-4 backdrop-blur-sm transition-all ${
        isZeroAi
          ? 'border-emerald-500/60 bg-emerald-950/25 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20'
          : 'border-zinc-800 bg-zinc-900/60'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {label}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isZeroAi
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30'
                : isHuman
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : isAi
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isZeroAi ? (
              <>
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                Humanized Classification (100% Confidence)
              </>
            ) : isHuman ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                Human ({humanConfidence}% Confidence)
              </>
            ) : isAi ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5" />
                {aiPercentage}% AI GPT
              </>
            ) : (
              <>
                <Info className="h-3.5 w-3.5" />
                Mixed ({humanConfidence}% Confidence)
              </>
            )}
          </span>
        </div>

        {/* Highlight Score Summary */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/70 text-center">
          <div>
            <div className="text-[10px] uppercase font-semibold text-zinc-400">AI Probability</div>
            <div className={`mt-0.5 font-mono text-sm font-extrabold ${isZeroAi ? 'text-emerald-400' : 'text-rose-400'}`}>
              {aiPercentage}%
            </div>
            <div className="text-[9px] text-zinc-500">{isZeroAi ? '0.0 AI GPT' : `${aiPercentage}% AI GPT`}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-zinc-400">Confidence</div>
            <div className="mt-0.5 font-mono text-sm font-extrabold text-emerald-400">
              {humanConfidence}%
            </div>
            <div className="text-[9px] text-zinc-500">Detector Grade</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-zinc-400">Classification</div>
            <div className={`mt-0.5 text-xs font-bold ${isZeroAi ? 'text-emerald-400' : 'text-zinc-200'}`}>
              {classification}
            </div>
            <div className="text-[9px] text-zinc-500">{isZeroAi ? 'Zero AI Writing' : 'Analyzed'}</div>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-emerald-400 font-bold">100% Human Verification</span>
            <span className={`font-mono text-xs font-bold ${isZeroAi ? 'text-zinc-500' : 'text-rose-400'}`}>
              {aiPercentage}% AI GPT
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full transition-all duration-700 ${
                isZeroAi
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300 w-full'
                  : isHuman
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : isAi
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${humanConfidence}%` }}
            />
          </div>
        </div>

        {/* Verification Checkpoints */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-2">
            <div className="text-[10px] font-medium text-zinc-500 uppercase">Vocabulary Diversity</div>
            <div className="mt-0.5 font-mono text-xs font-bold text-zinc-200">
              {(metrics.ttr * 100).toFixed(1)}%
            </div>
            <div className="text-[9px] text-emerald-400">High Variety</div>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-2">
            <div className="text-[10px] font-medium text-zinc-500 uppercase">Burstiness (CV)</div>
            <div className="mt-0.5 font-mono text-xs font-bold text-zinc-200">
              {metrics.cv.toFixed(2)}
            </div>
            <div className="text-[9px] text-emerald-400">Organic Cadence</div>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-2">
            <div className="text-[10px] font-medium text-zinc-500 uppercase">AI Clichés Found</div>
            <div className={`mt-0.5 font-mono text-xs font-bold ${
              metrics.bannedWordsFound && metrics.bannedWordsFound.length > 0
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}>
              {metrics.bannedWordsFound && metrics.bannedWordsFound.length > 0
                ? `${metrics.bannedWordsFound.length} Detected`
                : '0 (Clean)'}
            </div>
            <div className="text-[9px] text-zinc-500">Zero-AI Verified</div>
          </div>
        </div>

        {/* Word count details */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 px-1">
          <span>Words: <strong className="text-zinc-200">{metrics.wordCount}</strong></span>
          <span>Sentences: <strong className="text-zinc-200">{metrics.sentenceCount}</strong></span>
          <span>Avg Sentence: <strong className="text-zinc-200">{metrics.avgSentenceLength} words</strong></span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {singleMode || !metricsBefore ? (
        renderGauge(activeMetrics, 'AI Detection Analysis')
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderGauge(metricsBefore, 'Before: Original Input')}
          {metricsAfter && renderGauge(metricsAfter, 'After: Undetectable Output')}
        </div>
      )}

      {/* Sentence-level analysis toggle */}
      {activeMetrics.sentences && activeMetrics.sentences.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <button
            onClick={() => setShowSentenceDetails(!showSentenceDetails)}
            className="flex w-full items-center justify-between text-xs font-medium text-zinc-300 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Sentence-by-Sentence Verification ({activeMetrics.sentences.length} sentences)
            </span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${showSentenceDetails ? 'rotate-90' : ''}`}
            />
          </button>

          {showSentenceDetails && (
            <div className="mt-3 space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-4 text-[11px] text-zinc-400 pb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  100% Natural Human Cadence
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Uniform AI Predictability
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {activeMetrics.sentences.map((sent, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-2.5 text-xs transition-colors ${
                      sent.isAiLikely
                        ? 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                        : 'border-emerald-500/30 bg-emerald-950/20 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 font-mono text-[10px] text-zinc-500">
                      <span>Sentence #{idx + 1} ({sent.words} words)</span>
                      <span className={sent.isAiLikely ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                        {sent.isAiLikely ? 'Flagged AI Pattern' : '100% Natural Human (0.0 AI)'}
                      </span>
                    </div>
                    <p className="leading-relaxed">{sent.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
