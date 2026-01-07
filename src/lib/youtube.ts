import YouTubePlayer from 'youtube-player';

export class YouTubeService {
  private player: any = null;
  private elementId: string;
  private onStateChangeCallback: ((state: number) => void) | null = null;
  private isInitialized = false;

  constructor(elementId: string) {
    this.elementId = elementId;
  }

  init(onStateChange: (state: number) => void) {
    this.onStateChangeCallback = onStateChange;
    
    // Prevent double initialization
    if (this.isInitialized) return;

    // Ensure element exists before initializing
    if (!document.getElementById(this.elementId)) {
        console.warn('YouTube Element not found, deferring init');
        return;
    }

    this.player = YouTubePlayer(this.elementId, {
      playerVars: {
        autoplay: 0,
        controls: 0, // Hide native controls
        modestbranding: 1,
        rel: 0,
      },
    });

    this.player.on('stateChange', (event: any) => {
        console.log('YT State Change:', event.data);
        if (this.onStateChangeCallback) {
            this.onStateChangeCallback(event.data);
        }
    });

    this.player.on('ready', () => {
        console.log('YT Player Ready');
    });

    this.player.on('error', (e: any) => {
        console.error('YT Player Error:', e);
    });

    this.isInitialized = true;
  }

  loadVideo(videoId: string) {
    console.log('Loading Video:', videoId);
    if (!this.player || !this.player.loadVideoById) {
        console.warn('Player not ready, queuing video:', videoId);
        // Retry once after short delay or simple fail-safe
        setTimeout(() => this.player?.loadVideoById?.(videoId), 1000);
        return;
    }
    this.player.loadVideoById(videoId);
  }

  play() {
    console.log('Playing Video');
    this.player.playVideo();
  }

  pause() {
    console.log('Pausing Video');
    this.player.pauseVideo();
  }

  setPlaybackRate(rate: number) {
    this.player.setPlaybackRate(rate);
  }

  seekTo(seconds: number, allowSeekAhead: boolean = true) {
    this.player.seekTo(seconds, allowSeekAhead);
  }

  async getCurrentTime(): Promise<number> {
    return this.player.getCurrentTime();
  }
}

export const ytService = new YouTubeService('youtube-player-hidden');
(window as any).ytService = ytService;
