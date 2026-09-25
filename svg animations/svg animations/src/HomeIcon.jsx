import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function HomeIcon({
    size = 80,
    color = "currentColor",
    strokeWidth = 1.25,
    className = "",
    isHovered: externalHovered,
    ...props
}) {
    const [internalHovered, setInternalHovered] = useState(false);
    const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;


    const houseVariants = {
        normal: {
            y: 0,
            transition: { duration: 0.35, ease: "easeInOut" }
        },
        hover: {
            y: -4,
            transition: { duration: 0.38, ease: "easeInOut" }
        }
    };

    // Step 5: Soft blue drop shadow appears beneath house (0.00s -> 0.38s)
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
            transition: { duration: 0.38, ease: "easeInOut" }
        }
    };

    // NEW: Roof (chaath) draws from BOTH sides simultaneously towards the peak! (0.03s -> 0.38s)
    const roofVariants = {
        normal: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        hover: {
            pathLength: [0, 1],
            opacity: [0.3, 1],
            transition: { duration: 0.35, delay: 0.03, ease: "easeInOut" }
        }
    };

    // Step 2: Front door opens naturally from left hinge (0.10s -> 0.45s)
    const doorVariants = {
        normal: {
            rotateY: 0,
            scaleX: 1,
            skewY: 0,
            transition: { duration: 0.35, ease: "easeInOut" }
        },
        hover: {
            rotateY: -65,
            scaleX: 0.75,
            skewY: 5,
            transition: { duration: 0.35, delay: 0.1, ease: "easeInOut" }
        }
    };

    // Step 3: Warm yellow light softly glows from inside (0.15s -> 0.50s)
    const lightVariants = {
        normal: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        hover: {
            opacity: [0, 0.7, 1],
            scale: 1,
            transition: { duration: 0.35, delay: 0.15, ease: "easeInOut" }
        }
    };

    const spillVariants = {
        normal: {
            opacity: 0,
            scaleY: 0,
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        hover: {
            opacity: [0, 0.4, 0.65],
            scaleY: 1,
            transition: { duration: 0.35, delay: 0.18, ease: "easeInOut" }
        }
    };

    // Step 4: Subtle white shine sweeps across roof from left to right (0.20s -> 0.65s)
    const shineVariants = {
        normal: {
            x: -35,
            opacity: 0,
            transition: { duration: 0.25, ease: "easeInOut" }
        },
        hover: {
            x: 35,
            opacity: [0, 1, 1, 0],
            transition: { duration: 0.45, delay: 0.2, ease: "easeInOut" }
        }
    };

    // Step 6: Small glowing particles appear briefly around roof (0.25s -> 0.75s)
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
            y: [0, -5, -9],
            transition: { duration: 0.45, delay: customDelay, ease: "easeInOut" }
        })
    };

    // Staggered particle appearance finishing by ~0.78s
    const particles = [
        { cx: 6, cy: 8, delay: 0.25, type: "star", color: "#fbbf24" },
        { cx: 10, cy: 3, delay: 0.30, type: "circle", color: "#60a5fa" },
        { cx: 12, cy: -1, delay: 0.35, type: "star", color: "#fef08a" },
        { cx: 15, cy: 2, delay: 0.28, type: "circle", color: "#fbbf24" },
        { cx: 18, cy: 7, delay: 0.32, type: "star", color: "#60a5fa" }
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
                {/* Warm yellow glowing interior light */}
                <radialGradient id="warm-light-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                    <stop offset="60%" stopColor="#facc15" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
                </radialGradient>

                {/* Light beam spilling out of open door onto ground */}
                <linearGradient id="door-spill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#facc15" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                </linearGradient>

                {/* Soft blue drop shadow beneath the house */}
                <radialGradient id="blue-ground-shadow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
                </radialGradient>

                {/* Roof clip path for the white shine sweep */}
                <clipPath id="roof-clip-path">
                    <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                </clipPath>

                {/* Glow filter for warm interior light */}
                <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* 5. Soft blue drop shadow beneath the house */}
            <motion.ellipse
                cx="12"
                cy="23.5"
                rx="9"
                ry="2.5"
                fill="url(#blue-ground-shadow)"
                stroke="none"
                variants={shadowVariants}
            />

            {/* 3. Light beam spilling onto the ground from doorway */}
            <motion.polygon
                points="9,21 15,21 17.5,25 6.5,25"
                fill="url(#door-spill-grad)"
                stroke="none"
                style={{ transformOrigin: "12px 21px" }}
                variants={spillVariants}
            />

            {/* 1. House Group: Smoothly lifts up by 4px */}
            <motion.g variants={houseVariants}>
                {/* Dummy background rect / bounding box */}
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />

                {/* 3. Warm yellow light softly glows from inside the house */}
                <motion.path
                    d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6 Z"
                    fill="url(#warm-light-grad)"
                    stroke="none"
                    filter="url(#soft-glow)"
                    variants={lightVariants}
                    style={{ transformOrigin: "12px 18px" }}
                />

                {/* House Body / Walls */}
                <path
                    d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* 2. Front door opens naturally from the left hinge */}
                <motion.g
                    style={{
                        transformBox: "fill-box",
                        transformOrigin: "left center",
                        perspective: 600
                    }}
                    variants={doorVariants}
                >
                    {/* Door fill background when closed/opening */}
                    <path
                        d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"
                        fill="#ffffff"
                        fillOpacity="0.95"
                        stroke="none"
                    />
                    {/* Door outline */}
                    <path
                        d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Small door handle on the right side */}
                    <circle cx="13.8" cy="18" r="0.45" fill={color} stroke="none" />
                </motion.g>

                {/* NEW: The Roof (chaath) draws from BOTH sides (left and right) simultaneously towards the top peak! */}
                <motion.path
                    d="M5 12l-2 0l9 -9"
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={roofVariants}
                />
                <motion.path
                    d="M19 12l2 0l-9 -9"
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={roofVariants}
                />

                {/* 4. Subtle white shine sweeps across the roof from left to right */}
                <g clipPath="url(#roof-clip-path)">
                    <motion.rect
                        x="-20"
                        y="-5"
                        width="10"
                        height="30"
                        fill="white"
                        fillOpacity="0.75"
                        stroke="none"
                        style={{
                            transform: "rotate(30deg)",
                            transformOrigin: "center center",
                            filter: "blur(2px)"
                        }}
                        variants={shineVariants}
                    />
                </g>

                {/* 6. Small glowing particles appear briefly around the roof */}
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
                                filter="url(#soft-glow)"
                            />
                        ) : (
                            <circle
                                cx={particle.cx}
                                cy={particle.cy}
                                r="1.2"
                                fill={particle.color}
                                stroke="none"
                                filter="url(#soft-glow)"
                            />
                        )}
                    </motion.g>
                ))}
            </motion.g>
        </motion.svg>
    );
}

export default HomeIcon;
