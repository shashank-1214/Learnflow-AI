import React from "react"
import { Outlet, Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left side: branding/imagery */}
      <div className="hidden lg:flex flex-col w-1/2 bg-card border-r border-border text-foreground p-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            LearnFlow AI<span className="text-primary">.</span>
          </Link>
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl font-semibold leading-tight mb-6"
          >
            Upload Anything. <br/>
            <span className="text-muted-foreground">Learn Everything.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-md"
          >
            Join the most advanced AI-powered learning platform designed for students who want to master any subject faster.
          </motion.p>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground/60">
          © {new Date().getFullYear()} LearnFlow AI. All rights reserved.
        </div>
      </div>

      {/* Right side: forms */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link to="/" className="text-3xl font-bold tracking-tight">
              LearnFlow AI<span className="text-primary">.</span>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
