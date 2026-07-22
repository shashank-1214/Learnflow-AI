import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Calendar, Download, Trash2, ChevronLeft,
  BrainCircuit, ListChecks, Copy, Printer, Send, Sparkles, MessageSquare, X, ChevronUp, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { noteService, type Note } from '@/services/note.service';
import { exportUtils } from '@/utils/exportNotes.util';
import toast from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const SUGGESTED_PROMPTS = [
  'Summarize this document',
  'Explain this simply',
  'Important interview questions',
  'List key concepts',
  'Explain in Telugu',
];

// ── Chat Panel Component ───────────────────────────────────────────────────────
function ChatPanel({ noteId, disabled }: { noteId: string; disabled: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || disabled) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history of previous messages in the format the backend expects
      const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));
      const response = await noteService.chatWithNote(noteId, text.trim(), history);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.answer || "I couldn't find that information in this document.",
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'Something went wrong. Please try again.',
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [noteId, messages, isLoading, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium">
          <Sparkles className="w-4.5 h-4.5 text-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Chat with AI</h3>
          <p className="text-xs text-muted-foreground">Answers based on this document</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-500 font-medium">Ready</span>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-3 border border-primary/20">
              <BrainCircuit className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">Ask anything about this note</p>
            <p className="text-xs text-muted-foreground mb-6">I'll only use the document's content to answer.</p>

            {/* Suggested Prompts */}
            <div className="flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={disabled || isLoading}
                  className="text-left text-xs px-3 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all text-primary font-medium disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-foreground" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted/60 text-foreground rounded-tl-sm border border-border/30'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI Typing Indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="bg-muted/60 rounded-2xl rounded-tl-sm border border-border/30 px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border/50 bg-background/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 border border-border/50 focus-within:border-primary/40 transition-colors">
          <input
            ref={inputRef}
            type="text"
            placeholder={disabled ? 'Note is still processing...' : 'Ask anything about this note...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading || disabled}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-foreground" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">Enter to send • Shift+Enter for newline</p>
      </div>
    </div>
  );
}

