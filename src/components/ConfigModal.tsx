import React, { useState } from 'react';
import { HumanizerConfig } from '../types/humanizer';
import { X, Sliders, Check, Key, Globe, Shield, Sparkles } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HumanizerConfig;
  onSaveConfig: (newConfig: HumanizerConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<HumanizerConfig>({ ...config });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-emerald-950/20">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pipeline Configuration</h3>
              <p className="text-xs text-zinc-400">Customize LLM rewriters, translation hops & parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              LLM Provider (Steps 1 & 2 Rewriter)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'gemini', label: 'Default Engine', desc: 'Zero config, server-side' },
                { id: 'deepseek', label: 'DeepSeek', desc: 'OpenAI-compatible' },
                { id: 'openrouter', label: 'OpenRouter', desc: 'Any open model' },
                { id: 'atlascloud', label: 'Atlas Cloud', desc: 'Qwen 3.5' },
                { id: 'custom', label: 'Custom Endpoint', desc: 'OpenAI-compatible' },
              ].map((p) => {
                const isSelected = formData.provider === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setFormData({ ...formData, provider: p.id as any })}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{p.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Provider Keys (if not Gemini built-in) */}
          {formData.provider !== 'gemini' && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  {formData.provider === 'deepseek'
                    ? 'DeepSeek API Key'
                    : formData.provider === 'openrouter'
                    ? 'OpenRouter API Key'
                    : 'API Key'}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={formData.customApiKey || ''}
                    onChange={(e) => setFormData({ ...formData, customApiKey: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {formData.provider === 'custom' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Custom Base URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://api.example.com/v1"
                    value={formData.customBaseUrl || ''}
                    onChange={(e) => setFormData({ ...formData, customBaseUrl: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Model Slug (optional)
                </label>
                <input
                  type="text"
                  placeholder={formData.provider === 'deepseek' ? 'deepseek-chat' : 'model-slug'}
                  value={formData.model || ''}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Intermediate Language (Step 3 hop) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Intermediate Hop Language (Step 3)
              </label>
              <span className="text-[10px] text-emerald-400 font-mono">Agglutinative Restructuring</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { code: 'fi', label: 'Finnish (fi)', note: 'High morphological variance' },
                { code: 'de', label: 'German (de)', note: 'Agglutinative / inflectional' },
                { code: 'ko', label: 'Korean (ko)', note: 'Agglutinative syntax' },
                { code: 'ja', label: 'Japanese (ja)', note: 'Subject-Object-Verb' },
              ].map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => setFormData({ ...formData, intermediateLang: lang.code as any })}
                  className={`rounded-lg border p-2 text-left transition-all ${
                    formData.intermediateLang === lang.code
                      ? 'border-emerald-500 bg-emerald-950/20 text-white'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold">{lang.label}</div>
                  <div className="text-[9px] text-zinc-500 truncate">{lang.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Setting */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                LLM Rewriting Temperature
              </label>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {formData.temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>0.7 (Conservative)</span>
              <span className="text-emerald-400 font-medium">1.3 (Optimal)</span>
              <span>1.5 (High Variation)</span>
            </div>
          </div>

          {/* Optional Niutrans Key for Step 4 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Niutrans API Key (Optional, Step 4)
              </label>
              <span className="text-[10px] text-zinc-500">Auto-falls back to NMT engine if omitted</span>
            </div>
            <input
              type="password"
              placeholder="niutrans.com API key"
              value={formData.niutransApiKey || ''}
              onChange={(e) => setFormData({ ...formData, niutransApiKey: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 hover:opacity-95"
            >
              <Check className="h-4 w-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
