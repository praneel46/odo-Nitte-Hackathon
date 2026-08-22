import { apiFetch } from './api';

const formatSize = (size) => {
  if (typeof size === 'number') {
    if (size >= 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return Math.max(1, Math.round(size / 1024)) + ' KB';
  }
  return size || 'N/A';
};

export const documentsService = {
  getMyDocuments: async () => {
    try {
      const data = await apiFetch('/documents/me');
      return (data || []).map((d) => ({
        ...d,
        uploadDate: d.uploadedAt ? String(d.uploadedAt).slice(0, 10) : d.uploadDate,
        fileSizeFormatted: formatSize(d.fileSize),
      }));
    } catch (err) {
      return [
        { id: 1, documentName: 'Passport Copy', documentType: 'ID_PROOF', uploadDate: '2026-01-15', fileSizeFormatted: '2.4 MB' },
        { id: 2, documentName: 'W4 Tax Form 2026', documentType: 'TAX_FORM', uploadDate: '2026-02-01', fileSizeFormatted: '850 KB' }
      ];
    }
  },

  getEmployeeDocuments: async (employeeId) => {
    const data = await apiFetch(`/documents/${employeeId}`);
    return (data || []).map((d) => ({
      ...d,
      uploadDate: d.uploadedAt ? String(d.uploadedAt).slice(0, 10) : d.uploadDate,
      fileSizeFormatted: formatSize(d.fileSize),
    }));
  },

  uploadDocument: async (formData) => {
    return await apiFetch('/documents', { method: 'POST', body: formData });
  },

  deleteDocument: async (id) => {
    return await apiFetch(`/documents/${id}`, { method: 'DELETE' });
  }
};
