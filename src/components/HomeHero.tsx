import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Bot, 
  GraduationCap, 
  FlaskConical, 
  BookOpen, 
  Utensils, 
  Home, 
  Car, 
  HeartPulse, 
  DoorOpen, 
  Sparkles, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Mic,
  Eye,
  Sliders,
  Maximize2,
  X,
  Calendar
} from 'lucide-react';
import { CampusLocation } from '../types/campus';
import { NiisCampusHeroVisual } from './NiisCampusHeroVisual';
import campusHeroImg from '../assets/images/college_campus_front_1790579806192.jpg';
import { useLanguage } from '../context/LanguageContext';

interface HomeHeroProps {
  onSearchSelect: (location: CampusLocation) => void;
  onExploreMap: () => void;
  onOpenAssistant: () => void;
  onCategorySelect: (category: string) => void;
  locations: CampusLocation[];
  onOpenDemo: () => void;
  onOpenAppointmentBooking?: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSearchSelect,
  onExploreMap,
  onOpenAssistant,
  onCategorySelect,
  locations,
  onOpenDemo,
  onOpenAppointmentBooking,
}) => {
  const { t, language, locName, floorLabel } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [blurIntensity, setBlurIntensity] = useState<'soft' | 'medium' | 'heavy' | 'clear'>('soft');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter suggestions
  const suggestions = searchTerm.trim()
    ? locations.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickAccessCategories = [
    { label: t.catDepartment, category: 'Department', icon: GraduationCap, color: 'text-[#1a73e8] bg-[#e8f0fe]' },
    { label: t.catLaboratory, category: 'Laboratory', icon: FlaskConical, color: 'text-[#1e8e3e] bg-[#e6f4ea]' },
    { label: t.catLibrary, category: 'Library', icon: BookOpen, color: 'text-[#f9ab00] bg-[#fef7e0]' },
    { label: t.catCanteen, category: 'Canteen', icon: Utensils, color: 'text-[#d93025] bg-[#fce8e6]' },
    { label: t.catHostel, category: 'Hostel', icon: Home, color: 'text-[#9334e6] bg-[#f3e8fd]' },
    { label: t.catParking, category: 'Parking', icon: Car, color: 'text-[#5f6368] bg-[#f1f3f4]' },
    { label: t.catMedical, category: 'Medical', icon: HeartPulse, color: 'text-[#e52592] bg-[#fde7f3]' },
    { label: t.catGate, category: 'Gate', icon: DoorOpen, color: 'text-[#202124] bg-[#e8eaed]' },
  ];

  // Helper for blur classes
  const getBlurClass = () => {
    switch (blurIntensity) {
      case 'clear': return 'filter blur-0 scale-100 opacity-80';
      case 'soft': return 'filter blur-md scale-105 opacity-65';
      case 'medium': return 'filter blur-xl scale-110 opacity-55';
      case 'heavy': return 'filter blur-2xl scale-125 opacity-40';
      default: return 'filter blur-md scale-105 opacity-60';
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Header Section with Blurred Campus Image in Front */}
      <section className="relative w-full pt-8 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto flex flex-col items-center overflow-hidden rounded-3xl mt-2 border border-[#dadce0] shadow-sm">
        
        {/* NIIS Group of Institutions Campus Front Elevation Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <NiisCampusHeroVisual blurClass={getBlurClass()} />
          {/* Subtle Google Gradient Vignette for perfect text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/80 to-white/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-white/60" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl">
          
          {/* Subtle Campus Identification & Announcement Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <div 
              onClick={onOpenDemo}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0fe]/90 backdrop-blur-sm border border-[#d2e3fc] text-[#1967d2] text-xs font-semibold cursor-pointer hover:bg-[#d2e3fc] transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Hackathon Demo: 6-Step Campus Navigation</span>
              <ArrowRight className="w-3 h-3" />
            </div>

            {/* Book Campus Visit Pill (Supabase Backend) */}
            {onOpenAppointmentBooking && (
              <div 
                onClick={onOpenAppointmentBooking}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f4ea]/90 backdrop-blur-sm border border-[#ceead6] text-[#137333] text-xs font-semibold cursor-pointer hover:bg-[#ceead6] transition-colors shadow-xs"
                title="Book an appointment or campus visit (Synced to Supabase)"
              >
                <Calendar className="w-3.5 h-3.5 text-[#1e8e3e]" />
                <span>Book Campus Visit</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-[#137333] font-bold border border-[#ceead6]">
                  Supabase
                </span>
              </div>
            )}

            {/* College Campus Badge - NIIS Group of Institutions */}
            <div 
              onClick={() => setShowPhotoModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#dadce0] text-[#3c4043] text-xs font-semibold shadow-xs hover:border-[#1a73e8] hover:text-[#1a73e8] transition-colors cursor-pointer group"
              title="Click to view full NIIS Campus photograph"
            >
              <span className="w-2 h-2 rounded-full bg-[#1e8e3e] animate-pulse"></span>
              <span>NIIS Group of Institutions</span>
              <Maximize2 className="w-3 h-3 text-[#5f6368] group-hover:text-[#1a73e8] ml-0.5" />
            </div>

            {/* Blur Style Controller Pill */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#dadce0] text-xs text-[#5f6368] shadow-xs">
              <Sliders className="w-3 h-3 text-[#1a73e8]" />
              <span className="text-[11px] font-medium mr-1">Photo Blur:</span>
              {(['clear', 'soft', 'medium', 'heavy'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setBlurIntensity(mode)}
                  className={`px-1.5 py-0.5 text-[10px] rounded-md font-semibold transition-all capitalize ${
                    blurIntensity === mode
                      ? 'bg-[#1a73e8] text-white'
                      : 'hover:bg-[#f1f3f4] text-[#5f6368]'
                  }`}
                  title={`Switch campus image to ${mode} blur`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Title with Google Style Typography */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#202124] tracking-tight font-['Google_Sans',sans-serif] leading-tight drop-shadow-xs">
            {language === 'hi' ? 'एआई-संचालित स्मार्ट कैंपस नेविगेशन' : 'AI-POWERED SMART CAMPUS NAVIGATION'}
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 text-base sm:text-lg text-[#3c4043] font-normal leading-relaxed max-w-2xl bg-white/40 backdrop-blur-xs py-1 px-3 rounded-full">
            {t.heroSubtitle}
          </p>

          {/* Prominent Google Search Bar */}
          <div ref={searchRef} className="relative w-full max-w-2xl mt-7">
            <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-full border border-[#dadce0] shadow-[0_4px_14px_rgba(60,64,67,0.14)] hover:shadow-[0_6px_20px_rgba(60,64,67,0.2)] transition-all px-4 py-3 group focus-within:border-[#1a73e8] focus-within:ring-2 focus-within:ring-[#e8f0fe]">
              <Search className="w-5 h-5 text-[#5f6368] group-focus-within:text-[#1a73e8] shrink-0 mr-3" />
              
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={language === 'hi' ? 'आप कहां जाना चाहते हैं? (उदा. एमसीए कक्षा, कंप्यूटर लैब २...)' : 'Where do you want to go? (e.g. MCA Classroom, Computer Lab 2...)'}
                className="w-full text-sm sm:text-base text-[#202124] placeholder-[#5f6368] bg-transparent focus:outline-none"
              />

              <button
                onClick={onOpenAssistant}
                className="p-1.5 rounded-full text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f1f3f4] transition-colors shrink-0 ml-1 cursor-pointer"
                title={t.askAiAssistant}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#dadce0] shadow-[0_8px_24px_rgba(60,64,67,0.16)] overflow-hidden z-30 text-left animate-in fade-in">
                <div className="px-4 py-2 bg-[#f8f9fa] border-b border-[#f1f3f4] text-[11px] font-semibold text-[#5f6368] uppercase">
                  {language === 'hi' ? 'मिलते-जुलते कैंपस स्थल' : 'Matching Campus Locations'}
                </div>
                {suggestions.map(loc => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      onSearchSelect(loc);
                      setShowSuggestions(false);
                      setSearchTerm('');
                    }}
                    className="px-4 py-3 hover:bg-[#f8f9fa] cursor-pointer flex items-center justify-between border-b border-[#f1f3f4] last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#202124]">{locName(loc)}</p>
                        <p className="text-xs text-[#5f6368]">
                          {loc.building} · {floorLabel(loc.floor)} {loc.room ? `(${loc.room})` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#1a73e8] flex items-center gap-1">
                      {language === 'hi' ? 'मार्ग' : 'Route'} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => {
                const lib = locations.find(l => l.id === 'loc_central_library') || locations[0];
                onSearchSelect(lib);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer ring-2 ring-sky-300/30"
              title="Demonstrate Shortest Distance Navigation: Main Block to Library"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
              <span>⚡ Shortest Route Demo (320m)</span>
            </button>

            <button
              onClick={onExploreMap}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#155724] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{t.exploreCampusMap}</span>
            </button>

            <button
              onClick={() => {
                const mca = locations.find(l => l.id === 'loc_mca_class') || locations[0];
                onSearchSelect(mca);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#f8f9fa] text-[#3c4043] border border-[#dadce0] text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#ea4335]" />
              <span>{t.navigateHere}</span>
            </button>

            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#dadce0] text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{t.askAiAssistant}</span>
            </button>
          </div>

        </div>
      </section>

      {/* Quick Access Grid Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#202124] font-['Google_Sans',sans-serif]">
              Quick Access Categories
            </h2>
            <p className="text-xs text-[#5f6368]">
              Jump straight to popular student and visitor zones
            </p>
          </div>
          <button
            onClick={onExploreMap}
            className="text-xs font-semibold text-[#1a73e8] hover:underline flex items-center gap-1"
          >
            View All On Map <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickAccessCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => onCategorySelect(cat.category)}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#202124] group-hover:text-[#1a73e8] transition-colors text-center">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Highlights & Live Campus Information Strip */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-white border border-[#dadce0] shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Graph-Based Dijkstra Routing
              </h3>
              <p className="text-xs text-[#5f6368] mt-1 leading-relaxed">
                Computes optimal outdoor avenues, indoor corridors, stairwells, and elevator links with accurate walking distances.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#dadce0] shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Gemini NLP Understanding
              </h3>
              <p className="text-xs text-[#5f6368] mt-1 leading-relaxed">
                Simply type or speak in plain English: "Where is MCA classroom?" and get instantaneous building, floor, and navigation steps.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#dadce0] shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#fef7e0] text-[#b06000] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Step-Free Accessibility
              </h3>
              <p className="text-xs text-[#5f6368] mt-1 leading-relaxed">
                Dedicated toggle for wheelchair ramps and elevator-only paths across multi-floor academic buildings.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* NIIS Group of Institutions Campus Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#dadce0]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-[#dadce0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e] animate-pulse"></span>
                <div>
                  <h3 className="text-base font-bold text-[#202124] font-['Google_Sans',sans-serif]">
                    NIIS Group of Institutions - Main Campus Academic Block
                  </h3>
                  <p className="text-xs text-[#5f6368]">
                    Official Front Elevation Architecture · Bhubaneswar Campus
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="p-2 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative w-full aspect-[16/9] bg-[#0f172a] overflow-hidden">
              <NiisCampusHeroVisual blurClass="filter blur-0 opacity-100" />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#dadce0] flex items-center justify-between text-xs text-[#5f6368]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1a73e8]">Key Highlights:</span>
                <span>Tiered Pagoda Roof · 3-Story Blue Glass Atrium · Modern Lecture Halls</span>
              </div>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setBlurIntensity('clear');
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#1a73e8] text-white font-semibold hover:bg-[#155724] transition-colors"
              >
                Set Hero Photo to Clear Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
