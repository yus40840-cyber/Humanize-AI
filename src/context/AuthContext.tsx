import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  countryCode: string;
  isPakistani: boolean;
  plan: 'free' | 'pro' | 'pakistan_lifetime';
  hasPaid: boolean;
  humanizationsUsed: number;
  humanizedWordsCount: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  joinedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  canHumanize: boolean;
  remainingFreeTries: number;
  registerUser: (data: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    username?: string;
    password?: string;
  }) => Promise<{ requiresOtp: boolean; demoOtp: string }>;
  verifyOtpAndActivate: (otp: string) => Promise<boolean>;
  loginUser: (identifier: string, password?: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  upgradeToPro: () => void;
  recordHumanization: (words: number) => void;
  logout: () => void;
  pendingRegistration: any | null;
}

const STORAGE_KEY = 'raheel_auth_user_v2';
const REGISTERED_USERS_KEY = 'raheel_registered_users_db';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [pendingRegistration, setPendingRegistration] = useState<any | null>(null);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Determine if user can humanize based on Free vs Paid logic:
  // Case A: Pakistani User (Phone starts with +92) -> Free lifetime usage, unlimited.
  // Case B: Non-Pakistani User -> Only 1 free humanization, then require payment.
  // Unauthenticated user -> 1 preview try, then requires Sign Up / Login.
  const isPakistani = user ? user.countryCode === '+92' : false;
  const hasPaid = user?.hasPaid || user?.plan === 'pro';
  const humanizationsUsed = user?.humanizationsUsed || 0;

  let canHumanize = true;
  let remainingFreeTries = 0;

  if (user) {
    if (isPakistani || hasPaid) {
      canHumanize = true;
      remainingFreeTries = 999999;
    } else {
      // Non-Pakistani without payment
      if (humanizationsUsed < 1) {
        canHumanize = true;
        remainingFreeTries = 1 - humanizationsUsed;
      } else {
        canHumanize = false;
        remainingFreeTries = 0;
      }
    }
  } else {
    // Guest user: allowed 1 preview try
    canHumanize = true;
    remainingFreeTries = 1;
  }

  const registerUser = async (data: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    username?: string;
    password?: string;
  }): Promise<{ requiresOtp: boolean; demoOtp: string }> => {
    const cleanPhone = data.phone.replace(/[^\d]/g, '');
    const isPak = data.countryCode === '+92';
    const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const pending = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      username: (data.username || data.email.split('@')[0] || 'member').trim(),
      phone: cleanPhone,
      countryCode: data.countryCode,
      isPakistani: isPak,
      plan: isPak ? 'pakistan_lifetime' : 'free',
      hasPaid: isPak, // Pakistani users have lifetime free access
      humanizationsUsed: 0,
      humanizedWordsCount: 0,
      isEmailVerified: true,
      isPhoneVerified: false,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      demoOtp,
    };

    setPendingRegistration(pending);
    return { requiresOtp: true, demoOtp };
  };

  const verifyOtpAndActivate = async (otp: string): Promise<boolean> => {
    if (!pendingRegistration) return false;
    if (otp.trim() !== pendingRegistration.demoOtp && otp.trim() !== '123456') {
      return false;
    }

    const activatedUser: UserProfile = {
      ...pendingRegistration,
      isPhoneVerified: true,
    };

    // Save to registered DB
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(activatedUser);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    setUser(activatedUser);
    setPendingRegistration(null);
    return true;
  };

  const loginUser = async (identifier: string, _password?: string): Promise<boolean> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanNum = identifier.replace(/[^\d]/g, '');

    // Check registered DB
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      const list: UserProfile[] = raw ? JSON.parse(raw) : [];
      const found = list.find(
        (u) =>
          u.email.toLowerCase() === cleanId ||
          u.username.toLowerCase() === cleanId ||
          (cleanNum && u.phone.includes(cleanNum))
      );

      if (found) {
        setUser(found);
        return true;
      }
    } catch (e) {
      console.error(e);
    }

    // Default mock login
    const isPak = cleanId.includes('+92') || cleanNum.startsWith('92');
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: cleanId.includes('@') ? cleanId.split('@')[0] : 'Member',
      email: cleanId.includes('@') ? cleanId : `${cleanId}@user.com`,
      username: cleanId.split('@')[0],
      phone: cleanNum || '3001234567',
      countryCode: isPak ? '+92' : '+1',
      isPakistani: isPak,
      plan: isPak ? 'pakistan_lifetime' : 'free',
      hasPaid: isPak,
      humanizationsUsed: 0,
      humanizedWordsCount: 0,
      isEmailVerified: true,
      isPhoneVerified: true,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setUser(newUser);
    return true;
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    const isGoogle = provider === 'google';
    const mockUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: isGoogle ? 'Google Member' : 'Facebook Member',
      email: isGoogle ? 'google.user@gmail.com' : 'fb.user@facebook.com',
      username: isGoogle ? 'google_member' : 'fb_member',
      phone: '3001234567',
      countryCode: '+92', // Default Pakistani free lifetime access
      isPakistani: true,
      plan: 'pakistan_lifetime',
      hasPaid: true,
      humanizationsUsed: 0,
      humanizedWordsCount: 0,
      isEmailVerified: true,
      isPhoneVerified: true,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setUser(mockUser);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    if (updates.countryCode) {
      updated.isPakistani = updates.countryCode === '+92';
      if (updated.isPakistani) {
        updated.plan = 'pakistan_lifetime';
        updated.hasPaid = true;
      }
    }
    setUser(updated);
  };

  const upgradeToPro = () => {
    if (!user) return;
    setUser({
      ...user,
      plan: 'pro',
      hasPaid: true,
    });
  };

  const recordHumanization = (words: number) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        humanizationsUsed: prev.humanizationsUsed + 1,
        humanizedWordsCount: prev.humanizedWordsCount + words,
      };
    });
  };

  const logout = () => {
    setUser(null);
    setPendingRegistration(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        canHumanize,
        remainingFreeTries,
        registerUser,
        verifyOtpAndActivate,
        loginUser,
        socialLogin,
        updateProfile,
        upgradeToPro,
        recordHumanization,
        logout,
        pendingRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
