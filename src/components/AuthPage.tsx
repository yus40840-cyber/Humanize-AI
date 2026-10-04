import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Edit3,
  Sparkles,
  KeyRound,
  ExternalLink,
  Crown,
  Globe,
  RefreshCw,
} from 'lucide-react';

interface AuthPageProps {
  onSuccessRedirect?: () => void;
}

const COUNTRY_CODES = [
  { code: '+92', country: 'Pakistan', flag: '🇵🇰', freeLifetime: true },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸', freeLifetime: false },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', freeLifetime: false },
  { code: '+91', country: 'India', flag: '🇮🇳', freeLifetime: false },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪', freeLifetime: false },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', freeLifetime: false },
  { code: '+49', country: 'Germany', flag: '🇩🇪', freeLifetime: false },
  { code: '+33', country: 'France', flag: '🇫🇷', freeLifetime: false },
  { code: '+86', country: 'China', flag: '🇨🇳', freeLifetime: false },
  { code: '+81', country: 'Japan', flag: '🇯🇵', freeLifetime: false },
  { code: '+61', country: 'Australia', flag: '🇦🇺', freeLifetime: false },
  { code: '+90', country: 'Turkey', flag: '🇹🇷', freeLifetime: false },
];

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccessRedirect }) => {
  const {
    user,
    isAuthenticated,
    registerUser,
    verifyOtpAndActivate,
    loginUser,
    socialLogin,
    updateProfile,
    upgradeToPro,
    logout,
    pendingRegistration,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot'>('login');

  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountryCode, setEditCountryCode] = useState('+92');

  // UI status
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid Email Address is required.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 6) {
      setError('A valid Phone Number is mandatory for OTP verification.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions to create an account.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({
        name: fullName,
        email,
        phone,
        countryCode,
        username: username || email.split('@')[0],
        password,
      });

      setDemoCode(res.demoOtp);
      setOtpCode(res.demoOtp); // Auto-fill for seamless verification
      setEmailVerificationSent(true);
      setMode('otp');
      setSuccessMsg(`An SMS OTP code has been sent to ${countryCode} ${phone}, and a verification link was sent to ${email}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await verifyOtpAndActivate(otpCode);
      if (ok) {
        setSuccessMsg('Account activated and verified! Redirecting to your Dashboard...');
        if (onSuccessRedirect) {
          setTimeout(onSuccessRedirect, 900);
        }
      } else {
        setError('Invalid OTP code. Please enter the code sent to your mobile.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim()) {
      setError('Please enter your Email or Username.');
      return;
    }
    if (!loginPassword.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await loginUser(loginIdentifier, loginPassword);
      if (ok) {
        setSuccessMsg('Login successful! Welcome back.');
        if (onSuccessRedirect) {
          setTimeout(onSuccessRedirect, 800);
        }
      } else {
        setError('Invalid login credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
      setSuccessMsg(`Password reset instructions sent to ${forgotEmail}`);
    }, 600);
  };

  // Start Edit Profile
  const handleStartEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditUsername(user.username);
    setEditPhone(user.phone);
    setEditCountryCode(user.countryCode);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile({
      name: editName.trim(),
      username: editUsername.trim() || user?.username,
      phone: editPhone.trim() || user?.phone,
      countryCode: editCountryCode,
    });
    setIsEditingProfile(false);
    setSuccessMsg('Profile updated successfully!');
  };

  // ----------------------------------------------------
  // 3. DASHBOARD / PROFILE VIEW (When logged in)
  // ----------------------------------------------------
  if (isAuthenticated && user) {
    const isPakistani = user.countryCode === '+92' || user.isPakistani;
    const isPaid = user.hasPaid || user.plan === 'pro';

    return (
      <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-2xl shadow-lg shadow-emerald-500/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                  Account Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome, {user.name}
                </h1>
                <p className="text-xs text-zinc-400">
                  Member ID: <span className="font-mono text-zinc-300">{user.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={handleStartEdit}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-emerald-400" />
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:border-rose-500/40 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Free vs Paid Logic Status Banner */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Membership Status:
                </span>
                {isPakistani ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400">
                    <span>🇵🇰</span>
                    Pakistani Member — Unlimited Lifetime Free
                  </span>
                ) : isPaid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400">
                    <Crown className="h-3.5 w-3.5" />
                    Pro Member — Unlimited Access
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-400">
                    <Globe className="h-3.5 w-3.5" />
                    International Free Trial (1 Free Humanization)
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-400">
                {isPakistani
                  ? 'All Pakistani phone numbers (+92) enjoy 100% free unlimited humanizations with 0.0% AI detection for life.'
                  : isPaid
                  ? 'Your account has full unlimited access to 0.0% AI text humanization with PDF & Image OCR.'
                  : `You have used ${user.humanizationsUsed} of 1 free humanization. ${
                      user.humanizationsUsed >= 1
                        ? 'Payment is required to continue humanizing unlimited text.'
                        : 'Your next humanization is free!'
                    }`}
              </p>
            </div>

            {!isPakistani && !isPaid && (
              <button
                onClick={upgradeToPro}
                className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-md shadow-emerald-500/20 hover:opacity-95 cursor-pointer"
              >
                <Crown className="h-3.5 w-3.5" />
                Upgrade to Unlimited Pro
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pb-2 border-b border-zinc-800">
              Personal Information
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Full Name</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Email Address (ID)</span>
                <span className="font-mono text-zinc-300">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Username</span>
                <span className="font-mono text-emerald-400">@{user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Phone Number</span>
                <span className="font-mono text-white">
                  {user.countryCode} {user.phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Phone Verification</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified (OTP)
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pb-2 border-b border-zinc-800">
              Usage & Detection Quota
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">ZeroGPT AI Standard</span>
                <span className="font-mono font-bold text-emerald-400">0.0% AI GPT Guaranteed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Humanizations Run</span>
                <span className="font-mono font-bold text-white">{user.humanizationsUsed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Total Words Processed</span>
                <span className="font-mono font-bold text-white">{user.humanizedWordsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Member Since</span>
                <span className="font-mono text-zinc-400">{user.joinedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Allowed Free Usage</span>
                <span className="font-semibold text-emerald-400">
                  {isPakistani ? 'Unlimited Free' : isPaid ? 'Unlimited Pro' : '1 Free Run'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch CTA */}
        <div className="pt-2">
          <button
            onClick={onSuccessRedirect}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-opacity cursor-pointer"
          >
            <Sparkles className="h-4 w-4 fill-current" />
            Launch Raheel Humanize Text Studio
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Edit Profile Details</h3>
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Phone Number & Country</label>
                  <div className="flex gap-2">
                    <select
                      value={editCountryCode}
                      onChange={(e) => setEditCountryCode(e.target.value)}
                      className="w-32 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // OTP VERIFICATION VIEW (Mandatory phone activation)
  // ----------------------------------------------------
  if (mode === 'otp') {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Smartphone className="h-7 w-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Verify Phone Number (OTP)
            </h2>
            <p className="text-xs text-zinc-400">
              Enter the 6-digit code sent to your phone to activate your account.
            </p>
          </div>

          {emailVerificationSent && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-start gap-2">
              <Mail className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>Email Verification link sent:</strong> We have sent a confirmation email to your address for extra security.
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 px-4 text-center text-xl font-mono tracking-widest text-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
              {demoCode && (
                <div className="rounded-lg bg-zinc-950 border border-emerald-500/20 p-2 text-[11px] text-emerald-400 flex items-center justify-between">
                  <span>Demo SMS Code: <strong>{demoCode}</strong></span>
                  <span className="text-[10px] text-zinc-400">Auto-filled</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Activating Account...' : 'Activate & Continue to Dashboard'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FORGOT PASSWORD VIEW
  // ----------------------------------------------------
  if (mode === 'forgot') {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Reset Password</h2>
            <p className="text-xs text-zinc-400">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {forgotSent ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-300 space-y-3 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-400" />
              <p>Reset link sent! Please check your inbox.</p>
              <button
                onClick={() => setMode('login')}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-bold text-zinc-950 hover:opacity-95 cursor-pointer"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 1 & 2. SIGN UP / LOGIN FORM VIEW
  // ----------------------------------------------------
  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
            {mode === 'login' ? <Lock className="h-6 w-6" /> : <User className="h-6 w-6" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create New Account'}
          </h2>
          <p className="text-xs text-zinc-400">
            {mode === 'login'
              ? 'Access Raheel Humanize Text with 0.0% AI guarantee'
              : 'Sign up to get 0.0% AI text humanization. Pakistani users (+92) enjoy free lifetime access.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-zinc-800 bg-zinc-950 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Social Auth Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => socialLogin('google')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => socialLogin('facebook')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-zinc-900 px-3 text-[11px] uppercase tracking-wider text-zinc-500">
            Or with email & phone
          </span>
          <div className="border-t border-zinc-800 w-full" />
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ---------------- LOGIN FORM ---------------- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="name@example.com or username"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-zinc-400 cursor-pointer">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Account'}
            </button>

            <div className="text-center pt-2 text-xs text-zinc-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-emerald-400 hover:underline ml-1"
              >
                Create one now
              </button>
            </div>
          </form>
        )}

        {/* ---------------- SIGN UP FORM ---------------- */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ali Khan"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">
                Email Address (Your ID) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Number (Mandatory) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Phone Number (OTP Verification) <span className="text-rose-400">*</span>
                </label>
                {countryCode === '+92' && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    🇵🇰 Free Lifetime Access
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-32 rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-2.5 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="300 1234567"
                    required
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Optional Username */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 block">
                Username (Optional)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ali_writer"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 chars"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Agree to Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 accent-emerald-500 cursor-pointer"
                required
              />
              <label htmlFor="agreeTerms" className="text-xs text-zinc-400 leading-snug cursor-pointer">
                I agree to the <span className="text-emerald-400 underline">Terms & Conditions</span> and Privacy Policy.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Sending Phone OTP...' : 'Send OTP & Create Account'}
            </button>

            <div className="text-center pt-2 text-xs text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-400 hover:underline ml-1"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
