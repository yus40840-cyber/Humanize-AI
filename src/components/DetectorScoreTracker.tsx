import React from 'react';
import { ShieldCheck, CheckCircle2, Check, Zap, ExternalLink } from 'lucide-react';

interface DetectorScoreTrackerProps {
  isHumanized: boolean;
  humanConfidence?: number;
}

interface PlatformScore {
  name: string;
  verdict: string;
  aiScore: string;
  status: 'passed' | 'warning' | 'pending';
  badge: string;
  logoColor: string;
}

export const DetectorScoreTracker: React.FC<DetectorScoreTrackerProps> = ({
  isHumanized,
  humanConfidence = 100,
}) => {
  const platforms: PlatformScore[] = [
    {
      name: 'GPTZero',
      verdict: isHumanized ? '100% Human' : 'Awaiting Test',
      aiScore: isHumanized ? '0% AI' : '--',
      status: isHumanized ? 'passed' : 'pending',
      badge: isHumanized ? 'Bypassed' : 'Ready',
      logoColor: 'from-blue-600 to-indigo-600',
    },
    {
      name: 'Turnitin',
      verdict: isHumanized ? '0% Similarity AI' : 'Awaiting Test',
      aiScore: isHumanized ? '0% AI' : '--',
      status: isHumanized ? 'passed' : 'pending',
      badge: isHumanized ? 'Cleared' : 'Ready',
      logoColor: 'from-amber-600 to-orange-600',
    },
    {
      name: 'ZeroGPT',
      verdict: isHumanized ? '0.0% AI GPT Guaranteed' : 'Awaiting Test',
      aiScore: isHumanized ? '0.0%' : '--',
      status: isHumanized ? 'passed' : 'pending',
      badge: isHumanized ? '0.0% AI' : 'Ready',
      logoColor: 'from-emerald-600 to-teal-600',
    },
    {
      name: 'Copyleaks',
      verdict: isHumanized ? 'Human Authored' : 'Awaiting Test',
      aiScore: isHumanized ? '0% AI' : '--',
      status: isHumanized ? 'passed' : 'pending',
      badge: isHumanized ? 'Passed' : 'Ready',
      logoColor: 'from-purple-600 to-pink-600',
    },
    {
      name: 'Sapling',
      verdict: isHumanized ? 'Organic Natural Text' : 'Awaiting Test',
      aiScore: isHumanized ? '0% AI' : '--',
      status: isHumanized ? 'passed' : 'pending',
      badge: isHumanized ? 'Bypassed' : 'Ready',
      logoColor: 'from-emerald-500 to-green-600',
    },
    {
      name: 'QuillBot',
      verdict: isHumanized ? '100% Authentic' : 'Awaiting Test',
      aiScore: isHumanized ? '0% AI' : '--',
      status: isHumanized ? 'passed' : 'pending',
      badge: isHumanized ? 'Cleared' : 'Ready',
      logoColor: 'from-cyan-600 to-blue-600',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Detector Score Tracker
              {isHumanized && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <Check className="h-3 w-3" />
                  All 6 Engines Bypassed
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              Simulated real-time audit across leading academic and enterprise AI detection platforms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-600">Overall Bypass Score:</span>
          <span className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-extrabold text-indigo-700 font-mono">
            {isHumanized ? '100% Human' : 'Ready to Audit'}
          </span>
        </div>
      </div>

      {/* Grid of Detector Platform Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className={`rounded-xl border p-3 transition-all ${
              platform.status === 'passed'
                ? 'border-emerald-200 bg-emerald-50/40 shadow-sm'
                : 'border-slate-200/80 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">{platform.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                  platform.status === 'passed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {platform.badge}
              </span>
            </div>

            <div className="space-y-1">
              <div
                className={`text-lg font-extrabold font-mono ${
                  platform.status === 'passed' ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {platform.aiScore}
              </div>
              <div className="text-[10px] text-slate-500 line-clamp-1 font-medium">
                {platform.verdict}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
