import React from 'react';
import { ShieldCheck, Computer, Moon, Sun, Monitor, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { adminAuthService } from '@/services/admin.service';

export default function AdminSettings() {
  const { theme, setTheme } = useTheme();
  
  const { data } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: adminAuthService.getProfile,
    staleTime: 5 * 60 * 1000,
  });

  const fallbackUser = adminAuthService.getUser();
  const user = data?.data?.user || fallbackUser;

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" /> Admin Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage platform appearance and administrative preferences.</p>
      </div>

      {/* Appearance Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
          <Computer className="w-5 h-5 text-primary" /> Appearance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <button 
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <Sun className={`w-8 h-8 mb-3 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-medium text-foreground">Light</span>
            {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-primary absolute top-4 right-4" />}
          </button>
          
          <button 
            onClick={() => setTheme('dark')}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <Moon className={`w-8 h-8 mb-3 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-medium text-foreground">Dark</span>
            {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-primary absolute top-4 right-4" />}
          </button>
          
          <button 
            onClick={() => setTheme('system')}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <Monitor className={`w-8 h-8 mb-3 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-medium text-foreground">System</span>
            {theme === 'system' && <CheckCircle2 className="w-4 h-4 text-primary absolute top-4 right-4" />}
          </button>
        </div>
      </section>

      {/* Admin Profile Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Administrative Account
        </h2>
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-semibold text-lg flex items-center gap-2">
                {user?.name || 'Administrator'}
                <span className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full">Root</span>
              </p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Full Name</label>
              <input type="text" disabled value={user?.name || ''} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground disabled:opacity-70" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Email Address</label>
              <input type="email" disabled value={user?.email || ''} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground disabled:opacity-70" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
          About LearnFlow
        </h2>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-sm text-foreground mb-1 font-medium">LearnFlow AI Enterprise</p>
          <p className="text-xs text-muted-foreground mb-4">Version 2.4.0 (Production)</p>
          <p className="text-sm text-muted-foreground">LearnFlow is a modern AI SaaS application for generating intelligent study notes, flashcards, and quizzes from uploaded documents.</p>
        </div>
      </section>
    </div>
  );
}
