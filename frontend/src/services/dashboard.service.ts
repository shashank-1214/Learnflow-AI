import api from '../api/axios';

export interface DashboardSummary {
  totalNotes: number;
  totalUploads: number;
  recentNotes: any[]; // We can type this strictly when we define Note interface
  storageUsed: number;
  lastUpload: string | null;
}

export interface DashboardStats {
  weeklyUploads: number;
  monthlyUploads: number;
  totalAINotesGenerated: number;
  storageUsed: number;
}

export interface DashboardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardService = {
  getDashboardSummary: async (): Promise<DashboardResponse<DashboardSummary>> => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardResponse<DashboardStats>> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};
