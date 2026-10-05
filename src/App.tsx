/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar, NavTab } from './components/Navbar';
import { LearningJourneyHeader } from './components/LearningJourneyHeader';
import { ToolsCenterModal } from './components/ToolsCenterModal';
import { ApiConsoleModal } from './components/ApiConsoleModal';
import { PluginsModal } from './components/PluginsModal';
import { UpgradeModal } from './components/UpgradeModal';
import { AuthModal } from './components/AuthModal';
import { PipelinePlayground } from './components/PipelinePlayground';
import { DetectorTab } from './components/DetectorTab';
import { ImageDetectorTab } from './components/ImageDetectorTab';
import { YouTubeSummarizerTab } from './components/YouTubeSummarizerTab';
import { DocTranslatorTab } from './components/DocTranslatorTab';
import { AuthPage } from './components/AuthPage';
import { AuthProvider } from './context/AuthContext';
import { HumanizerConfig } from './types/humanizer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('pipeline');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isToolsCenterOpen, setIsToolsCenterOpen] = useState(false);
  const [isApiConsoleOpen, setIsApiConsoleOpen] = useState(false);
  const [isPluginsOpen, setIsPluginsOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [humanizerInputText, setHumanizerInputText] = useState<string>('');

  const [config] = useState<HumanizerConfig>({
    provider: 'gemini',
    temperature: 1.35,
    intermediateLang: 'fi',
    targetLang: 'en',
    tone: 'natural',
    readability: 'normal',
    purpose: 'general',
    humanizationMode: 'simple',
  });

  // Automatic popup for Login / Sign Up when any user visits or uses the website
  useEffect(() => {
    try {
      const hasSeenAutoPopup = sessionStorage.getItem('raheel_auto_auth_popup_seen');
      const savedUser = localStorage.getItem('raheel_auth_user_v2');

      if (!hasSeenAutoPopup && !savedUser) {
        const timer = setTimeout(() => {
          const currentUser = localStorage.getItem('raheel_auth_user_v2');
          if (!currentUser) {
            setIsAuthModalOpen(true);
            sessionStorage.setItem('raheel_auto_auth_popup_seen', 'true');
          }
        }, 2500); // 2.5 second delay after load, like modern SaaS sites
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSendToHumanizer = (text: string) => {
    setHumanizerInputText(text);
    setActiveTab('pipeline');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans selection:bg-indigo-500/20 selection:text-indigo-700">
        {/* Fixed Collapsible Sidebar Navigation */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenToolsCenter={() => setIsToolsCenterOpen(true)}
          onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          onOpenApiConsole={() => setIsApiConsoleOpen(true)}
          onOpenPlugins={() => setIsPluginsOpen(true)}
        />

        {/* Main Content Area (Dynamically adjusts margin for Sidebar) */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
        >
          {/* Top Header */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenToolsCenter={() => setIsToolsCenterOpen(true)}
          />

          <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-8">
            {/* Top Learning Journey Header with 3 Featured Action Cards on Home */}
            {activeTab === 'pipeline' && (
              <LearningJourneyHeader
                onSelectTab={setActiveTab}
                onOpenToolsCenter={() => setIsToolsCenterOpen(true)}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelinePlayground
                config={config}
                initialText={humanizerInputText}
                onNavigateToAuth={() => setIsAuthModalOpen(true)}
                onTriggerAuthPopup={() => setIsAuthModalOpen(true)}
              />
            )}

            {activeTab === 'detector' && <DetectorTab />}

            {activeTab === 'image-detector' && <ImageDetectorTab />}

            {activeTab === 'youtube' && (
              <YouTubeSummarizerTab onSendToHumanizer={handleSendToHumanizer} />
            )}

            {activeTab === 'translator' && (
              <DocTranslatorTab onSendToHumanizer={handleSendToHumanizer} />
            )}

            {activeTab === 'auth' && (
              <AuthPage onSuccessRedirect={() => setActiveTab('pipeline')} />
            )}
          </main>

          {/* Footer in modern clean light-mode SaaS style */}
          <footer className="border-t border-slate-200/90 bg-white py-6 text-xs text-slate-500">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 overflow-hidden rounded-md border border-indigo-200 shadow-2xs">
                  <img
                    src="/src/assets/images/raheel_logo_1791132797706.jpg"
                    alt="Raheel Humanize Text"
                    className="h-full w-full object-cover"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-bold text-slate-800">Raheel Humanize</span>
                <span>·</span>
                <span className="text-indigo-600 font-semibold">Strict 0.0% AI Probability Guaranteed</span>
              </div>
              <span className="text-slate-400">Undetectable AI Text Humanizer & Forensic Detector</span>
            </div>
          </footer>
        </div>

        {/* Automatic and Manual Login / Sign Up Popup Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />

        {/* Categorized Tools Center Hub Modal */}
        <ToolsCenterModal
          isOpen={isToolsCenterOpen}
          onClose={() => setIsToolsCenterOpen(false)}
          onSelectTab={setActiveTab}
          onSendToHumanizer={handleSendToHumanizer}
        />

        {/* API Console Modal */}
        <ApiConsoleModal
          isOpen={isApiConsoleOpen}
          onClose={() => setIsApiConsoleOpen(false)}
        />

        {/* Plugins & Extensions Modal */}
        <PluginsModal
          isOpen={isPluginsOpen}
          onClose={() => setIsPluginsOpen(false)}
        />

        {/* Upgrade Pro Modal */}
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}
