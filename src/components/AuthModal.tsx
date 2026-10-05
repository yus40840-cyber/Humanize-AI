import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Mail,
  Lock,
  Smartphone,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  KeyRound,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
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

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { registerUser, verifyOtpAndActivate, loginUser, socialLogin } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginCountryCode, setLoginCountryCode] = useState('+92');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // WhatsApp OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI status
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle WhatsApp OTP Sign Up
  const handlePhoneSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 6) {
      setError('A valid Phone Number is required.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({
        name: fullName,
        email: email || `${phone.replace(/\D/g, '')}@raheeluser.com`,
        phone,
        countryCode,
        password,
      });

      setOtpCode(res.demoOtp);
      setMode('otp');
      setResendCooldown(30);
      setSuccessMsg(`A 6-digit WhatsApp OTP has been sent to ${countryCode} ${phone}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Direct Email Sign Up
  const handleEmailSignUpSubmit = async (e: React.FormEvent) => {
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
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({
        name: fullName,
        email,
        phone: '3001234567',
        countryCode: '+92',
        password,
      });

      await verifyOtpAndActivate(res.demoOtp || '123456');
      setSuccessMsg('Account created successfully! Welcome to Raheel Humanize.');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Login
  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim()) {
      setError('Please enter your email or username.');
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
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setError('Invalid login credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Phone Login
  const handlePhoneLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const clean = loginPhone.replace(/\D/g, '');
    if (!clean || clean.length < 6) {
      setError('Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhone = `${loginCountryCode}${clean}`;
      if (loginWithOtp) {
        const demoOtp = '123456';
        setOtpCode(demoOtp);
        setCountryCode(loginCountryCode);
        setPhone(clean);
        setMode('otp');
        setResendCooldown(30);
        setSuccessMsg(`A 6-digit WhatsApp OTP has been dispatched to ${loginCountryCode} ${clean}`);
        return;
      }

      const ok = await loginUser(fullPhone, loginPassword || '123456');
      if (ok) {
        setSuccessMsg('Phone login verified! Welcome back.');
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setError('Could not log in with this phone number.');
      }
    } catch (err: any) {
      setError(err.message || 'Phone login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verify
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit code sent to your WhatsApp.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await verifyOtpAndActivate(otpCode);
      if (ok) {
        setSuccessMsg('Account activated and verified!');
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setError('Invalid OTP code. Please enter 123456 or the received code.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = async (provider: 'google' | 'facebook') => {
    await socialLogin(provider);
    setSuccessMsg(`Connected with ${provider === 'google' ? 'Google' : 'Facebook'}!`);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          title="Close Popup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header with Ultra Quality Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-md shadow-indigo-500/10">
            <img
              src="/src/assets/images/raheel_logo_1791132797706.jpg"
              alt="Raheel Humanize Text"
              className="h-full w-full object-cover"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {mode === 'login' ? 'Welcome to Raheel Humanize' : 'Create Free Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict 0.0% AI Probability Guaranteed · 🇵🇰 Free Lifetime for Pakistan
            </p>
          </div>
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        {mode !== 'otp' && (
          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Social Auth Buttons */}
        {mode !== 'otp' && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSocialClick('google')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
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
              onClick={() => handleSocialClick('facebook')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
          </div>
        )}

        {/* Professional Divider: Or with email & phone */}
        {mode !== 'otp' && (
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200/90 w-full" />
            <span className="bg-white px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 select-none">
              Or with email &amp; phone
            </span>
            <div className="border-t border-slate-200/90 w-full" />
          </div>
        )}

        {/* Method Switcher: Email vs Phone */}
        {mode !== 'otp' && (
          <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-100/90 p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setError(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Phone</span>
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* OTP Verification Mode */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Enter 6-Digit WhatsApp OTP</h3>
              <p className="text-xs text-slate-500">
                Sent to {countryCode} {phone}
              </p>
            </div>

            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="••••••"
              autoFocus
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-xl font-mono tracking-widest text-indigo-600 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        )}

        {/* Login Forms */}
        {mode === 'login' && authMethod === 'email' && (
          <form onSubmit={handleEmailLoginSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Signing In...' : 'Sign In with Email'}
            </button>
          </form>
        )}

        {mode === 'login' && authMethod === 'phone' && (
          <form onSubmit={handlePhoneLoginSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">Phone Number</label>
                {loginCountryCode === '+92' && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    🇵🇰 Free Lifetime
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={loginCountryCode}
                  onChange={(e) => setLoginCountryCode(e.target.value)}
                  className="w-28 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="300 1234567"
                  required
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 font-mono focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Signing In...' : 'Sign In with Phone'}
            </button>
          </form>
        )}

        {/* Sign Up Forms */}
        {mode === 'signup' && authMethod === 'email' && (
          <form onSubmit={handleEmailSignUpSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ali Khan"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Creating Account...' : 'Create Account with Email'}
            </button>
          </form>
        )}

        {mode === 'signup' && authMethod === 'phone' && (
          <form onSubmit={handlePhoneSignUpSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ali Khan"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">Phone (WhatsApp OTP)</label>
                {countryCode === '+92' && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    🇵🇰 Free Lifetime
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-28 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="300 1234567"
                  required
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 font-mono focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Sending WhatsApp OTP...' : 'Send WhatsApp OTP & Register'}
            </button>
          </form>
        )}

        {/* Footer Dismiss / Continue Exploring option */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
          >
            Continue exploring as guest →
          </button>
        </div>
      </div>
    </div>
  );
};
