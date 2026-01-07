import { useAuthStore } from './store';

export const bridgeService = {
  async getYouTubeId(title: string, artist: string): Promise<string | null> {
    const { youtubeApiKey } = useAuthStore.getState();
    const query = `${title} ${artist} audio`;

    if (!youtubeApiKey) {
      console.warn('YouTube API Key missing for bridge.');
      // Fallback strategies? Scraping is hard client-side.
      // Maybe return a "best guess" hardcoded list or error.
      return null;
    }

    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${youtubeApiKey}`);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].id.videoId;
      }
    } catch (e) {
      console.error('Bridge Error:', e);
    }
    return null;
  }
};
