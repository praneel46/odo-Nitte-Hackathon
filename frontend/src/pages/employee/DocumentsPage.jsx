import React, { useState, useEffect } from 'react';
import { documentsService } from '../../services/documents';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { Upload, Download, Trash2, FileText } from 'lucide-react';

export const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('ID_PROOF');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const loadDocs = () => {
    setLoading(true);
    documentsService.getMyDocuments().then((data) => {
      setDocs(data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select a file to upload.', 'error');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentName', docName || selectedFile.name);
      formData.append('documentType', docType);

      await documentsService.uploadDocument(formData);
      showToast('Document uploaded successfully!', 'success');
      setIsModalOpen(false);
      loadDocs();
    } catch (err) {
      showToast(err.message || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      await documentsService.downloadDocument(doc.id, doc.documentName);
      showToast(`Downloaded ${doc.documentName}`, 'success');
    } catch (err) {
      showToast(err.message || 'Download failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this document from your vault?')) {
      try {
        await documentsService.deleteDocument(id);
        showToast('Document deleted.', 'info');
        loadDocs();
      } catch (err) {
        showToast(err.message || 'Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Document Storage Vault</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Secure employee records, identification documents, and employment contracts</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Upload className="w-4 h-4" /> Upload Document
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Document Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Upload Date</th>
                  <th className="p-4">File Size</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{doc.documentName}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="purple">{doc.documentType}</Badge>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{doc.uploadDate}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{doc.fileSizeFormatted || doc.fileSize}</td>
                    <td className="p-4 flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleDownload(doc)}>
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Vault Document">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input label="Document Label" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g. Passport Copy 2026" required />
          <Select
            label="Category"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            options={[
              { label: 'Identification Proof (Passport/ID)', value: 'ID_PROOF' },
              { label: 'Tax Form (W4/1099)', value: 'TAX_FORM' },
              { label: 'Employment Contract', value: 'CONTRACT' },
              { label: 'Certification / Degree', value: 'CERTIFICATE' },
            ]}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select File <span className="text-red-500">*</span></label>
            <input
              type="file"
              required
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950/60 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" className="w-1/2" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-1/2" isLoading={uploading}>
              Upload
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
