import React from 'react';
import { Building } from '../types/campus';

interface BuildingPlansProps {
  buildings: Building[];
  selectedFloor: number;
  theme: 'satellite' | 'blueprint' | 'standard';
  showPlans: boolean;
  hoveredBuildingId: string | null;
  selectedBuildingId: string | null;
}

export const BuildingPlans: React.FC<BuildingPlansProps> = ({
  buildings,
  selectedFloor,
  theme,
  showPlans,
  hoveredBuildingId,
  selectedBuildingId,
}) => {
  if (!showPlans) return null;

  const isBlueprint = theme === 'blueprint';
  const isSatellite = theme === 'satellite';

  // Styling palette depending on theme
  const wallStroke = isBlueprint ? '#38bdf8' : isSatellite ? '#f8fafc' : '#3c4043';
  const wallFill = isBlueprint ? 'rgba(8, 47, 73, 0.85)' : isSatellite ? 'rgba(23, 37, 84, 0.78)' : '#ffffff';
  const roomBg = isBlueprint ? 'rgba(14, 165, 233, 0.12)' : isSatellite ? 'rgba(255, 255, 255, 0.18)' : '#f8f9fa';
  const textPrimary = isBlueprint ? '#e0f2fe' : isSatellite ? '#ffffff' : '#202124';
  const textSecondary = isBlueprint ? '#7dd3fc' : isSatellite ? '#cbd5e1' : '#5f6368';
  const furnitureStroke = isBlueprint ? '#0284c7' : isSatellite ? '#93c5fd' : '#9aa0a6';
  const furnitureFill = isBlueprint ? 'rgba(2, 132, 199, 0.25)' : isSatellite ? 'rgba(255, 255, 255, 0.25)' : '#e8eaed';
  const doorColor = isBlueprint ? '#38bdf8' : isSatellite ? '#60a5fa' : '#1a73e8';

  return (
    <g className="building-plans-layer pointer-events-none select-none transition-all duration-300">
      {/* ============================================================== */}
      {/* 1. ACADEMIC BLOCK A (Engineering & Tech) [x: 260, y: 320, w: 170, h: 130] */}
      {/* ============================================================== */}
      <g id="plan_acad_a">
        {/* Floor 0 / Ground: Engineering Labs & Workshop */}
        {selectedFloor === 0 && (
          <g>
            {/* Background base */}
            <rect x="264" y="324" width="162" height="122" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
            {/* Main Central Corridor */}
            <rect x="264" y="375" width="162" height="20" fill={isBlueprint ? 'rgba(2, 132, 199, 0.15)' : 'rgba(0,0,0,0.1)'} stroke={wallStroke} strokeWidth="1" strokeDasharray="3,2" />
            <text x="345" y="388" fill={textSecondary} fontSize="8" fontWeight="600" textAnchor="middle" letterSpacing="0.5">
              CENTRAL CORRIDOR
            </text>

            {/* Room 1: Robotics & Mechatronics Lab (North-West) */}
            <rect x="266" y="326" width="76" height="47" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="304" y="342" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              A-001 Robotics Lab
            </text>
            <text x="304" y="352" fill={textSecondary} fontSize="7" textAnchor="middle">
              Workbenches & Arms
            </text>
            {/* Robotics workbenches & equipment icons */}
            <rect x="272" y="357" width="28" height="12" rx="2" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />
            <rect x="308" y="357" width="28" height="12" rx="2" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />

            {/* Room 2: CAD / CAM Design Studio (North-East) */}
            <rect x="344" y="326" width="80" height="47" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="384" y="342" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              A-002 CAD Studio
            </text>
            <text x="384" y="352" fill={textSecondary} fontSize="7" textAnchor="middle">
              24 High-Spec PCs
            </text>
            {/* Workstation pods */}
            <g stroke={furnitureStroke} strokeWidth="0.7" fill={furnitureFill}>
              <rect x="352" y="357" width="16" height="12" rx="1.5" />
              <rect x="372" y="357" width="16" height="12" rx="1.5" />
              <rect x="392" y="357" width="16" height="12" rx="1.5" />
            </g>

            {/* Room 3: Mechanical Testing Lab (South-West) */}
            <rect x="266" y="397" width="76" height="47" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="304" y="415" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              A-003 Materials Lab
            </text>
            <text x="304" y="425" fill={textSecondary} fontSize="7" textAnchor="middle">
              UTM & Hardness Testers
            </text>

            {/* Room 4: Stairs, Elevator & Restrooms (South-East) */}
            <rect x="344" y="397" width="80" height="47" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="384" y="414" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
              Lift & Restrooms
            </text>
            {/* Lift icon */}
            <rect x="350" y="420" width="18" height="18" rx="2" fill="none" stroke={wallStroke} strokeWidth="1" />
            <line x1="350" y1="420" x2="368" y2="438" stroke={wallStroke} strokeWidth="0.8" />
            <line x1="368" y1="420" x2="350" y2="438" stroke={wallStroke} strokeWidth="0.8" />
            <text x="359" y="432" fill={textPrimary} fontSize="6" fontWeight="bold" textAnchor="middle">LIFT</text>
            {/* Restrooms symbol */}
            <rect x="374" y="420" width="44" height="18" rx="2" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />
            <text x="396" y="432" fill={textSecondary} fontSize="6.5" fontWeight="bold" textAnchor="middle">WC (M/F)</text>

            {/* Main Entrance Door Swing */}
            <path d="M 338 446 A 12 12 0 0 1 352 446" fill="none" stroke={doorColor} strokeWidth="1.5" />
          </g>
        )}

        {/* Floor 1 & 2: Computer Labs & Lecture Halls */}
        {(selectedFloor === 1 || selectedFloor === 2) && (
          <g>
            <rect x="264" y="324" width="162" height="122" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
            {/* Central Corridor */}
            <rect x="264" y="375" width="162" height="20" fill={isBlueprint ? 'rgba(2, 132, 199, 0.15)' : 'rgba(0,0,0,0.1)'} stroke={wallStroke} strokeWidth="1" strokeDasharray="3,2" />

            {/* North Lab: Computer Lab 1 or 2 */}
            <rect x="266" y="326" width="95" height="47" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="313" y="341" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              {selectedFloor === 2 ? 'Comp Lab 2 (Software)' : 'Comp Lab 1 (Networks)'}
            </text>
            {/* Computer rows */}
            <g stroke={furnitureStroke} strokeWidth="0.7" fill={furnitureFill}>
              <line x1="272" y1="350" x2="354" y2="350" stroke={furnitureStroke} strokeWidth="1" />
              <line x1="272" y1="363" x2="354" y2="363" stroke={furnitureStroke} strokeWidth="1" />
              <circle cx="280" cy="350" r="1.5" />
              <circle cx="295" cy="350" r="1.5" />
              <circle cx="310" cy="350" r="1.5" />
              <circle cx="325" cy="350" r="1.5" />
              <circle cx="340" cy="350" r="1.5" />
              <circle cx="280" cy="363" r="1.5" />
              <circle cx="295" cy="363" r="1.5" />
              <circle cx="310" cy="363" r="1.5" />
              <circle cx="325" cy="363" r="1.5" />
              <circle cx="340" cy="363" r="1.5" />
            </g>

            {/* Server & Faculty Office */}
            <rect x="363" y="326" width="61" height="47" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="393" y="342" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
              Faculty Cabins
            </text>
            <text x="393" y="353" fill={textSecondary} fontSize="7" textAnchor="middle">
              Rooms 205-208
            </text>

            {/* South-West Lecture Hall */}
            <rect x="266" y="397" width="95" height="47" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="313" y="414" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              Lecture Theatre A-201
            </text>
            {/* Student seat rows */}
            <path d="M 275 425 Q 313 430 351 425" fill="none" stroke={furnitureStroke} strokeWidth="1.2" />
            <path d="M 275 433 Q 313 438 351 433" fill="none" stroke={furnitureStroke} strokeWidth="1.2" />

            {/* Stairwell / Elevator */}
            <rect x="363" y="397" width="61" height="47" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <rect x="370" y="405" width="20" height="20" rx="2" fill="none" stroke={wallStroke} strokeWidth="1" />
            <line x1="370" y1="405" x2="390" y2="425" stroke={wallStroke} strokeWidth="0.8" />
            <line x1="390" y1="405" x2="370" y2="425" stroke={wallStroke} strokeWidth="0.8" />
            <text x="380" y="417" fill={textPrimary} fontSize="6" fontWeight="bold" textAnchor="middle">LIFT</text>
            <text x="393" y="437" fill={textSecondary} fontSize="6.5" textAnchor="middle">Stairs & WC</text>
          </g>
        )}

        {/* Floor 3: Project & Research Floor */}
        {selectedFloor >= 3 && (
          <g>
            <rect x="264" y="324" width="162" height="122" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
            <rect x="266" y="326" width="158" height="52" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="345" y="348" fill={textPrimary} fontSize="9" fontWeight="bold" textAnchor="middle">
              A-301 IoT & Embedded Systems Lab
            </text>
            <text x="345" y="360" fill={textSecondary} fontSize="7" textAnchor="middle">
              Arduino · Raspberry Pi · Drone Test Cage
            </text>

            <rect x="266" y="380" width="80" height="64" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="306" y="405" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
              A-302 Project Lab
            </text>

            <rect x="348" y="380" width="76" height="64" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="386" y="405" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
              Conference Hall
            </text>
          </g>
        )}
      </g>

      {/* ============================================================== */}
      {/* 2. ACADEMIC BLOCK B (MCA & CS Dept) [x: 500, y: 320, w: 180, h: 140] */}
      {/* ============================================================== */}
      <g id="plan_acad_b">
        {/* Floor 0 / Ground: HOD & Admissions Desk */}
        {selectedFloor === 0 && (
          <g>
            <rect x="504" y="324" width="172" height="132" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
            {/* Corridor */}
            <rect x="504" y="380" width="172" height="20" fill={isBlueprint ? 'rgba(2, 132, 199, 0.15)' : 'rgba(0,0,0,0.1)'} stroke={wallStroke} strokeWidth="1" strokeDasharray="3,2" />
            <text x="590" y="393" fill={textSecondary} fontSize="8" fontWeight="600" textAnchor="middle" letterSpacing="0.5">
              MCA CONCOURSE
            </text>

            {/* HOD Office & Conference Room (North-West) */}
            <rect x="506" y="326" width="82" height="52" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="547" y="344" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              B-001 HOD Office
            </text>
            <text x="547" y="354" fill={textSecondary} fontSize="7" textAnchor="middle">
              Dept. Head & PA Room
            </text>
            {/* Conference table */}
            <ellipse cx="547" cy="366" rx="16" ry="6" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />

            {/* Department Library & Digital Archives (North-East) */}
            <rect x="590" y="326" width="84" height="52" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="632" y="344" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              B-002 Dept. Library
            </text>
            <text x="632" y="354" fill={textSecondary} fontSize="7" textAnchor="middle">
              MCA Project Archives
            </text>
            {/* Book shelf rows */}
            <line x1="598" y1="363" x2="666" y2="363" stroke={furnitureStroke} strokeWidth="1.2" strokeDasharray="4,2" />
            <line x1="598" y1="371" x2="666" y2="371" stroke={furnitureStroke} strokeWidth="1.2" strokeDasharray="4,2" />

            {/* Server Room & Cloud Rack (South-West) */}
            <rect x="506" y="402" width="70" height="52" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="541" y="420" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
              Server Room
            </text>
            <text x="541" y="430" fill={textSecondary} fontSize="6.5" textAnchor="middle">
              High-Density Racks
            </text>
            {/* Racks */}
            <rect x="515" y="436" width="12" height="12" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />
            <rect x="532" y="436" width="12" height="12" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />
            <rect x="549" y="436" width="12" height="12" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />

            {/* Student Lounge & Seminar Hub (South-East) */}
            <rect x="578" y="402" width="96" height="52" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="626" y="420" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              Student Activity Hall
            </text>
            <text x="626" y="430" fill={textSecondary} fontSize="7" textAnchor="middle">
              Hackathon Pods & Lounge
            </text>
            {/* Door swing at entrance */}
            <path d="M 584 456 A 12 12 0 0 1 598 456" fill="none" stroke={doorColor} strokeWidth="1.5" />
          </g>
        )}

        {/* Floor 1 & 2: MCA Classroom B-204 & Lecture Theatres */}
        {(selectedFloor === 1 || selectedFloor === 2) && (
          <g>
            <rect x="504" y="324" width="172" height="132" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
            {/* Corridor */}
            <rect x="504" y="380" width="172" height="20" fill={isBlueprint ? 'rgba(2, 132, 199, 0.15)' : 'rgba(0,0,0,0.1)'} stroke={wallStroke} strokeWidth="1" strokeDasharray="3,2" />

            {/* Smart Classroom B-204 (Highlighted with distinctive border) */}
            <rect x="506" y="326" width="86" height="52" fill={wallFill} stroke={selectedFloor === 2 ? '#22c55e' : wallStroke} strokeWidth={selectedFloor === 2 ? 2 : 1.2} />
            <text x="549" y="342" fill={selectedFloor === 2 ? (isBlueprint ? '#4ade80' : '#15803d') : textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              {selectedFloor === 2 ? 'MCA B-204 (Smart)' : 'MCA B-101 (Lecture)'}
            </text>
            <text x="549" y="352" fill={textSecondary} fontSize="7" textAnchor="middle">
              Interactive SmartBoard
            </text>
            {/* Tiered desk rows */}
            <rect x="512" y="358" width="74" height="4" rx="1" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.7" />
            <rect x="512" y="366" width="74" height="4" rx="1" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.7" />
            {/* Teacher podium */}
            <rect x="543" y="373" width="12" height="4" rx="1" fill="#22c55e" opacity="0.8" />

            {/* B-205 AI & Data Science Lab (North-East) */}
            <rect x="594" y="326" width="80" height="52" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="634" y="342" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              {selectedFloor === 2 ? 'B-205 AI & ML Lab' : 'B-102 DBMS Lab'}
            </text>
            <text x="634" y="352" fill={textSecondary} fontSize="7" textAnchor="middle">
              NVIDIA GPU Pods
            </text>
            {/* Workstations */}
            <g stroke={furnitureStroke} strokeWidth="0.7" fill={furnitureFill}>
              <rect x="600" y="360" width="14" height="12" rx="1" />
              <rect x="620" y="360" width="14" height="12" rx="1" />
              <rect x="640" y="360" width="14" height="12" rx="1" />
              <rect x="660" y="360" width="10" height="12" rx="1" />
            </g>

            {/* South-West: Seminar Hall B-201 */}
            <rect x="506" y="402" width="86" height="52" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="549" y="419" fill={textPrimary} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              B-201 Seminar Hall
            </text>
            <text x="549" y="429" fill={textSecondary} fontSize="7" textAnchor="middle">
              Audio-Visual Stage
            </text>
            <ellipse cx="549" cy="442" rx="28" ry="7" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />

            {/* South-East: Restrooms & Lift Core */}
            <rect x="594" y="402" width="80" height="52" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <rect x="600" y="410" width="22" height="22" rx="2" fill="none" stroke={wallStroke} strokeWidth="1" />
            <line x1="600" y1="410" x2="622" y2="432" stroke={wallStroke} strokeWidth="0.8" />
            <line x1="622" y1="410" x2="600" y2="432" stroke={wallStroke} strokeWidth="0.8" />
            <text x="611" y="423" fill={textPrimary} fontSize="6.5" fontWeight="bold" textAnchor="middle">LIFT</text>
            <text x="646" y="422" fill={textSecondary} fontSize="7" fontWeight="bold" textAnchor="middle">WC Block</text>
            <text x="646" y="432" fill={textSecondary} fontSize="6" textAnchor="middle">Accessible</text>
          </g>
        )}

        {/* Floor 3: Postgraduate Research & Incubation */}
        {selectedFloor >= 3 && (
          <g>
            <rect x="504" y="324" width="172" height="132" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
            <rect x="506" y="326" width="168" height="60" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="590" y="352" fill={textPrimary} fontSize="9" fontWeight="bold" textAnchor="middle">
              B-301 Cloud & Cyber Security Center
            </text>
            <text x="590" y="364" fill={textSecondary} fontSize="7.5" textAnchor="middle">
              SOC Command Console & Penetration Testing Sandbox
            </text>

            <rect x="506" y="390" width="168" height="64" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
            <text x="590" y="418" fill={textPrimary} fontSize="9" fontWeight="bold" textAnchor="middle">
              B-302 Innovation & Startup Incubator
            </text>
            <text x="590" y="430" fill={textSecondary} fontSize="7" textAnchor="middle">
              Mentorship Rooms & VC Pitch Boardroom
            </text>
          </g>
        )}
      </g>

      {/* ============================================================== */}
      {/* 3. CENTRAL LIBRARY (LIB) [x: 390, y: 160, w: 150, h: 110] */}
      {/* ============================================================== */}
      <g id="plan_library">
        <rect x="394" y="164" width="142" height="102" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
        
        {/* Circulation Desk / Reception (Center Entrance) */}
        <path d="M 445 264 A 20 20 0 0 1 485 264" fill="none" stroke={doorColor} strokeWidth="1.5" />
        <rect x="440" y="240" width="50" height="16" rx="3" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="1" />
        <text x="465" y="251" fill={textPrimary} fontSize="7" fontWeight="bold" textAnchor="middle">
          CIRCULATION
        </text>

        {/* West Wing: Stacks (Book Shelves) */}
        <rect x="396" y="166" width="62" height="70" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="427" y="180" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Book Stacks
        </text>
        {/* Bookshelf racks */}
        <g stroke={furnitureStroke} strokeWidth="1" fill={furnitureFill}>
          <rect x="402" y="188" width="50" height="5" rx="1" />
          <rect x="402" y="198" width="50" height="5" rx="1" />
          <rect x="402" y="208" width="50" height="5" rx="1" />
          <rect x="402" y="218" width="50" height="5" rx="1" />
        </g>

        {/* East Wing: Quiet Reading Hall & Digital E-Library */}
        <rect x="462" y="166" width="72" height="70" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="498" y="180" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Silent Reading
        </text>
        {/* Reading tables with chairs */}
        <g stroke={furnitureStroke} strokeWidth="0.8" fill={furnitureFill}>
          <circle cx="480" cy="198" r="6" />
          <circle cx="516" cy="198" r="6" />
          <circle cx="480" cy="220" r="6" />
          <circle cx="516" cy="220" r="6" />
        </g>
      </g>

      {/* ============================================================== */}
      {/* 4. CANTEEN & STUDENT DINING [x: 720, y: 330, w: 130, h: 110] */}
      {/* ============================================================== */}
      <g id="plan_canteen">
        <rect x="724" y="334" width="122" height="102" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />

        {/* Kitchen & Food Prep Zone (East) */}
        <rect x="785" y="336" width="59" height="98" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="814" y="354" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          KITCHEN
        </text>
        <text x="814" y="364" fill={textSecondary} fontSize="6.5" textAnchor="middle">
          Food Counters
        </text>
        {/* Meal Serving counter line */}
        <line x1="785" y1="375" x2="785" y2="425" stroke="#ef4444" strokeWidth="2.5" />
        <text x="814" y="405" fill="#ef4444" fontSize="7" fontWeight="bold" textAnchor="middle">
          Serving Bar
        </text>

        {/* Dining Hall & Seating Tables (West) */}
        <rect x="726" y="336" width="56" height="98" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="754" y="352" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          DINING HALL
        </text>
        {/* 4-seater dining tables */}
        <g stroke={furnitureStroke} strokeWidth="0.8" fill={furnitureFill}>
          <circle cx="742" cy="370" r="5" />
          <circle cx="766" cy="370" r="5" />
          <circle cx="742" cy="392" r="5" />
          <circle cx="766" cy="392" r="5" />
          <circle cx="742" cy="414" r="5" />
          <circle cx="766" cy="414" r="5" />
        </g>
      </g>

      {/* ============================================================== */}
      {/* 5. GRAND AUDITORIUM [x: 720, y: 170, w: 140, h: 110] */}
      {/* ============================================================== */}
      <g id="plan_auditorium">
        <rect x="724" y="174" width="132" height="102" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />

        {/* Grand Stage (North) */}
        <rect x="734" y="178" width="112" height="28" rx="4" fill={furnitureFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="790" y="196" fill={textPrimary} fontSize="9" fontWeight="bold" textAnchor="middle">
          AUDITORIUM MAIN STAGE
        </text>
        {/* Stage edge podium */}
        <rect x="782" y="202" width="16" height="4" fill="#a855f7" />

        {/* Tiered Auditorium Seating Arcs */}
        <g stroke={furnitureStroke} strokeWidth="1.4" fill="none">
          <path d="M 740 220 Q 790 232 840 220" />
          <path d="M 736 230 Q 790 244 844 230" />
          <path d="M 732 240 Q 790 256 848 240" />
          <path d="M 730 250 Q 790 268 850 250" />
        </g>
        <text x="790" y="266" fill={textSecondary} fontSize="7" textAnchor="middle">
          Capacity: 1,200 Seats
        </text>
      </g>

      {/* ============================================================== */}
      {/* 6. ADMINISTRATIVE COMPLEX [x: 190, y: 170, w: 150, h: 100] */}
      {/* ============================================================== */}
      <g id="plan_admin">
        <rect x="194" y="174" width="142" height="92" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />

        {/* Admissions & Finance Counter */}
        <rect x="196" y="176" width="70" height="42" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="231" y="192" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Admissions & Fee
        </text>
        <line x1="202" y1="202" x2="260" y2="202" stroke={furnitureStroke} strokeWidth="1" strokeDasharray="3,2" />
        <text x="231" y="212" fill={textSecondary} fontSize="6.5" textAnchor="middle">
          Student Desks 1-4
        </text>

        {/* Registrar & Principal Chamber */}
        <rect x="268" y="176" width="66" height="42" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="301" y="192" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Registrar & Dean
        </text>
        <rect x="288" y="200" width="26" height="12" rx="2" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />

        {/* Main Boardroom with Executive Table */}
        <rect x="196" y="220" width="138" height="44" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="265" y="235" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          University Senate Boardroom
        </text>
        {/* Conference table */}
        <rect x="225" y="242" width="80" height="14" rx="7" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.8" />
        {/* Executive seats around table */}
        <circle cx="235" cy="239" r="1.5" fill={furnitureStroke} />
        <circle cx="250" cy="239" r="1.5" fill={furnitureStroke} />
        <circle cx="265" cy="239" r="1.5" fill={furnitureStroke} />
        <circle cx="280" cy="239" r="1.5" fill={furnitureStroke} />
        <circle cx="295" cy="239" r="1.5" fill={furnitureStroke} />
      </g>

      {/* ============================================================== */}
      {/* 7. MEDICAL & HEALTH CLINIC [x: 80, y: 340, w: 130, h: 90] */}
      {/* ============================================================== */}
      <g id="plan_medical">
        <rect x="84" y="344" width="122" height="82" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />

        {/* Reception & Triage */}
        <rect x="86" y="346" width="55" height="40" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="113" y="362" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Clinic Triage
        </text>
        <text x="113" y="372" fill={textSecondary} fontSize="6.5" textAnchor="middle">
          Nurse Station
        </text>

        {/* Doctor Consultation Room */}
        <rect x="143" y="346" width="61" height="40" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="173" y="362" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Consultation
        </text>
        <rect x="160" y="370" width="26" height="10" rx="1.5" fill={furnitureFill} stroke={furnitureStroke} strokeWidth="0.7" />

        {/* Ward with 3 Hospital Recovery Beds */}
        <rect x="86" y="388" width="118" height="36" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
        <text x="145" y="401" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Day Care Observation Beds
        </text>
        {/* Beds */}
        <g stroke={furnitureStroke} strokeWidth="0.8" fill={furnitureFill}>
          <rect x="100" y="407" width="18" height="12" rx="1.5" />
          <rect x="135" y="407" width="18" height="12" rx="1.5" />
          <rect x="170" y="407" width="18" height="12" rx="1.5" />
        </g>
      </g>

      {/* ============================================================== */}
      {/* 8. BOYS HOSTEL [x: 100, y: 520, w: 150, h: 110] */}
      {/* ============================================================== */}
      <g id="plan_boys_hostel">
        <rect x="104" y="524" width="142" height="102" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
        <rect x="106" y="526" width="138" height="24" fill={wallFill} stroke={wallStroke} strokeWidth="1" />
        <text x="175" y="542" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Warden Office & Common Room
        </text>
        {/* Dorm Rooms grid */}
        <g stroke={wallStroke} strokeWidth="1" fill={wallFill}>
          <rect x="106" y="552" width="32" height="34" />
          <rect x="141" y="552" width="32" height="34" />
          <rect x="176" y="552" width="32" height="34" />
          <rect x="211" y="552" width="33" height="34" />

          <rect x="106" y="589" width="32" height="35" />
          <rect x="141" y="589" width="32" height="35" />
          <rect x="176" y="589" width="32" height="35" />
          <rect x="211" y="589" width="33" height="35" />
        </g>
        <text x="122" y="572" fill={textSecondary} fontSize="6" textAnchor="middle">Dorm 1</text>
        <text x="157" y="572" fill={textSecondary} fontSize="6" textAnchor="middle">Dorm 2</text>
        <text x="192" y="572" fill={textSecondary} fontSize="6" textAnchor="middle">Dorm 3</text>
        <text x="227" y="572" fill={textSecondary} fontSize="6" textAnchor="middle">Dorm 4</text>
      </g>

      {/* ============================================================== */}
      {/* 9. GIRLS HOSTEL [x: 740, y: 510, w: 140, h: 110] */}
      {/* ============================================================== */}
      <g id="plan_girls_hostel">
        <rect x="744" y="514" width="132" height="102" rx="8" fill={roomBg} stroke={wallStroke} strokeWidth="1.5" />
        <rect x="746" y="516" width="128" height="24" fill={wallFill} stroke={wallStroke} strokeWidth="1" />
        <text x="810" y="532" fill={textPrimary} fontSize="8" fontWeight="bold" textAnchor="middle">
          Girls Residence Hub & Security
        </text>
        <g stroke={wallStroke} strokeWidth="1" fill={wallFill}>
          <rect x="746" y="542" width="30" height="34" />
          <rect x="778" y="542" width="30" height="34" />
          <rect x="810" y="542" width="30" height="34" />
          <rect x="842" y="542" width="32" height="34" />

          <rect x="746" y="579" width="30" height="35" />
          <rect x="778" y="579" width="30" height="35" />
          <rect x="810" y="579" width="30" height="35" />
          <rect x="842" y="579" width="32" height="35" />
        </g>
        <text x="761" y="562" fill={textSecondary} fontSize="6" textAnchor="middle">Suite 1</text>
        <text x="793" y="562" fill={textSecondary} fontSize="6" textAnchor="middle">Suite 2</text>
        <text x="825" y="562" fill={textSecondary} fontSize="6" textAnchor="middle">Suite 3</text>
        <text x="858" y="562" fill={textSecondary} fontSize="6" textAnchor="middle">Suite 4</text>
      </g>
    </g>
  );
};
