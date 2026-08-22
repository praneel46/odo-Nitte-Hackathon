import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Layers, ArrowRight, Mail, Lock, Eye, EyeOff, X } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@dayflow.com');
  const [password, setPassword] = useState('Admin@123');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login } = useAuth();
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

  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      showToast('Google Sign-In requires VITE_GOOGLE_CLIENT_ID to be configured in your environment variables.', 'info');
      return;
    }
    
    const redirectUri = window.location.origin + (import.meta.env.BASE_URL || '/');
    const scope = 'openid email profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#F0F4FA] flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Accents */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />

      {/* Main Split Card Container */}
      <div className="w-full max-w-[1120px] my-auto bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-white/80 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative z-10 lg:max-h-[620px] lg:h-[620px]">
        
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
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:px-12 lg:py-8 flex flex-col justify-center h-full overflow-y-auto lg:overflow-y-visible">
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* Top Logo Container & Headings */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#1E62EC] text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/30 mb-3">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Log in to Dayflow
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Access your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Workplace Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your workplace email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 hover:bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 hover:bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
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
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#1E62EC] hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-1"
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

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative px-3 bg-white text-xs font-medium text-slate-400">or</span>
            </div>

            {/* Google Login Option */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 bg-white rounded-xl text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Bottom Register Prompt */}
            <div className="text-center text-xs text-slate-500 font-medium pt-2">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Register Account
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
