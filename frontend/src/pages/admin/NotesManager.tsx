import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminDataService } from '@/services/admin.service';
import { Trash2, Search, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotesManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, isError }: any = useQuery({
    queryKey: ['adminNotes', page, search],
    queryFn: () => adminDataService.getNotes(page, limit, search),
    keepPreviousData: true,
  } as any);

  const deleteMutation = useMutation({
    mutationFn: adminDataService.deleteNote,
    onSuccess: () => {
      toast.success('Note deleted successfully');
      queryClient.invalidateQueries(['adminNotes'] as any);
      queryClient.invalidateQueries(['adminDashboardStats'] as any);
    },
    onError: () => toast.error('Failed to delete note'),
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this AI-generated note?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Notes</h1>
          <p className="text-sm text-muted-foreground">Review and moderate AI-generated study notes</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-muted rounded-lg" />)}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-400">Failed to load notes.</div>
        ) : !data?.notes || data.notes.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No notes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground/70">
              <thead className="bg-card border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.notes?.map((note: any) => (
                  <tr key={note._id} className="hover:bg-card transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{note.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      {note.owner?.name || 'Unknown User'}<br/>
                      <span className="text-xs text-muted-foreground">{note.owner?.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        note.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        note.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {note.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(note.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(note._id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg text-red-400/70 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Delete Note"
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
    </div>
  );
}
