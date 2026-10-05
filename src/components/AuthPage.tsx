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
  Crown,
  Globe,
  RefreshCw,
  MessageSquare,
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
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

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
  const [loginPhone, setLoginPhone] = useState('');
  const [loginCountryCode, setLoginCountryCode] = useState('+92');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // WhatsApp OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password State (Email Reset OTP)
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

  // Handle Sign Up (WhatsApp OTP)
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
      setError('A valid Phone Number is mandatory for WhatsApp OTP verification.');
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

  // Handle WhatsApp OTP Verification
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
        setSuccessMsg('Account activated and verified! Redirecting to Dashboard...');
        if (onSuccessRedirect) {
          setTimeout(onSuccessRedirect, 800);
        }
      } else {
        setError('Invalid OTP code. Please enter the 6-digit code received on WhatsApp.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendWhatsAppOtp = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setSuccessMsg(`A new WhatsApp verification code has been dispatched to ${countryCode} ${phone}`);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
          setTimeout(onSuccessRedirect, 700);
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
        // Send WhatsApp OTP for phone login
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
        if (onSuccessRedirect) {
          setTimeout(onSuccessRedirect, 700);
        }
      } else {
        setError('Could not log in with this phone number. Please check credentials or sign up.');
      }
    } catch (err: any) {
      setError(err.message || 'Phone login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Direct Sign Up
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
        phone: phone || '3001234567',
        countryCode: countryCode || '+92',
        username: username || email.split('@')[0],
        password,
      });

      // Activate immediately for email sign-up
      await verifyOtpAndActivate(res.demoOtp || '123456');
      setSuccessMsg('Account created successfully! Welcome to Raheel Humanize.');
      if (onSuccessRedirect) {
        setTimeout(onSuccessRedirect, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Step 1 (Send Email Reset OTP)
  const handleSendResetEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset OTP.');

      if (data.demoCode) {
        setForgotOtp(data.demoCode);
      }
      setForgotStep('verify');
      setSuccessMsg(`Password reset OTP has been sent to ${forgotEmail}. Please check your email inbox.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Step 2 (Verify Email OTP & Set New Password)
  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!forgotOtp.trim()) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: forgotOtp.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify reset code.');

      setSuccessMsg('Your password has been successfully reset! You can now log in.');
      setTimeout(() => {
        setMode('login');
        setForgotStep('request');
        setLoginIdentifier(forgotEmail);
        setLoginPassword('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
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
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-2xl shadow-md shadow-indigo-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase font-bold tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                  Account Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {user.name}
                </h1>
                <p className="text-xs text-slate-500">
                  Member ID: <span className="font-mono text-slate-700">{user.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={handleStartEdit}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-500 hover:border-rose-300 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Free vs Paid Logic Status Banner */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Membership Status:
                </span>
                {isPakistani ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    <span>🇵🇰</span>
                    Pakistani Member — Unlimited Lifetime Free
                  </span>
                ) : isPaid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-bold text-indigo-700">
                    <Crown className="h-3.5 w-3.5" />
                    Pro Member — Unlimited Access ($3.99/mo)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-xs font-bold text-amber-800">
                    <Globe className="h-3.5 w-3.5" />
                    International Free Trial (1 Free Humanization)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600">
                {isPakistani
                  ? 'All Pakistani phone numbers (+92) enjoy 100% free unlimited humanizations with 0.0% AI detection for life.'
                  : isPaid
                  ? 'Your account has full unlimited access to 0.0% AI text humanization with PDF & Image OCR.'
                  : `You have used ${user.humanizationsUsed} of 1 free humanization. ${
                      user.humanizationsUsed >= 1
                        ? 'Payment ($3.99/mo) is required to continue humanizing unlimited text.'
                        : 'Your next humanization is free!'
                    }`}
              </p>
            </div>

            {!isPakistani && !isPaid && (
              <button
                onClick={upgradeToPro}
                className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:opacity-95 cursor-pointer"
              >
                <Crown className="h-3.5 w-3.5" />
                Upgrade to PRO ($3.99/mo)
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Personal Information
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Full Name</span>
                <span className="font-semibold text-slate-800">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email Address (ID)</span>
                <span className="font-mono text-slate-700">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Username</span>
                <span className="font-mono text-indigo-600 font-bold">@{user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">WhatsApp / Phone</span>
                <span className="font-mono text-slate-800">
                  {user.countryCode} {user.phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">WhatsApp Verification</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified (WhatsApp OTP)
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Usage & Detection Quota
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">ZeroGPT AI Standard</span>
                <span className="font-mono font-bold text-emerald-600">0.0% AI GPT Guaranteed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Humanizations Run</span>
                <span className="font-mono font-bold text-slate-800">{user.humanizationsUsed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Words Processed</span>
                <span className="font-mono font-bold text-slate-800">{user.humanizedWordsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Member Since</span>
                <span className="font-mono text-slate-500">{user.joinedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Allowed Free Usage</span>
                <span className="font-semibold text-indigo-700">
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-opacity cursor-pointer"
          >
            <Sparkles className="h-4 w-4 fill-current" />
            Launch Raheel Humanize Text Studio
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900">Edit Profile Details</h3>
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Phone Number & Country</label>
                  <div className="flex gap-2">
                    <select
                      value={editCountryCode}
                      onChange={(e) => setEditCountryCode(e.target.value)}
                      className="w-32 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white hover:opacity-95"
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
  // OTP VERIFICATION VIEW: WHATSAPP OTP ACTIVATION
  // ----------------------------------------------------
  if (mode === 'otp') {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm">
              <MessageSquare className="h-7 w-7 text-indigo-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Verify Phone Number sent WhatsApp (OTP)
            </h2>
            <p className="text-xs text-slate-500">
              Enter the 6-digit code sent to your phone to activate your account.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block text-center">
                Enter 6-Digit WhatsApp Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="••••••"
                autoFocus
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-center text-2xl font-mono tracking-widest text-indigo-600 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Activating Account...' : 'Activate & Continue to Dashboard'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleResendWhatsAppOtp}
                disabled={resendCooldown > 0}
                className="text-xs text-indigo-600 font-bold hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
              >
                {resendCooldown > 0 ? `Resend WhatsApp code in ${resendCooldown}s` : 'Resend WhatsApp code'}
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              ← Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FORGOT PASSWORD VIEW (Email Reset OTP)
  // ----------------------------------------------------
  if (mode === 'forgot') {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Reset Password</h2>
            <p className="text-xs text-slate-500">
              {forgotStep === 'request'
                ? 'Enter your registered email address and we will send a 6-digit reset OTP to your email.'
                : `Enter the 6-digit reset code sent to ${forgotEmail} along with your new password.`}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              {successMsg}
            </div>
          )}

          {forgotStep === 'request' ? (
            <form onSubmit={handleSendResetEmailOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white hover:opacity-95 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Sending Reset OTP...' : 'Send Reset OTP to Email'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyResetOtp} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  6-Digit Email Reset OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  placeholder="Enter code from email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-center text-lg font-mono tracking-widest text-indigo-600 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white hover:opacity-95 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Resetting Password...' : 'Verify OTP & Reset Password'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep('request')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Resend code to different email
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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm">
            {mode === 'login' ? <Lock className="h-6 w-6" /> : <User className="h-6 w-6" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create New Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Access Raheel Humanize Text with 0.0% AI guarantee'
              : 'Sign up to get 0.0% AI text humanization. Pakistani users (+92) enjoy free lifetime access.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
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
            onClick={() => socialLogin('facebook')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </button>
        </div>

        {/* Professional Divider: Or with email & phone */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200/90 w-full" />
          <span className="bg-white px-3.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 select-none">
            Or with email &amp; phone
          </span>
          <div className="border-t border-slate-200/90 w-full" />
        </div>

        {/* Email vs Phone Professional Method Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-100/90 p-1 mb-2">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
              authMethod === 'email'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Continue with Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
              authMethod === 'phone'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Continue with Phone</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ---------------- LOGIN FORM ---------------- */}
        {mode === 'login' && (
          authMethod === 'email' ? (
            /* Email Login */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Email Address or Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="name@example.com or username"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotStep('request');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? 'Signing In...' : 'Sign In with Email'}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-indigo-600 hover:underline ml-1 cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* Phone Login */
            <form onSubmit={handlePhoneLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Phone Number</label>
                  {loginCountryCode === '+92' && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      🇵🇰 Free Lifetime Access
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={loginCountryCode}
                    onChange={(e) => setLoginCountryCode(e.target.value)}
                    className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="300 1234567"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {!loginWithOtp ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Account Password</label>
                    <button
                      type="button"
                      onClick={() => setLoginWithOtp(true)}
                      className="text-[11px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Login via WhatsApp OTP instead
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-900 flex items-center justify-between">
                  <span>We'll send an instant 6-digit WhatsApp OTP to your phone.</span>
                  <button
                    type="button"
                    onClick={() => setLoginWithOtp(false)}
                    className="text-[11px] font-bold text-indigo-700 underline"
                  >
                    Use Password
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading
                  ? 'Verifying...'
                  : loginWithOtp
                  ? 'Send WhatsApp OTP'
                  : 'Sign In with Phone'}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-indigo-600 hover:underline ml-1 cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          )
        )}

        {/* ---------------- SIGN UP FORM ---------------- */}
        {mode === 'signup' && (
          authMethod === 'email' ? (
            /* Email Sign Up */
            <form onSubmit={handleEmailSignUpSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ali Khan"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTermsEmail"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 cursor-pointer"
                  required
                />
                <label htmlFor="agreeTermsEmail" className="text-xs text-slate-600 leading-snug cursor-pointer">
                  I agree to the <span className="text-indigo-600 underline font-semibold">Terms &amp; Conditions</span> and Privacy Policy.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !agreeTerms}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? 'Creating Account...' : 'Create Account with Email'}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-indigo-600 hover:underline ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          ) : (
            /* Phone Sign Up */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ali Khan"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com (optional)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">
                    Phone Number (WhatsApp OTP) <span className="text-rose-500">*</span>
                  </label>
                  {countryCode === '+92' && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      🇵🇰 Free Lifetime Access
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTermsPhone"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 cursor-pointer"
                  required
                />
                <label htmlFor="agreeTermsPhone" className="text-xs text-slate-600 leading-snug cursor-pointer">
                  I agree to the <span className="text-indigo-600 underline font-semibold">Terms &amp; Conditions</span> and Privacy Policy.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !agreeTerms}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? 'Sending WhatsApp OTP...' : 'Send WhatsApp OTP & Register'}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-indigo-600 hover:underline ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
};
