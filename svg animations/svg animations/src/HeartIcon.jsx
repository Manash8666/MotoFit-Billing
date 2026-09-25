import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function HeartIcon({
  size = 64,
  color = "currentColor",
  strokeWidth = 1.5,
  className = "",
  isHovered: externalHovered,
  ...props
}) {
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;

  // SNAPPY & FASTER TIMING (Total duration: ~0.62s, energetic & responsive)
  // Step 1: Heart quickly scales with realistic "lub-dub" heartbeat effect (0.00s -> 0.45s)
  const heartbeatVariants = {
    normal: {
      scale: 1,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: {
      scale: [1, 1.14, 1.02, 1.08],
      transition: { duration: 0.45, ease: "easeInOut" }
    }
  };

  // Step 5: Subtle ECG heartbeat line quickly zips across behind heart (0.03s -> 0.43s)
  const ecgVariants = {
    normal: {
      pathLength: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    hover: {
      pathLength: [0, 1],
      opacity: [0, 0.75, 0],
      transition: { duration: 0.4, delay: 0.03, ease: "easeInOut" }
    }
  };

  // Step 2: Purple & red gradient quickly fills heart from bottom to top (0.06s -> 0.46s)
  const fillVariants = {
    normal: {
      y: 26,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, delay: 0.06, ease: "easeInOut" }
    }
  };

  // Step 3 & 6: Soft purple-red aura quickly blooms around heart (0.10s -> 0.50s)
  const auraVariants = {
    normal: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: {
      opacity: [0, 0.75, 0.4],
      scale: [0.5, 1.25, 1],
      transition: { duration: 0.4, delay: 0.1, ease: "easeInOut" }
    }
  };

  // Step 4: Tiny floating particles emerge quickly and fade away (0.15s -> 0.60s)
  const particleVariants = {
    normal: {
      opacity: 0,
      scale: 0,
      y: 0,
      x: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    hover: (custom) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.3, 0],
      y: [0, custom.dy * 0.5, custom.dy],
      x: [0, custom.dx * 0.5, custom.dx],
      transition: { duration: 0.45, delay: custom.delay, ease: "easeInOut" }
    })
  };

  // Snappy particle delays finishing by ~0.62s
  const particles = [
    { cx: 6, cy: 7, delay: 0.15, type: "heart", color: "#8b5cf6", dx: -4, dy: -10 },
    { cx: 9, cy: 4, delay: 0.18, type: "circle", color: "#f43f5e", dx: -2, dy: -12 },
    { cx: 12, cy: 3, delay: 0.22, type: "heart", color: "#db2777", dx: 0, dy: -14 },
    { cx: 15, cy: 4, delay: 0.16, type: "circle", color: "#c084fc", dx: 2, dy: -12 },
    { cx: 18, cy: 7, delay: 0.20, type: "heart", color: "#ff4d6d", dx: 4, dy: -10 }
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
        {/* Step 2: Beautiful purple & red gradient fill (Purple at bottom, Ruby Red at top) */}
        <linearGradient id="heart-purple-red-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
          <stop offset="45%" stopColor="#db2777" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
        </linearGradient>

        {/* Step 3: Soft glowing purple-red aura radial gradient */}
        <radialGradient id="heart-aura-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#db2777" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#9333ea" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>

        {/* Clip path for filling heart from bottom to top */}
        <clipPath id="heart-fill-clip">
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572 Z" />
        </clipPath>

        {/* Soft glow filter for aura and sparkles */}
        <filter id="heart-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Step 3: Soft glowing aura behind heart */}
      <motion.circle
        cx="12"
        cy="12"
        r="11"
        fill="url(#heart-aura-grad)"
        stroke="none"
        variants={auraVariants}
      />

      {/* Step 5: Subtle ECG heartbeat pulse line behind the heart */}
      <motion.path
        d="M -2 13 L 4 13 L 7 8 L 10 18 L 13 6 L 16 15 L 19 13 L 26 13"
        fill="none"
        stroke="#db2777"
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#heart-glow-filter)"
        variants={ecgVariants}
      />

      {/* Step 1: Heart Group scaling with realistic heartbeat effect */}
      <motion.g variants={heartbeatVariants} style={{ transformOrigin: "12px 12px" }}>
        {/* Dummy bounding box */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />

        {/* Step 2: Beautiful purple & red gradient smoothly filling heart from bottom to top */}
        <g clipPath="url(#heart-fill-clip)">
          <motion.rect
            x="-6"
            y="-6"
            width="36"
            height="32"
            fill="url(#heart-purple-red-grad)"
            stroke="none"
            variants={fillVariants}
          />
        </g>

        {/* Heart Outline */}
        <path
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572 Z"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Step 4: Tiny floating particles emerge and fade away */}
        {particles.map((particle, idx) => (
          <motion.g
            key={idx}
            style={{
              transformOrigin: `${particle.cx}px ${particle.cy}px`
            }}
            custom={particle}
            variants={particleVariants}
          >
            {particle.type === "heart" ? (
              <path
                d="M 12 11.5 l -1.5 1.5 l -1.5 -1.5 a 1 1 0 1 1 1.5 -1.3 a 1 1 0 1 1 1.5 1.3 Z"
                fill={particle.color}
                stroke="none"
                filter="url(#heart-glow-filter)"
                style={{
                  transform: `translate(${particle.cx - 12}px, ${particle.cy - 11.5}px) scale(0.7)`
                }}
              />
            ) : (
              <circle
                cx={particle.cx}
                cy={particle.cy}
                r="1.2"
                fill={particle.color}
                stroke="none"
                filter="url(#heart-glow-filter)"
              />
            )}
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  );
}

export default HeartIcon;
