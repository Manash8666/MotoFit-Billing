'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import { MotoFitLogo } from './MotoFitLogo';
import './DarkNavBar.css';

function DarkNavBar() {
  const [activeTab, setActiveTab] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 80, opacity: 0 });
  const [isSearching, setIsSearching] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'inbox', icon: MessageCircle, label: 'Inbox', hasNotification: true },
    { id: 'saved', icon: User, label: 'Saved' },
  ];

  useEffect(() => {
    if (navRef.current) {
      const activeElement = navRef.current.querySelector<HTMLElement>(`[data-id="${activeTab}"]`);
      if (activeElement) {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
          opacity: 1,
        });
      }
    }

    if (activeTab === 'search') {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [activeTab]);

  // Center of active button inside the indicator container
  const cx = indicatorStyle.width ? indicatorStyle.width / 2 : 40;
  const peakY = 8;    // Peak of the rounded dome
  const baseY = 65;   // Baseline shifted down to the very bottom edge
  const midY = 38;    // Inflection height
  const topRadius = 16;  // Half-width of the rounded dome top
  const baseRadius = 42; // Half-width of the flared base
  const midRadius = 26;  // Half-width of the middle wall

  // Smooth dome/bell wave curve positioned lower along the bottom
  const wavePath = `M -2500,${baseY} L ${cx - baseRadius - 8},${baseY} C ${cx - baseRadius},${baseY} ${cx - midRadius - 4},${midY + 12} ${cx - midRadius},${midY} C ${cx - midRadius + 3},${midY - 14} ${cx - topRadius - 4},${peakY} ${cx},${peakY} C ${cx + topRadius + 4},${peakY} ${cx + midRadius - 3},${midY - 14} ${cx + midRadius},${midY} C ${cx + midRadius + 4},${midY + 12} ${cx + baseRadius},${baseY} ${cx + baseRadius + 8},${baseY} L 2500,${baseY}`;

  return (
    <div className="dark-nav-wrapper">
      {/* Search Frame Overlay - Outside nav so it's not clipped */}
      <div 
        className={`dark-search-container ${isSearching ? 'open' : ''}`} 
        role="dialog" 
        aria-modal="true" 
        aria-label="Search Menu"
        aria-hidden={!isSearching}
      >
        <div className="dark-search-bg" aria-hidden="true"></div>
        <div className="dark-search-content">
          <div className="mr-3">
            <MotoFitLogo size={26} glow={isSearching} className="dark-flying-icon" />
          </div>
          <input
            type="text"
            className="dark-search-input"
            placeholder="Search anything..."
            aria-label="Search Input Box"
            autoFocus={isSearching}
          />
          <button
            className="dark-search-close"
            aria-label="Close Search"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('home');
            }}
          >
            ×
          </button>
        </div>
      </div>

      <nav className="dark-nav-bar" ref={navRef}>
        {/* Hardware-accelerated sliding active indicator */}
        <div
          className="dark-active-indicator"
        style={{
          transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
        }}
      >
        <svg className="dark-wave-svg" overflow="visible">
          <defs>
            <filter id="neon-red-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="dark-wave-path"
            d={wavePath}
            fill="none"
            stroke="#f04923"
            strokeWidth="2.4"
            filter="url(#neon-red-glow)"
          />
        </svg>
        {/* Atmospheric ambient glow */}
        <div className="dark-tab-ambient-glow" />
      </div>

      {/* Nav Items */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            data-id={item.id}
            className={`dark-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={`${item.label} Navigation Tab`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={`dark-icon-container ${item.id === 'search' && isSearching ? 'hide-icon' : ''}`}>
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive && item.id === 'home' ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              {item.hasNotification && <span className="dark-notification-dot" aria-hidden="true" />}
            </div>
            <div className={`dark-active-dot ${isActive ? 'visible' : ''}`} aria-hidden="true" />
            <span className="dark-nav-label" aria-hidden={!isActive}>{item.label}</span>
          </button>
        );
      })}
      </nav>
    </div>
  );
}

export default DarkNavBar;

