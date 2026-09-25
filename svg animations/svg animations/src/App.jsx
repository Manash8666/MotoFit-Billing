import React, { useState } from 'react';
import { HomeIcon } from './HomeIcon';
import { FolderIcon } from './FolderIcon';
import { HeartIcon } from './HeartIcon';
import { BellIcon } from './BellIcon';
import { UserIcon } from './UserIcon';
import FolderWidget from './FolderWidget';

function App() {
  const [hoveredHome, setHoveredHome] = useState(false);
  const [hoveredFolder, setHoveredFolder] = useState(false);
  const [hoveredHeart, setHoveredHeart] = useState(false);
  const [hoveredBell, setHoveredBell] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '56px',
        userSelect: 'none'
      }}
    >
      {/* Home Item */}
      <div
        onMouseEnter={() => setHoveredHome(true)}
        onMouseLeave={() => setHoveredHome(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <HomeIcon size={64} strokeWidth={1.5} color="#000000" isHovered={hoveredHome} />
        <span
          style={{
            color: hoveredHome ? '#000000' : '#6b7280',
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.3px',
            transition: 'color 0.3s ease'
          }}
        >
          Home
        </span>
      </div>

      {/* Folder Item with independent hover & FolderWidget positioned further below */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* Top Folder Icon + Label (Independent Hover) */}
        <div
          onMouseEnter={() => setHoveredFolder(true)}
          onMouseLeave={() => setHoveredFolder(false)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <FolderIcon size={64} strokeWidth={1.5} color="#000000" isHovered={hoveredFolder} />
          <span
            style={{
              color: hoveredFolder ? '#000000' : '#6b7280',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.3px',
              transition: 'color 0.3s ease'
            }}
          >
            Folder
          </span>
        </div>

        {/* FolderWidget positioned further down ("thora sa thora necha karo") without triggering or reacting to top folder hover */}
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '32px',
            zIndex: 30
          }}
        >
          <FolderWidget />
        </div>
      </div>

      {/* Heart Item */}
      <div
        onMouseEnter={() => setHoveredHeart(true)}
        onMouseLeave={() => setHoveredHeart(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <HeartIcon size={64} strokeWidth={1.5} color="#000000" isHovered={hoveredHeart} />
        <span
          style={{
            color: hoveredHeart ? '#000000' : '#6b7280',
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.3px',
            transition: 'color 0.3s ease'
          }}
        >
          Heart
        </span>
      </div>

      {/* Bell Item */}
      <div
        onMouseEnter={() => setHoveredBell(true)}
        onMouseLeave={() => setHoveredBell(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <BellIcon size={64} strokeWidth={1.5} color="#000000" isHovered={hoveredBell} />
        <span
          style={{
            color: hoveredBell ? '#000000' : '#6b7280',
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.3px',
            transition: 'color 0.3s ease'
          }}
        >
          Bell
        </span>
      </div>

      {/* User Item */}
      <div
        onMouseEnter={() => setHoveredUser(true)}
        onMouseLeave={() => setHoveredUser(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <UserIcon size={64} strokeWidth={1.5} color="#000000" isHovered={hoveredUser} />
        <span
          style={{
            color: hoveredUser ? '#000000' : '#6b7280',
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.3px',
            transition: 'color 0.3s ease'
          }}
        >
          User
        </span>
      </div>
    </div>
  );
}

export default App;