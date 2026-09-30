import React from 'react';

interface CampusNavLogoProps {
  className?: string;
  size?: number;
}

export const CampusNavLogo: React.FC<CampusNavLogoProps> = ({ className = 'w-10 h-10', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div 
      className={`relative shrink-0 select-none overflow-hidden rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${className}`}
      style={style}
    >
      <svg
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rich Sky Blue Gradient */}
          <linearGradient id="navLogoBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>

          {/* Central Radial Light Glow */}
          <radialGradient id="navSkyGlow" cx="50%" cy="32%" r="55%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          {/* Glowing Winding Path Gradient */}
          <linearGradient id="navPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          {/* Rolling Hills Gradient */}
          <linearGradient id="navHillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          <linearGradient id="navHillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Building Shading */}
          <linearGradient id="navBldgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Pin Shadow Filter */}
          <filter id="navPinShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0c4a6e" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Squircle Background Base */}
        <rect width="512" height="512" rx="112" fill="url(#navLogoBg)" />
        <rect width="512" height="512" rx="112" fill="url(#navSkyGlow)" />

        {/* University Building in Background */}
        <g id="univ_bg">
          {/* Main Academic Center Block */}
          <rect x="176" y="165" width="160" height="150" fill="url(#navBldgGrad)" />
          {/* Left Wing */}
          <rect x="85" y="185" width="95" height="130" fill="#e2e8f0" />
          {/* Right Wing */}
          <rect x="332" y="185" width="95" height="130" fill="#cbd5e1" />

          {/* Left Wing Arched Windows */}
          <rect x="105" y="210" width="22" height="34" rx="11" fill="#0f172a" opacity="0.65" />
          <rect x="140" y="210" width="22" height="34" rx="11" fill="#0f172a" opacity="0.65" />
          <rect x="105" y="255" width="22" height="32" rx="3" fill="#0f172a" opacity="0.6" />
          <rect x="140" y="255" width="22" height="32" rx="3" fill="#0f172a" opacity="0.6" />

          {/* Right Wing Arched Windows */}
          <rect x="350" y="210" width="22" height="34" rx="11" fill="#0f172a" opacity="0.65" />
          <rect x="385" y="210" width="22" height="34" rx="11" fill="#0f172a" opacity="0.65" />
          <rect x="350" y="255" width="22" height="32" rx="3" fill="#0f172a" opacity="0.6" />
          <rect x="385" y="255" width="22" height="32" rx="3" fill="#0f172a" opacity="0.6" />

          {/* Classical Center Portico Columns */}
          <rect x="190" y="185" width="14" height="120" fill="#ffffff" />
          <rect x="222" y="185" width="14" height="120" fill="#ffffff" />
          <rect x="276" y="185" width="14" height="120" fill="#ffffff" />
          <rect x="308" y="185" width="14" height="120" fill="#ffffff" />

          {/* Center Pediment Roof Triangle */}
          <polygon points="166,165 256,110 346,165" fill="#ffffff" />
          <polygon points="176,165 256,116 336,165" fill="#f8fafc" />

          {/* Dome / Cupola Structure */}
          <rect x="236" y="90" width="40" height="24" fill="#f1f5f9" />
          
          {/* Graduation Mortarboard Cap on Top */}
          <polygon points="256,52 318,78 256,104 194,78" fill="#ffffff" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.25))" />
          <rect x="238" y="90" width="36" height="14" rx="3" fill="#e2e8f0" />
          {/* Mortarboard Tassel */}
          <path d="M 256,78 Q 220,84 214,108" stroke="#ffffff" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <circle cx="214" cy="112" r="5" fill="#ffffff" />
        </g>

        {/* Rolling Green Hills Landscape */}
        <path d="M -20,380 Q 140,290 280,350 Q 420,400 532,340 L 532,532 L -20,532 Z" fill="url(#navHillGrad1)" />
        <path d="M 532,390 Q 380,300 240,360 Q 100,410 -20,360 L -20,532 L 532,532 Z" fill="url(#navHillGrad2)" opacity="0.9" />

        {/* Stylized Foreground Green Trees with White Trunk Stems */}
        {/* Left Tree */}
        <g transform="translate(85, 235)">
          <circle cx="25" cy="45" r="32" fill="#22c55e" />
          <circle cx="25" cy="42" r="27" fill="#4ade80" opacity="0.75" />
          <path d="M 25,50 L 25,85" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <path d="M 25,65 L 14,54" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M 25,60 L 36,50" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Right Tree */}
        <g transform="translate(370, 235)">
          <circle cx="25" cy="45" r="32" fill="#22c55e" />
          <circle cx="25" cy="42" r="27" fill="#4ade80" opacity="0.75" />
          <path d="M 25,50 L 25,85" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <path d="M 25,65 L 14,54" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M 25,60 L 36,50" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Curving Illuminated Winding Road / Pathway with Soft Glow */}
        <path 
          d="M 256,310 C 250,335 220,350 200,365 C 160,395 160,420 220,445 C 280,470 330,490 350,532 L 130,532 C 110,490 140,460 170,440 C 210,410 225,395 240,360 C 248,340 252,325 256,310 Z" 
          fill="url(#navPathGrad)" 
          filter="drop-shadow(0 0 16px rgba(56,189,248,0.8))" 
        />

        {/* Large Iconic White Map Pin in Center Foreground */}
        <g filter="url(#navPinShadow)">
          {/* Pure White Pin Body */}
          <path 
            d="M 256,350 C 210,295 186,252 186,212 C 186,173 217,142 256,142 C 295,142 326,173 326,212 C 326,252 302,295 256,350 Z" 
            fill="#ffffff" 
          />
          
          {/* Royal Blue Inner Circle Target */}
          <circle cx="256" cy="214" r="44" fill="#0284c7" />
          
          {/* Solid White Center Dot */}
          <circle cx="256" cy="214" r="21" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};
