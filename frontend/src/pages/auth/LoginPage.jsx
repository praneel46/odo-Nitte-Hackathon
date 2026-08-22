import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/ui/Toast';
import { Layers, ArrowRight, Mail, Lock, Eye, EyeOff, X, Sun, Moon } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@dayflow.com');
  const [password, setPassword] = useState('Admin@123');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      showToast('Logged in successfully!', 'success');
      navigate('/app/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showToast('Please contact your HR administrator to reset your password.', 'info');
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#F0F4FA] dark:bg-[#0B0F19] flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden font-sans transition-colors">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 shadow-md hover:scale-105 transition-all cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {/* Background Ambient Accents */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-200/40 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-100/50 dark:bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* Main Split Card Container */}
      <div className="w-full max-w-[1120px] my-auto bg-white dark:bg-[#111827] rounded-[2rem] shadow-2xl shadow-blue-900/10 dark:shadow-black/40 border border-white/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative z-10 lg:max-h-[620px] lg:h-[620px]">
        
        {/* LEFT PANEL — BRANDING */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1E62EC] via-[#1A58E1] to-[#1244C8] text-white p-6 sm:p-8 lg:p-10 relative flex flex-col justify-between h-full min-h-[260px] lg:min-h-0 overflow-hidden select-none">
          
          {/* Top Decorative Floating Elements */}
          <div className="absolute top-0 right-20 w-10 h-28 border border-white/20 rounded-b-full bg-white/10 backdrop-blur-xs flex items-end justify-center pb-3">
            <div className="w-3 h-10 rounded-full bg-white/20" />
          </div>

          <div className="absolute top-10 right-8 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-white/30 p-1 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-xs shadow-cyan-300" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 ml-1.5" />
          </div>

          {/* Top Branding Logo */}
          <div className="flex items-center gap-2.5 z-10">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">Dayflow</span>
          </div>

          {/* Dot Grid Top Left */}
          <div className="hidden sm:grid grid-cols-6 gap-2 w-24 opacity-30 my-4 lg:my-6">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>

          {/* Center Text Block */}
          <div className="my-auto py-3 lg:py-4 z-10 max-w-sm">
            <h1 className="text-3xl lg:text-[2.5rem] font-black text-white leading-tight tracking-tight">
              Welcome to <br />
              Dayflow
            </h1>
            <p className="text-sm lg:text-base font-semibold text-blue-100 mt-2.5 leading-snug">
              Enterprise Human Resources &amp; <br />
              Attendance System
            </p>
            
            {/* Short Decorative Horizontal Line */}
            <div className="w-10 h-1 bg-blue-300/60 rounded-full my-3.5" />

            <p className="text-xs lg:text-sm text-blue-100/80 leading-relaxed font-normal">
              Simplify workforce management, track attendance, and empower your organization.
            </p>
          </div>

          {/* Bottom Decorative Elements */}
          <div className="relative z-10 hidden lg:flex items-end justify-between pt-4">
            <div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-300 to-blue-300 shadow-md shadow-cyan-500/30 mb-2" />
              <div className="grid grid-cols-6 gap-2 w-20 opacity-30">
                {[...Array(18)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
                ))}
              </div>
            </div>

            <X className="w-4 h-4 text-white/40 absolute bottom-2 left-28" />

            {/* Concentric Spheres Bottom Right */}
            <div className="absolute -bottom-16 -right-16 w-56 h-56 border-2 border-white/20 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 border-2 border-white/25 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-400 to-blue-500 shadow-xl shadow-cyan-400/40 relative">
                  <div className="w-4 h-4 rounded-full bg-cyan-200 shadow-sm absolute top-1 right-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — LOGIN */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] p-6 sm:p-8 lg:px-12 lg:py-8 flex flex-col justify-center h-full overflow-y-auto lg:overflow-y-visible">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Top Logo Container & Headings */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#1E62EC] text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/30 mb-3">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Log in to Dayflow
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Access your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Workplace Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your workplace email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#1E62EC] hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Log In <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Register Prompt */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium pt-3 border-t border-slate-100 dark:border-slate-800">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline">
                Register Account
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
