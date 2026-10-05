import React, { useState } from 'react';
import { X, Terminal, Key, Copy, Check, Code, ShieldCheck, Zap } from 'lucide-react';

interface ApiConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConsoleModal: React.FC<ApiConsoleModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('rhl_live_9f83a2c019d4b7e826f501a3');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const curlExample = `curl -X POST https://api.raheelhumanize.com/v1/humanize \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Furthermore, organizations can leverage predictive methodologies to drive operational efficacy.",
    "humanizationMode": "standard",
    "readability": "normal",
    "purpose": "general",
    "tone": "natural"
  }'`;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(curlExample);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRegenerateKey = () => {
    const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(`rhl_live_${rand}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-0.5 text-xs font-bold text-indigo-700">
            <Terminal className="h-3.5 w-3.5" />
            <span>Developer Platform</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Raheel Humanize API Console
          </h2>
          <p className="text-xs text-slate-500">
            Integrate 0.0% AI text humanization into your automated pipelines, CMS, or backend services.
          </p>
        </div>

        {/* API Key Box */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-indigo-600" />
              Active Secret API Key
            </span>
            <button
              onClick={handleRegenerateKey}
              className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Roll Key
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs text-slate-800 select-all"
            />
            <button
              onClick={handleCopyKey}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              {copiedKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* cURL Example */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5 text-indigo-600" />
              cURL Request Example
            </span>
            <button
              onClick={handleCopyCode}
              className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedCode ? 'Copied Code' : 'Copy cURL'}
            </button>
          </div>
          <pre className="rounded-2xl border border-slate-800 bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-slate-200 overflow-x-auto select-all">
            {curlExample}
          </pre>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
            <span className="font-bold text-slate-800 block">Strict 0.0% AI</span>
            <span className="text-[11px] text-slate-500">Guaranteed bypass across ZeroGPT, GPTZero, and Turnitin.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
            <span className="font-bold text-slate-800 block">Ultra-Low Latency</span>
            <span className="text-[11px] text-slate-500">Global edge endpoints delivering fast 4-stage neural pipeline.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
            <span className="font-bold text-slate-800 block">Unlimited Quota</span>
            <span className="text-[11px] text-slate-500">Pro & Pakistani developers receive unlimited requests.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
