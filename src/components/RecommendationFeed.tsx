import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

interface RecommendationFeedProps {
  era: number; // 0-100 (representing 1980 - 2025)
  vibe: number; // 0-100 (Chill - Voltage)
  theme: 'neon' | 'minimal';
  onSelect: (id: string, title: string, artist: string) => void;
}

// Mock "Knowledge Graph" Data
export const TRACK_DATABASE = [
  // --- 2010s Synthwave / Outrun ---
  { id: 'MV_3Dpw-BRY', title: 'Nightcall', artist: 'Kavinsky', year: 2010, energy: 40, connections: ['Drive Soundtrack', 'French House'] },
  { id: 'v29I_Ff78_c', title: 'Odd Look', artist: 'Kavinsky', year: 2013, energy: 70, connections: ['The Weeknd', 'French House'] },
  { id: 'er416Ad3R1g', title: 'Midnight City', artist: 'M83', year: 2011, energy: 80, connections: ['Indie Pop', 'Saxophone Solo'] },
  { id: 'J9Q3i5wYjMc', title: 'Tech Noir', artist: 'Gunship', year: 2015, energy: 60, connections: ['Synthwave', 'John Carpenter'] },
  { id: '4x3-d3r5-0s', title: 'Turbo Killer', artist: 'Carpenter Brut', year: 2016, energy: 100, connections: ['Darksynth', 'Action Movie'] },
  { id: 'w7JthgqH2wQ', title: 'Running in the Night', artist: 'FM-84', year: 2016, energy: 50, connections: ['Dreamwave', 'Ollie Wride'] },
  { id: 'lTx3G6h2xyA', title: 'Resonance', artist: 'Home', year: 2014, energy: 30, connections: ['Chillwave', 'Nostalgia'] },
  { id: 'XfR9iY5y94s', title: 'After Dark', artist: 'Mr. Kitty', year: 2014, energy: 45, connections: ['Darkwave', 'TikTok'] },
  
  // --- 80s Classics ---
  { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', year: 1987, energy: 80, connections: ['Classics', 'Internet Culture'] },
  { id: '9jK-NcRmVcw', title: 'The Final Countdown', artist: 'Europe', year: 1986, energy: 90, connections: ['Arena Rock', 'Anthem'] },
  { id: 'djV11Xbc914', title: 'Take On Me', artist: 'a-ha', year: 1985, energy: 85, connections: ['Synthpop', 'Sketch Animation'] },
  { id: 'eH3giaIzONA', title: 'Hotline Bling (Synthcvlt Remix)', artist: 'Drake (Remix)', year: 2015, energy: 55, connections: ['Lo-Fi', 'Remix'] }, 
  { id: 'L_jWHffIx5E', title: 'All Star', artist: 'Smash Mouth', year: 1999, energy: 85, connections: ['Meme', '90s Rock'] },

  // --- Modern Retro / Pop ---
  { id: '9EcjWd-O4jI', title: 'Blinding Lights', artist: 'The Weeknd', year: 2019, energy: 90, connections: ['Modern 80s', 'Max Martin'] },
  { id: 'fHI8X4OXluQ', title: 'Save Your Tears', artist: 'The Weeknd', year: 2020, energy: 65, connections: ['Synthpop', 'Ariana Grande'] },
  { id: 'qWOwDA6p9_c', title: 'Physical', artist: 'Dua Lipa', year: 2020, energy: 95, connections: ['Disco Revival', 'Workout'] },
  
  // --- Cyberspace / Darksynth ---
  { id: 'YwK-pM5a9d8', title: 'Roller Mobster', artist: 'Carpenter Brut', year: 2015, energy: 98, connections: ['Hotline Miami', 'Ultra Violence'] },
  { id: 'p3l7fgvrEKM', title: 'Behemoth', artist: 'GosT', year: 2015, energy: 95, connections: ['Slasherwave', 'Horror'] },
  { id: '2EqM3D5Q0G0', title: 'Neo-Tokyo', artist: 'Perturbator', year: 2016, energy: 92, connections: ['Cyberpunk', 'Akira'] },

  // --- Chill / Vaporwave ---
  { id: 'cU8HrO7XuiE', title: 'Resonance', artist: 'Home', year: 2014, energy: 30, connections: ['Vaporwave', 'Simpsonwave'] }, 
  { id: 'zsLz4w6fX0o', title: 'SimpsonWave 1995', artist: 'FrankJavCee', year: 2016, energy: 20, connections: ['Meme', 'Aesthetic'] },
  // --- City Pop / Future Funk ---
  { id: '3bNITQR4Uso', title: 'Plastic Love', artist: 'Mariya Takeuchi', year: 1984, energy: 40, connections: ['City Pop', 'Japan'] },
  { id: '9Gj47G2e1Jc', title: 'Midnight Pretenders', artist: 'Tomoko Aran', year: 1983, energy: 35, connections: ['City Pop', 'The Weeknd Sample'] },
  { id: 'GeT9p6R9iGg', title: 'Flyday Chinatown', artist: 'Yasuha', year: 1981, energy: 85, connections: ['City Pop', 'TikTok'] },
  { id: '4nBopzLhFkI', title: 'Fantasy', artist: 'Meiko Nakahara', year: 1982, energy: 90, connections: ['City Pop', 'Disco'] },

  // --- Industrial / EBM / Darkwave ---
  { id: 'gTw2YvutJRA', title: 'Headhunter', artist: 'Front 242', year: 1988, energy: 95, connections: ['EBM', 'Industrial'] },
  { id: '8Qx2lMaMsk8', title: 'Join in the Chant', artist: 'Nitzer Ebb', year: 1987, energy: 100, connections: ['EBM', 'Techno Origins'] },
  { id: 'K0d-1r8F9cI', title: 'Lucretia My Reflection', artist: 'Sisters of Mercy', year: 1987, energy: 75, connections: ['Goth', 'Darkwave'] },
  { id: 'lPpUFBVSyWs', title: 'Enjoy the Silence', artist: 'Depeche Mode', year: 1990, energy: 50, connections: ['Synthpop', 'Classic'] },

  // --- New Wave / Post-Punk ---
  { id: 'WguM2Vv3c5w', title: 'Age of Consent', artist: 'New Order', year: 1983, energy: 85, connections: ['New Wave', 'Manchester'] },
  { id: '9GMjH1kB0mE', title: 'Blue Monday', artist: 'New Order', year: 1983, energy: 90, connections: ['Synthpop', 'Best Selling 12"'] },
  { id: '1XOeKqZy-Sg', title: 'Lovesong', artist: 'The Cure', year: 1989, energy: 40, connections: ['Goth', 'Romantic'] },
  { id: 'iIpfWORQwhU', title: 'Just Like Heaven', artist: 'The Cure', year: 1987, energy: 88, connections: ['Indie', 'Alternative'] },

  // --- 90s / 2000s Electronica ---
  { id: '6mdknLVQ8jM', title: 'Around the World', artist: 'Daft Punk', year: 1997, energy: 80, connections: ['French House', 'Robots'] },
  { id: 's9MszVE7aR4', title: 'One More Time', artist: 'Daft Punk', year: 2000, energy: 95, connections: ['French House', 'Anime'] },
  { id: 'FGBhQbmPwH8', title: 'Music Sounds Better With You', artist: 'Stardust', year: 1998, energy: 85, connections: ['French House', 'Classic House'] },
  { id: 'Z3AKrwna2C8', title: 'Lady (Hear Me Tonight)', artist: 'Modjo', year: 2000, energy: 82, connections: ['French House', 'Guitar Loop'] },

  // --- Modern Synth / Indie ---
  { id: '0OkB6p5C2k0', title: 'The Less I Know The Better', artist: 'Tame Impala', year: 2015, energy: 60, connections: ['Indie', 'Bassline'] },
  { id: 'P3P3k8g_vK8', title: 'Everything Now', artist: 'Arcade Fire', year: 2017, energy: 90, connections: ['Indie Rock', 'ABBA Vibes'] },
  { id: 'a5uQMwRMHcs', title: 'Instant Crush', artist: 'Daft Punk ft. Julian Casablancas', year: 2013, energy: 50, connections: ['Vocoder', 'Sad Robot'] },
];

export const RecommendationFeed: React.FC<RecommendationFeedProps> = ({ era, vibe, theme, onSelect }) => {
  const isNeon = theme === 'neon';

  // Algorithm Logic
  const targetYear = 1980 + (era / 100) * 45; 
  const targetEnergy = vibe;

  // Smart Filtering: Attempt Strict -> Relax if needed
  const getTracks = (strictness: 'high' | 'medium' | 'low') => {
      const yearTol = strictness === 'high' ? 5 : (strictness === 'medium' ? 15 : 100);
      const energyTol = strictness === 'high' ? 20 : (strictness === 'medium' ? 40 : 100);

      const matches = TRACK_DATABASE.filter(track => {
        const yearDiff = Math.abs(track.year - targetYear);
        const energyDiff = Math.abs(track.energy - targetEnergy);
        return yearDiff < yearTol && energyDiff < energyTol;
      });
      return matches;
  };

  let filteredTracks = getTracks('high');
  let matchType = 'EXACT MATCH';

  if (filteredTracks.length < 3) {
      filteredTracks = getTracks('medium');
      matchType = 'NEARBY ERA';
  }
  if (filteredTracks.length === 0) {
      filteredTracks = getTracks('low').slice(0, 10); // Check everything, take top 10
      matchType = 'DISCOVERY MODE';
  }

  // Sort by relevance
  filteredTracks.sort((a, b) => {
      const scoreA = Math.abs(a.year - targetYear) + Math.abs(a.energy - targetEnergy);
      const scoreB = Math.abs(b.year - targetYear) + Math.abs(b.energy - targetEnergy);
      return scoreA - scoreB;
  });

  return (
    <div id="recommendation-feed" className="space-y-4 px-2 pb-20">
      <div className="flex items-center justify-between mb-4">
          <h3 className={`font-mono text-sm font-bold tracking-widest uppercase mb-2 ${isNeon ? 'text-cyber-cyan' : 'text-gray-600'}`}>
              {matchType} // {Math.floor(targetYear)}s
          </h3>
          <div className={`text-[10px] px-2 py-1 rounded ${isNeon ? 'bg-cyber-pink/20 text-cyber-pink' : 'bg-gray-200 text-gray-600'}`}>
              VIBE: {Math.floor(targetEnergy)}%
          </div>
      </div>

      <AnimatePresence>
        {filteredTracks.map((track, i) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(track.id, track.title, track.artist)}
            className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300
                ${isNeon 
                    ? 'bg-cyber-panel/50 hover:bg-cyber-panel border border-cyber-grid/50 hover:border-cyber-cyan/50' 
                    : 'bg-white hover:bg-gray-50 shadow-sm border border-gray-100'
                }
            `}
          >
            <div className="flex justify-between items-start">
               <div>
                   <h4 className={`font-bold text-sm ${isNeon ? 'text-white group-hover:text-cyber-cyan' : 'text-gray-800'}`}>
                       {track.title}
                   </h4>
                   <p className={`text-xs mt-1 ${isNeon ? 'text-gray-400' : 'text-gray-500'}`}>
                       {track.artist} • {track.year}
                   </p>
               </div>
               <button className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                   ${isNeon ? 'bg-cyber-pink text-white shadow-neon-pink' : 'bg-black text-white'}
               `}>
                   <Play size={12} fill="currentColor" />
               </button>
            </div>
            
            {/* Knowledge Graph Connections */}
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                {track.connections.map(tag => (
                    <span 
                        key={tag} 
                        className={`text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap
                            ${isNeon 
                                ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20' 
                                : 'bg-gray-100 text-gray-500'
                            }
                        `}
                    >
                        #{tag}
                    </span>
                ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {filteredTracks.length === 0 && (
          <div className={`text-center py-10 font-mono text-xs ${isNeon ? 'text-gray-600' : 'text-gray-400'}`}>
              NO SIGNAL FOUND IN THIS SECTOR...
          </div>
      )}
    </div>
  );
};