// ── Main Note Detail Page ─────────────────────────────────────────────────────
export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  // Mobile chat bottom sheet state
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await noteService.getNoteById(id);
        if (response.success) setNote(response.data);
        else toast.error('Failed to fetch note details.');
      } catch {
        toast.error('Failed to load note.');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await noteService.deleteNote(id);
      if (res.success) {
        toast.success('Note deleted successfully.');
        navigate('/dashboard');
      }
    } catch {
      toast.error('Failed to delete note.');
    }
  };

  const handleExport = async (type: 'pdf' | 'docx' | 'md' | 'copy' | 'print') => {
    if (!note) return;
    try {
      setIsExporting(true);
      if (type === 'pdf') { toast.loading('Generating PDF...', { id: 'export' }); await exportUtils.downloadPDF(note); toast.success('PDF Downloaded', { id: 'export' }); }
      else if (type === 'docx') { toast.loading('Generating DOCX...', { id: 'export' }); await exportUtils.downloadDOCX(note); toast.success('DOCX Downloaded', { id: 'export' }); }
      else if (type === 'md') { exportUtils.downloadMarkdown(note); toast.success('Markdown Downloaded'); }
      else if (type === 'copy') { await exportUtils.copyToClipboard(note); toast.success('Copied to clipboard'); }
      else if (type === 'print') { exportUtils.printNotes(); }
    } catch { toast.error('Export failed.', { id: 'export' }); }
    finally { setIsExporting(false); }
  };

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown';
  const isChatDisabled = !note || note.status !== 'completed';

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex gap-6 h-[calc(100vh-80px)] animate-pulse">
        <div className="flex-1 space-y-4">
          <div className="h-10 w-2/3 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
        <div className="w-80 shrink-0 bg-muted rounded-2xl hidden lg:block" />
      </div>
    );
  }

  // ── 404 ────────────────────────────────────────────────────────────────────
  if (!note) {
    return (
      <div className="text-center py-20 animate-in fade-in">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Note Not Found</h2>
        <p className="text-muted-foreground mb-8">This note doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/dashboard')} className="rounded-full">Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <>
      {/* ── Two-Column Layout ─────────────────────────────────────────────── */}
      <div className="flex gap-6 items-start animate-in fade-in duration-500 pb-24 lg:pb-8">

        {/* ── Left: Note Content (70%) ───────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full border bg-card shadow-sm shrink-0 mt-1">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                  {note.title || note.originalFileName}
                </h1>
                <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  {note.sourceType === 'image' ? (
                    <span className="flex items-center gap-1.5 bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded text-xs font-medium">
                      <ImageIcon className="w-3.5 h-3.5" /> Image
                    </span>
                  ) : null}
                  <Calendar className="w-4 h-4" />
                  {note.sourceType === 'image' ? 'Analyzed' : 'Uploaded'} {formatDate(note.createdAt)}
                </p>
              </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {note.sourceType === 'image' && note.imageUrl && (
                <a 
                  href={note.imageUrl.replace(/\\/g, '/')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs border-purple-500/20 text-purple-500 hover:bg-purple-500/10 hover:text-purple-600">
                    <ImageIcon className="w-3.5 h-3.5" /> View Image
                  </Button>
                </a>
              )}
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" disabled={isExporting} onClick={() => handleExport('pdf')}>
                <Download className="w-3.5 h-3.5" /> PDF
              </Button>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" disabled={isExporting} onClick={() => handleExport('docx')}>
                <Download className="w-3.5 h-3.5" /> DOCX
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex rounded-full gap-1.5 text-xs" disabled={isExporting} onClick={() => handleExport('md')}>
                <Download className="w-3.5 h-3.5" /> MD
              </Button>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" onClick={() => handleExport('copy')}>
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full gap-1.5 text-xs" onClick={() => handleExport('print')}>
                <Printer className="w-3.5 h-3.5" /> Print
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-full" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Summary Card */}
          {note.summary && (
            <Card className="shadow-sm overflow-hidden relative border-primary/10">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent" />
              <CardHeader className="pb-2 pl-6">
                <CardTitle className="text-base flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-primary" /> AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-6">
                <p className="text-muted-foreground leading-relaxed text-sm">{note.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Key Points */}
          {note.keyPoints && note.keyPoints.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-emerald-500" /> Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {note.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Generated Notes */}
          {note.generatedNotes && (
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/20 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" /> Generated Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-4">
                  {note.generatedNotes.split('\n').filter(p => p.trim()).map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right: Sticky AI Chat Panel (30%, desktop only) ──────────── */}
        <div className="w-[340px] shrink-0 sticky top-4 hidden lg:flex flex-col h-[calc(100vh-96px)] rounded-2xl border border-primary/15 bg-card/80 backdrop-blur-xl shadow-premium overflow-hidden">
          <ChatPanel noteId={id!} disabled={isChatDisabled} />
        </div>
      </div>

      {/* ── Mobile: Floating "Ask AI" Button & Bottom Sheet ────────────────── */}
      <div className="lg:hidden">
        {/* Floating Action Button */}
        {!mobileChatOpen && (
          <button
            onClick={() => setMobileChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-premium flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageSquare className="w-6 h-6 text-foreground" />
          </button>
        )}

        {/* Bottom Sheet */}
        <AnimatePresence>
          {mobileChatOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileChatOpen(false)}
              />
              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 h-[75vh] bg-card rounded-t-3xl border-t border-primary/15 shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Drag Handle */}
                <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 rounded-full bg-muted mx-auto" />
                </div>
                <button
                  onClick={() => setMobileChatOpen(false)}
                  className="absolute top-3 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
                <ChatPanel noteId={id!} disabled={isChatDisabled} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
