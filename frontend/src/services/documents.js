import { apiFetch } from './api';

export const documentsService = {
  getMyDocuments: async () => {
    try {
      return await apiFetch('/documents/me');
    } catch (err) {
      return [
        { id: 1, documentName: 'Passport Copy', documentType: 'ID_PROOF', uploadDate: '2026-01-15', fileSize: '2.4 MB' },
        { id: 2, documentName: 'W4 Tax Form 2026', documentType: 'TAX_FORM', uploadDate: '2026-02-01', fileSize: '850 KB' },
        { id: 3, documentName: 'Employment Agreement', documentType: 'CONTRACT', uploadDate: '2025-12-01', fileSize: '1.8 MB' }
      ];
    }
  },

  getEmployeeDocuments: async (employeeId) => {
    return await apiFetch(`/documents/${employeeId}`);
  },

  uploadDocument: async (formData) => {
    return await apiFetch('/documents', { method: 'POST', body: formData });
  },

  deleteDocument: async (id) => {
    return await apiFetch(`/documents/${id}`, { method: 'DELETE' });
  }
};
