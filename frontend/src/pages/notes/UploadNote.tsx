import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, CheckCircle2, Image as ImageIcon, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { noteService } from '@/services/note.service';
import AILoadingStages from '@/components/ui/AILoadingStages';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function UploadNote() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'document' | 'image'>('document');

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files;
    if (dropped && dropped.length > 0) validateAndSetFile(dropped[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) validateAndSetFile(files[0]);
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validDocTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validImgTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];

    if (activeTab === 'document' && !validDocTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload PDF, DOCX, or TXT.'); return;
    }
    if (activeTab === 'image' && !validImgTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload PNG, JPG, JPEG, or WEBP.'); return;
    }
    if (selectedFile.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15MB limit.'); return;
    }

    setFile(selectedFile);
    if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await noteService.uploadNote(file, title, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
        setUploadProgress(pct);
        if (pct === 100) {
          setIsUploading(false);
          setIsProcessing(true);
        }
      });

      if (response.success) {
        setIsProcessing(false);
        setIsSuccess(true);
        toast.success('AI notes generated successfully!');
        setTimeout(() => navigate('/dashboard/generated-notes'), 1200);
      }
    } catch (error: any) {
      setIsUploading(false);
      setIsProcessing(false);
      const message = error?.response?.data?.message || 'Failed to upload and process note.';
      toast.error(message);
    }
  };

  const handleTabSwitch = (tab: 'document' | 'image') => {
    setActiveTab(tab);
    removeFile();
    setTitle('');
  };

  const isLoading = isUploading || isProcessing;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Material</h1>
        <p className="text-muted-foreground mt-1">Upload your lecture, PDF, or image to automatically generate AI study notes.</p>
      </div>

      <Card className="shadow-premium border-primary/10 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          {(['document', 'image'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabSwitch(tab)}
              disabled={isLoading}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 relative ${
                activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'document' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              {tab === 'document' ? 'Documents' : 'Images'}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <CardContent className="p-8 space-y-8">

          {/* AI Loading Stages overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AILoadingStages
                  isImage={activeTab === 'image'}
                  uploadProgress={uploadProgress}
                  isProcessing={isProcessing}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success state */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </motion.div>
                <p className="text-xl font-bold text-emerald-500">Notes Generated!</p>
                <p className="text-sm text-muted-foreground">Redirecting to your notes...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && !isSuccess && (
            <>
              {/* Title input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  {activeTab === 'document' ? 'Document' : 'Image'} Title (Optional)
                </Label>
                <Input
                  id="title"
                  placeholder={activeTab === 'document' ? 'e.g. Chapter 4: Neural Networks' : 'e.g. Biology Diagram – Cell Structure'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-muted/50 border-muted focus-visible:ring-primary h-12 text-base"
                />
              </div>

              {/* File drop zone */}
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
                      isDragging
                        ? 'border-primary bg-primary/5 shadow-premium-hover scale-[1.01]'
                        : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/20'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <motion.div
                      animate={{ y: isDragging ? -8 : 0 }}
                      className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      {activeTab === 'document'
                        ? <UploadCloud className="w-10 h-10 text-primary" />
                        : <ImageIcon className="w-10 h-10 text-primary" />}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">
                      {isDragging ? 'Drop to upload!' : `Drag & drop your ${activeTab === 'document' ? 'file' : 'image'}`}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {activeTab === 'document' ? 'Supports PDF, DOCX, and TXT up to 15MB' : 'Supports PNG, JPG, JPEG, and WEBP up to 15MB'}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept={activeTab === 'document' ? '.pdf,.docx,.txt' : '.png,.jpg,.jpeg,.webp'}
                      onChange={handleFileChange}
                    />
                    <Button variant="outline" className="rounded-full px-8 pointer-events-none">
                      Browse Files
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file-card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border rounded-2xl p-6 bg-card flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      {activeTab === 'document' ? <File className="w-8 h-8 text-primary" /> : <ImageIcon className="w-8 h-8 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h4 className="font-semibold text-lg truncate">{file.name}</h4>
                      <p className="text-muted-foreground mt-1 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Button variant="ghost" size="icon" onClick={removeFile} className="text-muted-foreground hover:text-destructive">
                        <X className="w-5 h-5" />
                      </Button>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button size="lg" onClick={handleUpload} className="rounded-full shadow-premium gap-2">
                          <UploadCloud className="w-5 h-5" />
                          Generate AI Notes
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
