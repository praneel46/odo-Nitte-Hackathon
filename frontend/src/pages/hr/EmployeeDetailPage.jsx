import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeesService } from '../../services/employees';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { ArrowLeft, Shield, UserCheck } from 'lucide-react';

export const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [emp, setEmp] = useState(null);
  const [role, setRole] = useState('EMPLOYEE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeesService.getById(id).then((data) => {
      setEmp(data);
      setRole(data?.role || 'EMPLOYEE');
      setLoading(false);
    });
  }, [id]);

  const handleRoleChange = async () => {
    try {
      await employeesService.updateRole(id, role);
      showToast(`Updated role to ${role}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update role', 'error');
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/app/employees')} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Employee Profile #{id}</h2>
          <p className="text-xs text-slate-500 font-medium">Workforce record & permissions governance</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
            {emp?.firstName?.[0]}{emp?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{emp?.firstName} {emp?.lastName}</h3>
            <p className="text-xs text-slate-500">{emp?.email} • ID: {emp?.employeeId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Job Title</span>
            <p className="font-bold text-slate-900 mt-0.5">{emp?.jobTitle || 'Staff Member'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Department</span>
            <p className="font-bold text-slate-900 mt-0.5">{emp?.departmentName || 'Operations'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Current Status</span>
            <div className="mt-0.5"><Badge variant="success">{emp?.status || 'ACTIVE'}</Badge></div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Phone</span>
            <p className="font-bold text-slate-900 mt-0.5">{emp?.phone || '+1 555-0199'}</p>
          </div>
        </div>

        {isAdmin && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Governance Role Management (Admin)</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={[
                    { label: 'Employee', value: 'EMPLOYEE' },
                    { label: 'HR Lead', value: 'HR' },
                    { label: 'System Admin', value: 'ADMIN' },
                  ]}
                />
              </div>
              <Button variant="primary" size="sm" onClick={handleRoleChange}>
                Update Role
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
