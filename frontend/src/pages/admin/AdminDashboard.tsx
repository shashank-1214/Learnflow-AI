import React, { useMemo } from 'react';
import { ShieldCheck, Users, FileText, BarChart3, ArrowRight, Upload, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminAuthService, adminDataService } from '@/services/admin.service';

const statCards = [
  { label: 'Total Users', value: '—', icon: Users, color: 'from-violet-600 to-indigo-600' },
  { label: 'Total Notes', value: '—', icon: FileText, color: 'from-emerald-600 to-teal-600' },
  { label: 'Storage Used', value: '—', icon: BarChart3, color: 'from-amber-600 to-orange-600' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = adminAuthService.getUser();

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
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-violet-600 to-indigo-600', trend: 'Live Data' },
    { label: 'Total Notes', value: stats?.totalNotes || 0, icon: FileText, color: 'from-emerald-600 to-teal-600', trend: 'Generated' },
    { label: 'Total Uploads', value: stats?.totalUploads || 0, icon: Upload, color: 'from-blue-600 to-cyan-600', trend: 'Source Docs' },
    { label: 'Total Storage Used', value: stats?.totalStorage ? `${(stats.totalStorage / (1024 * 1024)).toFixed(2)} MB` : '0 MB', icon: BarChart3, color: 'from-amber-600 to-orange-600', trend: 'Capacity' },
    { label: "Today's Uploads", value: todaysUploads, icon: Calendar, color: 'from-pink-600 to-rose-600', trend: `+${todaysUploads} Today` },
    { label: 'Monthly Growth', value: monthlyGrowth, icon: TrendingUp, color: 'from-fuchsia-600 to-purple-600', trend: `+${monthlyGrowth} Users` },
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
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          Failed to load dashboard statistics. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Welcome back, <span className="text-violet-400">{user?.name || 'Admin'}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            LearnFlow Administration Panel · Full access granted
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-violet-300">Admin</span>
        </div>
      </div>

      {stats?.totalUsers === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <BarChart3 className="w-12 h-12 text-foreground/20" />
          <h2 className="text-xl font-bold text-foreground">No Data Available</h2>
          <p className="text-sm text-muted-foreground">Your LearnFlow instance is empty. Wait for users to register.</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
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
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: 'Manage Users', sub: 'Search and delete users', to: '/admin/users', color: 'violet' },
                { label: 'Manage Notes', sub: 'View generated AI notes', to: '/admin/notes', color: 'emerald' },
                { label: 'Manage Uploads', sub: 'Review original documents', to: '/admin/uploads', color: 'blue' },
              ].map(({ label, sub, to }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border hover:bg-muted/80 hover:border-border transition-all text-left group"
                >
                  <div>
                    <p className="font-semibold text-foreground text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Recent Users</h2>
            <div className="space-y-3">
              {stats?.recentUsers?.map((u: any) => (
                <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
