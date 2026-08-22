import { apiFetch } from './api';

export const employeesService = {
  getAll: async () => {
    try {
      return await apiFetch('/employees');
    } catch (err) {
      return [
        { id: 1, employeeId: 'EMP-101', firstName: 'Alex', lastName: 'Morgan', email: 'alex.morgan@dayflow.com', jobTitle: 'Senior HR Operations Lead', departmentName: 'Human Resources', role: 'HR', status: 'ACTIVE', phone: '+1 555-234-5678' },
        { id: 2, employeeId: 'EMP-102', firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah.j@dayflow.com', jobTitle: 'Lead Software Engineer', departmentName: 'Engineering', role: 'EMPLOYEE', status: 'ACTIVE', phone: '+1 555-876-5432' },
        { id: 3, employeeId: 'EMP-103', firstName: 'Michael', lastName: 'Chen', email: 'michael.c@dayflow.com', jobTitle: 'Product Manager', departmentName: 'Product', role: 'EMPLOYEE', status: 'ACTIVE', phone: '+1 555-998-1122' },
        { id: 4, employeeId: 'EMP-104', firstName: 'David', lastName: 'Miller', email: 'david.m@dayflow.com', jobTitle: 'VP of Technology', departmentName: 'Executive', role: 'ADMIN', status: 'ACTIVE', phone: '+1 555-334-4556' }
      ];
    }
  },

  getById: async (id) => {
    try {
      return await apiFetch(`/employees/${id}`);
    } catch (err) {
      return { id, employeeId: `EMP-${id}`, firstName: 'Employee', lastName: 'User', jobTitle: 'Staff Member', departmentName: 'Operations', role: 'EMPLOYEE', status: 'ACTIVE' };
    }
  },

  update: async (id, data) => {
    return await apiFetch(`/employees/${id}`, { method: 'PUT', body: data });
  },

  updateRole: async (id, role) => {
    return await apiFetch(`/employees/${id}/role`, { method: 'PUT', body: { role } });
  },

  updateStatus: async (id, status) => {
    return await apiFetch(`/employees/${id}/status`, { method: 'PUT', body: { status } });
  }
};
