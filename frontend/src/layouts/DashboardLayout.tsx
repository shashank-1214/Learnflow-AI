import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar, { MobileSidebarDrawer } from "@/components/shared/Sidebar"
import TopNavbar from "@/components/shared/TopNavbar"
import PageTransition from "@/components/ui/PageTransition"

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar drawer */}
      <MobileSidebarDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNavbar role="user" onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <PageTransition variant="fade-slide">
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
