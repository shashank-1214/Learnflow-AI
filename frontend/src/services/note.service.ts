import api from '../api/axios';

export interface Note {
  _id: string;
  originalFileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  status: 'processing' | 'completed' | 'failed';
  title?: string;
  summary?: string;
  generatedNotes?: string;
  keyPoints?: string[];
  owner: string;
  sourceType: 'file' | 'image';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesListResponse {
  success: boolean;
  message?: string;
  data: Note[];
}

export interface NoteResponse {
  success: boolean;
  message: string;
  data: Note;
}

export const noteService = {
  uploadNote: async (file: File, title?: string, onUploadProgress?: (progressEvent: any) => void): Promise<NoteResponse> => {
    if (!file) throw new Error('File is required');

    const formData = new FormData();
    formData.append('file', file);
    if (title) {
      formData.append('title', title);
    }
    
    const response = await api.post('/notes/upload', formData, {
      onUploadProgress,
    });
    return response.data;
  },

  getAllNotes: async (): Promise<NotesListResponse> => {
    const response = await api.get('/notes');
    return response.data;
  },

  getNoteById: async (id: string): Promise<NoteResponse> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  updateNote: async (id: string, updateData: Partial<Note>): Promise<NoteResponse> => {
    const response = await api.patch(`/notes/${id}`, updateData);
    return response.data;
  },

  deleteNote: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  chatWithNote: async (id: string, message: string, history: { role: string; text: string }[]): Promise<{ success: boolean; answer: string }> => {
    const response = await api.post(`/notes/${id}/chat`, { message, history });
    return response.data;
  }
};
