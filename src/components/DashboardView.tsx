import React, { useState } from 'react';
import { 
  Compass, 
  Bot, 
  Search, 
  MapPin, 
  Navigation, 
  Clock, 
  Bookmark, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Utensils, 
  FlaskConical, 
  GraduationCap,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, CampusLocation } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';

interface DashboardViewProps {
  user: UserProfile;
  locations: CampusLocation[];
  onOpenMap: () => void;
  onOpenAssistant: () => void;
  onSelectLocation: (loc: CampusLocation) => void;
  onStartNavigation: (loc: CampusLocation) => void;
  onOpenAppointmentBooking?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  locations,
  onOpenMap,
  onOpenAssistant,
  onSelectLocation,
  onStartNavigation,
  onOpenAppointmentBooking,
}) => {
  const { t, language, locName, floorLabel } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  let greeting = t.goodMorning;
  if (currentHour >= 12 && currentHour < 17) greeting = t.goodAfternoon;
  else if (currentHour >= 17) greeting = t.goodEvening;

  // Recent Locations from brief
  const recentLocationIds = ['loc_mca_class', 'loc_comp_lab_2', 'loc_central_library'];
  const recentLocations = locations.filter(l => recentLocationIds.includes(l.id));

  // Nearby Locations with calculated distances
  const nearbyPlaces = [
    { id: 'loc_central_library', name: 'Central Library', category: 'Library', distance: 120, icon: BookOpen, color: 'text-[#f9ab00] bg-[#fef7e0]' },
    { id: 'loc_canteen', name: 'Campus Canteen', category: 'Canteen', distance: 250, icon: Utensils, color: 'text-[#d93025] bg-[#fce8e6]' },
    { id: 'loc_comp_lab_2', name: 'Computer Lab 2', category: 'Laboratory', distance: 320, icon: FlaskConical, color: 'text-[#1e8e3e] bg-[#e6f4ea]' },
  ];

  // Today's classes for student
  const todayClasses = [
    {
      time: '10:00 AM – 11:30 AM',
      course: 'MCA-201: Advanced Database Management Systems',
      room: 'Room B-204',
      building: 'Academic Block B',
      locationId: 'loc_mca_class',
      status: 'Next Class',
    },
    {
      time: '02:00 PM – 04:00 PM',
      course: 'MCA-205: Cloud Computing & Systems Lab',
      room: 'Room A-210',
      building: 'Academic Block A',
      locationId: 'loc_comp_lab_2',
      status: 'Upcoming',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#dadce0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-2xl font-bold text-[#202124] font-['Google_Sans',sans-serif]">
              {greeting}, {user.name}
            </h1>
          </div>
          <p className="text-xs text-[#5f6368] mt-1">
            Logged in as <span className="font-semibold text-[#1a73e8]">{user.role}</span> · {user.department || 'Campus Visitor'} · Main Campus Zone
          </p>
        </div>

        {/* Quick Search in Dashboard */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campus locations..."
            className="w-full pl-9 pr-3 py-2 text-xs text-[#202124] placeholder-[#80868b] bg-[#f1f3f4] focus:bg-white rounded-full border border-transparent focus:border-[#1a73e8] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Big Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Campus Map Explore Card */}
        <div 
          onClick={onOpenMap}
          className="p-6 rounded-2xl bg-white border border-[#dadce0] hover:border-[#1a73e8] shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center transition-transform group-hover:scale-105">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-[#202124] font-['Google_Sans',sans-serif]">
                  {t.navMap}
                </span>
                <span className="text-xs">🗺️</span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                {language === 'hi' ? 'इंटरैक्टिव मैप, भवन, मंजिलें और पैदल नेविगेशन' : 'Interactive map, buildings, floors & walking navigation'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#5f6368] group-hover:text-[#1a73e8] group-hover:translate-x-1 transition-all" />
        </div>

        {/* AI Search Card */}
        <div 
          onClick={onOpenAssistant}
          className="p-6 rounded-2xl bg-white border border-[#dadce0] hover:border-[#1e8e3e] shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center transition-transform group-hover:scale-105">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-[#202124] font-['Google_Sans',sans-serif]">
                  {t.navAssistant}
                </span>
                <span className="text-xs">🤖</span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                {language === 'hi' ? 'एआई सहायक से पूछें: "एमसीए क्लासरूम कहाँ है?"' : 'Ask AI Assistant: "Where is MCA classroom?"'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#5f6368] group-hover:text-[#1e8e3e] group-hover:translate-x-1 transition-all" />
        </div>

        {/* Book Visit Card (Supabase Backend) */}
        {onOpenAppointmentBooking && (
          <div 
            onClick={onOpenAppointmentBooking}
            className="p-6 rounded-2xl bg-white border border-[#dadce0] hover:border-[#f9ab00] shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#fef7e0] text-[#b06000] flex items-center justify-center transition-transform group-hover:scale-105">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-[#202124] font-['Google_Sans',sans-serif]">
                    Book Visit
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-bold">
                    Supabase
                  </span>
                </div>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Schedule admission, faculty, or principal appointment
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#5f6368] group-hover:text-[#b06000] group-hover:translate-x-1 transition-all" />
          </div>
        )}

      </div>

      {/* Today's Schedule Card */}
      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1a73e8]" />
            <h2 className="text-base font-bold text-[#202124] font-['Google_Sans',sans-serif]">
              Today's Academic Schedule & Navigation
            </h2>
          </div>
          <span className="text-xs text-[#5f6368]">
            Semester 3 · Section A
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {todayClasses.map((item, idx) => {
            const loc = locations.find(l => l.id === item.locationId);
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa] flex flex-col justify-between gap-3 hover:border-[#dadce0] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1a73e8]">
                      {item.time}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1967d2]">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#202124] mt-1">
                    {item.course}
                  </h3>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    {item.building} · {item.room}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#e8eaed]">
                  {loc && (
                    <button
                      onClick={() => onStartNavigation(loc)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#1a73e8] hover:bg-[#155724] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate to Room</span>
                    </button>
                  )}
                  {loc && (
                    <button
                      onClick={() => onSelectLocation(loc)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#dadce0] hover:bg-[#f1f3f4] text-xs font-medium text-[#3c4043] transition-colors"
                    >
                      View on Map
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Recent Locations & Nearby Places */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Locations (as specified in brief) */}
        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#202124] font-['Google_Sans',sans-serif]">
              Recent Locations
            </h2>
            <Clock className="w-4 h-4 text-[#5f6368]" />
          </div>

          <div className="space-y-2">
            {recentLocations.map(loc => (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className="p-3 rounded-xl border border-[#e8eaed] hover:border-[#1a73e8] hover:bg-[#f8f9fa] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">
                      {loc.name}
                    </p>
                    <p className="text-[11px] text-[#5f6368]">
                      {loc.building} · Floor {loc.floor === 0 ? 'Ground' : loc.floor} {loc.room ? `(${loc.room})` : ''}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartNavigation(loc);
                  }}
                  className="p-2 rounded-full text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
                  title="Navigate here"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Places (with meter distances as specified in brief) */}
        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#202124] font-['Google_Sans',sans-serif]">
              Nearby Places
            </h2>
            <span className="text-xs text-[#5f6368]">From Main Gate</span>
          </div>

          <div className="space-y-2">
            {nearbyPlaces.map(item => {
              const loc = locations.find(l => l.id === item.id);
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => loc && onSelectLocation(loc)}
                  className="p-3 rounded-xl border border-[#e8eaed] hover:border-[#1a73e8] hover:bg-[#f8f9fa] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#5f6368]">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-[#5f6368] bg-[#f1f3f4] px-2 py-0.5 rounded">
                      {item.distance} m
                    </span>
                    {loc && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartNavigation(loc);
                        }}
                        className="p-1.5 rounded-full text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
                        title="Start route"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
