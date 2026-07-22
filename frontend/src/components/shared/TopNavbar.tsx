import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { MobileMenuButton } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

interface TopNavbarProps {
  user?: { name: string; email: string } | null;
  role?: 'admin' | 'user';
  onMenuClick?: () => void;
}

function ProfileDropdown({ user, role, onClose }: { user?: { name: string; email: string } | null; role: 'admin' | 'user'; onClose: () => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    onClose();
    navigate('/auth/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : role === 'admin' ? 'AD' : 'US';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={[
        'absolute right-0 top-full mt-3 w-64',
        'rounded-2xl overflow-hidden',
        'z-[999]',
        /* Solid opaque background — dark mode handled by CSS var overrides */
        'bg-white dark:bg-slate-900',
        'border border-gray-200 dark:border-slate-700',
        'shadow-2xl',
      ].join(' ')}
      style={{ isolation: 'isolate' }}
    >
      {/* User Info Header */}
      <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 dark:bg-slate-800/70 border-b border-gray-200 dark:border-slate-700">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow ring-2 ring-white dark:ring-slate-700 font-bold text-sm shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {user?.name || (role === 'admin' ? 'Admin' : 'User')}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
            {user?.email || ''}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-2">
        {role === 'user' && (
          <>
            <button
              onClick={() => { navigate('/dashboard/notes/upload'); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30 transition-colors shrink-0">
                <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </span>
              Upload New Material
            </button>

            <button
              onClick={() => { navigate('/dashboard/settings'); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700/60 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-slate-700 transition-colors shrink-0">
                <Settings className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
              </span>
              Settings
            </button>
          </>
        )}

        {/* Divider */}
        <div className="my-1.5 border-t border-gray-100 dark:border-slate-700/60" />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left group"
        >
          <span className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors shrink-0">
            <LogOut className="w-3.5 h-3.5" />
          </span>
          Sign out
        </button>
      </div>
    </motion.div>
  );
}


export default function TopNavbar({ user: propUser, role = 'user', onMenuClick }: TopNavbarProps) {
  const { user: authUser } = useAuth();
  const user = propUser ?? authUser;
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : role === 'admin' ? 'AD' : 'US';

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-4">

        {/* Left: hamburger (mobile) + search */}
        <div className="flex items-center gap-3 flex-1">
          <MobileMenuButton onClick={onMenuClick ?? (() => {})} />

          <motion.div
            animate={{ width: searchFocused ? '100%' : undefined }}
            className="relative w-full max-w-xs md:max-w-md hidden sm:block group"
          >
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${searchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
            <input
              type="text"
              placeholder={`Search ${role === 'admin' ? 'users, notes, docs...' : 'your notes, flashcards...'}`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full bg-muted/40 hover:bg-muted/60 focus:bg-background border border-transparent focus:border-border rounded-full pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-0 transition-all duration-300 focus:shadow-md"
            />
          </motion.div>
        </div>

        {/* Right: theme + notifications + profile */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <ThemeToggle />

          {/* Notification bell */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"
            />
          </motion.button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              onClick={() => setProfileOpen(p => !p)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted transition-colors group"
              aria-label="Profile menu"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-sm ring-2 ring-background font-bold text-xs shrink-0">
                {initials}
              </div>
              <motion.div
                animate={{ rotate: profileOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <ProfileDropdown
                  user={user}
                  role={role}
                  onClose={() => setProfileOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
