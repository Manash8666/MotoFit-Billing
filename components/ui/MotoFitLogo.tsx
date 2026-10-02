import React from 'react';

interface MotoFitLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const MotoFitLogo: React.FC<MotoFitLogoProps> = ({ 
  className = "", 
  size = 40,
  glow = true
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MotoFit Logo"
      role="img"
    >
      <defs>
        {glow && (
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f04923" />
          <stop offset="100%" stopColor="#ff7b5c" />
        </linearGradient>
      </defs>

      {/* Outer abstract wheel */}
      <circle 
        cx="50" 
        cy="50" 
        r="42" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeDasharray="16 10" 
        className="text-gray-800 dark:text-white/20 origin-center animate-[spin_20s_linear_infinite]" 
      />
      
      {/* Inner gear rim */}
      <circle 
        cx="50" 
        cy="50" 
        r="30" 
        stroke="currentColor" 
        strokeWidth="2"
        className="text-gray-400 dark:text-gray-600"
      />

      {/* Stylized M/Wrench core */}
      <path
        d="M 28 65 L 28 40 L 40 55 L 50 42 L 60 55 L 72 40 L 72 65"
        stroke="url(#primary-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={glow ? "url(#neon-glow)" : ""}
        className="origin-center hover:scale-110 transition-transform duration-300"
      />

      <circle cx="50" cy="50" r="4" fill="url(#primary-gradient)" />
    </svg>
  );
};
