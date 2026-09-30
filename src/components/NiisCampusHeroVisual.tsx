import React from 'react';

interface NiisCampusHeroVisualProps {
  className?: string;
  blurClass?: string;
}

export const NiisCampusHeroVisual: React.FC<NiisCampusHeroVisualProps> = ({
  className = 'w-full h-full',
  blurClass = 'filter blur-md opacity-65',
}) => {
  return (
    <div className={`relative overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className={`w-full h-full transition-all duration-700 ease-out ${blurClass}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Authentic Pale Sky Blue Gradient */}
          <linearGradient id="niisSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a7eb0" />
            <stop offset="30%" stopColor="#6896c4" />
            <stop offset="65%" stopColor="#9cc0df" />
            <stop offset="100%" stopColor="#c5dbef" />
          </linearGradient>

          {/* Sandstone Wall Color */}
          <linearGradient id="niisWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#eed4bd" />
            <stop offset="50%" stopColor="#e2c3a6" />
            <stop offset="100%" stopColor="#d5b291" />
          </linearGradient>

          {/* Terracotta Pillars */}
          <linearGradient id="niisPillar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#692f23" />
            <stop offset="25%" stopColor="#823e2f" />
            <stop offset="75%" stopColor="#8e4637" />
            <stop offset="100%" stopColor="#692f23" />
          </linearGradient>

          {/* Center Blue Glass Reflection */}
          <linearGradient id="niisGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e4e79" />
            <stop offset="25%" stopColor="#29699e" />
            <stop offset="55%" stopColor="#4ca3da" />
            <stop offset="85%" stopColor="#24679e" />
            <stop offset="100%" stopColor="#1b4974" />
          </linearGradient>

          {/* Golden Sun Flare on 2nd Floor Window */}
          <radialGradient id="niisSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
            <stop offset="35%" stopColor="#fde047" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#f97316" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>

          <filter id="niisShadow" x="-5%" y="0%" width="110%" height="110%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Clear Horizon Sky */}
        <rect width="1920" height="1080" fill="url(#niisSky)" />

        {/* NIIS Group of Institutions Academic Block */}
        <g id="niis_facade" filter="url(#niisShadow)">
          {/* Center Rooftop Pagoda Crest */}
          <g id="center_pagoda">
            <rect x="800" y="225" width="320" height="30" fill="#672f23" rx="2" />
            <rect x="780" y="220" width="360" height="8" fill="#54251b" />
            
            {/* 5-Bay Open Pavilion Tier */}
            <rect x="825" y="165" width="270" height="55" fill="#672f23" />
            <rect x="840" y="175" width="30" height="40" fill="url(#niisSky)" />
            <rect x="895" y="175" width="30" height="40" fill="url(#niisSky)" />
            <rect x="945" y="175" width="30" height="40" fill="url(#niisSky)" />
            <rect x="995" y="175" width="30" height="40" fill="url(#niisSky)" />
            <rect x="1050" y="175" width="30" height="40" fill="url(#niisSky)" />
            
            {/* Pagoda Eaves & Bracket Cornice */}
            <polygon points="760,165 1160,165 1130,152 790,152" fill="#7a372a" />
            <rect x="830" y="130" width="260" height="22" fill="#5e291e" />

            {/* Pyramid Temple Roof Top */}
            <polygon points="960,95 825,130 1095,130" fill="#672f23" />
            <polygon points="960,105 845,130 1075,130" fill="#7d3b2d" />
            <polygon points="960,112 940,126 980,126" fill="#3a160f" />
            <circle cx="960" cy="92" r="5" fill="#a8523f" />
            <rect x="958" y="80" width="4" height="12" fill="#a8523f" />
          </g>

          {/* Left Corner Roof Cupola */}
          <g id="left_cupola">
            <rect x="140" y="220" width="180" height="40" fill="#672f23" />
            <path d="M 150,220 C 180,175 220,155 230,145 C 240,155 280,175 310,220 Z" fill="#5a271c" />
            <path d="M 165,220 C 190,185 220,165 230,155 C 240,165 270,185 295,220 Z" fill="#733427" />
            <rect x="228" y="125" width="4" height="20" fill="#cbd5e1" />
            <circle cx="230" cy="122" r="4" fill="#cbd5e1" />
          </g>

          {/* Right Corner Roof Cupola */}
          <g id="right_cupola">
            <rect x="1600" y="220" width="180" height="40" fill="#672f23" />
            <path d="M 1610,220 C 1640,175 1680,155 1690,145 C 1700,155 1740,175 1770,220 Z" fill="#5a271c" />
            <path d="M 1625,220 C 1650,185 1680,165 1690,155 C 1700,165 1730,185 1755,220 Z" fill="#733427" />
            <rect x="1688" y="125" width="4" height="20" fill="#cbd5e1" />
            <circle cx="1690" cy="122" r="4" fill="#cbd5e1" />
          </g>

          {/* Roof Parapet Balustrade & 10 Finials */}
          <rect x="100" y="255" width="1720" height="32" fill="#dfc1a4" stroke="#c49e7b" strokeWidth="2" />
          <rect x="120" y="262" width="1680" height="6" fill="#b28864" />
          <rect x="120" y="274" width="1680" height="6" fill="#b28864" />

          {/* Finial Urns */}
          <g fill="#7a372a">
            {[350, 440, 530, 620, 710, 1200, 1290, 1380, 1470, 1560].map((x) => (
              <path key={x} d={`M ${x},255 L ${x},240 C ${x},236 ${x + 4},232 ${x + 7},232 C ${x + 10},232 ${x + 14},236 ${x + 14},240 L ${x + 14},255 Z`} />
            ))}
          </g>

          {/* Main Facade Wall Base */}
          <rect x="100" y="287" width="1720" height="600" fill="url(#niisWall)" />

          {/* Terracotta Vertical Pilasters */}
          <g fill="url(#niisPillar)">
            {[100, 250, 390, 530, 670, 1212, 1352, 1492, 1632, 1782].map((x, i) => (
              <rect key={i} x={x} y="287" width={i === 0 || i === 4 || i === 5 || i === 9 ? 38 : 34} height="600" />
            ))}
          </g>

          {/* Floor Cornice Lines */}
          <rect x="100" y="415" width="1720" height="12" fill="#7a372a" />
          <rect x="100" y="555" width="1720" height="12" fill="#7a372a" />
          <rect x="100" y="695" width="1720" height="12" fill="#7a372a" />
          <rect x="100" y="835" width="1720" height="14" fill="#672f23" />

          {/* Floor 4 Windows */}
          <g fill="#cbd5e1" stroke="#ffffff" strokeWidth="4">
            {[150, 295, 435, 575, 1260, 1400, 1540, 1680].map((x) => (
              <rect key={x} x={x} y="325" width="85" height="65" rx="3" />
            ))}
          </g>

          {/* Floor 3 Windows */}
          <g stroke="#ffffff" strokeWidth="4">
            {[150, 295, 435, 575].map((x) => (
              <rect key={x} x={x} y="445" width="85" height="85" rx="3" fill="#475569" />
            ))}
            {[1260, 1400, 1540, 1680].map((x) => (
              <rect key={x} x={x} y="445" width="85" height="85" rx="3" fill="#cbd5e1" />
            ))}
          </g>

          {/* Floor 2 Windows */}
          <g stroke="#ffffff" strokeWidth="4">
            {[150, 295, 435, 575].map((x) => (
              <rect key={x} x={x} y="585" width="85" height="85" rx="3" fill="#334155" />
            ))}
            <rect x="1260" y="585" width="85" height="85" rx="3" fill="#64748b" />
            {/* Window with Golden Sunset Reflection */}
            <rect x="1400" y="585" width="85" height="85" rx="3" fill="url(#niisSun)" />
            <rect x="1540" y="585" width="85" height="85" rx="3" fill="#475569" />
            <rect x="1680" y="585" width="85" height="85" rx="3" fill="#475569" />
          </g>

          {/* Floor 1 (Ground) Windows */}
          <g fill="#1e293b" stroke="#ffffff" strokeWidth="4">
            {[150, 295, 435, 575].map((x) => (
              <rect key={x} x={x} y="725" width="85" height="85" rx="3" />
            ))}
            {[1260, 1400, 1540, 1680].map((x) => (
              <rect key={x} x={x} y="725" width="85" height="85" rx="3" fill="#334155" />
            ))}
          </g>

          {/* CENTER TOWER WITH BLUE REFLECTIVE ATRIUM */}
          <g id="center_tower">
            <rect x="710" y="270" width="500" height="617" fill="url(#niisWall)" stroke="#c49e7b" strokeWidth="3" />

            {/* Quoin Corner Blocks */}
            <g>
              {[280, 340, 400, 460, 520, 580, 640].map((y) => (
                <rect key={`lq_${y}`} x="710" y={y} width="55" height="24" fill="#dfc0a2" />
              ))}
              {[310, 370, 430, 490, 550, 610].map((y) => (
                <rect key={`lqb_${y}`} x="710" y={y} width="40" height="24" fill="#7a372a" />
              ))}
              {[280, 340, 400, 460, 520, 580, 640].map((y) => (
                <rect key={`rq_${y}`} x="1155" y={y} width="55" height="24" fill="#dfc0a2" />
              ))}
              {[310, 370, 430, 490, 550, 610].map((y) => (
                <rect key={`rqb_${y}`} x="1170" y={y} width="40" height="24" fill="#7a372a" />
              ))}
            </g>

            {/* Soaring Blue Glass Atrium Curtain */}
            <g id="atrium">
              <rect x="835" y="415" width="250" height="250" fill="url(#niisGlass)" rx="4" stroke="#1e3a5f" strokeWidth="4" />
              {/* Glass Mullions */}
              <line x1="897" y1="415" x2="897" y2="665" stroke="#ffffff" strokeWidth="3" opacity="0.65" />
              <line x1="960" y1="415" x2="960" y2="665" stroke="#ffffff" strokeWidth="3" opacity="0.65" />
              <line x1="1022" y1="415" x2="1022" y2="665" stroke="#ffffff" strokeWidth="3" opacity="0.65" />

              <line x1="835" y1="456" x2="1085" y2="456" stroke="#ffffff" strokeWidth="2.5" opacity="0.6" />
              <line x1="835" y1="498" x2="1085" y2="498" stroke="#ffffff" strokeWidth="2.5" opacity="0.6" />
              <line x1="835" y1="540" x2="1085" y2="540" stroke="#ffffff" strokeWidth="2.5" opacity="0.6" />
              <line x1="835" y1="582" x2="1085" y2="582" stroke="#ffffff" strokeWidth="2.5" opacity="0.6" />
              <line x1="835" y1="624" x2="1085" y2="624" stroke="#ffffff" strokeWidth="2.5" opacity="0.6" />

              {/* Sky Reflections */}
              <polygon points="840,420 980,420 890,660 840,660" fill="#ffffff" opacity="0.22" />
              <polygon points="985,420 1080,420 1020,660 925,660" fill="#ffffff" opacity="0.18" />
            </g>

            {/* Entrance Portico with NIIS Sign */}
            <g id="portico">
              <path d="M 740,887 L 740,730 Q 960,670 1180,730 L 1180,887 Z" fill="#b0644b" />
              <path d="M 755,887 L 755,745 Q 960,695 1165,745 L 1165,887 Z" fill="#934934" />
              <rect x="780" y="745" width="360" height="42" rx="4" fill="#672f23" opacity="0.95" />
              <text x="960" y="773" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900" fill="#fde047" textAnchor="middle" letterSpacing="3">
                NIIS GROUP OF INSTITUTIONS
              </text>
              <path d="M 880,887 L 880,810 Q 960,780 1040,810 L 1040,887 Z" fill="#1e293b" />
              <line x1="960" y1="785" x2="960" y2="887" stroke="#94a3b8" strokeWidth="3" />
            </g>
          </g>
        </g>

        {/* Dense Tropical Greenery Left & Right */}
        <g id="foliage_sides">
          <circle cx="20" cy="850" r="220" fill="#0f2617" />
          <circle cx="90" cy="790" r="170" fill="#143922" />
          <circle cx="40" cy="700" r="140" fill="#1e4e2f" />
          <circle cx="160" cy="840" r="130" fill="#295c39" />

          <circle cx="1900" cy="850" r="220" fill="#0f2617" />
          <circle cx="1830" cy="790" r="170" fill="#143922" />
          <circle cx="1880" cy="700" r="140" fill="#1e4e2f" />
          <circle cx="1760" cy="840" r="130" fill="#295c39" />
        </g>

        {/* Tall Slender Queen Palm Tree */}
        <g id="palm_tree">
          <path d="M 1240,950 Q 1235,750 1220,530 Q 1225,750 1250,950 Z" fill="#5c4d3c" />
          <path d="M 1220,530 Q 1160,510 1100,535 Q 1150,550 1220,530" fill="#2e7d32" />
          <path d="M 1220,530 Q 1140,540 1070,600 Q 1130,590 1220,530" fill="#1b5e20" />
          <path d="M 1220,530 Q 1120,480 1050,470 Q 1120,510 1220,530" fill="#388e3c" />
          <path d="M 1220,530 Q 1280,500 1350,530 Q 1290,545 1220,530" fill="#2e7d32" />
          <path d="M 1220,530 Q 1300,530 1370,590 Q 1300,580 1220,530" fill="#1b5e20" />
          <path d="M 1220,530 Q 1290,470 1350,460 Q 1280,500 1220,530" fill="#4caf50" />
        </g>

        {/* Foreground Shrubs */}
        <g id="shrubs">
          <circle cx="760" cy="830" r="110" fill="#2e7d32" />
          <circle cx="850" cy="840" r="95" fill="#388e3c" />
          <circle cx="960" cy="830" r="120" fill="#1b5e20" />
          <circle cx="1060" cy="840" r="105" fill="#2e7d32" />
          <circle cx="1140" cy="830" r="100" fill="#1e4620" />
          <circle cx="1220" cy="850" r="110" fill="#2e7d32" />
        </g>

        {/* Foreground Metal Arched Railing Fence */}
        <g stroke="#cbd5e1" strokeWidth="4" fill="none">
          <line x1="200" y1="960" x2="1720" y2="960" stroke="#94a3b8" strokeWidth="5" />
          <line x1="200" y1="920" x2="1720" y2="920" stroke="#94a3b8" strokeWidth="5" />
          {[240, 400, 560, 1240, 1400, 1560].map((x) => (
            <path key={x} d={`M ${x},960 L ${x},880 Q ${x + 60},830 ${x + 120},880 L ${x + 120},960`} />
          ))}
          <path d="M 720,960 L 720,880 Q 840,830 960,880 L 960,960" />
          <path d="M 960,960 L 960,880 Q 1080,830 1200,880 L 1200,960" />
        </g>

        {/* Campus Bulletin Notice Board */}
        <g id="notice_board">
          <rect x="780" y="878" width="205" height="110" fill="#cbd5e1" stroke="#64748b" strokeWidth="3" rx="2" />
          <rect x="786" y="902" width="60" height="80" fill="#dc2626" />
          <rect x="850" y="902" width="64" height="80" fill="#0284c7" />
          <rect x="918" y="902" width="62" height="80" fill="#2563eb" />
          <rect x="786" y="884" width="194" height="14" fill="#f8fafc" />
          <text x="883" y="895" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="bold" fill="#0f172a" textAnchor="middle">
            NIIS GROUP OF INSTITUTIONS
          </text>
        </g>

        {/* Paved Walkway at bottom */}
        <rect x="0" y="1030" width="1920" height="50" fill="#334155" />
      </svg>
    </div>
  );
};
