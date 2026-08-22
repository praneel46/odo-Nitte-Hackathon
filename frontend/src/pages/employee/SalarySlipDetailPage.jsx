import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { payrollService } from '../../services/payroll';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Download, Layers } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const SalarySlipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [slip, setSlip] = useState(null);

  useEffect(() => {
    payrollService.getMySlips().then((data) => {
      const found = (data || []).find((s) => String(s.id) === String(id));
      setSlip(found || { id, month: 'July 2026', issueDate: '2026-07-31', baseSalary: 95000, allowances: 15000, deductions: 8000, netSalary: 102000 });
    });
  }, [id]);

  const handleDownload = () => {
    showToast(`Downloading Salary Slip PDF for ${slip?.month}...`, 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/app/payroll')} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Salary Slip - {slip?.month}</h2>
            <p className="text-xs text-slate-500 font-medium">Official payroll breakdown statement</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4" /> Download PDF
        </Button>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Dayflow HRMS Inc.</h3>
              <p className="text-xs text-slate-500">Statement Reference: PAY-{id}-2026</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Issue Date</span>
            <p className="text-sm font-bold text-slate-900">{slip?.issueDate}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earnings & Allowances</h4>
          <div className="flex justify-between text-xs py-1 border-b border-slate-100">
            <span className="text-slate-600">Base Salary</span>
            <span className="font-semibold text-slate-900">${slip?.baseSalary?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs py-1 border-b border-slate-100">
            <span className="text-slate-600">Performance & Housing Allowances</span>
            <span className="font-semibold text-green-600">+${slip?.allowances?.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deductions & Statutory Withholdings</h4>
          <div className="flex justify-between text-xs py-1 border-b border-slate-100">
            <span className="text-slate-600">Federal Tax & Social Security</span>
            <span className="font-semibold text-red-600">-${slip?.deductions?.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-900">Total Net Disbursed Salary</span>
          <span className="text-xl font-extrabold text-blue-600">${slip?.netSalary?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
