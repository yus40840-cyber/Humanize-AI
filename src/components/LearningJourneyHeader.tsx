import React from 'react';
import { Sparkles, ShieldAlert, Grid, ArrowRight } from 'lucide-react';
import { NavTab } from './Navbar';

interface LearningJourneyHeaderProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenToolsCenter: () => void;
}

export const LearningJourneyHeader: React.FC<LearningJourneyHeaderProps> = ({
  onSelectTab,
  onOpenToolsCenter,
}) => {
  // Time-aware greeting defaulting to Good Afternoon
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Header Row with Greeting & Browse All Tools Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-sm font-semibold text-slate-500">
            {getGreeting()}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Let's start today's learning journey.
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenToolsCenter}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-xs hover:border-indigo-300 hover:bg-indigo-50/60 transition-all cursor-pointer"
        >
          <Grid className="h-4 w-4 text-indigo-600" />
          <span>Browse All Tools</span>
        </button>
      </div>

      {/* 3 Featured Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: AI Humanizer */}
        <div
          onClick={() => onSelectTab('pipeline')}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>

              {/* Metric Box: 100% HUMAN Confidence */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-1.5 text-right">
                <div className="text-base font-black text-emerald-600 font-mono leading-none">
                  100%
                </div>
                <div className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-wider leading-tight mt-0.5">
                  HUMAN
                </div>
                <div className="text-[9px] font-semibold text-slate-400 leading-tight">
                  Confidence
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                AI Humanizer
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Rewrite AI text to read naturally like a human.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600">
            <span>Launch Humanizer</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: AI Detector */}
        <div
          onClick={() => onSelectTab('detector')}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-rose-400 hover:shadow-md hover:shadow-rose-500/10 transition-all cursor-pointer"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-sm shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="h-5 w-5" />
              </div>

              {/* Metric Box: 88% AI Detection Result */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-right">
                <div className="text-base font-black text-rose-600 font-mono leading-none">
                  88%
                </div>
                <div className="text-[9px] font-extrabold text-rose-800 uppercase tracking-wider leading-tight mt-0.5">
                  AI
                </div>
                <div className="text-[9px] font-semibold text-slate-400 leading-tight">
                  Detection Result
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
                AI Detector
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Scan any text to instantly identify AI footprints.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-rose-600">
            <span>Scan Text</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Browse All Tools */}
        <div
          onClick={onOpenToolsCenter}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white p-5 shadow-xs hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Grid className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-indigo-100/90 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider">
                15+ Tools
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Browse All Tools
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Discover and launch powerful AI capabilities.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-indigo-100 text-xs font-bold text-indigo-700">
            <span>Open Tools Center</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
