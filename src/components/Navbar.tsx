import React from 'react';
import { User, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 'pipeline' | 'detector' | 'image-detector' | 'youtube' | 'translator' | 'auth';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenToolsCenter?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated } = useAuth();
  const isPakistani = user ? user.countryCode === '+92' || user.isPakistani : false;
  const isPaid = user?.hasPaid || user?.plan === 'pro';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Zone */}
        <div
          onClick={() => setActiveTab('pipeline')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-sm shadow-indigo-500/10">
            <img
              src="/src/assets/images/raheel_logo_1791132797706.jpg"
              alt="Raheel Humanize Text Logo"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              Raheel{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Humanize Text
              </span>
            </span>
          </div>
        </div>

        {/* Auth / Account Zone (Clean Top Bar) */}
        <div className="flex items-center gap-3">
          {isPakistani ? (
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              <span>🇵🇰</span>
              <span>Pakistan Lifetime Free</span>
            </div>
          ) : isPaid ? (
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              <Crown className="h-3.5 w-3.5 text-amber-600" />
              <span>Pro Active</span>
            </div>
          ) : null}

          {isAuthenticated && user ? (
            <button
              onClick={() => setActiveTab('auth')}
              className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'auth'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
              title="View Account Dashboard"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-xs font-extrabold shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 leading-tight">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold leading-tight">
                  {isPakistani ? '🇵🇰 Lifetime Free' : isPaid ? 'Pro Member' : 'Free Trial'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-500/25 hover:opacity-95 transition-opacity cursor-pointer"
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
