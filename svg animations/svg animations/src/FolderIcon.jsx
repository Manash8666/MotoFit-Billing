import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function FolderIcon({
  size = 64,
  color = "currentColor",
  strokeWidth = 1.5,
  className = "",
  isHovered: externalHovered,
  ...props
}) {
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;

  // SNAPPY & FAST TIMING (Total duration: ~0.5s, crisp & responsive)
  // Step 1: Folder quickly lifts up by 4px (0.00s -> 0.22s)
  const folderVariants = {
    normal: {
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    hover: {
      y: -4,
      transition: { duration: 0.22, ease: "easeOut" }
    }
  };

  // Step 6: Soft blue shadow appears beneath folder (0.00s -> 0.22s)
  const shadowVariants = {
    normal: {
      opacity: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    hover: {
      opacity: 0.85,
      scaleX: 1.1,
      scaleY: 1,
      transition: { duration: 0.22, ease: "easeOut" }
    }
  };

  // Step 2: Front flap snaps open quickly on hover! (0.05s -> 0.30s)
  const flapVariants = {
    normal: {
      d: "M 3 8 L 21 8 L 21 17 A 2 2 0 0 1 19 19 L 5 19 A 2 2 0 0 1 3 17 Z",
      rotateX: 0,
      scaleY: 1,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    hover: {
      d: "M 6.5 12 L 22 12 L 21 17 A 2 2 0 0 1 19 19 L 5 19 A 2 2 0 0 1 3 17 Z",
      rotateX: -40,
      scaleY: 0.88,
      transition: { duration: 0.25, delay: 0.05, ease: "easeOut" }
    }
  };

  // Step 3 & 4: Document quickly slides out ~30% upward (0.10s -> 0.38s)
  const docVariants = {
    normal: {
      y: 0,
      opacity: 0,
      transition: { duration: 0.18, ease: "easeOut" }
    },
    hover: {
      y: -6.5,
      opacity: 1,
      transition: { duration: 0.28, delay: 0.1, ease: "easeOut" }
    }
  };

  // Step 5: Small glowing sparkles quickly pop around folder (0.15s -> 0.50s)
  const particleVariants = {
    normal: {
      opacity: 0,
      scale: 0,
      y: 0,
      transition: { duration: 0.15, ease: "easeOut" }
    },
    hover: (customDelay) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.3, 0],
      y: [0, -5, -9],
      transition: { duration: 0.35, delay: customDelay, ease: "easeOut" }
    })
  };

  // Snappy particle delays
  const particles = [
    { cx: 5, cy: 7, delay: 0.15, type: "star", color: "#60a5fa" },
    { cx: 9, cy: 3, delay: 0.18, type: "circle", color: "#fbbf24" },
    { cx: 14, cy: 1, delay: 0.22, type: "star", color: "#93c5fd" },
    { cx: 19, cy: 5, delay: 0.16, type: "circle", color: "#60a5fa" },
    { cx: 21, cy: 10, delay: 0.20, type: "star", color: "#fbbf24" }
  ];

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="-2 -4 28 30"
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
        {/* Step 4: Subtle blue gradient for document */}
        <linearGradient id="doc-blue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="1" />
          <stop offset="60%" stopColor="#bfdbfe" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
        </linearGradient>

        {/* Step 6: Soft blue shadow beneath folder */}
        <radialGradient id="blue-folder-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </radialGradient>

        {/* Glow filter for sparkles */}
        <filter id="folder-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Step 6: Soft blue drop shadow beneath folder */}
      <motion.ellipse
        cx="12"
        cy="23.5"
        rx="9"
        ry="2.5"
        fill="url(#blue-folder-shadow)"
        stroke="none"
        variants={shadowVariants}
      />

      {/* Step 1: Folder Group lifts up by 4px */}
      <motion.g variants={folderVariants}>
        {/* Dummy bounding box */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />

        {/* Layer 1: Back Wall & Tab of Folder */}
        <path
          d="M5 19a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2"
          fill="#ffffff"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer 2: Step 3 & 4 - Sliding Document with subtle blue gradient */}
        <motion.g variants={docVariants} style={{ transformOrigin: "center center" }}>
          <rect
            x="6.5"
            y="8.5"
            width="11"
            height="9"
            rx="1"
            fill="url(#doc-blue-grad)"
            stroke={color}
            strokeWidth={strokeWidth * 0.85}
          />
          {/* Subtle lines on document */}
          <line x1="8.5" y1="11" x2="13.5" y2="11" stroke="#3b82f6" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" />
          <line x1="8.5" y1="13.5" x2="15.5" y2="13.5" stroke="#3b82f6" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" />
        </motion.g>

        {/* Layer 3: Step 2 - Front Flap starts 100% FULLY CLOSED, snaps open on hover! */}
        <motion.path
          fill="#ffffff"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center bottom",
            perspective: 600
          }}
          variants={flapVariants}
        />

        {/* Step 5: Small glowing sparkles appear around folder */}
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
                filter="url(#folder-glow)"
              />
            ) : (
              <circle
                cx={particle.cx}
                cy={particle.cy}
                r="1.2"
                fill={particle.color}
                stroke="none"
                filter="url(#folder-glow)"
              />
            )}
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  );
}

export default FolderIcon;
