import React, { useState } from 'react';
import { PipelineStep } from '../types/humanizer';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, FileText, ArrowRight, Sparkles } from 'lucide-react';

interface StepProgressTrackerProps {
  steps: PipelineStep[];
  isLoading: boolean;
  activeStep?: number;
  totalSteps?: number;
}

export const StepProgressTracker: React.FC<StepProgressTrackerProps> = ({
  steps,
  isLoading,
  activeStep = 1,
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  const defaultStepLabels = [
    { step: 1, title: 'Step 1: 中文改写 (Chinese Rewrite)', desc: 'High-temperature (1.3) anti-AI prompt' },
    { step: 2, title: 'Step 2: 日语改写 (Japanese Rewrite)', desc: 'Context history retained across languages' },
    { step: 3, title: 'Step 3: 一轮翻译 (Hop 1: JA → FI)', desc: 'Finnish morphologic restructuring' },
    { step: 4, title: 'Step 4: 二轮翻译 (Hop 2: FI → Target)', desc: 'Final cross-engine target reconstruction' },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Pipeline Execution Steps ({steps.length}/4)
          </h3>
        </div>
        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="h-3 w-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            Processing Step {steps.length + 1}...
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {defaultStepLabels.map((lbl) => {
          const stepData = steps.find((s) => s.step === lbl.step);
          const isDone = Boolean(stepData);
          const isCurrent = isLoading && steps.length + 1 === lbl.step;
          const isPending = !isDone && !isCurrent;
          const isExpanded = expandedStep === lbl.step;

          return (
            <div
              key={lbl.step}
              className={`rounded-lg border transition-all ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : isCurrent
                  ? 'border-emerald-500/50 bg-emerald-900/10 shadow-sm'
                  : 'border-zinc-800/60 bg-zinc-950/40 opacity-60'
              }`}
            >
              <div
                onClick={() => isDone && toggleStep(lbl.step)}
                className={`flex items-center justify-between px-4 py-3 ${
                  isDone ? 'cursor-pointer hover:bg-zinc-800/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isCurrent
                        ? 'bg-emerald-500 text-zinc-950 animate-bounce'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : lbl.step}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-zinc-200">
                        {stepData?.direction || lbl.title}
                      </span>
                      {stepData && (
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                          {stepData.engine}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500">{lbl.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {stepData && (
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      {stepData.durationMs !== undefined && (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                          <Clock className="h-3 w-3 text-zinc-500" />
                          {stepData.durationMs}ms
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                        <FileText className="h-3 w-3 text-zinc-500" />
                        {stepData.length} chars
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                      )}
                    </div>
                  )}

                  {isCurrent && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20 animate-pulse">
                      Running
                    </span>
                  )}

                  {isPending && (
                    <span className="text-[11px] text-zinc-600">Waiting</span>
                  )}
                </div>
              </div>

              {/* Collapsible output preview */}
              {isDone && isExpanded && stepData && (
                <div className="border-t border-zinc-800/80 bg-zinc-950/70 p-4">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Intermediate Output (Step {lbl.step})
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(stepData.output);
                      }}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Copy step output
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap rounded bg-zinc-900/80 p-3 font-mono text-xs leading-relaxed text-zinc-300 border border-zinc-800">
                    {stepData.output}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
