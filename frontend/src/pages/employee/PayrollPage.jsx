import React, { useState, useEffect } from 'react';
import { payrollService } from '../../services/payroll';
import { Button } from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { DollarSign, Download, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PayrollPage = () => {
  const [payroll, setPayroll] = useState(null);
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([payrollService.getMyPayroll(), payrollService.getMySlips()]).then(([pay, slp]) => {
      setPayroll(pay);
      setSlips(slp || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payroll & Compensation Vault</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Overview of base structure, allowances, deductions, and monthly salary slips</p>
        </div>
      </div>

      {/* Salary Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Base Annual Salary</p>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            ${payroll?.baseSalary ? payroll.baseSalary.toLocaleString() : '95,000'}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Allowances</p>
          <h3 className="text-xl font-extrabold text-green-600 mt-1">
            +${payroll?.allowances ? payroll.allowances.toLocaleString() : '15,000'}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Deductions & Taxes</p>
          <h3 className="text-xl font-extrabold text-red-600 mt-1">
            -${payroll?.deductions ? payroll.deductions.toLocaleString() : '8,000'}
          </h3>
        </div>
        <div className="bg-blue-600 text-white p-5 rounded-xl border border-blue-700 shadow-sm">
          <p className="text-xs font-semibold text-blue-100 uppercase">Net Monthly Compensation</p>
          <h3 className="text-2xl font-extrabold mt-1">
            ${payroll?.netSalary ? payroll.netSalary.toLocaleString() : '102,000'}
          </h3>
        </div>
      </div>

      {/* Payslips Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 font-bold text-sm text-slate-900">
            Monthly Salary Slips & Statements
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Pay Period</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Base</th>
                  <th className="p-4">Allowances</th>
                  <th className="p-4">Deductions</th>
                  <th className="p-4">Net Salary</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{slip.month}</td>
                    <td className="p-4 text-slate-500">{slip.issueDate}</td>
                    <td className="p-4">${slip.baseSalary.toLocaleString()}</td>
                    <td className="p-4 text-green-600 font-medium">+${slip.allowances.toLocaleString()}</td>
                    <td className="p-4 text-red-600 font-medium">-${slip.deductions.toLocaleString()}</td>
                    <td className="p-4 font-extrabold text-slate-900">${slip.netSalary.toLocaleString()}</td>
                    <td className="p-4">
                      <Button variant="secondary" size="sm" onClick={() => navigate(`/app/payroll/slips/${slip.id}`)}>
                        <FileText className="w-3.5 h-3.5" /> View Slip
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
