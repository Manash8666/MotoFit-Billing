import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function UserIcon({
  size = 64,
  color = "currentColor",
  strokeWidth = 1.5,
  className = "",
  isHovered: externalHovered,
  ...props
}) {
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;


  const headVariants = {
    normal: {
      y: 0,
      rotate: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    hover: {
      y: [0, -5, 2, -3, 1, 0],
      rotate: [0, -6, 6, -3, 2, 0],
      transition: { duration: 0.65, ease: "easeInOut" }
    }
  };

  // Step 3: Soft blue glow appears behind avatar (0.00s -> 0.50s)
  const glowVariants = {
    normal: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.35, ease: "easeInOut" }
    },
    hover: {
      opacity: [0, 0.75, 0.4],
      scale: [0.5, 1.25, 1],
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  // Step 4: Subtle shine sweeps across avatar from left to right (0.10s -> 0.70s)
  const shineVariants = {
    normal: {
      x: -30,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    hover: {
      x: [-30, 35],
      opacity: [0, 0.85, 0],
      transition: { duration: 0.6, delay: 0.1, ease: "easeInOut" }
    }
  };

  // Step 6: Cute golden waving hand pops in at bottom-right and waves back and forth! 👋 (0.15s -> 0.85s)
  const handVariants = {
    normal: {
      scale: 0,
      rotate: 0,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: {
      scale: [0, 1.25, 1, 1, 1, 1, 1],
      rotate: [0, 26, -18, 22, -14, 6, 0],
      opacity: 1,
      transition: { duration: 0.7, delay: 0.15, ease: "easeInOut" }
    }
  };

  // Step 5: Small floating sparkles appear briefly around profile (0.25s -> 0.88s)
  const particleVariants = {
    normal: {
      opacity: 0,
      scale: 0,
      y: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: (customDelay) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.3, 0],
      y: [0, -6, -11],
      transition: { duration: 0.55, delay: customDelay, ease: "easeInOut" }
    })
  };

  // Sparkle positions around user avatar
  const particles = [
    { cx: 4, cy: 6, delay: 0.25, type: "star", color: "#60a5fa" },
    { cx: 9, cy: 2, delay: 0.30, type: "circle", color: "#fbbf24" },
    { cx: 15, cy: 2, delay: 0.35, type: "star", color: "#93c5fd" },
    { cx: 20, cy: 7, delay: 0.28, type: "circle", color: "#60a5fa" }
  ];

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="-4 -4 32 32"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`cursor-pointer select-none overflow-visible ${className}`}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      initial="normal"
      animate={isHovered ? "hover" : "normal"}
      style={{ width: size, height: size }}
      {...props}
    >
      <defs>
        {/* Soft blue glow radial gradient */}
        <radialGradient id="user-blue-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.65" />
          <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </radialGradient>

        {/* Warm golden yellow fill for waving hand 👋 */}
        <linearGradient id="hand-gold-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.85" />
        </linearGradient>

        {/* Subtle shine linear gradient */}
        <linearGradient id="user-shine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Clip path for body so shine sweeps cleanly inside */}
        <clipPath id="user-body-clip">
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2 Z" />
        </clipPath>

        {/* Soft glow filter for sparkles and hand */}
        <filter id="user-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Soft blue glow behind avatar */}
      <motion.circle
        cx="12"
        cy="13"
        r="11"
        fill="url(#user-blue-glow)"
        stroke="none"
        variants={glowVariants}
      />

      {/* Subtle shine sweeping across body from left to right inside clip path */}
      <g clipPath="url(#user-body-clip)">
        {/* Subtle base tint when hovered */}
        <rect x="0" y="0" width="24" height="24" fill="#eff6ff" opacity="0.4" />

        <motion.rect
          x="0"
          y="-4"
          width="8"
          height="32"
          fill="url(#user-shine-grad)"
          stroke="none"
          style={{ transformOrigin: "center center", transform: "rotate(20deg)" }}
          variants={shineVariants}
        />
      </g>

      {/* User Avatar Shoulders & Body Outline (Stays grounded firmly in place!) */}
      <path
        d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* NEW: User Avatar Head bounces / bobs up and down playfully on hover! */}
      <motion.g
        style={{ transformOrigin: "12px 11px" }}
        variants={headVariants}
      >
        <path
          d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>

      {/* Cute waving hand 👋 popping in at bottom-right and waving back and forth! */}
      <motion.g
        style={{ transformOrigin: "19.5px 23.5px" }}
        variants={handVariants}
      >
        <g transform="translate(13.5, 12.5) scale(0.5)">
          <path
            d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5 M11 11v-2a1.5 1.5 0 0 1 3 0v2.5 M14 10.5a1.5 1.5 0 0 1 3 0v1.5 M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -5.2 -3l-2.8 -4.7a1.5 1.5 0 0 1 2.5 -1.5l2.5 3"
            fill="url(#hand-gold-fill)"
            stroke={color}
            strokeWidth={strokeWidth * 2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </motion.g>

      {/* Small floating sparkles appear briefly around profile */}
      {particles.map((particle, idx) => (
        <motion.g
          key={idx}
          style={{
            transformOrigin: `${particle.cx}px ${particle.cy}px`
          }}
          custom={particle.delay}
          variants={particleVariants}
        >
          {particle.type === "star" ? (
            <path
              d={`M ${particle.cx} ${particle.cy - 1.8} 
                    C ${particle.cx + 0.15} ${particle.cy - 0.3} ${particle.cx + 0.3} ${particle.cy - 0.15} ${particle.cx + 1.8} ${particle.cy} 
                    C ${particle.cx + 0.3} ${particle.cy + 0.15} ${particle.cx + 0.15} ${particle.cy + 0.3} ${particle.cx} ${particle.cy + 1.8} 
                    C ${particle.cx - 0.15} ${particle.cy + 0.3} ${particle.cx - 0.3} ${particle.cy + 0.15} ${particle.cx - 1.8} ${particle.cy} 
                    C ${particle.cx - 0.3} ${particle.cy - 0.15} ${particle.cx - 0.15} ${particle.cy - 0.3} ${particle.cx} ${particle.cy - 1.8} Z`}
              fill={particle.color}
              stroke="none"
              filter="url(#user-glow-filter)"
            />
          ) : (
            <circle
              cx={particle.cx}
              cy={particle.cy}
              r="1.2"
              fill={particle.color}
              stroke="none"
              filter="url(#user-glow-filter)"
            />
          )}
        </motion.g>
      ))}
    </motion.svg>
  );
}

export default UserIcon;
