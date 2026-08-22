import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Layers } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    role: 'EMPLOYEE',
  });
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mx-auto shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Dayflow Account</h2>
          <p className="text-xs text-slate-500 font-medium">Join your organization's Dayflow workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <Input label="Workplace Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <Input label="Employee ID" name="employeeId" placeholder="EMP-105" value={formData.employeeId} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          <Select
            label="Organization Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { label: 'Employee', value: 'EMPLOYEE' },
              { label: 'HR Lead', value: 'HR' },
              { label: 'System Admin', value: 'ADMIN' },
            ]}
          />

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
            Register Account
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
