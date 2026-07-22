import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

const STAGES = [
  { label: 'Uploading document...', progress: 12 },
  { label: 'Reading content...', progress: 25 },
  { label: 'Analyzing structure...', progress: 38 },
  { label: 'Understanding context...', progress: 52 },
  { label: 'Generating notes...', progress: 65 },
  { label: 'Writing summary...', progress: 78 },
  { label: 'Extracting key points...', progress: 88 },
  { label: 'Almost ready...', progress: 96 },
  { label: 'Completed!', progress: 100 },
];

const IMAGE_STAGES = [
  { label: 'Uploading image...', progress: 15 },
  { label: 'Processing visual content...', progress: 30 },
  { label: 'Analyzing image with AI...', progress: 50 },
  { label: 'Extracting information...', progress: 68 },
  { label: 'Generating study notes...', progress: 82 },
  { label: 'Writing key points...', progress: 93 },
  { label: 'Almost ready...', progress: 97 },
  { label: 'Completed!', progress: 100 },
];

interface AILoadingStagesProps {
  isImage?: boolean;
  uploadProgress?: number;
  isProcessing?: boolean;
}

export default function AILoadingStages({
  isImage = false,
  uploadProgress = 0,
  isProcessing = false,
}: AILoadingStagesProps) {
  const stages = isImage ? IMAGE_STAGES : STAGES;
  const [stageIndex, setStageIndex] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Advance through stages over time while processing
  useEffect(() => {
    if (!isProcessing) return;
    // Move through stages 0–(n-2) at intervals; last stage held until complete
    const maxStageIdx = stages.length - 2;
    const interval = setInterval(() => {
      setStageIndex(prev => {
        if (prev < maxStageIdx) return prev + 1;
        return prev;
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [isProcessing, stages.length]);

  // Smoothly animate the progress bar
  useEffect(() => {
    const target = isProcessing ? stages[stageIndex].progress : uploadProgress;
    const step = target > displayProgress ? 1 : 0;
    if (step === 0) return;
    const timer = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev >= target) { clearInterval(timer); return prev; }
        return Math.min(prev + 1, target);
      });
    }, 14);
    return () => clearInterval(timer);
  }, [stageIndex, isProcessing, uploadProgress, stages]);

  const currentLabel = isProcessing
    ? stages[stageIndex].label
    : uploadProgress === 100 ? 'Upload complete...' : `Uploading... ${uploadProgress}%`;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Animated icon */}
      <div className="relative w-20 h-20">
        {/* Outer pulse ring */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-60" />
        {/* Rotating gradient ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin-slow"
          style={{ background: 'conic-gradient(from 0deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'destination-out', maskComposite: 'exclude' }}
        />
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>

      {/* Stage label */}
      <div className="h-7 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-base font-semibold text-center text-foreground"
          >
            {currentLabel}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary animate-gradient"
            initial={{ width: '0%' }}
            animate={{ width: `${displayProgress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right mt-1.5">{displayProgress}%</p>
      </div>

      {/* Stages list */}
      <div className="w-full max-w-xs space-y-1.5">
        {stages.map((stage, idx) => {
          const isDone = idx < stageIndex || (!isProcessing && uploadProgress >= stage.progress);
          const isCurrent = isProcessing && idx === stageIndex;
          return (
            <div
              key={stage.label}
              className={`flex items-center gap-2.5 text-xs transition-colors duration-300 ${
                isDone ? 'text-emerald-500' : isCurrent ? 'text-primary' : 'text-muted-foreground/40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0 opacity-40" />
              )}
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        {isImage
          ? 'Gemini AI is analyzing your image and generating study notes...'
          : 'Gemini AI is reading your document and generating comprehensive study notes...'}
      </p>
    </div>
  );
}
