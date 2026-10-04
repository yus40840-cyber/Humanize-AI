import React, { useState } from 'react';
import { SHOWCASE_EXAMPLES } from '../data/showcaseExamples';
import { ShowcaseItem } from '../types/humanizer';
import { CheckCircle2, ChevronRight, Copy, ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';

interface ShowcaseViewerProps {
  onLoadExample: (text: string) => void;
}

export const ShowcaseViewer: React.FC<ShowcaseViewerProps> = ({ onLoadExample }) => {
  const [selectedExample, setSelectedExample] = useState<ShowcaseItem>(SHOWCASE_EXAMPLES[0]);
  const [activeStepTab, setActiveStepTab] = useState<'input' | 'step1' | 'step2' | 'step3' | 'step4'>('step4');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            Official Repository Showcase Traces
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            End-to-end verified traces from the <code>examples/showcase/</code> dataset. All 5 final outputs classified as <strong>human</strong> by target AI detectors.
          </p>
        </div>

        <button
          onClick={() => onLoadExample(selectedExample.originalInput)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity"
        >
          <Sparkles className="h-4 w-4" />
          Load Current Sample into Pipeline
        </button>
      </div>

      {/* Example Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SHOWCASE_EXAMPLES.map((item) => {
          const isSelected = selectedExample.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedExample(item);
                setActiveStepTab('step4');
              }}
              className={`rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-emerald-500/80 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-emerald-400">
                  #{item.number}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  {(item.confidence * 100).toFixed(2)}%
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold text-zinc-200 line-clamp-1">
                {item.topic}
              </div>
              <div className="mt-1 text-[11px] text-zinc-400">
                Verdict: <span className="text-emerald-400 font-medium capitalize">{item.verdict}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Example Detail Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
                Example {selectedExample.number}
              </span>
              <h3 className="text-base font-bold text-white">
                {selectedExample.topic}
              </h3>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
              <span>Detection Result: <strong className="text-emerald-400">Human ({selectedExample.confidence * 100}%)</strong></span>
              <span>•</span>
              <span>4-Step Multi-Language Chain</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(
                activeStepTab === 'input'
                  ? selectedExample.originalInput
                  : activeStepTab === 'step1'
                  ? selectedExample.step1.output
                  : activeStepTab === 'step2'
                  ? selectedExample.step2.output
                  : activeStepTab === 'step3'
                  ? selectedExample.step3.output
                  : selectedExample.step4.output
              )}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? 'Copied!' : 'Copy Current Text'}
            </button>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="mt-5 flex flex-wrap gap-1.5 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveStepTab('input')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeStepTab === 'input'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Original Input
          </button>
          <button
            onClick={() => setActiveStepTab('step1')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeStepTab === 'step1'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Step 1: 中文改写
          </button>
          <button
            onClick={() => setActiveStepTab('step2')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeStepTab === 'step2'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Step 2: 日语改写
          </button>
          <button
            onClick={() => setActiveStepTab('step3')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeStepTab === 'step3'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Step 3: 一轮翻译 (FI)
          </button>
          <button
            onClick={() => setActiveStepTab('step4')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeStepTab === 'step4'
                ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Step 4: Final Output (EN)
          </button>
        </div>

        {/* Text View Area */}
        <div className="mt-4">
          <div className="flex items-center justify-between pb-2 text-[11px] font-mono text-zinc-400">
            <span>
              {activeStepTab === 'input' && 'Source: English AI-generated baseline'}
              {activeStepTab === 'step1' && `Engine: ${selectedExample.step1.engine} · ${selectedExample.step1.direction}`}
              {activeStepTab === 'step2' && `Engine: ${selectedExample.step2.engine} · ${selectedExample.step2.direction}`}
              {activeStepTab === 'step3' && `Engine: ${selectedExample.step3.engine} · ${selectedExample.step3.direction}`}
              {activeStepTab === 'step4' && `Engine: ${selectedExample.step4.engine} · ${selectedExample.step4.direction}`}
            </span>
            <span className="text-zinc-500">
              {activeStepTab === 'input'
                ? `${selectedExample.originalInput.length} chars`
                : activeStepTab === 'step1'
                ? `${selectedExample.step1.output.length} chars`
                : activeStepTab === 'step2'
                ? `${selectedExample.step2.output.length} chars`
                : activeStepTab === 'step3'
                ? `${selectedExample.step3.output.length} chars`
                : `${selectedExample.step4.output.length} chars`}
            </span>
          </div>

          <div className="min-h-48 rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-4 font-mono text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap">
            {activeStepTab === 'input' && selectedExample.originalInput}
            {activeStepTab === 'step1' && selectedExample.step1.output}
            {activeStepTab === 'step2' && selectedExample.step2.output}
            {activeStepTab === 'step3' && selectedExample.step3.output}
            {activeStepTab === 'step4' && selectedExample.step4.output}
          </div>
        </div>

        {/* Why this worked callout */}
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-4 text-xs">
          <h4 className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <BookOpen className="h-4 w-4" />
            Why This Worked (from Lynote.ai Analysis)
          </h4>
          <p className="mt-2 leading-relaxed text-zinc-300">
            {selectedExample.whyWorked ||
              'The 4-step chain compounds humanization signals: Steps 1–2 break AI statistical fingerprints with creative variation at temperature 1.3 while retaining cross-lingual context history. Step 3 hops through Finnish (an agglutinative morphology distant from Indo-European), forcing deep structural reshuffling. Step 4 ensures cross-engine reconstruction so no single-engine statistical pattern survives.'}
          </p>
        </div>
      </div>
    </div>
  );
};
