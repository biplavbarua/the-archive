import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ControlKnobProps {
  label: string;
  subLabel?: string;
  value: number; // 0 to 100
  onChange: (val: number) => void;
  color?: 'pink' | 'cyan' | 'amber'; // New prop for neon color
  theme?: 'neon' | 'minimal';
  min?: number;
  max?: number;
}

export const ControlKnob: React.FC<ControlKnobProps> = ({ 
  label, 
  subLabel,
  value, 
  onChange,
  color = 'cyan',
  theme = 'neon',
  min = 0,
  max = 100 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const startValue = useRef<number>(0);

  // Normalize value to rotation (-135 to 135 degrees)
  const rotation = (value / 100) * 270 - 135;
  const isNeon = theme === 'neon';

  // Styles based on theme
  const getThemeStyles = () => {
    if (isNeon) {
         return {
            shadow: {
                pink: 'shadow-neon-pink border-cyber-pink',
                cyan: 'shadow-neon-cyan border-cyber-cyan',
                amber: 'shadow-neon-amber border-cyber-amber'
            }[color],
            text: {
                pink: 'text-cyber-pink shadow-neon-pink',
                cyan: 'text-cyber-cyan shadow-neon-cyan',
                amber: 'text-cyber-amber shadow-neon-amber',
            }[color],
            knobBg: 'conic-gradient(from 0deg, #333, #666, #333, #666, #333)',
            indicator: 'bg-current shadow-[0_0_5px_currentColor]',
            ringOp: 'opacity-30'
         };
    } else {
        // Minimal (Neumorphic)
        return {
            shadow: 'shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] border-gray-100', // Neumorphic Outer
            text: 'text-gray-600',
            knobBg: 'linear-gradient(145deg, #f0f0f0, #cacaca)',
            indicator: 'bg-orange-500 w-1.5',
            ringOp: 'opacity-0' // Hide retro grid
        };
    }
  };

  const styles = getThemeStyles();

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = value;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    // Calculate delta: moving up increases value
    const deltaY = startY.current - e.clientY;
    const sensitivity = 0.5;
    let newValue = startValue.current + deltaY * sensitivity;

    // Clamp
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;

    // Haptic feedback on significant changes (every 5%)
    if (Math.floor(newValue / 5) !== Math.floor(value / 5)) {
        if (navigator.vibrate) navigator.vibrate(5);
    }

    onChange(newValue);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        ref={knobRef}
        className="relative w-20 h-20 cursor-ns-resize touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* LED Ring Background (Grid marks) - Neon Only */}
        <svg className={`absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none ${styles.ringOp} transition-opacity duration-300`}>
             <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" className="text-gray-500" />
        </svg>

        {/* Outer Ring Glow / Shadow */}
        <div className={`absolute inset-0 rounded-full border border-opacity-50 blur-[1px] transition-all duration-300 transform 
            ${isNeon ? styles.shadow : styles.shadow}
        `} />
        
        {/* Knob Body */}
        <motion.div 
          className="absolute inset-1 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: styles.knobBg }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Inner Cap */}
            {isNeon && <div className="absolute inset-[2px] rounded-full bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] shadow-inner" />}
            {!isNeon && <div className="absolute inset-[4px] rounded-full bg-linear-to-b from-[#e6e6e6] to-[#ffffff] shadow-inner" />}

             {/* Indicator */}
            <div className={`h-6 absolute top-2 rounded-full z-10 
                ${isNeon ? (`${styles.text?.split(' ')[0]} ${styles.indicator}`) : styles.indicator}
            `} />
        </motion.div>
      </div>
      
      <span className={`mt-3 font-sans text-[10px] font-semibold tracking-widest uppercase z-10 
          ${isNeon 
            ? 'text-white/90 drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]' 
            : 'text-gray-800'
          }
      `}>
        {label}
      </span>
      {subLabel && (
        <span className={`text-[8px] font-mono tracking-[0.2em] font-medium mt-0.5
            ${isNeon ? 'text-cyber-cyan/80' : 'text-gray-400'}
        `}>
            {subLabel}
        </span>
      )}
    </div>
  );
};
