import React, { useState } from 'react';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import './LightNavBar.css';

function LightNavBar() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'inbox', icon: MessageCircle, label: 'Inbox', hasNotification: true },
    { id: 'saved', icon: User, label: 'Saved' },
  ];

  return (
    <nav className="light-nav-bar">
      {/* Navigation Items */}
      <div className="light-nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`light-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="light-nav-icon-wrapper">
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                {item.hasNotification && <span className="light-nav-notification-dot" />}
              </div>
              <span className="light-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default LightNavBar;
