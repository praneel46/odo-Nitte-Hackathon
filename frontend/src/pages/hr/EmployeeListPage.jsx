import React, { useState, useEffect } from 'react';
import { employeesService } from '../../services/employees';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Search, UserPlus, Shield, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    employeesService.getAll().then((data) => {
      setEmployees(data || []);
      setLoading(false);
    });
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || emp.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Employee Governance Directory</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Search, filter, and inspect workforce profiles across departments</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search employee by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            options={[
              { label: 'All Roles', value: 'ALL' },
              { label: 'Employee', value: 'EMPLOYEE' },
              { label: 'HR Lead', value: 'HR' },
              { label: 'System Admin', value: 'ADMIN' },
            ]}
          />
        </div>
      </div>

      {/* Desktop Table & Mobile Cards */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Employee</th>
                  <th className="p-4">ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{emp.firstName} {emp.lastName}</p>
                        <p className="text-slate-500 text-[11px]">{emp.email}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-700">{emp.employeeId}</td>
                    <td className="p-4 text-slate-700">{emp.jobTitle}</td>
                    <td className="p-4 text-slate-700">{emp.departmentName || 'Operations'}</td>
                    <td className="p-4">
                      <Badge variant={emp.role === 'ADMIN' ? 'danger' : emp.role === 'HR' ? 'purple' : 'info'}>
                        {emp.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'danger'}>{emp.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="secondary" size="sm" onClick={() => navigate(`/app/employees/${emp.id}`)}>
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
            {filteredEmployees.map((emp) => (
              <div key={emp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{emp.firstName} {emp.lastName}</h4>
                    <p className="text-xs text-slate-500">{emp.email}</p>
                  </div>
                  <Badge variant={emp.role === 'ADMIN' ? 'danger' : emp.role === 'HR' ? 'purple' : 'info'}>{emp.role}</Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>ID:</strong> {emp.employeeId}</p>
                  <p><strong>Title:</strong> {emp.jobTitle}</p>
                  <p><strong>Dept:</strong> {emp.departmentName}</p>
                </div>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate(`/app/employees/${emp.id}`)}>
                  Inspect Profile
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
