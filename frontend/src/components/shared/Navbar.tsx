import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            LearnFlow AI<span className="text-primary">.</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link to="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
            <Link to="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/auth/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Log in
          </Link>
          <Button asChild className="rounded-full px-6">
            <Link to="/auth/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
