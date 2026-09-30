import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  FlaskConical, 
  Utensils, 
  BookOpen, 
  HeartPulse, 
  Car, 
  Sparkles, 
  Trophy, 
  Building2, 
  Home, 
  Droplets, 
  MapPin, 
  Navigation, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Layers, 
  Compass, 
  Check,
  Info
} from 'lucide-react';
import { CampusLocation, LocationCategory, NavigationRoute } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';

export interface LegendItem {
  id: string;
  category: LocationCategory | string;
  label: string;
  sublabel: string;
  color: string;
  group: 'academic' | 'amenity' | 'nav';
  icon: React.ComponentType<{ className?: string }>;
  accentBg: string;
}

export const CAMPUS_MARKER_CATEGORIES: LegendItem[] = [
  // Academic Spaces
  {
    id: 'classroom',
    category: 'Classroom',
    label: 'Classrooms',
    sublabel: 'MCA lecture theatre, smart classrooms & seminar rooms',
    color: '#1a73e8', // Google Blue
    accentBg: '#e8f0fe',
    group: 'academic',
    icon: GraduationCap,
  },
  {
    id: 'lab',
    category: 'Laboratory',
    label: 'Labs & Research',
    sublabel: 'Computer Lab 1 & 2, coding workstations & networks',
    color: '#0d652d', // Forest Emerald
    accentBg: '#e6f4ea',
    group: 'academic',
    icon: FlaskConical,
  },
  // Amenities
  {
    id: 'canteen',
    category: 'Canteen',
    label: 'Canteen & Dining',
    sublabel: 'Food court, breakfast, meal counters & snack hub',
    color: '#d93025', // Coral Red
    accentBg: '#fce8e6',
    group: 'amenity',
    icon: Utensils,
  },
  {
    id: 'library',
    category: 'Library',
    label: 'Library & Reading',
    sublabel: 'Central library, quiet study pods & digital journals',
    color: '#e37400', // Amber/Orange
    accentBg: '#fef7e0',
    group: 'amenity',
    icon: BookOpen,
  },
  {
    id: 'washroom',
    category: 'Washroom',
    label: 'Washrooms & Restrooms',
    sublabel: 'Wheelchair-accessible restrooms (Block B & Food Court)',
    color: '#0284c7', // Sky Cyan
    accentBg: '#e0f2fe',
    group: 'amenity',
    icon: Droplets,
  },
  {
    id: 'medical',
    category: 'Medical',
    label: 'Medical & Clinic',
    sublabel: 'Health dispensary, 24/7 doctor & first aid station',
    color: '#d01884', // Magenta Pink
    accentBg: '#fce8f3',
    group: 'amenity',
    icon: HeartPulse,
  },
  {
    id: 'auditorium',
    category: 'Auditorium',
    label: 'Auditorium & Events',
    sublabel: '1,200-seat grand auditorium & cultural convention hall',
    color: '#8430ce', // Purple
    accentBg: '#f3e8fd',
    group: 'amenity',
    icon: Sparkles,
  },
  {
    id: 'sports',
    category: 'Playground',
    label: 'Sports & Grounds',
    sublabel: '400m synthetic running track, cricket & football field',
    color: '#1e8e3e', // Grass Green
    accentBg: '#e6f4ea',
    group: 'amenity',
    icon: Trophy,
  },
  {
    id: 'parking',
    category: 'Parking',
    label: 'Parking Plaza',
    sublabel: 'Visitor, staff two/four-wheeler & EV charging bays',
    color: '#5f6368', // Slate Gray
    accentBg: '#f1f3f4',
    group: 'amenity',
    icon: Car,
  },
  {
    id: 'admin',
    category: 'Administrative',
    label: 'Admin & Registrar',
    sublabel: 'Student admissions, fees, ID cards & records desk',
    color: '#185abc', // Navy
    accentBg: '#e8f0fe',
    group: 'amenity',
    icon: Building2,
  },
  {
    id: 'hostel',
    category: 'Hostel',
    label: 'Student Hostels',
    sublabel: 'Boys and Girls residential blocks with 24/7 security',
    color: '#7c3aed', // Deep Violet
    accentBg: '#ede9fe',
    group: 'amenity',
    icon: Home,
  },
];

export function getCategoryPinColor(cat: string): string {
  switch (cat) {
    case 'Classroom': return '#1a73e8';
    case 'Laboratory': return '#0d652d';
    case 'Library': return '#e37400';
    case 'Canteen': return '#d93025';
    case 'Medical': return '#d01884';
    case 'Washroom': return '#0284c7';
    case 'Parking': return '#5f6368';
    case 'Administrative': return '#185abc';
    case 'Auditorium': return '#8430ce';
    case 'Playground': return '#1e8e3e';
    case 'Hostel': return '#7c3aed';
    case 'Department': return '#2563eb';
    case 'Gate': return '#202124';
    default: return '#1a73e8';
  }
}

interface MapLegendProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  locations?: CampusLocation[];
  activeRoute?: NavigationRoute | null;
  className?: string;
  theme?: 'satellite' | 'blueprint' | 'standard';
}

