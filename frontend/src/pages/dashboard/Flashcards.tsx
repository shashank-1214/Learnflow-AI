import React from 'react';
import { BrainCircuit, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Flashcards() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/30 transition-all duration-500"></div>
        <div className="relative bg-card border border-border rounded-3xl p-8 shadow-premium">
          <BrainCircuit className="w-16 h-16 text-primary mx-auto" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
        Smart Flashcards
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
        We're building an advanced spaced-repetition engine to help you memorize anything, automatically generated from your documents.
      </p>

      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full font-medium text-sm mb-12">
        <Sparkles className="w-4 h-4" />
        Coming in v3.0
      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </button>
    </div>
  );
}
