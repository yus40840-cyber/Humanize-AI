import React, { useState } from 'react';
import { X, Puzzle, Chrome, FileText, CheckCircle2, Download, ExternalLink, Sparkles } from 'lucide-react';

interface PluginsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PluginsModal: React.FC<PluginsModalProps> = ({ isOpen, onClose }) => {
  const [installedPlugins, setInstalledPlugins] = useState<Record<string, boolean>>({
    chrome: true,
  });

  if (!isOpen) return null;

  const plugins = [
    {
      id: 'chrome',
      name: 'Chrome Extension',
      desc: 'Humanize text directly in ChatGPT, Gmail, Claude, and any webpage with 1-click.',
      icon: Chrome,
      color: 'text-amber-500 bg-amber-50',
      badge: 'v2.4 Live',
    },
    {
      id: 'gdocs',
      name: 'Google Docs Add-on',
      desc: 'Rewrite selected paragraphs and check AI detection scores without leaving Google Docs.',
      icon: FileText,
      color: 'text-blue-500 bg-blue-50',
      badge: 'Popular',
    },
    {
      id: 'word',
      name: 'Microsoft Word Plugin',
      desc: 'Integrated sidebar assistant for Microsoft Office 365 and desktop Word.',
      icon: FileText,
      color: 'text-indigo-500 bg-indigo-50',
      badge: 'Enterprise',
    },
    {
      id: 'desktop',
      name: 'Desktop Widget (Mac & Win)',
      desc: 'Global hotkey (Cmd/Ctrl + Shift + H) to immediately humanize clipboard text.',
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-50',
      badge: 'Fast',
    },
  ];

  const toggleInstall = (id: string) => {
    setInstalledPlugins((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-0.5 text-xs font-bold text-purple-700">
            <Puzzle className="h-3.5 w-3.5" />
            <span>Extensions & Integrations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Raheel Humanize Plugins
          </h2>
          <p className="text-xs text-slate-500">
            Access 0.0% AI text humanization anywhere you type: in your browser, Google Docs, Word, or desktop apps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plugins.map((plugin) => {
            const isInstalled = !!installedPlugins[plugin.id];
            const Icon = plugin.icon;
            return (
              <div
                key={plugin.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs hover:border-indigo-300 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${plugin.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {plugin.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{plugin.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{plugin.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleInstall(plugin.id)}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                    isInstalled
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs hover:opacity-95'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Installed & Active
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      Add to {plugin.name.split(' ')[0]}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
