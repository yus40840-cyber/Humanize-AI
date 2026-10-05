import React, { useState } from 'react';
import { DetectionMetrics } from '../types/humanizer';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, ChevronRight, Activity, Sparkles, Check } from 'lucide-react';

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
    const isAi = metrics.verdict === 'ai' && metrics.aiScore > 0.5;
    const aiPercentage = isZeroAi ? '0.0' : (metrics.aiScore * 100).toFixed(1);
    const humanConfidence = isZeroAi ? 100 : Math.round(metrics.humanConfidence);
    const classification = isZeroAi
      ? 'Humanized'
      : metrics.verdict === 'human'
      ? 'Human'
      : metrics.verdict === 'ai'
      ? 'AI Generated'
      : 'Mixed';

    return (
      <div
        className={`rounded-2xl border p-4 transition-all ${
          isZeroAi
            ? 'border-emerald-300 bg-emerald-50/60 shadow-sm shadow-emerald-500/10'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isZeroAi
                ? 'bg-emerald-600 text-white shadow-xs'
                : isHuman
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : isAi
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
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
        <div className="mt-3.5 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">AI Probability</div>
            <div
              className={`mt-0.5 font-mono text-sm font-extrabold ${
                isZeroAi ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {aiPercentage}%
            </div>
            <div className="text-[9px] text-slate-400 font-medium">
              {isZeroAi ? '0.0 AI GPT' : `${aiPercentage}% AI GPT`}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Confidence</div>
            <div className="mt-0.5 font-mono text-sm font-extrabold text-emerald-600">
              {humanConfidence}%
            </div>
            <div className="text-[9px] text-slate-400 font-medium">Detector Grade</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Classification</div>
            <div
              className={`mt-0.5 text-xs font-bold ${
                isZeroAi ? 'text-emerald-700' : 'text-slate-800'
              }`}
            >
              {classification}
            </div>
            <div className="text-[9px] text-slate-400 font-medium">
              {isZeroAi ? 'Zero AI Writing' : 'Analyzed'}
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-3.5 space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 font-medium">AI Probability Gauge</span>
              <span className="font-mono text-xs font-bold text-slate-800">{aiPercentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all duration-500 ${
                  isZeroAi ? 'bg-emerald-500' : isAi ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.max(Number(aiPercentage), 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              AI Detection Analysis
            </h4>
            <span className="text-[10px] text-slate-400">
              ZeroGPT & Statistical Linguistic Audit
            </span>
          </div>
        </div>

        {activeMetrics.sentences && activeMetrics.sentences.length > 0 && (
          <button
            onClick={() => setShowSentenceDetails(!showSentenceDetails)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            <span>{showSentenceDetails ? 'Hide Sentences' : 'Audit Sentences'}</span>
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform ${showSentenceDetails ? 'rotate-90' : ''}`}
            />
          </button>
        )}
      </div>

      {singleMode ? (
        renderGauge(activeMetrics, 'Text Analysis')
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {metricsBefore && renderGauge(metricsBefore, 'Before (AI Input)')}
          {metricsAfter && renderGauge(metricsAfter, 'After (0.0% Humanized)')}
        </div>
      )}

      {/* Sentence Breakdown */}
      {showSentenceDetails && activeMetrics.sentences && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1.5 border-b border-slate-200">
            <span>Per-Sentence AI Probability</span>
            <span className="text-[10px] text-slate-500 font-mono">
              {activeMetrics.sentences.length} sentences
            </span>
          </div>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {activeMetrics.sentences.map((sent, idx) => {
              const isSentAi = sent.isAiLikely;
              return (
                <div
                  key={idx}
                  className={`rounded-lg border p-2 text-xs transition-colors ${
                    isSentAi
                      ? 'border-rose-200 bg-rose-50/60 text-rose-900'
                      : 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold">Sentence #{idx + 1}</span>
                    <span
                      className={`font-extrabold ${isSentAi ? 'text-rose-600' : 'text-emerald-700'}`}
                    >
                      {(sent.score * 100).toFixed(0)}% AI · {sent.words} words
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{sent.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
