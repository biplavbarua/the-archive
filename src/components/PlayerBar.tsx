import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings } from 'lucide-react';

interface PlayerBarProps {
  isPlaying: boolean;
  currentTrack: { title: string; artist: string; id: string } | null;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSettingsClick: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ isPlaying, currentTrack, onTogglePlay, onNext, onPrev, onSettingsClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        
        {/* Track Info */}
        <div className="flex items-center w-1/3 truncate pr-4">
          {currentTrack ? (
            <>
               <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 overflow-hidden mr-3">
                 <img src={`https://img.youtube.com/vi/${currentTrack.id}/default.jpg`} alt="art" className="w-full h-full object-cover" />
               </div>
               <div className="truncate">
                 <div className="font-semibold text-sm text-gray-900 truncate">{currentTrack.title}</div>
                 <div className="text-xs text-gray-500 truncate">{currentTrack.artist}</div>
               </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">Select a track to play</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={onPrev} className="text-gray-600 hover:text-black transition">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={onTogglePlay} 
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={onNext} className="text-gray-600 hover:text-black transition">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Volume / Extra */}
        <div className="flex items-center justify-end w-1/3 gap-4 text-gray-400">
           <button onClick={onSettingsClick} className="hover:text-black transition">
             <Settings size={18} />
           </button>
           <div className="flex items-center gap-2">
             <Volume2 size={18} />
             <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
               <div className="w-3/4 h-full bg-gray-400" />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
