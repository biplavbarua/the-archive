import { useState, useEffect, useRef } from 'react';
import { PlayerBar } from './components/PlayerBar';
import { SettingsModal } from './components/SettingsModal';
import { TRACK_DATABASE } from './components/RecommendationFeed'; // Re-using data for now
import { ytService } from './lib/youtube';
import { Search, Music, Play } from 'lucide-react';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRACK_DATABASE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [queue, setQueue] = useState<typeof TRACK_DATABASE>([]); // Moved state up
  
  // Initialize Engine
  const handlePlayRef = useRef<(t: typeof TRACK_DATABASE[0]) => void>(() => {});
  const queueRef = useRef<typeof TRACK_DATABASE>([]);

  // Initialize Engine
  useEffect(() => {
    ytService.init((state) => {
        if (state === 1) setIsPlaying(true);
        if (state === 2) setIsPlaying(false);
        if (state === 0) {
            // Track Ended - Play Next
            const currentQueue = queueRef.current;
            if (currentQueue.length > 0) {
                const nextTrack = currentQueue[0];
                handlePlayRef.current(nextTrack);
                // Queue update happens in handlePlay or we explicitly slice here?
                // Actually handlePlay fetches *new* recommendations.
                // We should update the visual queue too.
                setQueue(q => q.slice(1));
            }
        }
    });
  }, []);

  // Sync Refs moved down


  // Search Logic
  const [searchResults, setSearchResults] = useState<typeof TRACK_DATABASE>([]);
  
  useEffect(() => {
    const performSearch = async () => {
        if (!searchQuery) {
            setSearchResults(TRACK_DATABASE); // Show local DB by default or empty?
            return;
        }

        // 1. Try Direct YouTube Search
        const { isYoutubeConfigured } = await import('./lib/store').then(m => m.useAuthStore.getState());
        
        if (isYoutubeConfigured()) {
            const { youtubeSearchService } = await import('./lib/youtubeSearch');
            const tracks = await youtubeSearchService.search(searchQuery);
            if (tracks.length > 0) {
                 setSearchResults(tracks as any);
                 return;
            }
        }

        // 2. Fallback to Local Filter
        const filtered = TRACK_DATABASE.filter(t => 
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.artist.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
    };

    const timeout = setTimeout(performSearch, 500); // Debounce
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Queue & Algorithm

  // ... (Search Logic remains) ...

  const displayTracks = searchQuery ? searchResults : TRACK_DATABASE;

  const handlePlay = async (track: typeof TRACK_DATABASE[0]) => {
    // If same track, toggle
    if (currentTrack.id === track.id) {
       isPlaying ? ytService.pause() : ytService.play();
       return;
    }

    // Direct Play
    setCurrentTrack(track);
    ytService.loadVideo(track.id);
    setIsPlaying(true);

    // FETCH RECOMMENDATIONS ("The Algorithm")
    const { isYoutubeConfigured } = await import('./lib/store').then(m => m.useAuthStore.getState());
    if (isYoutubeConfigured()) {
       const { youtubeSearchService } = await import('./lib/youtubeSearch');
       console.log('Fetching recommendations for:', track.title);
       const related = await youtubeSearchService.getRelated(track.id, track.title, track.artist);
       if (related.length > 0) {
          setQueue(related as any); // Populate "Up Next"
       }
    }
  };

  const handleNext = () => {
    const idx = TRACK_DATABASE.findIndex(t => t.id === currentTrack.id);
    const next = TRACK_DATABASE[(idx + 1) % TRACK_DATABASE.length];
    handlePlay(next);
  };

  const handlePrev = () => {
    const idx = TRACK_DATABASE.findIndex(t => t.id === currentTrack.id);
    const prev = TRACK_DATABASE[(idx - 1 + TRACK_DATABASE.length) % TRACK_DATABASE.length];
    handlePlay(prev);
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-gray-50 font-sans text-gray-900">
      
      <div id="youtube-player-hidden" className="absolute top-[-9999px] left-[-9999px]" />

      {/* --- Header / Search --- */}
      <div className="flex-none bg-white border-b border-gray-200 px-4 py-4 z-10 sticky top-0">
        <div className="max-w-screen-lg mx-auto flex gap-4 items-center">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Music size={18} />
            </div>
            Archive
          </div>
          
          <div className="flex-1 max-w-md relative group">
             <div className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-black transition-colors">
               <Search size={18} />
             </div>
             <input 
               type="text" 
               placeholder="Search Library..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
             />
          </div>
        </div>
      </div>

      {/* --- Main Content (Track List) --- */}
      <div className="flex-1 overflow-y-auto px-4 py-2 pb-24">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 border-b border-gray-200 mb-2">
            <span className="w-8">#</span>
            <span className="flex-1">Title</span>
            <span className="flex-1 hidden sm:block">Artist</span>
            <span className="w-20 hidden sm:block text-right">Year</span>
          </div>



          {/* UP NEXT QUEUE */}
          {queue.length > 0 && (
             <div className="mt-8 mb-4">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Up Next (Auto-Radio)</div>
               <div className="space-y-1 opacity-75 grayscale hover:grayscale-0 transition-all">
                  {queue.slice(0, 5).map((track, i) => ( // Show top 5
                     <div key={track.id + i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/50">
                        <div className="w-8 text-center text-xs text-gray-300 font-mono">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                           <div className="text-sm font-medium text-gray-700 truncate">{track.title}</div>
                           <div className="text-xs text-gray-500 truncate">{track.artist}</div>
                        </div>
                     </div>
                  ))}
               </div>
             </div>
          )}

          <div className="space-y-1">
            {displayTracks.map((track, i) => {
               const isActive = currentTrack?.title === track.title; // Fallback match by title if IDs differ (Spotify vs Local)
               return (
                 <div 
                   key={track.id}
                   onClick={() => handlePlay(track)}
                   className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-colors
                     ${isActive ? 'bg-black/5' : 'hover:bg-gray-100'}
                   `}
                 >
                    <div className="w-8 text-center text-sm text-gray-400 font-mono flex items-center justify-center">
                       {isActive && isPlaying ? (
                          <div className="flex gap-[2px] items-end h-3">
                             <div className="w-[3px] bg-black animate-[bounce_0.6s_infinite]" />
                             <div className="w-[3px] bg-black animate-[bounce_0.8s_infinite]" />
                             <div className="w-[3px] bg-black animate-[bounce_0.5s_infinite]" />
                          </div>
                       ) : (
                          <span className="group-hover:hidden">{i + 1}</span>
                       )}
                       <Play size={12} className={`hidden group-hover:block ${isActive ? 'text-black' : 'text-gray-500'}`} fill="currentColor" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <div className={`text-sm font-medium truncate ${isActive ? 'text-black' : 'text-gray-900'}`}>{track.title}</div>
                       <div className="sm:hidden text-xs text-gray-500 truncate">{track.artist}</div>
                    </div>
                    
                    <div className={`flex-1 hidden sm:block text-sm truncate ${isActive ? 'text-black' : 'text-gray-500'}`}>
                      {track.artist}
                    </div>

                    <div className="w-20 hidden sm:block text-right text-sm text-gray-400 font-mono">
                      {track.year}
                    </div>
                 </div>
               );
            })}

            {displayTracks.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                No tracks found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Player Bar --- */}
      <PlayerBar 
         isPlaying={isPlaying} 
         currentTrack={currentTrack} 
         onTogglePlay={() => isPlaying ? ytService.pause() : ytService.play()}
         onNext={handleNext}
         onPrev={handlePrev}
         onSettingsClick={() => setIsSettingsOpen(true)}
      />
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
