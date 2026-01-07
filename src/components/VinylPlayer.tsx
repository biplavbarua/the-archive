import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Disc } from 'lucide-react';

interface VinylPlayerProps {
  isPlaying: boolean;
  albumArt?: string;
  theme: 'neon' | 'minimal';
  onScratchStart?: () => void;
  onScratchEnd?: () => void;
  onScratchMove?: (rotationDelta: number) => void;
}

export const VinylPlayer: React.FC<VinylPlayerProps> = ({ 
  isPlaying, 
  albumArt, 
  theme,
  onScratchStart, 
  onScratchEnd, 
  onScratchMove 
}) => {
  const [isScratching, setIsScratching] = React.useState(false);
  const lastAngle = React.useRef<number>(0);
  const lastEmit = React.useRef<number>(0);
  const diskRef = React.useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  // Visual Rotation State
  const [visualRotation, setVisualRotation] = React.useState(0);
  const animationFrame = React.useRef<number>(0);

  // Auto-spin logic
  React.useEffect(() => {
    if (isPlaying && !isScratching) {
        const span = () => {
            setVisualRotation(prev => (prev + 1) % 360);
            animationFrame.current = requestAnimationFrame(span);
        };
        animationFrame.current = requestAnimationFrame(span);
    } else {
        cancelAnimationFrame(animationFrame.current);
    }
    return () => cancelAnimationFrame(animationFrame.current);
  }, [isPlaying, isScratching]);

  // Helper to calculate angle from center
  const getAngle = (clientX: number, clientY: number) => {
    if (!diskRef.current) return 0;
    const rect = diskRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsScratching(true);
    lastAngle.current = getAngle(e.clientX, e.clientY);
    (e.target as Element).setPointerCapture(e.pointerId);
    onScratchStart?.();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Update Tilt
    if (diskRef.current) {
        const rect = diskRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    }

    if (!isScratching) return;
    e.preventDefault();
    
    const currentAngle = getAngle(e.clientX, e.clientY);
    let delta = currentAngle - lastAngle.current;
    
    // Handle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // Direct 1:1 Visual Interaction
    setVisualRotation(prev => prev + delta);
    lastAngle.current = currentAngle;

    // Throttle Update (16ms ~ 60fps) for Audio
    const now = Date.now();
    if (now - lastEmit.current > 32) { 
        onScratchMove?.(delta);
        lastEmit.current = now;
    }
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsScratching(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
    x.set(0);
    y.set(0);
    onScratchEnd?.();
  };

  const isNeon = theme === 'neon';

  return (
    <motion.div 
      className="relative w-full aspect-square max-w-[320px] flex items-center justify-center mx-auto perspective-1000 touch-none"
      style={{ perspective: 1000 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Container with Tilt */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center transform-preserve-3d"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
          {/* Base/Platter Glow */}
          <div className={`absolute inset-0 rounded-xl transition-all duration-500
              ${isNeon 
                  ? 'border-2 border-cyber-pink/50 shadow-neon-pink bg-cyber-panel/80' 
                  : 'bg-white shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] rounded-[2rem]'
              } backdrop-blur-sm z-0 pointer-events-none`} 
          />
          
          {/* Corner Accents (Neon Only) */}
          {isNeon && (
            <>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan z-10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan z-10 pointer-events-none" />
            </>
          )}

          {/* The Record */}
          <motion.div
            ref={diskRef}
            className={`relative w-[85%] h-[85%] rounded-full shadow-2xl flex items-center justify-center overflow-hidden z-20 cursor-grab active:cursor-grabbing touch-none
                ${isNeon ? 'bg-black border-2 border-gray-800' : 'bg-[#1a1a1a] border-4 border-[#222]'}
            `}
            animate={{ 
                rotate: visualRotation,
                scale: isScratching ? 0.98 : 1
            }} 
            transition={{ 
                rotate: { duration: 0 }, // Instant updates
                scale: { duration: 0.1 }
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            style={{ willChange: 'transform', transformStyle: 'preserve-3d', translateZ: 20 }}
          >
            {/* Vinyl Texture */}
            <div className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                background: `repeating-radial-gradient(#111 0, #111 2px, #000 3px, #000 4px)`
                }} 
            />
            
            {/* Reflections */}
            <div className={`absolute inset-0 rounded-full pointer-events-none
                ${isNeon 
                    ? 'bg-gradient-to-tr from-cyber-cyan/10 to-transparent' 
                    : 'bg-gradient-to-tr from-white/10 to-transparent'
                }`} 
            />

            {/* Label */}
            <div className={`relative w-2/5 h-2/5 rounded-full overflow-hidden shadow-inner z-20 flex items-center justify-center pointer-events-none
                ${isNeon ? 'border-4 border-gray-900 bg-gray-900' : 'border-4 border-[#e0e0e0] bg-[#f0f0f0]'}
            `}>
                {albumArt ? (
                    <img src={albumArt} alt="Album Art" className="w-full h-full object-cover opacity-90" />
                ) : (
                    <Disc className={`w-12 h-12 ${isNeon ? 'text-cyber-pink' : 'text-gray-400'}`} />
                )}
            </div>
          </motion.div>

          {/* Tone Arm */}
          <motion.div 
            className="absolute top-[-10%] right-[-10%] w-24 h-48 origin-top-right pointer-events-none z-30 drop-shadow-xl"
            initial={{ rotate: -25 }}
            animate={{ rotate: isPlaying ? 0 : -35 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ translateZ: 40 }}
          >
              <div className={`absolute top-8 right-8 w-1.5 h-32 rounded-full origin-top transform rotate-12 border
                  ${isNeon 
                    ? 'bg-gradient-to-r from-gray-300 via-white to-gray-400 border-gray-600' 
                    : 'bg-[#d0d0d0] border-[#b0b0b0]'
                  }`} 
              />
              <div className={`absolute bottom-[3.5rem] right-[5.5rem] w-14 h-6 rounded transform -rotate-12 flex items-center justify-center border
                  ${isNeon 
                    ? 'bg-cyber-pink/80 shadow-neon-pink border-white/20' 
                    : 'bg-orange-500 border-orange-600'
                  }`}>
                  <div className="w-0.5 h-2 bg-white rounded-full mt-4" />
              </div>
          </motion.div>
      </motion.div>
    </motion.div>
  );
};
