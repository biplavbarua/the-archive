import { useAuthStore } from './store';

export interface YouTubeTrack {
  id: string;
  title: string;
  artist: string;
  year: number;
  energy: number;
  connections: string[];
}

export const youtubeSearchService = {
  async search(query: string): Promise<YouTubeTrack[]> {
    const { youtubeApiKey } = useAuthStore.getState();
    const searchMode = `${query} official audio`; // Optimize for music

    if (!youtubeApiKey) {
      console.warn('YouTube API Key missing.');
      return [];
    }

    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchMode)}&type=video&videoCategoryId=10&maxResults=20&key=${youtubeApiKey}`);
      const data = await res.json();
      
      if (!data.items) return [];

      return data.items.map((item: any) => {
        // Basic parsing: "Artist - Title" vs "Title"
        const snippetTitle = item.snippet.title;
        const channelTitle = item.snippet.channelTitle;
        
        let artist = channelTitle.replace('VEVO', '').trim();
        let title = snippetTitle;

        // Clean up common YouTube junk
        title = title.replace(/\(Official Video\)/gi, '')
                     .replace(/\(Official Audio\)/gi, '')
                     .replace(/\(Lyrics\)/gi, '')
                     .replace(/\[.*?\]/g, '')
                     .trim();

        // Heuristic: If " - " exists, split it
        if (title.includes(' - ')) {
            const parts = title.split(' - ');
            artist = parts[0].trim();
            title = parts[1].trim();
        }

        return {
            id: item.id.videoId,
            title: title,
            artist: artist,
            year: new Date(item.snippet.publishedAt).getFullYear() || 2024,
            energy: 80, // Dynamic?
            connections: ['YouTube']
        };
      });
    } catch (e) {
      console.error('YouTube Search Error:', e);
      return [];
    }
  },

  async getRelated(videoId: string, title: string, artist: string): Promise<YouTubeTrack[]> {
    const { youtubeApiKey } = useAuthStore.getState();

    if (!youtubeApiKey) {
      return [];
    }

    // "Related" endpoint is deprecated/broken.
    // Workaround: Search for "Artist similar songs" or "Title Artist mix"
    const query = `${artist} ${title} similar songs`;

    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=10&key=${youtubeApiKey}`);
      const data = await res.json();
      
      if (!data.items) return [];

      return data.items
        .filter((item: any) => item.id.videoId !== videoId) // Exclude current track
        .map((item: any) => {
        // Basic parsing (same as search)
        const snippetTitle = item.snippet.title;
        const channelTitle = item.snippet.channelTitle;
        
        let relatedArtist = channelTitle.replace('VEVO', '').trim();
        let relatedTitle = snippetTitle;

        relatedTitle = relatedTitle.replace(/\(Official Video\)/gi, '')
                     .replace(/\(Official Audio\)/gi, '')
                     .replace(/\(Lyrics\)/gi, '')
                     .replace(/\[.*?\]/g, '')
                     .trim();

        if (relatedTitle.includes(' - ')) {
            const parts = relatedTitle.split(' - ');
            relatedArtist = parts[0].trim();
            relatedTitle = parts[1].trim();
        }

        return {
            id: item.id.videoId,
            title: relatedTitle,
            artist: relatedArtist,
            year: new Date(item.snippet.publishedAt).getFullYear() || 2024,
            energy: 60, 
            connections: ['Recommendation']
        };
      });
    } catch (e) {
      console.error('YouTube Related Error:', e);
      return [];
    }
  }
};
