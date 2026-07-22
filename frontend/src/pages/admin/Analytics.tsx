import React, { useMemo } from 'react';
import { Users, FileText, Upload, BarChart3, Calendar, TrendingUp, AlertCircle, LineChart, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminDataService } from '@/services/admin.service';

// We import Recharts components to have them available for future integration,
// but since we lack historical data, we will render empty states.
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function Analytics() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: adminDataService.getDashboardStats,
  });

  const { todaysUploads, monthlyGrowth } = useMemo(() => {
    if (!stats) return { todaysUploads: 0, monthlyGrowth: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const todaysUploads = stats.recentUploads?.filter((u: any) => new Date(u.createdAt) >= today).length || 0;
    const monthlyGrowth = stats.recentUsers?.filter((u: any) => new Date(u.createdAt) >= thisMonth).length || 0;
    
    return { todaysUploads, monthlyGrowth };
  }, [stats]);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-violet-600 to-indigo-600', trend: 'Live' },
    { label: 'Total Notes', value: stats?.totalNotes || 0, icon: FileText, color: 'from-emerald-600 to-teal-600', trend: 'Generated' },
    { label: 'Total Uploads', value: stats?.totalUploads || 0, icon: Upload, color: 'from-blue-600 to-cyan-600', trend: 'Source' },
    { label: 'Storage Used', value: stats?.totalStorage ? `${(stats.totalStorage / (1024 * 1024)).toFixed(2)} MB` : '0 MB', icon: BarChart3, color: 'from-amber-600 to-orange-600', trend: 'Capacity' },
    { label: "Today's Uploads", value: todaysUploads, icon: Calendar, color: 'from-pink-600 to-rose-600', trend: `+${todaysUploads} Today` },
    { label: 'Monthly Growth', value: monthlyGrowth, icon: TrendingUp, color: 'from-fuchsia-600 to-purple-600', trend: `+${monthlyGrowth} Users` },
  ];

  const chartPlaceholders = [
    { id: 'users', title: 'Users Growth' },
    { id: 'notes', title: 'Notes Generated' },
    { id: 'uploads', title: 'Upload Activity' },
    { id: 'storage', title: 'Storage Usage' },
  ];

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-10 w-1/3 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-muted rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-72 bg-muted rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          Failed to load analytics statistics. Please check your connection and refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Activity className="w-6 h-6 text-violet-400" />
          Platform Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor LearnFlow usage, growth, and resource statistics in real-time.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {statCards.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="relative p-5 rounded-2xl bg-muted/30 border border-border overflow-hidden group hover:bg-muted transition-all flex flex-col justify-between h-full">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
            <div>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-1 truncate">{value}</p>
              <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartPlaceholders.map((chart) => (
          <div key={chart.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col h-80">
            <h2 className="text-sm font-semibold text-foreground/70 mb-6">{chart.title}</h2>
            
            {/* 
              Recharts implementation would go here when backend supports historical data endpoints.
              Currently, we render the elegant empty state as requested, without using mock datasets.
            */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
                <LineChart className="w-8 h-8 text-foreground/20" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/60">No analytics data available yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[250px] mx-auto">
                  Historical dataset is currently unavailable. This chart will populate automatically when timeline data is generated.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
