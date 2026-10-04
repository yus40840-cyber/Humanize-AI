/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PipelinePlayground } from './components/PipelinePlayground';
import { DetectorTab } from './components/DetectorTab';
import { AuthPage } from './components/AuthPage';
import { AuthProvider } from './context/AuthContext';
import { HumanizerConfig } from './types/humanizer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'detector' | 'auth'>('pipeline');

  const [config] = useState<HumanizerConfig>({
    provider: 'gemini',
    temperature: 1.35,
    intermediateLang: 'fi',
    targetLang: 'en',
  });

  return (
    <AuthProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6">
          {activeTab === 'pipeline' && (
            <PipelinePlayground
              config={config}
              onNavigateToAuth={() => setActiveTab('auth')}
            />
          )}

          {activeTab === 'detector' && <DetectorTab />}

          {activeTab === 'auth' && (
            <AuthPage onSuccessRedirect={() => setActiveTab('pipeline')} />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-xs text-zinc-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 overflow-hidden rounded-md border border-emerald-500/30">
                <img
                  src="/src/assets/images/raheel_logo_1791132797706.jpg"
                  alt="Raheel Humanize Text"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-semibold text-zinc-300">Raheel Humanize Text</span>
              <span>·</span>
              <span>0.0% AI Probability Guaranteed</span>
            </div>
            <span className="text-zinc-500">Undetectable AI Text Humanizer & Detector</span>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
