import React from 'react';
import { Building } from '../types/campus';

interface SatelliteCampusGraphicsProps {
  theme: 'satellite' | 'blueprint' | 'standard';
  buildings: Building[];
  showPlans: boolean;
}

export const SatelliteCampusGraphics: React.FC<SatelliteCampusGraphicsProps> = ({
  theme,
  buildings,
  showPlans,
}) => {
  const isSatellite = theme === 'satellite';
  const isBlueprint = theme === 'blueprint';
  const isStandard = theme === 'standard';

  return (
    <>
      <defs>
        {/* ============================================================== */}
        {/* SATELLITE MODE PATTERNS & GRADIENTS */}
        {/* ============================================================== */}

        {/* Aerial Earth Base Texture */}
        <radialGradient id="satGroundGradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1a3124" />
          <stop offset="45%" stopColor="#14261c" />
          <stop offset="85%" stopColor="#0f1d15" />
          <stop offset="100%" stopColor="#0a140f" />
        </radialGradient>

        {/* Manicured Lawns Texture */}
        <pattern id="satLawnMowing" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="12" height="24" fill="#244830" />
          <rect x="12" width="12" height="24" fill="#1e3e29" />
        </pattern>

        {/* Natural Weathered Asphalt Texture */}
        <pattern id="naturalAsphalt" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#25292e" />
          {/* Subtle aggregate specks */}
          <circle cx="4" cy="5" r="0.75" fill="#3c4149" opacity="0.8" />
          <circle cx="18" cy="9" r="0.6" fill="#181a1d" opacity="0.6" />
          <circle cx="26" cy="22" r="0.8" fill="#363b43" opacity="0.7" />
          <circle cx="10" cy="24" r="0.5" fill="#1b1d20" opacity="0.5" />
          <circle cx="22" cy="3" r="0.6" fill="#3f454e" opacity="0.7" />
        </pattern>

        {/* Light Mode Asphalt Pattern */}
        <pattern id="lightAsphalt" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#e8eaed" />
          <circle cx="6" cy="8" r="0.7" fill="#dadce0" opacity="0.9" />
          <circle cx="20" cy="14" r="0.8" fill="#dadce0" opacity="0.9" />
        </pattern>

        {/* Natural Stone Paver Walkways */}
        <pattern id="naturalPavers" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={isSatellite ? '#3e3b36' : isBlueprint ? '#0c3552' : '#e2dbd0'} />
          <line x1="0" y1="8" x2="16" y2="8" stroke={isSatellite ? '#2d2a26' : isBlueprint ? '#0284c7' : '#c8beaf'} strokeWidth="0.8" />
          <line x1="8" y1="0" x2="8" y2="8" stroke={isSatellite ? '#2d2a26' : isBlueprint ? '#0284c7' : '#c8beaf'} strokeWidth="0.8" />
          <line x1="16" y1="8" x2="16" y2="16" stroke={isSatellite ? '#2d2a26' : isBlueprint ? '#0284c7' : '#c8beaf'} strokeWidth="0.8" />
          <line x1="4" y1="8" x2="4" y2="16" stroke={isSatellite ? '#2d2a26' : isBlueprint ? '#0284c7' : '#c8beaf'} strokeWidth="0.8" />
        </pattern>

        {/* Photorealistic Sports Field Turf Stripes */}
        <pattern id="turfStripes" width="30" height="80" patternUnits="userSpaceOnUse">
          <rect width="15" height="80" fill="#1b5e20" />
          <rect x="15" width="15" height="80" fill="#2e7d32" />
        </pattern>

        {/* Solar Panel Photovoltaic Cell Grid Pattern */}
        <pattern id="solarPanelPattern" width="10" height="8" patternUnits="userSpaceOnUse">
          <rect width="10" height="8" fill="#172554" stroke="#1e3a8a" strokeWidth="0.8" />
          <line x1="0" y1="4" x2="10" y2="4" stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
          <line x1="5" y1="0" x2="5" y2="8" stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
        </pattern>

        {/* Concrete Roof Paver Texture */}
        <pattern id="roofPaver" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#334155" stroke="#1e293b" strokeWidth="0.5" />
        </pattern>

        {/* Blueprint Millimeter Grid */}
        <pattern id="blueprintGridFine" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#082f49" />
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#0284c7" strokeWidth="0.4" opacity="0.4" />
        </pattern>
        <pattern id="blueprintGridMajor" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#blueprintGridFine)" />
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
        </pattern>

        {/* Drop shadow for buildings in satellite mode */}
        <filter id="satelliteShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="8" dy="12" stdDeviation="6" floodColor="#000000" floodOpacity="0.65" />
        </filter>

        {/* Tree Drop Shadow */}
        <filter id="treeShadow" x="-30%" y="-30%" width="180%" height="180%">
          <feDropShadow dx="6" dy="9" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.6" />
        </filter>

        {/* Streetlight Glow */}
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#fef08a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ============================================================== */}
      {/* 1. TERRAIN / BASE CANVAS ACCORDING TO THEME */}
      {/* ============================================================== */}
      {isSatellite && (
        <g id="satellite_terrain">
          {/* Earth/Grass aerial base */}
          <rect x="0" y="0" width="1000" height="800" fill="url(#satGroundGradient)" />

          {/* Manicured Lawn Patches */}
          <rect x="50" y="50" width="900" height="700" rx="24" fill="url(#satLawnMowing)" opacity="0.35" />
          
          {/* North Academic Green Park with natural organic curve */}
          <path
            d="M 360 85 C 410 70, 520 70, 580 85 C 600 110, 580 150, 560 160 C 500 170, 420 165, 370 155 C 345 130, 345 100, 360 85 Z"
            fill="#143820"
            stroke="#225430"
            strokeWidth="1.5"
          />
          <text x="470" y="120" fill="#4ade80" fontSize="10.5" fontWeight="600" opacity="0.75" textAnchor="middle" letterSpacing="1">
            CENTRAL BOTANICAL GARDENS
          </text>

          {/* South Garden Courtyard */}
          <rect x="220" y="650" width="180" height="60" rx="12" fill="#163822" stroke="#265e38" strokeWidth="1" />
          <text x="310" y="685" fill="#86efac" fontSize="9" opacity="0.7" textAnchor="middle">
            South Garden Courtyard
          </text>
        </g>
      )}

      {isBlueprint && (
        <g id="blueprint_base">
          <rect x="0" y="0" width="1000" height="800" fill="url(#blueprintGridMajor)" />
          {/* Blueprint Title Block Frame */}
          <rect x="20" y="20" width="960" height="760" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <rect x="24" y="24" width="952" height="752" fill="none" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="6,4" />
          
          {/* Architectural Drawing Title Block in bottom right */}
          <g transform="translate(680, 680)">
            <rect x="0" y="0" width="280" height="80" fill="rgba(8, 47, 73, 0.95)" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="0" y1="26" x2="280" y2="26" stroke="#0284c7" strokeWidth="1" />
            <line x1="0" y1="52" x2="280" y2="52" stroke="#0284c7" strokeWidth="1" />
            <line x1="140" y1="26" x2="140" y2="80" stroke="#0284c7" strokeWidth="1" />
            <text x="140" y="18" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.8">
              CAMPUS MASTER ARCHITECTURAL PLAN
            </text>
            <text x="70" y="42" fill="#e0f2fe" fontSize="8" textAnchor="middle">SCALE: 1:500 (METRIC)</text>
            <text x="210" y="42" fill="#e0f2fe" fontSize="8" textAnchor="middle">PROJ: MCA / ENG BLOCKS</text>
            <text x="70" y="68" fill="#7dd3fc" fontSize="8" textAnchor="middle">REVISION: V3.8 (NATURAL ROADS)</text>
            <text x="210" y="68" fill="#7dd3fc" fontSize="8" textAnchor="middle">STATUS: APPROVED FOR CONST.</text>
          </g>
        </g>
      )}

      {/* ============================================================== */}
      {/* 2. ATHLETIC STADIUM / SPORTS GROUND */}
      {/* ============================================================== */}
      <g id="sports_ground" filter={isSatellite ? 'url(#satelliteShadow)' : undefined}>
        {/* Tartan Running Track */}
        <rect
          x="330"
          y="530"
          width="320"
          height="110"
          rx="55"
          fill={isSatellite ? '#7f1d1d' : isBlueprint ? 'none' : '#fce8e6'}
          stroke={isSatellite ? '#991b1b' : isBlueprint ? '#38bdf8' : '#f28b82'}
          strokeWidth={isBlueprint ? 2 : 4}
        />

        {/* 4 Athletic Running Lanes */}
        <rect x="336" y="534" width="308" height="102" rx="51" fill="none" stroke={isSatellite ? '#fca5a5' : isBlueprint ? '#0284c7' : '#ffffff'} strokeWidth="1" strokeDasharray="6,4" />
        <rect x="342" y="538" width="296" height="94" rx="47" fill="none" stroke={isSatellite ? '#fca5a5' : isBlueprint ? '#0284c7' : '#ffffff'} strokeWidth="1" strokeDasharray="6,4" />
        <rect x="348" y="542" width="284" height="86" rx="43" fill="none" stroke={isSatellite ? '#fca5a5' : isBlueprint ? '#0284c7' : '#ffffff'} strokeWidth="1" strokeDasharray="6,4" />

        {/* Inner Football Turf */}
        <rect
          x="356"
          y="547"
          width="268"
          height="76"
          rx="38"
          fill={isSatellite ? 'url(#turfStripes)' : isBlueprint ? 'rgba(14, 165, 233, 0.15)' : '#a8dab5'}
          stroke={isSatellite ? '#ffffff' : isBlueprint ? '#38bdf8' : '#34a853'}
          strokeWidth="1.5"
        />

        {/* Pitch Lines */}
        <line x1="490" y1="547" x2="490" y2="623" stroke="#ffffff" strokeWidth="1.8" />
        <circle cx="490" cy="585" r="22" fill="none" stroke="#ffffff" strokeWidth="1.8" />
        <circle cx="490" cy="585" r="2.5" fill="#ffffff" />
        <rect x="360" y="565" width="22" height="40" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <rect x="598" y="565" width="22" height="40" fill="none" stroke="#ffffff" strokeWidth="1.5" />

        <text x="490" y="589" fill={isSatellite ? '#ffffff' : isBlueprint ? '#7dd3fc' : '#137333'} fontSize="11" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">
          OLYMPIC ATHLETICS STADIUM
        </text>
      </g>

      {/* ============================================================== */}
      {/* 3. NATURAL ROADS, BOULEVARDS, KERBS & MEANDERING PATHS */}
      {/* ============================================================== */}

      {/* --- LAYER A: NATURAL SECONDARY PEDESTRIAN PATHWAYS (Flagstone / Pavers) --- */}
      <g id="natural_pedestrian_pathways" strokeLinecap="round" strokeLinejoin="round">
        {/* Curving garden walking trail through Botanical Park */}
        <path
          d="M 330 110 C 370 135, 410 95, 470 120 C 530 145, 590 100, 640 125"
          fill="none"
          stroke={isSatellite ? 'url(#naturalPavers)' : isBlueprint ? '#0284c7' : '#d7ccc8'}
          strokeWidth="8"
        />
        {/* Scenic walk connecting Stadium south to Hostels */}
        <path
          d="M 330 585 C 290 600, 260 620, 220 640 C 180 660, 160 650, 140 600"
          fill="none"
          stroke={isSatellite ? 'url(#naturalPavers)' : isBlueprint ? '#0284c7' : '#d7ccc8'}
          strokeWidth="7"
        />
        {/* Shaded promenade between Canteen and Girls Hostel */}
        <path
          d="M 780 430 C 820 450, 850 490, 840 540"
          fill="none"
          stroke={isSatellite ? 'url(#naturalPavers)' : isBlueprint ? '#0284c7' : '#d7ccc8'}
          strokeWidth="7"
        />
        {/* Courtyard path between Admin and Library */}
        <path
          d="M 340 220 C 365 240, 375 250, 395 240"
          fill="none"
          stroke={isSatellite ? 'url(#naturalPavers)' : isBlueprint ? '#0284c7' : '#d7ccc8'}
          strokeWidth="7"
        />
        {/* West quad connector to Medical Center */}
        <path
          d="M 260 380 C 235 375, 220 380, 210 385"
          fill="none"
          stroke={isSatellite ? 'url(#naturalPavers)' : isBlueprint ? '#0284c7' : '#d7ccc8'}
          strokeWidth="8"
        />
      </g>

      {/* --- LAYER B: NATURAL ROADS & ARTERIAL HIGHWAYS --- */}
      <g id="natural_roads_hierarchy" strokeLinecap="round" strokeLinejoin="round">

        {/* 1. SOFT GRAVEL / ROAD SHOULDER SUB-BASE (Realistic transition into grass) */}
        {isSatellite && (
          <g stroke="#353b34" opacity="0.6">
            {/* Outer Perimeter Ring Road Base */}
            <path
              d="M 490 740 C 380 740, 180 740, 100 720 C 60 705, 50 660, 50 580 L 50 200 C 50 120, 90 75, 180 75 L 820 75 C 910 75, 950 120, 950 200 L 950 580 C 950 660, 930 705, 890 720 C 810 740, 600 740, 490 740 Z"
              fill="none"
              strokeWidth="28"
            />
            {/* Central Boulevard Base */}
            <path d="M 490 760 L 490 450" fill="none" strokeWidth="36" />
            {/* East-West Avenue Base */}
            <path d="M 190 450 C 330 450, 400 450, 490 450 C 580 450, 670 450, 790 450" fill="none" strokeWidth="28" />
            {/* North Dean's Avenue Base */}
            <path d="M 265 270 C 370 270, 430 280, 490 270 C 580 255, 680 245, 780 250" fill="none" strokeWidth="26" />
            {/* Connecting Links Base */}
            <path d="M 490 450 C 490 370, 470 330, 465 270" fill="none" strokeWidth="24" />
            <path d="M 490 650 C 460 660, 430 670, 400 680" fill="none" strokeWidth="22" />
            <path d="M 345 450 C 300 480, 270 520, 250 560" fill="none" strokeWidth="22" />
            <path d="M 720 450 C 730 480, 740 515, 740 550" fill="none" strokeWidth="22" />
            <path d="M 590 450 C 640 450, 690 420, 720 390" fill="none" strokeWidth="24" />
          </g>
        )}

        {/* 2. CONCRETE KERB & GUTTER STONES (Defines clean architectural edge) */}
        <g stroke={isSatellite ? '#64748b' : isBlueprint ? '#38bdf8' : '#bdc1c6'} strokeWidth={isSatellite ? 24 : isBlueprint ? 22 : 24}>
          {/* Outer Perimeter Ring Road Kerb */}
          <path
            d="M 490 740 C 380 740, 180 740, 100 720 C 60 705, 50 660, 50 580 L 50 200 C 50 120, 90 75, 180 75 L 820 75 C 910 75, 950 120, 950 200 L 950 580 C 950 660, 930 705, 890 720 C 810 740, 600 740, 490 740 Z"
            fill="none"
          />
          {/* Central Boulevard Kerb */}
          <path d="M 490 760 L 490 450" fill="none" strokeWidth={isSatellite ? 32 : 28} />
          {/* East-West Promenade Kerb */}
          <path d="M 190 450 C 330 450, 400 450, 490 450 C 580 450, 670 450, 790 450" fill="none" />
          {/* North Academic Avenue Kerb */}
          <path d="M 265 270 C 370 270, 430 280, 490 270 C 580 255, 680 245, 780 250" fill="none" />
          {/* Central North Connector Kerb */}
          <path d="M 490 450 C 490 370, 470 330, 465 270" fill="none" strokeWidth={isSatellite ? 20 : 18} />
          {/* Parking & Hostel Branches Kerb */}
          <path d="M 490 650 C 460 660, 430 670, 400 680" fill="none" strokeWidth={isSatellite ? 18 : 16} />
          <path d="M 345 450 C 300 480, 270 520, 250 560" fill="none" strokeWidth={isSatellite ? 18 : 16} />
          <path d="M 720 450 C 730 480, 740 515, 740 550" fill="none" strokeWidth={isSatellite ? 18 : 16} />
          <path d="M 590 450 C 640 450, 690 420, 720 390" fill="none" strokeWidth={isSatellite ? 20 : 18} />
        </g>

        {/* 3. NATURAL WEATHERED ASPHALT PAVEMENT SURFACE */}
        <g stroke={isSatellite ? 'url(#naturalAsphalt)' : isBlueprint ? '#0369a1' : 'url(#lightAsphalt)'} strokeWidth={isSatellite ? 20 : isBlueprint ? 18 : 20}>
          {/* Outer Ring Road Tarmac */}
          <path
            d="M 490 740 C 380 740, 180 740, 100 720 C 60 705, 50 660, 50 580 L 50 200 C 50 120, 90 75, 180 75 L 820 75 C 910 75, 950 120, 950 200 L 950 580 C 950 660, 930 705, 890 720 C 810 740, 600 740, 490 740 Z"
            fill="none"
          />
          {/* Central Boulevard Tarmac */}
          <path d="M 490 760 L 490 450" fill="none" strokeWidth={isSatellite ? 28 : 24} />
          {/* East-West Avenue Tarmac */}
          <path d="M 190 450 C 330 450, 400 450, 490 450 C 580 450, 670 450, 790 450" fill="none" />
          {/* North Dean's Avenue Tarmac */}
          <path d="M 265 270 C 370 270, 430 280, 490 270 C 580 255, 680 245, 780 250" fill="none" />
          {/* Connecting Links Tarmac */}
          <path d="M 490 450 C 490 370, 470 330, 465 270" fill="none" strokeWidth={isSatellite ? 16 : 14} />
          <path d="M 490 650 C 460 660, 430 670, 400 680" fill="none" strokeWidth={isSatellite ? 14 : 12} />
          <path d="M 345 450 C 300 480, 270 520, 250 560" fill="none" strokeWidth={isSatellite ? 14 : 12} />
          <path d="M 720 450 C 730 480, 740 515, 740 550" fill="none" strokeWidth={isSatellite ? 14 : 12} />
          <path d="M 590 450 C 640 450, 690 420, 720 390" fill="none" strokeWidth={isSatellite ? 16 : 14} />
        </g>

        {/* 4. BUS / TAXI DROP-OFF BAY TURNOUT on South Boulevard */}
        {isSatellite && (
          <g>
            {/* Turnout bay asphalt */}
            <path
              d="M 504 670 C 516 670, 524 680, 524 695 C 524 710, 516 720, 504 720"
              fill="none"
              stroke="url(#naturalAsphalt)"
              strokeWidth="12"
            />
            {/* Dashed white lane marker for turnout */}
            <path
              d="M 504 670 C 516 670, 524 680, 524 695 C 524 710, 516 720, 504 720"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeDasharray="4,4"
              opacity="0.8"
            />
            {/* "BUS / TAXI" yellow pavement text */}
            <text x="516" y="698" fill="#facc15" fontSize="6" fontWeight="bold" textAnchor="middle" transform="rotate(90 516 698)">
              BUS STOP
            </text>
          </g>
        )}

        {/* 5. BOULEVARD CENTER GREEN MEDIAN DIVIDER (With planted shrubs) */}
        {isSatellite && (
          <g>
            {/* Curving green median island */}
            <rect x="488" y="490" width="4" height="200" rx="2" fill="#1e3e29" stroke="#94a3b8" strokeWidth="0.8" />
            {/* Low decorative shrubs along the median */}
            <circle cx="490" cy="510" r="2.5" fill="#22c55e" />
            <circle cx="490" cy="540" r="2.5" fill="#22c55e" />
            <circle cx="490" cy="570" r="2.5" fill="#22c55e" />
            <circle cx="490" cy="600" r="2.5" fill="#22c55e" />
            <circle cx="490" cy="630" r="2.5" fill="#22c55e" />
            <circle cx="490" cy="660" r="2.5" fill="#22c55e" />
          </g>
        )}

        {/* 6. CENTRAL TRAFFIC ROUNDABOUT (Natural Circular Geometry) */}
        <g id="central_roundabout">
          {/* Outer Kerb */}
          <circle
            cx="490"
            cy="450"
            r="38"
            fill="none"
            stroke={isSatellite ? '#64748b' : isBlueprint ? '#38bdf8' : '#bdc1c6'}
            strokeWidth={isSatellite ? 24 : 20}
          />
          {/* Asphalt Ring */}
          <circle
            cx="490"
            cy="450"
            r="38"
            fill="none"
            stroke={isSatellite ? 'url(#naturalAsphalt)' : isBlueprint ? '#0369a1' : 'url(#lightAsphalt)'}
            strokeWidth={isSatellite ? 20 : 16}
          />
          {/* Central Landscaped Island with Fountain */}
          <circle cx="490" cy="450" r="26" fill={isSatellite ? '#143820' : isBlueprint ? '#082f49' : '#e8f0fe'} stroke={isSatellite ? '#94a3b8' : '#38bdf8'} strokeWidth="1.5" />
          {/* Water basin */}
          <circle cx="490" cy="450" r="14" fill="#38bdf8" opacity="0.85" />
          <circle cx="490" cy="450" r="8" fill="#0284c7" />
          {/* Fountain spray center */}
          <circle cx="490" cy="450" r="3" fill="#ffffff" />
          
          {/* Roundabout Circular Flow Directional Arrows */}
          {isSatellite && (
            <g fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.85">
              {/* Arrow North */}
              <path d="M 470 420 A 28 28 0 0 1 510 420" strokeDasharray="6,4" />
              <polygon points="508,417 516,420 508,423" fill="#ffffff" stroke="none" />
              {/* Arrow South */}
              <path d="M 510 480 A 28 28 0 0 1 470 480" strokeDasharray="6,4" />
              <polygon points="472,483 464,480 472,477" fill="#ffffff" stroke="none" />
            </g>
          )}
        </g>

        {/* 7. REALISTIC ROAD MARKINGS (Dashed Yellow Centerline & Solid White Fog Lines) */}
        {isSatellite && (
          <g id="road_markings" opacity="0.85">
            {/* Perimeter Ring Road Centerline (Yellow Dashes) */}
            <path
              d="M 490 740 C 380 740, 180 740, 100 720 C 60 705, 50 660, 50 580 L 50 200 C 50 120, 90 75, 180 75 L 820 75 C 910 75, 950 120, 950 200 L 950 580 C 950 660, 930 705, 890 720 C 810 740, 600 740, 490 740"
              fill="none"
              stroke="#facc15"
              strokeWidth="1.2"
              strokeDasharray="8,8"
            />

            {/* West-East Promenade Dividing Markings */}
            <path
              d="M 200 450 C 330 450, 400 450, 440 450"
              fill="none"
              stroke="#facc15"
              strokeWidth="1.2"
              strokeDasharray="7,7"
            />
            <path
              d="M 540 450 C 600 450, 680 450, 780 450"
              fill="none"
              stroke="#facc15"
              strokeWidth="1.2"
              strokeDasharray="7,7"
            />

            {/* North Dean's Avenue Dividing Line */}
            <path
              d="M 270 270 C 370 270, 430 280, 490 270 C 570 255, 670 245, 770 250"
              fill="none"
              stroke="#facc15"
              strokeWidth="1.2"
              strokeDasharray="7,7"
            />

            {/* South Boulevard Painted Lane Arrows */}
            <g fill="#ffffff">
              {/* Northbound Lane Arrow (Straight) */}
              <polygon points="480,685 483,675 486,685 484,685 484,695 482,695 482,685" />
              {/* Left-turn lane arrow towards Parking */}
              <polygon points="479,655 471,655 474,651 471,655 474,659 476,656 483,656 483,663 481,663" />
              {/* Southbound Lane Arrow (Straight) */}
              <polygon points="498,675 495,685 492,675 494,675 494,665 496,665 496,675" />
            </g>

            {/* "SLOW / 15" Stencil painted on South Entrance */}
            <text x="483" y="735" fill="#ffffff" fontSize="5.5" fontWeight="bold" letterSpacing="1" opacity="0.9">
              SLOW
            </text>
            <text x="483" y="743" fill="#ffffff" fontSize="5" fontWeight="bold" opacity="0.9">
              15 MPH
            </text>
          </g>
        )}

        {/* 8. PEDESTRIAN ZEBRA CROSSINGS (Realistic Block Bars with Tactile Ramps) */}
        {isSatellite && (
          <g id="zebra_pedestrian_crossings" stroke="#ffffff" strokeWidth="2.5" opacity="0.92">
            {/* South Main Gate Crosswalk */}
            <line x1="476" y1="710" x2="504" y2="710" />
            <line x1="476" y1="714" x2="504" y2="714" />
            <line x1="476" y1="718" x2="504" y2="718" />
            <line x1="476" y1="722" x2="504" y2="722" />

            {/* Central Roundabout South Crossing */}
            <line x1="478" y1="482" x2="502" y2="482" />
            <line x1="478" y1="486" x2="502" y2="486" />
            <line x1="478" y1="490" x2="502" y2="490" />

            {/* Central Roundabout North Crossing */}
            <line x1="478" y1="412" x2="502" y2="412" />
            <line x1="478" y1="416" x2="502" y2="416" />
            <line x1="478" y1="420" x2="502" y2="420" />

            {/* Roundabout West Crossing into Block A */}
            <line x1="440" y1="440" x2="440" y2="460" />
            <line x1="444" y1="440" x2="444" y2="460" />
            <line x1="448" y1="440" x2="448" y2="460" />

            {/* Roundabout East Crossing into Block B */}
            <line x1="532" y1="440" x2="532" y2="460" />
            <line x1="536" y1="440" x2="536" y2="460" />
            <line x1="540" y1="440" x2="540" y2="460" />

            {/* Library Front Crosswalk */}
            <line x1="452" y1="280" x2="478" y2="280" />
            <line x1="452" y1="284" x2="478" y2="284" />
            <line x1="452" y1="288" x2="478" y2="288" />

            {/* Canteen Plaza Crosswalk */}
            <line x1="706" y1="380" x2="706" y2="400" />
            <line x1="710" y1="380" x2="710" y2="400" />
            <line x1="714" y1="380" x2="714" y2="400" />
          </g>
        )}

        {/* 9. CAMPUS TRANSIT VEHICLE ON ROAD (Adds Natural Realism) */}
        {isSatellite && (
          <g id="campus_shuttle_vehicle" transform="translate(480, 560)">
            {/* Vehicle Shadow */}
            <rect x="2" y="4" width="10" height="20" rx="3" fill="rgba(0,0,0,0.5)" />
            {/* Campus Electric Shuttle Bus */}
            <rect x="0" y="0" width="10" height="20" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="0.8" />
            {/* Blue roof stripe */}
            <rect x="1" y="4" width="8" height="12" rx="1.5" fill="#0284c7" />
            {/* Front windshield */}
            <rect x="1.5" y="1" width="7" height="3" rx="0.5" fill="#0f172a" />
            {/* Headlights */}
            <circle cx="2" cy="1" r="0.8" fill="#fef08a" />
            <circle cx="8" cy="1" r="0.8" fill="#fef08a" />
          </g>
        )}

        {/* 10. SOLAR LED STREET LIGHT POSTS (Lining curved road avenues) */}
        {isSatellite && (
          <g id="campus_streetlamps">
            {[
              { x: 472, y: 730 },
              { x: 508, y: 730 },
              { x: 472, y: 650 },
              { x: 508, y: 650 },
              { x: 472, y: 570 },
              { x: 508, y: 570 },
              { x: 472, y: 500 },
              { x: 508, y: 500 },
              { x: 440, y: 435 },
              { x: 540, y: 435 },
              { x: 440, y: 465 },
              { x: 540, y: 465 },
              { x: 380, y: 438 },
              { x: 600, y: 438 },
              { x: 680, y: 438 },
              { x: 450, y: 260 },
              { x: 480, y: 260 },
            ].map((lamp, i) => (
              <g key={i}>
                {/* Ambient glow circle */}
                <circle cx={lamp.x} cy={lamp.y} r="7" fill="url(#lampGlow)" opacity="0.6" />
                {/* Lamp pole top */}
                <circle cx={lamp.x} cy={lamp.y} r="1.5" fill="#fef08a" stroke="#475569" strokeWidth="0.5" />
              </g>
            ))}
          </g>
        )}
      </g>

      {/* ============================================================== */}
      {/* 4. PARKING PLAZA (Detailed Marked Bays & Parked Vehicles) */}
      {/* ============================================================== */}
      <g id="parking_plaza" transform="translate(370, 660)">
        <rect x="0" y="0" width="130" height="70" rx="8" fill={isSatellite ? '#1e293b' : isBlueprint ? 'rgba(8,47,73,0.9)' : '#f1f3f4'} stroke={isSatellite ? '#475569' : isBlueprint ? '#38bdf8' : '#dadce0'} strokeWidth="1.5" />
        
        {/* Parking Lot Title */}
        <text x="65" y="14" fill={isSatellite ? '#94a3b8' : isBlueprint ? '#7dd3fc' : '#5f6368'} fontSize="8" fontWeight="bold" textAnchor="middle">
          PARKING LOT P-1 & EV CHARGING
        </text>

        {/* White Parking Stalls Grid */}
        <g stroke={isSatellite ? '#ffffff' : isBlueprint ? '#38bdf8' : '#9aa0a6'} strokeWidth="1" strokeDasharray="none" opacity="0.8">
          <line x1="10" y1="20" x2="10" y2="38" />
          <line x1="26" y1="20" x2="26" y2="38" />
          <line x1="42" y1="20" x2="42" y2="38" />
          <line x1="58" y1="20" x2="58" y2="38" />
          <line x1="74" y1="20" x2="74" y2="38" />
          <line x1="90" y1="20" x2="90" y2="38" />
          <line x1="106" y1="20" x2="106" y2="38" />
          <line x1="122" y1="20" x2="122" y2="38" />

          {/* Lower row stalls */}
          <line x1="10" y1="48" x2="10" y2="66" />
          <line x1="26" y1="48" x2="26" y2="66" />
          <line x1="42" y1="48" x2="42" y2="66" />
          <line x1="58" y1="48" x2="58" y2="66" />
          <line x1="74" y1="48" x2="74" y2="66" />
          <line x1="90" y1="48" x2="90" y2="66" />
          <line x1="106" y1="48" x2="106" y2="66" />
          <line x1="122" y1="48" x2="122" y2="66" />
        </g>

        {/* Parked Cars Aerial Silhouettes */}
        {isSatellite && (
          <g>
            {/* White Sedan in Stall 1 */}
            <rect x="13" y="23" width="10" height="13" rx="2" fill="#f8fafc" stroke="#64748b" strokeWidth="0.5" />
            <rect x="14" y="26" width="8" height="7" rx="1.5" fill="#334155" />
            
            {/* Blue Compact in Stall 2 */}
            <rect x="29" y="23" width="10" height="12" rx="2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.5" />
            <rect x="30" y="26" width="8" height="6" rx="1.5" fill="#1e293b" />

            {/* Red SUV in Stall 4 */}
            <rect x="61" y="22" width="10" height="14" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="0.5" />
            <rect x="62" y="25" width="8" height="8" rx="1.5" fill="#1e293b" />

            {/* Silver Sedan in Lower Stall */}
            <rect x="29" y="50" width="10" height="13" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
            <rect x="30" y="53" width="8" height="7" rx="1.5" fill="#334155" />

            {/* Green EV Car in EV bay */}
            <rect x="93" y="50" width="10" height="13" rx="2" fill="#16a34a" stroke="#15803d" strokeWidth="0.5" />
            <rect x="94" y="53" width="8" height="7" rx="1.5" fill="#1e293b" />
            <text x="114" y="60" fill="#22c55e" fontSize="6.5" fontWeight="bold" textAnchor="middle">⚡ EV</text>
          </g>
        )}
      </g>

      {/* ============================================================== */}
      {/* 5. SATELLITE ROOF DETAILS (When showPlans is FALSE) */}
      {/* ============================================================== */}
      {isSatellite && !showPlans && (
        <g id="satellite_rooftops" className="pointer-events-none select-none">
          {/* Block A Roof: Solar Panel Array & HVAC units */}
          <g>
            <rect x="270" y="330" width="150" height="110" rx="8" fill="url(#roofPaver)" stroke="#475569" strokeWidth="1.5" />
            <rect x="278" y="338" width="70" height="40" rx="3" fill="url(#solarPanelPattern)" stroke="#1e40af" strokeWidth="1" />
            <text x="313" y="335" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">SOLAR PV ARRAY</text>

            {/* HVAC Chiller units */}
            <rect x="360" y="340" width="22" height="16" rx="2" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <line x1="363" y1="344" x2="379" y2="344" stroke="#94a3b8" strokeWidth="1" />
            <line x1="363" y1="348" x2="379" y2="348" stroke="#94a3b8" strokeWidth="1" />
            <line x1="363" y1="352" x2="379" y2="352" stroke="#94a3b8" strokeWidth="1" />

            <rect x="360" y="362" width="22" height="16" rx="2" fill="#475569" stroke="#64748b" strokeWidth="1" />

            {/* Roof Skylight */}
            <rect x="278" y="390" width="50" height="24" rx="2" fill="#38bdf8" opacity="0.6" stroke="#0284c7" strokeWidth="1" />
          </g>

          {/* Block B Roof: High-density solar grid & Elevator penthouse */}
          <g>
            <rect x="510" y="330" width="160" height="120" rx="8" fill="url(#roofPaver)" stroke="#475569" strokeWidth="1.5" />
            <rect x="520" y="340" width="80" height="45" rx="3" fill="url(#solarPanelPattern)" stroke="#1e40af" strokeWidth="1" />
            
            {/* Elevator & Stair tower */}
            <rect x="615" y="340" width="45" height="35" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <text x="637" y="362" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">LIFT CORE</text>

            {/* Industrial Cooling Fans */}
            <circle cx="540" cy="415" r="10" fill="#334155" stroke="#64748b" strokeWidth="1" />
            <circle cx="540" cy="415" r="3" fill="#94a3b8" />
            <circle cx="570" cy="415" r="10" fill="#334155" stroke="#64748b" strokeWidth="1" />
            <circle cx="570" cy="415" r="3" fill="#94a3b8" />
          </g>

          {/* Central Library Roof: Dome Skylight */}
          <g>
            <rect x="400" y="170" width="130" height="90" rx="8" fill="url(#roofPaver)" stroke="#475569" strokeWidth="1.5" />
            <circle cx="465" cy="215" r="28" fill="#0284c7" opacity="0.45" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="465" cy="215" r="16" fill="#38bdf8" opacity="0.6" />
            <text x="465" y="219" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">ATRIUM DOME</text>
          </g>

          {/* Auditorium Roof */}
          <g>
            <rect x="730" y="180" width="120" height="90" rx="10" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
            <line x1="735" y1="200" x2="845" y2="200" stroke="#475569" strokeWidth="2" />
            <line x1="735" y1="220" x2="845" y2="220" stroke="#475569" strokeWidth="2" />
            <line x1="735" y1="240" x2="845" y2="240" stroke="#475569" strokeWidth="2" />
          </g>
        </g>
      )}

      {/* ============================================================== */}
      {/* 6. PHOTOREALISTIC SATELLITE TREES (Casting shadows over roads) */}
      {/* ============================================================== */}
      {isSatellite && (
        <g id="satellite_trees" filter="url(#treeShadow)">
          {/* North Forest Cluster */}
          <circle cx="160" cy="110" r="24" fill="#14532d" />
          <circle cx="156" cy="106" r="18" fill="#166534" />
          <circle cx="152" cy="102" r="10" fill="#15803d" />

          <circle cx="210" cy="100" r="20" fill="#14532d" />
          <circle cx="206" cy="96" r="14" fill="#166534" />

          <circle cx="630" cy="115" r="26" fill="#14532d" />
          <circle cx="625" cy="110" r="20" fill="#166534" />
          <circle cx="620" cy="106" r="12" fill="#15803d" />

          {/* East Garden Cluster */}
          <circle cx="890" cy="280" r="28" fill="#14532d" />
          <circle cx="885" cy="275" r="20" fill="#166534" />

          <circle cx="880" cy="430" r="30" fill="#14532d" />
          <circle cx="875" cy="425" r="22" fill="#166534" />
          <circle cx="870" cy="420" r="14" fill="#15803d" />

          {/* Boulevard Trees casting natural shade over South Avenue */}
          <circle cx="458" cy="690" r="13" fill="#14532d" />
          <circle cx="454" cy="687" r="9" fill="#166534" />
          <circle cx="522" cy="690" r="13" fill="#14532d" />

          <circle cx="458" cy="630" r="13" fill="#14532d" />
          <circle cx="522" cy="630" r="13" fill="#14532d" />

          <circle cx="458" cy="570" r="13" fill="#14532d" />
          <circle cx="522" cy="570" r="13" fill="#14532d" />

          {/* West Garden Cluster */}
          <circle cx="70" cy="680" r="26" fill="#14532d" />
          <circle cx="66" cy="676" r="18" fill="#166534" />
          <circle cx="120" cy="700" r="22" fill="#14532d" />
        </g>
      )}
    </>
  );
};
