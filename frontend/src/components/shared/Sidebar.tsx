import React, { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, FileText, BrainCircuit, Library,
  Settings, UploadCloud, LogOut, ArrowRight, Menu, X
} from "lucide-react"
import { cn } from "@/utils/utils"
import { authService } from "@/services/auth.service"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

const navItems = [
  { name: "Overview",        href: "/dashboard",                icon: LayoutDashboard },
  { name: "My Library",      href: "/dashboard/library",        icon: Library },
  { name: "Generated Notes", href: "/dashboard/generated-notes", icon: FileText },
  { name: "Flashcards",      href: "/dashboard/flashcards",     icon: BrainCircuit },
  { name: "Uploads",         href: "/dashboard/uploads",        icon: UploadCloud },
]

function NavItem({ item, onClick }: { item: typeof navItems[0]; onClick?: () => void }) {
  const location = useLocation()
  const isActive = item.href === "/dashboard"
    ? location.pathname === "/dashboard"
    : location.pathname.startsWith(item.href)

  return (
    <NavLink
      to={item.href}
      end={item.href === "/dashboard"}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group overflow-hidden",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-sidebar-bg"
          className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
          initial={false}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
        />
      )}
      {/* Hover glow */}
      <span
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          !isActive && "bg-muted/60"
        )}
      />
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative z-10 shrink-0"
      >
        <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
      </motion.div>
      <span className="relative z-10">{item.name}</span>
    </NavLink>
  )
}

// Desktop Sidebar
function DesktopSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    toast.success("Logged out successfully")
    navigate("/auth/login", { replace: true })
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 hidden lg:flex transition-colors duration-300">
      <div className="p-6 pb-3">
        <NavLink to="/" className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-sm"
          >
            <span className="text-primary-foreground text-lg leading-none font-bold">L</span>
          </motion.div>
          <span>LearnFlow<span className="text-primary">.</span></span>
        </NavLink>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-3">
          Main Menu
        </div>
        {navItems.map(item => <NavItem key={item.href} item={item} />)}
      </div>

      <div className="p-4 mt-auto border-t border-border space-y-1">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) => cn(
            "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group overflow-hidden",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {location.pathname === "/dashboard/settings" && (
            <motion.div
              layoutId="active-sidebar-bg"
              className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
              initial={false}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            />
          )}
          <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-muted/60 transition-opacity duration-200" />
          <Settings className={cn("w-5 h-5 relative z-10", location.pathname === "/dashboard/settings" ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
          <span className="relative z-10">Settings</span>
        </NavLink>

        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>

        {/* Upgrade card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="relative z-10">
            <h4 className="font-semibold text-sm mb-1 text-foreground">Upgrade to Pro</h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Unlock unlimited AI processing and premium templates.</p>
            <div className="flex items-center text-xs font-semibold text-primary group-hover:underline">
              View plans <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
        </motion.div>
      </div>
    </aside>
  )
}

// Mobile Drawer
export function MobileSidebarDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    toast.success("Logged out successfully")
    onClose()
    navigate("/auth/login", { replace: true })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r border-border flex flex-col lg:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 pb-3">
              <NavLink to="/" onClick={onClose} className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-primary-foreground text-lg leading-none font-bold">L</span>
                </div>
                LearnFlow<span className="text-primary">.</span>
              </NavLink>
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-3">Main Menu</div>
              {navItems.map(item => <NavItem key={item.href} item={item} onClick={onClose} />)}
            </div>

            <div className="p-4 border-t border-border space-y-1">
              <NavLink
                to="/dashboard/settings"
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Settings className="w-5 h-5" />
                Settings
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// Mobile hamburger button (exported for TopNavbar)
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
      aria-label="Open menu"
    >
      <Menu className="w-5 h-5" />
    </motion.button>
  )
}

export default DesktopSidebar
