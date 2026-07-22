import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminDataService } from '@/services/admin.service';
import { Trash2, Search, AlertCircle, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const limit = 10;

  const { data, isLoading, isError }: any = useQuery({
    queryKey: ['adminUsers', page, search],
    queryFn: () => adminDataService.getUsers(page, limit, search),
    keepPreviousData: true,
  } as any);

  const { data: userDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['adminUserDetail', selectedUserId],
    queryFn: () => adminDataService.getUserById(selectedUserId!),
    enabled: !!selectedUserId,
  });

  const deleteMutation = useMutation({
    mutationFn: adminDataService.deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['adminUsers'] as any);
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their notes and uploads.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
          <p className="text-sm text-muted-foreground">View and manage all registered accounts</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-muted rounded-lg" />)}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-400">Failed to load users.</div>
        ) : !data?.users || data.users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground/70">
              <thead className="bg-card border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.users?.map((user: any) => (
                  <tr key={user._id} className="hover:bg-card transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-foreground/60'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedUserId(user._id)}
                        className="p-2 rounded-lg text-violet-400/70 hover:bg-violet-500/10 hover:text-violet-400 transition-all mr-2"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={deleteMutation.isPending || user.role === 'admin'}
                        className="p-2 rounded-lg text-red-400/70 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title={user.role === 'admin' ? "Cannot delete admin" : "Delete User"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-sm font-medium hover:bg-muted/80 disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {data?.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))}
            disabled={page === data?.totalPages}
            className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-sm font-medium hover:bg-muted/80 disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* View Details Modal */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setSelectedUserId(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">User Details</h2>
            </div>
            <div className="p-6">
              {isLoadingDetails ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : userDetails ? (
                <div className="space-y-4">
                  <div><p className="text-xs text-muted-foreground uppercase">ID</p><p className="text-foreground font-mono text-sm">{userDetails._id}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">Name</p><p className="text-foreground">{userDetails.name}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">Email</p><p className="text-foreground">{userDetails.email}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">Role</p><p className="text-foreground capitalize">{userDetails.role}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">Provider</p><p className="text-foreground capitalize">{userDetails.provider || 'local'}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">Verified</p><p className="text-foreground">{userDetails.isVerified ? 'Yes' : 'No'}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">Joined</p><p className="text-foreground">{new Date(userDetails.createdAt).toLocaleString()}</p></div>
                </div>
              ) : (
                <p className="text-red-400">Failed to load details.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
