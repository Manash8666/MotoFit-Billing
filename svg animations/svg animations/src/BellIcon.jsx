import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function BellIcon({
  size = 64,
  color = "currentColor",
  strokeWidth = 1.5,
  className = "",
  isHovered: externalHovered,
  ...props
}) {
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;

  // STRICT TIMING & STAGGER CHOREOGRAPHY (Total duration: ~0.88s, strictly easeInOut, zero bounce)
  // Step 1: Bell gently lifts up by 3px (0.00s -> 0.40s)
  const liftVariants = {
    normal: {
      y: 0,
      transition: { duration: 0.35, ease: "easeInOut" }
    },
    hover: {
      y: -3,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  // Step 2: Bell dome swings naturally from left to right around top loop (0.05s -> 0.85s)
  const swingVariants = {
    normal: {
      rotate: 0,
      transition: { duration: 0.35, ease: "easeInOut" }
    },
    hover: {
      rotate: [0, 15, -12, 8, -4, 0],
      transition: { duration: 0.8, delay: 0.05, ease: "easeInOut" }
    }
  };

  // NEW: Bell clapper / pendulum swings & translates independently inside the bell! (0.05s -> 0.85s)
  const clapperVariants = {
    normal: {
      x: 0,
      rotate: 0,
      transition: { duration: 0.35, ease: "easeInOut" }
    },
    hover: {
      x: [0, -3.5, 3, -2, 1, -0.5, 0],
      rotate: [0, -28, 22, -15, 8, -3, 0],
      transition: { duration: 0.8, delay: 0.05, ease: "easeInOut" }
    }
  };

  // Step 5: Soft blue drop shadow appears beneath bell (0.00s -> 0.40s)
  const shadowVariants = {
    normal: {
      opacity: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      transition: { duration: 0.35, ease: "easeInOut" }
    },
    hover: {
      opacity: 0.85,
      scaleX: 1.1,
      scaleY: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  // Step 5: Soft golden glow aura around bell (0.10s -> 0.60s)
  const glowVariants = {
    normal: {
      opacity: 0,
      scale: 0.6,
      transition: { duration: 0.35, ease: "easeInOut" }
    },
    hover: {
      opacity: [0, 0.75, 0.45],
      scale: [0.6, 1.25, 1],
      transition: { duration: 0.5, delay: 0.1, ease: "easeInOut" }
    }
  };

  // Internal warm golden tint inside bell dome when ringing (0.10s -> 0.60s)
  const fillVariants = {
    normal: {
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    hover: {
      opacity: [0, 0.85, 0.7],
      transition: { duration: 0.5, delay: 0.1, ease: "easeInOut" }
    }
  };

  // Step 3: Small red notification badge pops in at top-right corner with smooth scale animation (0.15s -> 0.60s)
  const badgeVariants = {
    normal: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: { duration: 0.45, delay: 0.15, ease: "easeInOut" }
    }
  };

  // Step 4: Two subtle ringing sound waves expand outward from both sides of the bell (0.20s -> 0.75s)
  const waveLeftVariants = {
    normal: {
      opacity: 0,
      scale: 0.7,
      x: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: {
      opacity: [0, 0.8, 0],
      scale: [0.7, 1.35, 1.45],
      x: [0, -3, -5],
      transition: { duration: 0.55, delay: 0.2, ease: "easeInOut" }
    }
  };

  const waveRightVariants = {
    normal: {
      opacity: 0,
      scale: 0.7,
      x: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: {
      opacity: [0, 0.8, 0],
      scale: [0.7, 1.35, 1.45],
      x: [0, 3, 5],
      transition: { duration: 0.55, delay: 0.2, ease: "easeInOut" }
    }
  };

  // Step 6: Exactly 3 LARGE, VIBRANT GOLDEN SPARKLES appear clearly around the bell (0.20s -> 0.85s)
  const particleVariants = {
    normal: {
      opacity: 0,
      scale: 0,
      y: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    hover: (customDelay) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.4, 0],
      y: [0, -6, -11],
      transition: { duration: 0.55, delay: customDelay, ease: "easeInOut" }
    })
  };

  // 3 distinct, bright golden/amber 4-pointed star sparkles (Left, Top Center, Right)
  const particles = [
    { cx: 3, cy: 8, delay: 0.20, color: "#f59e0b" },  // Deep Warm Gold (Left)
    { cx: 11, cy: 0, delay: 0.28, color: "#fbbf24" }, // Bright Warm Gold (Top Center)
    { cx: 21, cy: 8, delay: 0.24, color: "#d97706" }  // Rich Amber Gold (Right)
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
        {/* Soft golden glow aura radial gradient */}
        <radialGradient id="golden-bell-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        {/* Internal warm golden tint inside bell dome */}
        <linearGradient id="bell-gold-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.7" />
        </linearGradient>

        {/* Soft blue drop shadow beneath bell */}
        <radialGradient id="blue-bell-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </radialGradient>

        {/* Soft glow filter for sparkles and badge */}
        <filter id="bell-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Step 5: Soft blue drop shadow beneath the bell */}
      <motion.ellipse
        cx="12"
        cy="23.5"
        rx="9"
        ry="2.5"
        fill="url(#blue-bell-shadow)"
        stroke="none"
        variants={shadowVariants}
      />

      {/* Step 5: Soft golden glow aura behind bell */}
      <motion.circle
        cx="12"
        cy="11"
        r="11"
        fill="url(#golden-bell-glow)"
        stroke="none"
        variants={glowVariants}
      />

      {/* Step 4: Two subtle ringing sound waves expanding outward from both sides */}
      {/* Left sound wave */}
      <motion.path
        d="M 3 8 A 8 8 0 0 0 3 16"
        fill="none"
        stroke="#fbbf24"
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        style={{ transformOrigin: "12px 12px" }}
        variants={waveLeftVariants}
      />
      {/* Right sound wave */}
      <motion.path
        d="M 21 8 A 8 8 0 0 1 21 16"
        fill="none"
        stroke="#fbbf24"
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        style={{ transformOrigin: "12px 12px" }}
        variants={waveRightVariants}
      />

      {/* Step 1: Bell Group lifts up by 3px */}
      <motion.g variants={liftVariants}>
        {/* Dummy bounding box */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />

        {/* Step 2: Bell dome swings from top loop pivot (12px 3px) with realistic damping */}
        <motion.g variants={swingVariants} style={{ transformOrigin: "12px 3px" }}>
          {/* Internal golden glow tint when ringing */}
          <motion.path
            d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6 Z"
            fill="url(#bell-gold-fill)"
            stroke="none"
            variants={fillVariants}
          />

          {/* Bell Dome & Rim Outline */}
          <path
            d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* NEW: Bell Clapper / Pendulum swinging & translating independently inside the bell! */}
          <motion.g variants={clapperVariants} style={{ transformOrigin: "12px 17px" }}>
            <path
              d="M9 17v1a3 3 0 0 0 6 0v-1"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        </motion.g>

        {/* Step 3: Small red notification badge pops in at top-right corner */}
        <motion.g
          style={{ transformOrigin: "17.5px 5.5px" }}
          variants={badgeVariants}
        >
          <circle
            cx="17.5"
            cy="5.5"
            r="3.2"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Subtle white highlight dot inside badge */}
          <circle cx="18.3" cy="4.7" r="0.8" fill="#ffffff" stroke="none" />
        </motion.g>

        {/* Step 6: Exactly 3 LARGE, VIBRANT GOLDEN SPARKLES appear clearly around the bell */}
        {particles.map((particle, idx) => (
          <motion.g
            key={idx}
            style={{
              transformOrigin: `${particle.cx}px ${particle.cy}px`
            }}
            custom={particle.delay}
            variants={particleVariants}
          >
            <path
              d={`M ${particle.cx} ${particle.cy - 2.5} 
                  C ${particle.cx + 0.2} ${particle.cy - 0.4} ${particle.cx + 0.4} ${particle.cy - 0.2} ${particle.cx + 2.5} ${particle.cy} 
                  C ${particle.cx + 0.4} ${particle.cy + 0.2} ${particle.cx + 0.2} ${particle.cy + 0.4} ${particle.cx} ${particle.cy + 2.5} 
                  C ${particle.cx - 0.2} ${particle.cy + 0.4} ${particle.cx - 0.4} ${particle.cy + 0.2} ${particle.cx - 2.5} ${particle.cy} 
                  C ${particle.cx - 0.4} ${particle.cy - 0.2} ${particle.cx - 0.2} ${particle.cy - 0.4} ${particle.cx} ${particle.cy - 2.5} Z`}
              fill={particle.color}
              stroke="none"
              filter="url(#bell-glow-filter)"
            />
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  );
}

export default BellIcon;
