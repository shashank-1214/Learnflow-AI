import React from "react"
import { Bell, Search, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DashboardNavbar() {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Mobile menu trigger would go here */}
        
        <div className="flex-1">
          <div className="relative max-w-md hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents, notes, flashcards..."
              className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden sm:flex rounded-full gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary">
            <Plus className="h-4 w-4" />
            Quick Upload
          </Button>
          
          <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
          </Button>
          
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent cursor-pointer flex items-center justify-center text-white shadow-sm ring-2 ring-background">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
