import React from 'react';
import { User, Bell, Shield, LogOut, Computer, Moon, Sun, Monitor, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { show, hide } = useLoading();

  const handleLogout = () => {
    show('Signing you out...');
    // Small delay to let overlay appear before logout clears context
    setTimeout(() => {
      logout();
      hide();
    }, 150);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </motion.div>

      {/* Appearance Section */}
      <motion.section
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
          <Computer className="w-5 h-5 text-primary" /> Appearance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <button
            onClick={() => setTheme('light')}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <Sun className={`w-8 h-8 mb-3 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-medium text-foreground">Light</span>
            {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-primary absolute top-4 right-4" />}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <Moon className={`w-8 h-8 mb-3 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-medium text-foreground">Dark</span>
            {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-primary absolute top-4 right-4" />}
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <Monitor className={`w-8 h-8 mb-3 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-medium text-foreground">System</span>
            {theme === 'system' && <CheckCircle2 className="w-4 h-4 text-primary absolute top-4 right-4" />}
          </button>
        </div>
      </motion.section>

      {/* Profile Section */}
      <motion.section
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
          <User className="w-5 h-5 text-primary" /> Profile Details
        </h2>
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-sm cursor-default"
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </motion.div>
            <div>
              <p className="font-semibold text-lg">{user?.name}</p>
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
      </motion.section>

      {/* Account Section */}
      <motion.section
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
          <Shield className="w-5 h-5 text-primary" /> Security & Account
        </h2>
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">Change your password</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors hover:-translate-y-0.5 active:translate-y-0">Update</button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Danger Zone</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account</p>
            </div>
            <button className="px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-sm font-medium transition-all hover:-translate-y-0.5 active:translate-y-0">Delete Account</button>
          </div>
        </div>
      </motion.section>

      {/* Logout */}
      <motion.section
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="pt-4"
      >
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-destructive/10 text-destructive font-semibold hover:bg-destructive hover:text-destructive-foreground transition-all w-full md:w-auto justify-center"
        >
          <LogOut className="w-5 h-5" /> Logout from LearnFlow
        </motion.button>
      </motion.section>
    </div>
  );
}
