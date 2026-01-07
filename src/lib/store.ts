import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  youtubeApiKey: string;
  soundCloudClientId: string;
  setYoutubeApiKey: (key: string) => void;
  setSoundCloudClientId: (id: string) => void;
  isYoutubeConfigured: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      youtubeApiKey: '',
      soundCloudClientId: '',
      setYoutubeApiKey: (key) => set({ youtubeApiKey: key }),
      setSoundCloudClientId: (id) => set({ soundCloudClientId: id }),
      isYoutubeConfigured: () => !!get().youtubeApiKey,
    }),
    {
      name: 'archive-auth-storage',
    }
  )
);
