import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Library as LibraryIcon, Search, SlidersHorizontal, 
  FileText, Calendar, HardDrive, MoreVertical, 
  Trash2, Edit2, Download, Eye, X
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SkeletonNoteCard } from '@/components/ui/Skeleton';


import { noteService, type Note } from '@/services/note.service';
import { exportUtils } from '@/utils/exportNotes.util';

export default function Library() {
  const navigate = useNavigate();
  
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'largest' | 'smallest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  
  // Dropdown States
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [actionDropdownOpenId, setActionDropdownOpenId] = useState<string | null>(null);
  
  // Pagination const
  const ITEMS_PER_PAGE = 10;

  // Fetch Notes
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await noteService.getAllNotes();
      if (response.success && response.data) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      toast.error("Failed to load your library.");
    } finally {
      setLoading(false);
    }
  };

  // Client-Side Processing (Filter -> Sort -> Paginate)
  const processedNotes = useMemo(() => {
    let result = [...notes];

    // 1. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(note => 
        (note.title?.toLowerCase().includes(q)) ||
        (note.originalFileName?.toLowerCase().includes(q)) ||
        (note.summary?.toLowerCase().includes(q))
      );
    }

    // 2. Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      const sizeA = a.fileSize || 0;
      const sizeB = b.fileSize || 0;

      switch (sortBy) {
        case 'newest': return dateB - dateA;
        case 'oldest': return dateA - dateB;
        case 'largest': return sizeB - sizeA;
        case 'smallest': return sizeA - sizeB;
        default: return dateB - dateA;
      }
    });

    return result;
  }, [notes, searchQuery, sortBy]);

  // Pagination bounds
  const totalPages = Math.ceil(processedNotes.length / ITEMS_PER_PAGE) || 1;
  
  // Ensure current page is valid after filtering
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const currentNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedNotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedNotes, currentPage]);

  // Actions
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await noteService.deleteNote(id);
      if (res.success) {
        setNotes(prev => prev.filter(n => n._id !== id));
        toast.success("Note deleted.");
      }
    } catch (error) {
      toast.error("Failed to delete note.");
    }
  };

  const handleExport = async (note: Note, type: 'pdf' | 'docx', e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExporting) return;
    try {
      setIsExporting(true);
      toast.loading(`Generating ${type.toUpperCase()}...`, { id: 'export' });
      if (type === 'pdf') await exportUtils.downloadPDF(note);
      else await exportUtils.downloadDOCX(note);
      toast.success(`${type.toUpperCase()} Downloaded Successfully`, { id: 'export' });
    } catch (error) {
      toast.error('Export failed', { id: 'export' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRename = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTitle = window.prompt("Enter new title:", note.title || note.originalFileName);
    if (!newTitle || newTitle.trim() === "" || newTitle === note.title) return;
    
    try {
      const res = await noteService.updateNote(note._id, { title: newTitle.trim() });
      if (res.success) {
        setNotes(prev => prev.map(n => n._id === note._id ? { ...n, title: newTitle.trim() } : n));
        toast.success("Note renamed.");
      }
    } catch (error) {
      toast.error("Failed to rename note.");
    }
  };

  // Utils
  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };
  const formatDate = (date?: string) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <LibraryIcon className="w-8 h-8 text-primary" />
            My Library
          </h1>
          <p className="text-muted-foreground mt-2">
            You have {notes.length} generated {notes.length === 1 ? 'note' : 'notes'} in your collection.
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-primary/20 focus-visible:ring-primary rounded-full"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="relative">
            <Button 
              variant="outline" 
              className="gap-2 rounded-full border-primary/20 bg-card shrink-0"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </Button>
            
            {sortDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-popover p-1 text-popover-foreground shadow-md z-50 animate-in fade-in zoom-in-95">
                  <button onClick={() => { setSortBy('newest'); setSortDropdownOpen(false); }} className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${sortBy === 'newest' ? 'bg-primary/10 text-primary font-medium' : ''}`}>Newest First</button>
                  <button onClick={() => { setSortBy('oldest'); setSortDropdownOpen(false); }} className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${sortBy === 'oldest' ? 'bg-primary/10 text-primary font-medium' : ''}`}>Oldest First</button>
                  <button onClick={() => { setSortBy('largest'); setSortDropdownOpen(false); }} className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${sortBy === 'largest' ? 'bg-primary/10 text-primary font-medium' : ''}`}>Largest File</button>
                  <button onClick={() => { setSortBy('smallest'); setSortDropdownOpen(false); }} className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${sortBy === 'smallest' ? 'bg-primary/10 text-primary font-medium' : ''}`}>Smallest File</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonNoteCard key={i} />
          ))}
        </div>
      ) : processedNotes.length === 0 ? (
        <div className="text-center py-32 bg-card/30 rounded-3xl border border-dashed border-primary/20">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LibraryIcon className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Notes Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            {notes.length === 0 
              ? "You haven't uploaded any documents yet. Generate your first AI note to get started!"
              : "No notes match your search criteria. Try adjusting your filters."}
          </p>
          {notes.length === 0 && (
            <Button onClick={() => navigate('/dashboard/notes/upload')} size="lg" className="rounded-full shadow-premium">
              Upload Material
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {currentNotes.map((note, index) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    onClick={() => navigate(`/dashboard/notes/${note._id}`)}
                    className="group h-full flex flex-col cursor-pointer glass hover:shadow-premium-hover hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full -mr-2" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActionDropdownOpenId(actionDropdownOpenId === note._id ? null : note._id); 
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          
                          {actionDropdownOpenId === note._id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionDropdownOpenId(null); }} />
                              <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-popover p-1 text-popover-foreground shadow-md z-50 animate-in fade-in zoom-in-95">
                                <button onClick={(e) => { e.stopPropagation(); setActionDropdownOpenId(null); navigate(`/dashboard/notes/${note._id}`); }} className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                  <Eye className="w-4 h-4 mr-2" /> Preview
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setActionDropdownOpenId(null); handleExport(note, 'pdf', e); }} className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                  <Download className="w-4 h-4 mr-2" /> Download PDF
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setActionDropdownOpenId(null); handleExport(note, 'docx', e); }} className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                  <Download className="w-4 h-4 mr-2" /> Download DOCX
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setActionDropdownOpenId(null); handleRename(note, e); }} className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                  <Edit2 className="w-4 h-4 mr-2" /> Rename
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setActionDropdownOpenId(null); handleDelete(note._id, e); }} className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {note.title || note.originalFileName}
                        </h3>
                        {note.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-3 leading-relaxed">
                            {note.summary}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(note.createdAt)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5" />
                          {formatSize(note.fileSize)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-full px-4"
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground font-medium px-4">
                Page {currentPage} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full px-4"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
