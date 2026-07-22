import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Search, FileText, FileAudio, FileVideo, HardDrive, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { noteService } from '@/services/note.service';
import { SkeletonTableRow } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorPage from '@/components/ui/ErrorPage';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function UserUploads() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userUploads'],
    queryFn: noteService.getAllNotes
  });

  const uploads = data?.data || [];
  const filteredUploads = uploads.filter(upload =>
    upload.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (fileType?: string, sourceType?: string) => {
    if (sourceType === 'image') return <ImageIcon className="w-5 h-5 text-purple-500" />;
    if (!fileType) return <FileText className="w-5 h-5 text-blue-500" />;
    if (fileType.includes('audio')) return <FileAudio className="w-5 h-5 text-purple-500" />;
    if (fileType.includes('video')) return <FileVideo className="w-5 h-5 text-red-500" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this upload?')) return;
    try {
      await noteService.deleteNote(id);
      toast.success('Upload deleted');
      refetch();
    } catch {
      toast.error('Failed to delete upload');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UploadCloud className="w-8 h-8 text-primary" /> Your Uploads
          </h1>
          <p className="text-muted-foreground mt-1">Manage your uploaded source documents and files.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {['File Name', 'Size', 'Upload Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => <SkeletonTableRow key={i} />)}
            </tbody>
          </table>
        ) : error ? (
          <div className="p-8">
            <ErrorPage type="api-error" onRetry={() => refetch()} onGoHome={() => navigate('/dashboard')} />
          </div>
        ) : filteredUploads.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<HardDrive />}
              title={searchTerm ? 'No files found' : 'No uploads yet'}
              description={searchTerm ? `No files matched "${searchTerm}".` : "You haven't uploaded any documents yet. Upload your first file to get started."}
              actionLabel={!searchTerm ? 'Upload File' : undefined}
              onAction={!searchTerm ? () => navigate('/dashboard/notes/upload') : undefined}
              secondaryActionLabel={searchTerm ? 'Clear Search' : undefined}
              onSecondaryAction={searchTerm ? () => setSearchTerm('') : undefined}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  {['File Name', 'Size', 'Upload Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-4 font-medium text-muted-foreground ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUploads.map((upload, idx) => (
                  <motion.tr
                    key={upload._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg border border-border shadow-sm">
                          {getFileIcon(upload.fileType, upload.sourceType)}
                        </div>
                        <div className="max-w-[200px] md:max-w-[300px] truncate font-medium text-foreground">
                          {upload.originalFileName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{formatSize(upload.fileSize || 0)}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(upload.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        upload.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : upload.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {upload.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        title="View Note"
                        onClick={() => navigate(`/dashboard/notes/${upload._id}`)}
                        disabled={upload.status !== 'completed'}
                        className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {upload.sourceType === 'image' && upload.imageUrl ? (
                        <a
                          href={upload.imageUrl.replace(/\\/g, '/')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10 transition-colors inline-block"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </a>
                      ) : (
                        <a
                          href={upload.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors inline-block"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        title="Delete"
                        onClick={() => handleDelete(upload._id)}
                        className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
