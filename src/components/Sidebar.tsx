import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  Sparkles,
  ShieldCheck,
  ImageIcon,
  Youtube,
  FileText,
  BookOpen,
  Languages,
  Grid,
  Crown,
  Terminal,
  Puzzle,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenToolsCenter: () => void;
  onOpenUpgradeModal: () => void;
  onOpenApiConsole: () => void;
  onOpenPlugins: () => void;
  onOpenSubTool?: (tool: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeTab,
  onSelectTab,
  onOpenToolsCenter,
  onOpenUpgradeModal,
  onOpenApiConsole,
  onOpenPlugins,
  onOpenSubTool,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const isPakistani = user ? user.countryCode === '+92' || user.isPakistani : false;
  const isPaid = user?.hasPaid || user?.plan === 'pro';

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen border-r border-slate-200/90 bg-white shadow-xs transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Branding & Collapse Button */}
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onSelectTab('pipeline')}
            className={`flex items-center gap-3 cursor-pointer overflow-hidden ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-sm shadow-indigo-500/10">
              <img
                src="/src/assets/images/raheel_logo_1791132797706.jpg"
                alt="Raheel Humanize Logo"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-extrabold tracking-tight text-slate-900 truncate">
                  Raheel Humanize
                </span>
                <span className="text-[11px] font-bold text-indigo-600 truncate">
                  Raheel Humanize
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              title="Collapse Panel"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Collapsed Toggle Button */}
        {isCollapsed && (
          <div className="mt-2 flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              title="Expand Panel"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {/* Home */}
        <div>
          <button
            onClick={() => onSelectTab('pipeline')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Home"
          >
            <Home className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </button>
        </div>

        {/* Section 1: AI HUMANIZE & DETECT */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              AI HUMANIZE & DETECT
            </span>
          )}

          {/* AI Humanizer */}
          <button
            onClick={() => onSelectTab('pipeline')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="AI Humanizer"
          >
            <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
            {!isCollapsed && <span>AI Humanizer</span>}
          </button>

          {/* AI Detector */}
          <button
            onClick={() => onSelectTab('detector')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'detector'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="AI Detector"
          >
            <ShieldCheck className="h-4 w-4 text-rose-500 shrink-0" />
            {!isCollapsed && <span>AI Detector</span>}
          </button>

          {/* AI Image Detector */}
          <button
            onClick={() => onSelectTab('image-detector')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'image-detector'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="AI Image Detector"
          >
            <ImageIcon className="h-4 w-4 text-purple-600 shrink-0" />
            {!isCollapsed && <span>AI Image Detector</span>}
          </button>
        </div>

        {/* Section 2: AI LEARNING */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              AI LEARNING
            </span>
          )}

          {/* YouTube Transcript */}
          <button
            onClick={() => onOpenToolsCenter()}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="YouTube Transcript"
          >
            <FileText className="h-4 w-4 text-red-500 shrink-0" />
            {!isCollapsed && <span>YouTube Transcript</span>}
          </button>

          {/* YouTube Summarizer */}
          <button
            onClick={() => onSelectTab('youtube')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="YouTube Summarizer"
          >
            <Youtube className="h-4 w-4 text-red-500 shrink-0" />
            {!isCollapsed && <span>YouTube Summarizer</span>}
          </button>

          {/* AI Notes Generator */}
          <button
            onClick={() => onOpenToolsCenter()}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="AI Notes Generator"
          >
            <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />
            {!isCollapsed && <span>AI Notes Generator</span>}
          </button>

          {/* Doc Translate */}
          <button
            onClick={() => onSelectTab('translator')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'translator'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Doc Translate"
          >
            <Languages className="h-4 w-4 text-blue-600 shrink-0" />
            {!isCollapsed && <span>Doc Translate</span>}
          </button>
        </div>

        {/* Browse All Tools */}
        <div className="pt-2">
          <button
            onClick={onOpenToolsCenter}
            className={`w-full flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer shadow-2xs ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Browse All Tools"
          >
            <Grid className="h-4 w-4 text-indigo-600 shrink-0" />
            {!isCollapsed && <span>Browse All Tools</span>}
          </button>
        </div>
      </div>

      {/* Bottom Footer Section: Upgrade to Pro, API Console, Plugins, Sign In / Register */}
      <div className="border-t border-slate-100 p-3 space-y-1 bg-slate-50/50">
        {/* Upgrade to Pro */}
        <button
          onClick={onOpenUpgradeModal}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Upgrade to Pro"
        >
          <Crown className="h-4 w-4 text-amber-600 shrink-0" />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Upgrade to Pro</span>
              <span className="rounded-full bg-amber-200/80 px-1.5 py-0.2 text-[9px] font-black text-amber-900">
                PRO
              </span>
            </div>
          )}
        </button>

        {/* API Console */}
        <button
          onClick={onOpenApiConsole}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="API Console"
        >
          <Terminal className="h-4 w-4 text-slate-600 shrink-0" />
          {!isCollapsed && <span>API Console</span>}
        </button>

        {/* Plugins */}
        <button
          onClick={onOpenPlugins}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Plugins"
        >
          <Puzzle className="h-4 w-4 text-purple-600 shrink-0" />
          {!isCollapsed && <span>Plugins</span>}
        </button>

        {/* Sign In / Register (or User Profile) */}
        {isAuthenticated && user ? (
          <button
            onClick={() => onSelectTab('auth')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'auth'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title={`Account: ${user.name}`}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left truncate">
                <span className="font-bold text-slate-800 truncate">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-indigo-600">
                  {isPakistani ? '🇵🇰 Lifetime Free' : isPaid ? 'Pro Member' : 'Free Trial'}
                </span>
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={() => onSelectTab('auth')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Sign In / Register"
          >
            <User className="h-4 w-4 text-indigo-600 shrink-0" />
            {!isCollapsed && <span>Sign In / Register</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