export const MapLegend: React.FC<MapLegendProps> = ({
  selectedCategory,
  onSelectCategory,
  locations = [],
  activeRoute,
  className = '',
  theme = 'satellite',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'academic' | 'amenity' | 'nav'>('all');

  const isDark = theme === 'satellite' || theme === 'blueprint';

  // Count locations dynamically per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    locations.forEach(loc => {
      counts[loc.category] = (counts[loc.category] || 0) + 1;
    });
    return counts;
  }, [locations]);

  // Filtered legend items based on activeTab
  const visibleItems = useMemo(() => {
    if (activeTab === 'all') return CAMPUS_MARKER_CATEGORIES;
    return CAMPUS_MARKER_CATEGORIES.filter(item => item.group === activeTab);
  }, [activeTab]);

  // Handle marker category toggle
  const handleItemClick = (category: string) => {
    if (selectedCategory.toLowerCase() === category.toLowerCase()) {
      onSelectCategory('All');
    } else {
      onSelectCategory(category);
    }
  };

  return (
    <div className={`transition-all duration-200 ${className}`}>
      {!isOpen ? (
        // COLLAPSED FLOATING PILL
        <button
          onClick={() => setIsOpen(true)}
          className={`group flex items-center gap-2 px-3.5 py-2 backdrop-blur-md rounded-full border shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-lg transition-all text-xs font-medium cursor-pointer ${
            isDark
              ? 'bg-[#0f172a]/90 hover:bg-[#1e293b]/95 border-[#334155] text-white'
              : 'bg-white/95 hover:bg-white border-[#dadce0] text-[#202124]'
          }`}
          title="Open Map Legend"
          aria-label="Open Map Marker Legend"
        >
          <div className="flex items-center -space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] border border-white ring-1 ring-white/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d652d] border border-white ring-1 ring-white/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#d93025] border border-white ring-1 ring-white/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] border border-white ring-1 ring-white/50" />
          </div>

          <span className={`font-semibold transition-colors ${
            isDark ? 'text-slate-100 group-hover:text-sky-400' : 'text-[#3c4043] group-hover:text-[#1a73e8]'
          }`}>
            Map Legend
          </span>

          {selectedCategory !== 'All' && (
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
              isDark ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-[#e8f0fe] text-[#1a73e8]'
            }`}>
              {selectedCategory}
            </span>
          )}

          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isDark ? 'text-slate-400' : 'text-[#5f6368]'}`} />
        </button>
      ) : (
        // EXPANDED FLOATING LEGEND CARD
        <div className={`w-[310px] sm:w-[340px] backdrop-blur-md rounded-2xl border shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden text-xs transition-colors ${
          isDark
            ? 'bg-[#0f172a]/92 border-[#334155] text-slate-200'
            : 'bg-white/95 border-[#dadce0] text-[#202124]'
        }`}>
          
          {/* Card Header */}
          <div className={`px-3.5 py-2.5 border-b flex items-center justify-between ${
            isDark 
              ? 'border-[#1e293b] bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a]' 
              : 'border-[#f1f3f4] bg-gradient-to-r from-white via-white to-[#f8f9fa]'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-[#e8f0fe] text-[#1a73e8]'
              }`}>
                <MapPin className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <h4 className={`font-bold text-[13px] leading-tight ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                  Map Marker Legend
                </h4>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                  Color-coded pins for campus locations
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-full transition-colors cursor-pointer ${
                isDark 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
              title="Collapse Legend"
              aria-label="Collapse Legend"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Tab Chips */}
          <div className={`px-3 pt-2 pb-1.5 flex items-center gap-1 border-b overflow-x-auto scrollbar-none ${
            isDark ? 'border-[#1e293b] bg-slate-900/60' : 'border-[#f1f3f4] bg-[#fafafa]/80'
          }`}>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'all'
                  ? isDark 
                    ? 'bg-sky-500 text-white font-semibold shadow-xs' 
                    : 'bg-[#202124] text-white shadow-xs font-semibold'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'academic'
                  ? 'bg-[#1a73e8] text-white shadow-xs font-semibold'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Academic</span>
            </button>
            <button
              onClick={() => setActiveTab('amenity')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'amenity'
                  ? 'bg-[#d93025] text-white shadow-xs font-semibold'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              <Utensils className="w-3 h-3" />
              <span>Amenities</span>
            </button>
            <button
              onClick={() => setActiveTab('nav')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'nav'
                  ? 'bg-[#185abc] text-white shadow-xs font-semibold'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>Route</span>
            </button>
          </div>

          {/* Legend Items List */}
          <div className={`max-h-[240px] overflow-y-auto px-2 py-1.5 space-y-1 divide-y scrollbar-thin ${
            isDark ? 'divide-slate-800' : 'divide-[#f8f9fa]'
          }`}>
            {activeTab !== 'nav' ? (
              visibleItems.map(item => {
                const isSelected = selectedCategory.toLowerCase() === item.category.toLowerCase();
                const count = categoryCounts[item.category] || 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.category)}
                    className={`group pt-1 first:pt-0 flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? isDark 
                          ? 'bg-sky-950/60 border border-sky-500/50 shadow-xs' 
                          : 'bg-[#e8f0fe] border border-[#1a73e8]/30 shadow-xs'
                        : isDark 
                          ? 'hover:bg-slate-800/60 border border-transparent' 
                          : 'hover:bg-[#f8f9fa] border border-transparent'
                    }`}
                    role="button"
                    tabIndex={0}
                    title={`Click to filter: ${item.label}`}
                  >
                    {/* SVG Replica Pin of the actual map marker */}
                    <div className="flex-shrink-0 pt-0.5 flex flex-col items-center">
                      <svg width="18" height="24" viewBox="-12 -34 24 34" className="drop-shadow-xs group-hover:scale-110 transition-transform">
                        <path
                          d="M 0 0 C -9 -14 -12 -22 0 -34 C 12 -22 9 -14 0 0 Z"
                          fill={item.color}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <circle cx="0" cy="-21" r="5" fill="#ffffff" />
                      </svg>
                    </div>

                    {/* Content details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold text-[12px] truncate ${
                            isSelected 
                              ? isDark ? 'text-sky-300 font-bold' : 'text-[#1a73e8]' 
                              : isDark ? 'text-slate-100' : 'text-[#202124]'
                          }`}>
                            {item.label}
                          </span>
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>

                        {count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium flex-shrink-0 ${
                            isSelected
                              ? 'bg-[#1a73e8] text-white'
                              : isDark 
                                ? 'bg-slate-800 text-slate-300' 
                                : 'bg-[#f1f3f4] text-[#5f6368]'
                          }`}>
                            {count} {count === 1 ? 'place' : 'places'}
                          </span>
                        )}
                      </div>

                      <p className={`text-[10.5px] line-clamp-1 mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-[#5f6368]'
                      }`}>
                        {item.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              // Navigation & Wayfinding Indicators Tab
              <div className="py-1 space-y-2">
                {/* Current Location Sign */}
                <div className={`flex items-start gap-2.5 p-2 rounded-xl border ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-[#f8f9fa] border-[#e8eaed]'
                }`}>
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="w-5 h-5 rounded-full bg-[#1a73e8] border-2 border-white shadow-xs flex items-center justify-center ring-2 ring-[#1a73e8]/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    </div>
                  </div>
                  <div>
                    <div className={`font-semibold text-[12px] ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                      Your Location (Origin)
                    </div>
                    <p className={`text-[10.5px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                      Campus Main Gate pedestrian & vehicle entrance point
                    </p>
                  </div>
                </div>

                {/* Destination Target Sign */}
                <div className={`flex items-start gap-2.5 p-2 rounded-xl border ${
                  isDark ? 'bg-red-950/40 border-red-800/50' : 'bg-[#fce8e6]/60 border-[#fad2cf]'
                }`}>
                  <div className="flex-shrink-0 pt-0.5">
                    <svg width="18" height="24" viewBox="-12 -34 24 34" className="drop-shadow-xs">
                      <path
                        d="M 0 0 C -9 -14 -12 -22 0 -34 C 12 -22 9 -14 0 0 Z"
                        fill="#ea4335"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <circle cx="0" cy="-21" r="5" fill="#ffffff" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#f87171] text-[12px]">
                      Destination Pin
                    </div>
                    <p className={`text-[10.5px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                      Selected classroom, laboratory, or amenity endpoint
                    </p>
                  </div>
                </div>

                {/* Walking Route Path */}
                <div className={`flex items-start gap-2.5 p-2 rounded-xl border ${
                  isDark ? 'bg-sky-950/40 border-sky-800/50' : 'bg-[#e8f0fe]/60 border-[#d2e3fc]'
                }`}>
                  <div className="flex-shrink-0 pt-1.5 flex items-center justify-center w-5">
                    <div className="w-5 h-1.5 bg-[#38bdf8] rounded-full border-t border-b border-dashed border-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#38bdf8] text-[12px]">
                      Optimal Walking Route
                    </div>
                    <p className={`text-[10.5px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                      Shortest accessible Dijkstra path with animated direction flow
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer action bar */}
          <div className={`px-3 py-2 border-t flex items-center justify-between text-[11px] ${
            isDark ? 'bg-slate-900 border-[#1e293b]' : 'bg-[#f8f9fa] border-[#f1f3f4]'
          }`}>
            {selectedCategory !== 'All' ? (
              <div className="flex items-center justify-between w-full">
                <span className={`font-medium flex items-center gap-1 ${
                  isDark ? 'text-sky-400' : 'text-[#1a73e8]'
                }`}>
                  <Check className="w-3 h-3" />
                  Filtered: {selectedCategory}
                </span>
                <button
                  onClick={() => onSelectCategory('All')}
                  className={`underline cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-[#5f6368] hover:text-[#202124]'
                  }`}
                >
                  Show all markers
                </button>
              </div>
            ) : (
              <div className={`flex items-center justify-between w-full ${isDark ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                <span>Tap any marker to filter map</span>
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-[#80868b]'}`}>Interactive</span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
