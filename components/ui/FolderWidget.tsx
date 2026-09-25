'use client';
import { useState } from 'react';
import './FolderWidget.css';

export default function FolderWidget() {
  const [activeCard, setActiveCard] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [score, setScore] = useState(1248);

  // Allow clicking to pop out a card or cycle them
  const handleCardClick = (cardId, e) => {
    e.stopPropagation();
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  return (
    <div className="folder-widget-container">
      <div className="folder-showcase">
        <div 
          className={`folder-wrapper ${isHovered ? 'is-hovered' : ''} ${activeCard ? `active-${activeCard}` : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setActiveCard(null);
          }}
        >
        {/* Back of the Yellow Folder */}
        <div className="folder-back">
          <div className="folder-tab-back"></div>
        </div>

        {/* Stacked Cards Inside the Folder */}
        <div className="folder-cards-group">
          {/* Card 1: Dark / Black Card (Leftmost) */}
          <div 
            className={`folder-card card-dark ${activeCard === 'dark' ? 'card-popped' : ''}`}
            onClick={(e) => handleCardClick('dark', e)}
            title="Click to inspect Dark Card"
          >
            <div className="card-dark-inner">
              <div className="card-dark-header">
                <span className="dot dot-pink"></span>
                <span className="card-mini-title">Analytics</span>
              </div>
              <div className="card-dark-visual">
                <svg viewBox="0 0 100 50" className="dark-wave">
                  <path d="M0,40 Q25,10 50,30 T100,15 L100,50 L0,50 Z" fill="url(#pinkGrad)" opacity="0.6"/>
                  <path d="M0,40 Q25,10 50,30 T100,15" fill="none" stroke="#f04923" strokeWidth="2.5"/>
                  <defs>
                    <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f04923" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#f04923" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Green Card (Middle) */}
          <div 
            className={`folder-card card-green ${activeCard === 'green' ? 'card-popped' : ''}`}
            onClick={(e) => handleCardClick('green', e)}
            title="Click to inspect Green Card"
          >
            <div className="card-green-inner">
              <div className="card-green-header">
                <svg className="green-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="green-label">Growth</span>
              </div>
              <div className="green-stats">
                <span className="green-percent">+38.4%</span>
                <div className="green-bars">
                  <div className="bar" style={{ height: '40%' }}></div>
                  <div className="bar" style={{ height: '65%' }}></div>
                  <div className="bar" style={{ height: '85%' }}></div>
                  <div className="bar active" style={{ height: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: White Dashboard Card (Rightmost / Front) */}
          <div 
            className={`folder-card card-white ${activeCard === 'white' ? 'card-popped' : ''}`}
            onClick={(e) => handleCardClick('white', e)}
            title="Click to inspect Dashboard Card"
          >
            <div className="dashboard-card-ui">
              <div className="dashboard-header">
                <span className="dashboard-title">Overall score</span>
                <button 
                  className="dashboard-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScore(prev => prev === 1248 ? 1390 : 1248);
                  }}
                  title="Click to refresh score"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>

              {/* Speedometer Gauge Chart */}
              <div className="gauge-container">
                <svg viewBox="0 0 160 100" className="gauge-svg">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f04923" />
                      <stop offset="50%" stopColor="#d03d1c" />
                      <stop offset="100%" stopColor="#a82b0f" />
                    </linearGradient>
                    <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  {/* Background Track */}
                  <path
                    d="M 20 85 A 60 60 0 0 1 140 85"
                    fill="none"
                    stroke="#373a42"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Active Gradient Arc */}
                  <path
                    d="M 20 85 A 60 60 0 0 1 140 85"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="188.5"
                    strokeDashoffset={score === 1248 ? "45" : "25"}
                    filter="url(#gaugeGlow)"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  />
                </svg>
                <div className="gauge-value">
                  <span className="gauge-number">{score}</span>
                  <span className="gauge-change">+14.2%</span>
                </div>
              </div>

              {/* Metric Pills */}
              <div className="dashboard-pills">
                <div className="metric-pill">
                  <span className="pill-dot dot-orange"></span>
                  <span>BPM</span>
                </div>
                <div className="metric-pill">
                  <span className="pill-dot dot-red"></span>
                  <span>Kcal</span>
                </div>
              </div>

              {/* Bottom Mini Row */}
              <div className="dashboard-footer">
                <span className="footer-time">0:24:12</span>
                <span className="footer-status">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Front Folder Pocket */}
        <div className="folder-pocket">
          {/* Custom SVG silhouette for exact tab curve top */}
          <div className="pocket-shape">
            <svg viewBox="0 0 340 215" preserveAspectRatio="none">
              <path
                d="M 0 35 
                   Q 0 0 35 0 
                   L 130 0 
                   Q 155 0 175 22 
                   L 185 32
                   Q 205 52 230 52
                   L 305 52
                   Q 340 52 340 87
                   L 340 175
                   Q 340 215 300 215
                   L 40 215
                   Q 0 215 0 175
                   Z"
                fill="url(#pocketYellowGrad)"
              />
              <path
                d="M 0 35 
                   Q 0 0 35 0 
                   L 130 0 
                   Q 155 0 175 22 
                   L 185 32
                   Q 205 52 230 52
                   L 305 52
                   Q 340 52 340 87"
                fill="none"
                stroke="rgba(255, 255, 255, 0.65)"
                strokeWidth="2.5"
              />
              <defs>
                <linearGradient id="pocketYellowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffd034" />
                  <stop offset="40%" stopColor="#ffbf12" />
                  <stop offset="100%" stopColor="#f5a400" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Logo on bottom left exactly like the reference image */}
          <div className="folder-logo-box">
            <span className="folder-logo-text">is—</span>
          </div>

          {/* Subtle inner shadow / glass lighting on front pocket */}
          <div className="pocket-lighting"></div>
        </div>
      </div>
    </div>
    <span 
      className={`folder-widget-label ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Folder
    </span>
  </div>
);
}

