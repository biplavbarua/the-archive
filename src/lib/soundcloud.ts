import { useAuthStore } from './store';

export interface SoundCloudTrack {
  id: string;
  title: string;
  artist: string;
  artwork_url?: string;
  stream_url?: string;
  source: 'soundcloud';
}

export const soundCloudService = {
  // Placeholder for real search
  search: async (query: string): Promise<SoundCloudTrack[]> => {
     const { soundCloudClientId } = useAuthStore.getState();
     console.log('Searching SoundCloud for:', query);

     if (!soundCloudClientId) {
        console.warn('SoundCloud Client ID missing.');
        return [];
     }

     // Mock Implementation until keys are available
     // In a real app, this would hit https://api-v2.soundcloud.com/search/tracks
     return []; 
  },

  resolve: async (_url: string) => {
      // Resolve SC URL to track stream
      return null;
  }
};
