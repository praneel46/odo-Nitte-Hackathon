import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useToast } from '../../components/ui/Toast';
import {
  Layers,
  User,
  Mail,
  Lock,
  CreditCard,
  ShieldCheck,
  Users,
  BarChart3,
  UserPlus,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    role: 'EMPLOYEE',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.register(formData);
      showToast('Registration successful! Verify your email to activate account.', 'success');
      if (res?.devVerificationToken) {
        await authService.verifyEmail(res.devVerificationToken);
        showToast('Dev email verified automatically!', 'info');
      }
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-slate-50/80 flex items-center justify-center p-3 sm:p-5 lg:p-6 font-sans">
      {/* Main Centered Split-Screen Card */}
      <div className="w-full max-w-[1140px] lg:h-[660px] lg:max-h-[660px] bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-blue-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        
        {/* LEFT BRANDING & PROMOTIONAL PANEL (45% Width) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1E62EC] via-[#1653D8] to-[#0E3FB5] p-6 sm:p-8 lg:p-9 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
          
          {/* Dot Matrix Pattern Accent */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`,
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 space-y-6">
            {/* Logo & Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">Dayflow</span>
            </div>

            {/* Headline & Subtitle */}
            <div className="space-y-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                Join thousands of <br />
                <span className="text-cyan-300">organizations</span> who <br />
                trust Dayflow
              </h1>
              <p className="text-xs sm:text-sm font-medium text-blue-100/90 leading-relaxed max-w-sm">
                Create your account and simplify your workforce management with our intelligent HR platform.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Smart Workforce Management</h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug mt-0.5">
                    Streamline HR processes and boost team productivity
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Secure &amp; Reliable</h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug mt-0.5">
                    Enterprise-grade security to protect your data
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Insights That Matter</h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug mt-0.5">
                    Powerful analytics to drive better decisions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Dashboard Card Illustration */}
          <div className="relative z-10 pt-4 hidden sm:block">
            <div className="bg-white/90 backdrop-blur-lg p-3.5 rounded-2xl border border-white/40 shadow-xl shadow-blue-950/20 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Dashboard</span>
                </div>
                <span className="text-[9px] font-semibold text-slate-500">Live Workspace</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Total</span>
                  <span className="text-xs font-black text-slate-900">248</span>
                </div>
                <div className="p-1.5 bg-emerald-50/70 rounded-lg border border-emerald-100">
                  <span className="text-[8px] font-bold text-emerald-600 block uppercase">Present</span>
                  <span className="text-xs font-black text-emerald-700">186</span>
                </div>
                <div className="p-1.5 bg-amber-50/70 rounded-lg border border-amber-100">
                  <span className="text-[8px] font-bold text-amber-600 block uppercase">On Leave</span>
                  <span className="text-xs font-black text-amber-700">24</span>
                </div>
                <div className="p-1.5 bg-blue-50/70 rounded-lg border border-blue-100">
                  <span className="text-[8px] font-bold text-blue-600 block uppercase">Depts</span>
                  <span className="text-xs font-black text-blue-700">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT REGISTRATION FORM PANEL (55% Width) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-9 bg-white flex flex-col justify-between overflow-y-auto">
          {/* Top Form Header */}
          <div className="text-center space-y-1 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#1E62EC] text-white flex items-center justify-center font-bold mx-auto shadow-md shadow-blue-600/25">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
              Create Dayflow Account
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Join your organization's Dayflow workspace
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* First Name & Last Name (Side-by-side on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Workplace Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Workplace Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your work email"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  placeholder="e.g., EMP-105"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Organization Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Organization Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="HR">HR Lead</option>
                  <option value="ADMIN">System Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-[#1E62EC] via-[#1A58E1] to-[#1244C8] hover:from-[#1853CC] hover:to-[#0E39AA] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider & Login Link */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
