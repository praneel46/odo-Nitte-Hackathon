import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { employeesService } from '../../services/employees';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [address, setAddress] = useState(user?.address || '100 Innovation Way, Suite 400');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || 'Senior HR Operations Lead');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?.userId) {
        await employeesService.update(user.userId, { phone, address, jobTitle });
      }
      showToast('Profile information updated.', 'success');
      refreshUser();
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt="User Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-600"
        />
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">{user?.firstName} {user?.lastName}</h2>
            <Badge variant="purple">{user?.role}</Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium">{user?.jobTitle} • {user?.departmentName || 'Operations'}</p>
          <span className="inline-block text-[11px] font-mono font-semibold text-slate-400">ID: {user?.employeeId}</span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Personal & Contact Info</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" value={user?.firstName || ''} disabled />
            <Input label="Last Name" value={user?.lastName || ''} disabled />
          </div>
          <Input label="Work Email" value={user?.email || ''} disabled />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Input label="Physical Address" value={address} onChange={(e) => setAddress(e.target.value)} />

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" isLoading={loading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
