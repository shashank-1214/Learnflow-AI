import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Users, FileText, BarChart3,
  Settings, LogOut, ShieldCheck, Upload, Menu, X
} from 'lucide-react';
import { adminAuthService } from '@/services/admin.service';
import TopNavbar from '@/components/shared/TopNavbar';
import PageTransition from '@/components/ui/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/analytics',  icon: BarChart3,       label: 'Analytics' },
  { to: '/admin/users',      icon: Users,            label: 'Users' },
  { to: '/admin/notes',      icon: FileText,         label: 'Notes' },
  { to: '/admin/uploads',    icon: Upload,           label: 'Uploads' },
  { to: '/admin/settings',   icon: Settings,         label: 'Settings' },
];

function AdminSidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const fallbackUser = adminAuthService.getUser();
  const { data } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: adminAuthService.getProfile,
    staleTime: 5 * 60 * 1000,
  });
  const user = data?.data?.user || fallbackUser;

  const handleLogout = () => {
    adminAuthService.logout();
    toast.success('Admin logged out');
    onClose?.();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </motion.div>
          <div>
            <p className="text-sm font-bold tracking-tight text-foreground">LearnFlow</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group overflow-hidden ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Icon className="w-4 h-4" />
            </motion.div>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold shrink-0 text-primary-foreground">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fallbackUser = adminAuthService.getUser();
  const { data } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: adminAuthService.getProfile,
    staleTime: 5 * 60 * 1000,
  });
  const user = data?.data?.user || fallbackUser;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="w-60 shrink-0 hidden lg:flex flex-col border-r border-border bg-card">
        <AdminSidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-card border-r border-border flex flex-col lg:hidden shadow-2xl"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AdminSidebarContent onClose={() => setMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNavbar user={user} role="admin" onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <PageTransition variant="fade">
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
