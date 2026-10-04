import React from 'react';
import { ShieldCheck, PenTool, User, Smartphone, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'pipeline' | 'detector' | 'auth';
  setActiveTab: (tab: 'pipeline' | 'detector' | 'auth') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { user, isAuthenticated } = useAuth();
  const isPakistani = user ? user.countryCode === '+92' || user.isPakistani : false;
  const isPaid = user?.hasPaid || user?.plan === 'pro';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Zone */}
        <div
          onClick={() => setActiveTab('pipeline')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-500/30 bg-zinc-900 shadow-md shadow-emerald-500/10">
            <img
              src="/src/assets/images/raheel_logo_1791132797706.jpg"
              alt="Raheel Humanize Text Logo"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Raheel <span className="text-emerald-400">Humanize Text</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/70 p-1">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            Humanize Text
          </button>

          <button
            onClick={() => setActiveTab('detector')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'detector'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            AI Detector
          </button>
        </nav>

        {/* Auth / Account Zone */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <button
              onClick={() => setActiveTab('auth')}
              className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'auth'
                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:border-zinc-700 hover:text-white'
              }`}
              title="View Account Dashboard"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-white leading-tight">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-emerald-400 leading-tight">
                  {isPakistani ? '🇵🇰 Lifetime Free' : isPaid ? 'Pro Member' : 'Free Trial'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'auth'
                  ? 'border-emerald-500 bg-emerald-500 text-zinc-950 shadow-sm shadow-emerald-500/20'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200'
              }`}
              title="Sign In or Register with Phone Number"
            >
              <User className="h-3.5 w-3.5" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
