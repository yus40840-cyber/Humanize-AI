import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Cpu, Sparkles, Network, FileCode, CheckCircle } from 'lucide-react';

export const DocsViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'pipeline' | 'research' | 'methods' | 'metrics'>('pipeline');

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          Technical Documentation & Research
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Detailed technical reference and research background from the Lynote.ai repository.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {[
            { id: 'pipeline', label: 'Standard Pipeline Architecture', icon: Network },
            { id: 'research', label: 'StoryScope Research & Findings', icon: Sparkles },
            { id: 'methods', label: 'The 4 Core Methodologies', icon: FileCode },
            { id: 'metrics', label: 'Quality Metrics & Evaluation', icon: CheckCircle },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md text-xs leading-relaxed text-zinc-300">
          {activeSection === 'pipeline' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="h-4 w-4 text-emerald-400" />
                Standard Pipeline v1.5.1 (Production)
              </h3>
              <p>
                The Standard pipeline implements a 4-step sequence engineered after empirical testing across 50+ sample texts.
                Instead of simple synonym substitution or surface rephrasing, it combines high-temperature anti-AI localized rewriting
                with cross-engine, cross-family linguistic translation hops.
              </p>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3 font-mono">
                <div className="text-emerald-400 font-bold">Pipeline Execution Order:</div>
                <div className="text-zinc-200">
                  <span className="text-emerald-400">Step 1:</span> Input (EN) → Chinese (中文改写) · LLM Rewrite at temperature 1.3
                </div>
                <div className="text-zinc-200">
                  <span className="text-emerald-400">Step 2:</span> Chinese → Japanese (日语改写) · LLM Rewrite at temperature 1.3 (with conversational context history)
                </div>
                <div className="text-zinc-200">
                  <span className="text-emerald-400">Step 3:</span> Japanese → Finnish (FI) · Translation Hop 1 (Google Translate / NMT)
                </div>
                <div className="text-zinc-200">
                  <span className="text-emerald-400">Step 4:</span> Finnish → Target Language (EN) · Translation Hop 2 (Niutrans / NMT)
                </div>
              </div>

              <h4 className="text-sm font-semibold text-white mt-4">Why This Structure?</h4>
              <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                <li>
                  <strong className="text-white">Temperature 1.3 sampling:</strong> Breaks repetitive n-gram distributions and uniform AI perplexity scores without hallucinating facts.
                </li>
                <li>
                  <strong className="text-white">Conversational history in Step 2:</strong> Passing Step 1 as a prior assistant turn ensures semantic intent remains tethered across drastic language jumps.
                </li>
                <li>
                  <strong className="text-white">Cross-engine translation hops:</strong> Neural Machine Translation models have completely different latent representations and tokenizer rules than LLMs, stripping residual model signatures.
                </li>
              </ul>
            </div>
          )}

          {activeSection === 'research' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Research Notes: The StoryScope Study (COLM 2026)
              </h3>
              <p>
                Recent findings from the <em>StoryScope</em> study (conducted by University of Maryland & Google DeepMind, presented at COLM 2026)
                demonstrated that <strong>style-only rewriting has an inherent ceiling</strong> against state-of-the-art AI detectors.
              </p>
              
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-2">
                <div className="font-semibold text-emerald-400">Key Finding:</div>
                <p className="text-zinc-300">
                  Detectors no longer solely evaluate surface vocabulary or passive voice; they detect deep narrative macro-structures,
                  uniform clause densities, and discourse connectives that AI models disproportionately favor.
                </p>
              </div>

              <h4 className="text-sm font-semibold text-white mt-3">Why Finnish (fi) as the Intermediate Hop?</h4>
              <p>
                Finnish is a <strong>Finno-Ugric language</strong> with an agglutinative morphological system, completely distinct from the Indo-European family (English, Spanish, German).
                When text is converted into Finnish:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li>Prepositions and syntactic cases become agglutinated suffixes.</li>
                <li>Rigid Subject-Verb-Object (SVO) structures are broken down.</li>
                <li>Reconstructing back to English forces the translation engine to synthesize brand-new grammatical scaffolding, destroying AI sentence cadence.</li>
              </ul>
            </div>
          )}

          {activeSection === 'methods' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="h-4 w-4 text-emerald-400" />
                The Four Reference Methodologies
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5">
                  <div className="font-semibold text-emerald-400">Method 1: Translation Chain (v1.0)</div>
                  <p className="mt-1 text-zinc-400">
                    Runs input through a multi-hop round-trip translation across 3 to 5 languages (EN → ZH → JA → FI → EN).
                    Fast and style-preserving, but susceptible to semantic drift on technical idioms.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5">
                  <div className="font-semibold text-emerald-400">Method 2: LLM Multi-Round Rewriter (v1.0)</div>
                  <p className="mt-1 text-zinc-400">
                    Employs iterative high-temperature prompting with explicit anti-AI persona instructions.
                    Strong style adaptation, but can occasionally retain high perplexity consistency.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5">
                  <div className="font-semibold text-emerald-400">Method 3: Detection-Guided Feedback Loop</div>
                  <p className="mt-1 text-zinc-400">
                    Passes rewritten drafts through a local statistical detector (TTR, CV, Hapax ratio) in a closed feedback loop.
                    Iterates until human classification threshold is guaranteed.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5">
                  <div className="font-semibold text-emerald-400">Method 4: Mixed Engine (v1.5 Standard)</div>
                  <p className="mt-1 text-zinc-400">
                    The integrated optimal solution: blends the creative lexical freedom of LLMs with the structural reshaping of translation hops.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'metrics' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Evaluations & Quality Benchmarks
              </h3>
              <p>
                Tested on 50 verified text pairs evaluated by computational linguists across five qualitative dimensions:
              </p>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 pb-2">
                      <th className="pb-2">Evaluation Dimension</th>
                      <th className="pb-2 text-right">Score (out of 10)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    <tr><td className="py-2">Information Completeness</td><td className="py-2 text-right text-emerald-400 font-bold">10.0 / 10</td></tr>
                    <tr><td className="py-2">Language Fluency</td><td className="py-2 text-right text-emerald-400 font-bold">9.0 / 10</td></tr>
                    <tr><td className="py-2">Style Adaptability</td><td className="py-2 text-right text-emerald-400 font-bold">8.8 / 10</td></tr>
                    <tr><td className="py-2">Readability</td><td className="py-2 text-right text-emerald-400 font-bold">9.2 / 10</td></tr>
                    <tr><td className="py-2">Creativity & Impact</td><td className="py-2 text-right text-emerald-400 font-bold">8.5 / 10</td></tr>
                    <tr className="border-t border-zinc-800 font-bold text-white"><td className="py-2">Overall Average</td><td className="py-2 text-right text-emerald-400">9.1 / 10</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-zinc-300">
                <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
                  <ShieldAlert className="h-4 w-4" />
                  Responsible Use & Limitations Notice
                </div>
                <p className="text-[11px] text-zinc-400">
                  Round-trip translation may cause subtle drift in specialized formulas or citations.
                  Furthermore, AI text detectors evolve continually; no algorithm guarantees 100% bypass across all future detector updates.
                  Always review final text before publication.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
