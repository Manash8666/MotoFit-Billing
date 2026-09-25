import React, { useState, useRef, useEffect } from 'react';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import './App.css';

import DarkNavBar from './DarkNavBar';
import LightNavBar from './LightNavBar';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });
  const navRef = useRef(null);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'inbox', icon: MessageCircle, label: 'Inbox', hasNotification: true },
    { id: 'saved', icon: User, label: 'Saved' },
  ];

  useEffect(() => {
    if (navRef.current) {
      const activeElement = navRef.current.querySelector(`[data-id="${activeTab}"]`);
      if (activeElement) {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          top: activeElement.offsetTop,
          width: activeElement.offsetWidth,
          height: activeElement.offsetHeight,
          opacity: 1,
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="app-container" style={{ flexDirection: 'column', gap: '50px' }}>
      <nav className="nav-bar" ref={navRef}>
        {/* Sliding glassy background */}
        <div className="active-background" style={indicatorStyle}>
          <div className="active-dot"></div>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              data-id={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="icon-container">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive && item.id === 'home' ? 'currentColor' : 'none'} />
                {item.hasNotification && <span className="notification-dot"></span>}
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* The new dark nav bar placed below */}
      <DarkNavBar />

      {/* The newly added light style nav bar */}
      <LightNavBar />
    </div>
  );
}

export default App;
