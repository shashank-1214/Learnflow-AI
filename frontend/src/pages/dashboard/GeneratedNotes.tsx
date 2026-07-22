import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Clock, ChevronRight, Sparkles, Image as ImageIcon, AlertTriangle, UploadCloud } from 'lucide-react';
import { noteService } from '@/services/note.service';
import { SkeletonNoteCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorPage from '@/components/ui/ErrorPage';
import { motion } from 'framer-motion';

export default function GeneratedNotes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['generatedNotes'],
    queryFn: noteService.getAllNotes
  });

  const notes = data?.data || [];
  const filteredNotes = notes.filter(note =>
    (note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    note.status === 'completed'
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" /> Generated Notes
          </h1>
          <p className="text-muted-foreground mt-1">View and manage your AI-generated study materials.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonNoteCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorPage
          type="api-error"
          onRetry={() => refetch()}
          onGoHome={() => navigate('/dashboard')}
        />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title={searchTerm ? 'No notes found' : 'No generated notes yet'}
          description={
            searchTerm
              ? `No notes matched "${searchTerm}". Try a different search.`
              : 'Upload a document or image to generate your first AI-powered study notes.'
          }
          actionLabel={!searchTerm ? 'Upload Material' : undefined}
          onAction={!searchTerm ? () => navigate('/dashboard/notes/upload') : undefined}
          secondaryActionLabel={searchTerm ? 'Clear Search' : undefined}
          onSecondaryAction={searchTerm ? () => setSearchTerm('') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {filteredNotes.map((note, idx) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06, ease: 'easeOut' }}
              onClick={() => navigate(`/dashboard/notes/${note._id}`)}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-premium-hover transition-all duration-300 cursor-pointer group flex flex-col card-hover"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${note.sourceType === 'image' ? 'bg-purple-500/10 text-purple-500' : 'bg-primary/10 text-primary'}`}>
                    {note.sourceType === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {note.title || note.originalFileName}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {note.summary || 'No summary available.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">
                  {note.sourceType === 'image' ? '📷 Image source' : `From: ${note.originalFileName}`}
                </span>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                  View <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
