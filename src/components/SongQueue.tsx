import React from 'react';
import { Music } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

const MOCK_QUEUE: Song[] = [
  { id: 'MV_3Dpw-BRY', title: 'Nightcall', artist: 'Kavinsky', duration: '4:18' },
  { id: '4NRXx6U8ABQ', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20' },
  { id: '-nC5TBv3suI', title: 'Tech Noir', artist: 'Gunship', duration: '4:52' },
  { id: 'dX3k_QDnzHE', title: 'Midnight City', artist: 'M83', duration: '4:03' },
  { id: 'er416Ad3R1g', title: 'Resonance', artist: 'Home', duration: '3:32' },
];

export const SongQueue: React.FC<{ onSelect: (id: string, title: string, artist: string) => void }> = ({ onSelect }) => {
  return (
    <div className="w-full px-6 py-4 space-y-4">
      <div className="flex items-center gap-2 text-cyber-cyan border-b border-cyber-cyan/30 pb-2">
        <Music size={16} />
        <h3 className="font-mono text-sm tracking-widest uppercase glow-text">UP NEXT</h3>
      </div>
      
      <div className="space-y-3">
        {MOCK_QUEUE.map((song, i) => (
          <div 
            key={song.id}
            onClick={() => onSelect(song.id, song.title, song.artist)}
            className="group flex items-center justify-between p-3 rounded border border-cyber-grid bg-cyber-panel/50 backdrop-blur-sm hover:border-cyber-pink/50 transition-colors cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-gray-500 w-4">0{i + 1}</span>
                <div>
                    <p className="font-sans text-sm font-medium text-white group-hover:text-cyber-pink transition-colors">{song.title}</p>
                    <p className="font-mono text-xs text-gray-400">{song.artist}</p>
                </div>
            </div>
            <span className="font-mono text-xs text-cyber-cyan opacity-50">{song.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
