import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Phone, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onNavigate: (tab: string) => void;
  initialTab?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, initialTab = 'login' }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email or username');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password');
      return;
    }

    try {
      const { isAdmin } = login(loginEmail, loginPassword);
      if (isAdmin) {
        onNavigate('admin');
      } else {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setLoginError('Invalid credentials. Please check your details.');
    }
  };

  const handleAdminQuickLogin = () => {
    setLoginEmail('admin@fabricprint.in');
    setLoginPassword('admin123');
    const { isAdmin } = login('admin@fabricprint.in', 'admin123');
    if (isAdmin) {
      onNavigate('admin');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please enter your full name');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('Please enter a valid phone number');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Please enter a valid email address');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long');
      return;
    }

    try {
      register(regName, regPhone, regEmail, regPassword);
      onNavigate('home');
    } catch (err: any) {
      setRegError('Registration failed. Please try again.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSuccess(true);
    }
  };

  return (
    <div className="bg-slate-900 min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-extrabold text-2xl shadow-xl shadow-amber-500/10">
            FP
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Fabric Print Portal
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Manage your custom fabric orders, artwork designs, and bulk textile quotes
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

          {/* TWO TABS NAVIGATION */}
          <div className="flex bg-slate-900 rounded-2xl p-1 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setShowForgotPassword(false);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setShowForgotPassword(false);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && !showForgotPassword && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1.5">
                  Email / Username *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. aditi.design@example.com or admin@fabricprint.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 text-xs font-bold">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl transition shadow-lg shadow-amber-500/20 text-xs flex items-center justify-center space-x-2 mt-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Admin Quick Login Shortcut */}
              <div className="pt-4 border-t border-slate-900 text-center">
                <button
                  type="button"
                  onClick={handleAdminQuickLogin}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 px-3.5 py-2 rounded-xl text-[11px] font-bold transition inline-flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Login as Admin Demo</span>
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD SUB-VIEW */}
          {activeTab === 'login' && showForgotPassword && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm">Reset Your Password</h3>
              <p className="text-xs text-slate-400">
                Enter your registered email address and we will send you password reset instructions.
              </p>

              {forgotSuccess ? (
                <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Reset Email Sent!</span>
                  </div>
                  <p>Check your inbox for <strong>{forgotEmail}</strong>. Follow the link to set a new password.</p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotSuccess(false);
                    }}
                    className="text-amber-400 underline font-bold mt-2 block"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">Your Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aditi.design@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-slate-400 text-xs font-bold hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1.5">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1.5">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 90000 11223"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl transition shadow-lg shadow-amber-500/20 text-xs flex items-center justify-center space-x-2 mt-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

        {/* Security Note */}
        <p className="text-center text-[11px] text-slate-500">
          🔒 Protected by 256-bit SSL Encryption. Your fabric print designs remain 100% confidential.
        </p>
      </div>
    </div>
  );
};
