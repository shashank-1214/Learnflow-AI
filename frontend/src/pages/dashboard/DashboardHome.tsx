import React, { useEffect, useState } from "react"
import { UploadCloud, FileText, Clock, PlayCircle, BookOpen, MoreVertical, BrainCircuit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dashboardService, type DashboardSummary, type DashboardStats } from "@/services/dashboard.service"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { SkeletonStatCard, SkeletonCard } from "@/components/ui/Skeleton"
import { motion } from "framer-motion"
import AnimatedCard from "@/components/ui/AnimatedCard"

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryRes, statsRes] = await Promise.all([
          dashboardService.getDashboardSummary(),
          dashboardService.getDashboardStats()
        ]);

        if (summaryRes.success && statsRes.success) {
          setSummary(summaryRes.data);
          setStats(statsRes.data);
        }
      } catch (error: any) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const hasContent = summary ? summary.totalNotes > 0 : false;

  const formatStorage = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return mb.toFixed(1) + ' MB';
  };

  const timeAgo = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs} hrs ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return `Yesterday`;
    return `${diffDays} days ago`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return { icon: FileText, color: "text-red-500", bg: "bg-red-500/10" };
    if (fileType.includes("video") || fileType.includes("mp4")) return { icon: PlayCircle, color: "text-blue-500", bg: "bg-blue-500/10" };
    return { icon: FileText, color: "text-primary", bg: "bg-primary/10" };
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-slide-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded shimmer" />
            <div className="h-4 w-64 bg-muted rounded shimmer" />
          </div>
          <div className="h-12 w-48 bg-muted rounded-full shimmer shrink-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <SkeletonStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted rounded shimmer" />
            {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-20" />)}
          </div>
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted rounded shimmer" />
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} className="h-32" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate learning progress based on weekly uploads vs goal (e.g., 5)
  const weeklyGoal = 5;
  const progressPercent = stats ? Math.min(Math.round((stats.weeklyUploads / weeklyGoal) * 100), 100) : 0;

  return (
    <div className="space-y-8 animate-slide-up">

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name?.split(' ')[0] || 'User'}. Ready to learn?</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button size="lg" className="rounded-full shadow-premium gap-2 shrink-0" onClick={() => navigate('/dashboard/notes/upload')}>
            <UploadCloud className="w-5 h-5" />
            Upload New Material
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard
          delay={0}
          glowColor="rgba(37,99,235,0.12)"
          className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progressPercent}%</div>
            <p className="text-xs text-muted-foreground mt-1">Weekly goal completion ({stats?.weeklyUploads || 0}/{weeklyGoal})</p>
            <div className="mt-4 h-2 w-full bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard
          delay={0.06}
          glowColor="rgba(6,182,212,0.12)"
          className="rounded-2xl border border-border bg-card shadow-sm"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-accent" />
              Total AI Notes Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalAINotesGenerated || 0}</div>
            <p className="text-xs text-muted-foreground mt-1"><span className="text-success font-medium">+{stats?.monthlyUploads || 0}</span> this month</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard
          delay={0.12}
          glowColor="rgba(124,58,237,0.12)"
          className="rounded-2xl border border-border bg-card shadow-sm"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatStorage(summary?.storageUsed || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Last upload: {timeAgo(summary?.lastUpload || null)}</p>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Main Content Grid */}
      {hasContent ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Uploads (Files) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Recent Uploads</h2>
              <Button variant="ghost" size="sm" className="text-primary h-8 px-2 text-xs">View All</Button>
            </div>
            
            <div className="space-y-3">
              {summary?.recentNotes?.slice(0, 4).map((note: any) => {
                const { icon: Icon, color, bg } = getFileIcon(note.fileType || "");
                return (
                  <div key={note._id} onClick={() => navigate(`/dashboard/notes/${note._id}`)} className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-premium-hover hover:border-primary/20 transition-all duration-200 cursor-pointer glass">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{note.originalFileName}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.status === 'processing' ? 'Processing...' : (note.status === 'failed' ? 'Failed' : formatStorage(note.fileSize))}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                      {timeAgo(note.createdAt)}
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Notes (AI Content) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">AI Generated Notes</h2>
              <Button variant="ghost" size="sm" className="text-primary h-8 px-2 text-xs">View All</Button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {summary?.recentNotes?.filter((n: any) => n.status === 'completed').slice(0, 4).map((note: any) => (
                <Card key={note._id} onClick={() => navigate(`/dashboard/notes/${note._id}`)} className="hover:shadow-premium-hover hover:border-primary/20 transition-all duration-200 cursor-pointer group glass h-full flex flex-col">
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">{note.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                        <FileText className="w-3 h-3 shrink-0" />
                        <span className="truncate">{note.originalFileName}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <span className="text-[10px] font-medium px-2 py-1 bg-muted text-muted-foreground rounded-md truncate max-w-full">
                        {note.keyPoints?.length || 0} Key Points
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {summary?.recentNotes?.filter((n: any) => n.status === 'completed').length === 0 && (
                <div className="col-span-2 text-center py-12 border border-dashed rounded-xl text-muted-foreground">
                  <BrainCircuit className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  No AI notes generated yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="mt-12 flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-2xl bg-muted/20">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-2">No materials yet</h3>
          <p className="text-muted-foreground max-w-md mb-8">
            Upload your first lecture, PDF, or video to generate AI notes, flashcards, and study guides instantly.
          </p>
          <Button size="lg" className="rounded-full shadow-premium gap-2" onClick={() => navigate('/dashboard/notes/upload')}>
            <UploadCloud className="w-5 h-5" />
            Upload Material
          </Button>
        </div>
      )}
      
    </div>
  )
}
