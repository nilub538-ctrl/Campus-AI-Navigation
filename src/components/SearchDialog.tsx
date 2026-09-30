import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  X, 
  Zap,
  Sparkles,
  ArrowRight,
  Footprints
} from 'lucide-react';
import { CampusLocation } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';
import { parseCampusQuery } from '../utils/nlpEngine';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  locations: CampusLocation[];
  onSelectLocation: (location: CampusLocation) => void;
  onStartNavigation: (location: CampusLocation) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  locations,
  onSelectLocation,
  onStartNavigation,
}) => {
  const { t, language, locName, floorLabel } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean conversational prefixes for natural search (e.g. "Where is the library?" -> "library")
  const cleanedSearch = useMemo(() => {
    let s = searchTerm.toLowerCase().trim();
    const prefixes = [
      'where is the ',
      'where is ',
      'where are ',
      'take me to the ',
      'take me to ',
      'find the ',
      'find ',
      'navigate to the ',
      'navigate to ',
      'how to go to the ',
      'how to go to ',
      'how to reach the ',
      'how to reach ',
      'show me the route to ',
      'show route to ',
      'directions to ',
      'go to the ',
      'go to ',
      'kidhar hai ',
      'kahan hai ',
      'kaise jaye ',
    ];
    for (const prefix of prefixes) {
      if (s.startsWith(prefix)) {
        s = s.substring(prefix.length).trim();
        break;
      }
    }
    // Also remove trailing question mark
    return s.replace(/[?!.]+$/, '').trim();
  }, [searchTerm]);

  const { results, nlpMatched } = useMemo(() => {
    if (!searchTerm.trim()) {
      return { results: locations.slice(0, 6), nlpMatched: null };
    }

    // Try NLP engine
    const nlp = parseCampusQuery(searchTerm, 'node_acad_a_entrance', locations);
    const nlpLoc = nlp.matchedLocation;

    const queryTarget = cleanedSearch || searchTerm.toLowerCase();

    const filtered = locations.filter(l =>
      l.name.toLowerCase().includes(queryTarget) ||
      l.building.toLowerCase().includes(queryTarget) ||
      l.code.toLowerCase().includes(queryTarget) ||
      l.category.toLowerCase().includes(queryTarget) ||
      l.tags.some(tag => tag.toLowerCase().includes(queryTarget))
    );

    // If NLP found a match that isn't already first in filtered, prepend it
    if (nlpLoc && !filtered.some(l => l.id === nlpLoc.id)) {
      filtered.unshift(nlpLoc);
    } else if (nlpLoc) {
      const idx = filtered.findIndex(l => l.id === nlpLoc.id);
      if (idx > 0) {
        filtered.splice(idx, 1);
        filtered.unshift(nlpLoc);
      }
    }

    return { results: filtered, nlpMatched: nlpLoc };
  }, [searchTerm, cleanedSearch, locations]);

  if (!isOpen) return null;

  const sampleQueries = [
    'Where is the library?',
    'Take me to the laboratory',
    'Find canteen',
    'Navigate to hostel',
    'Where is Main Block?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#dadce0] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-sky-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Ask: "Where is the library?", "Take me to laboratory", "Find canteen"...'
            className="w-full text-sm text-[#202124] placeholder-[#80868b] bg-transparent focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-[#5f6368] hover:text-[#202124] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-[#5f6368] hover:text-[#202124] px-2 py-1 rounded bg-[#f1f3f4] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Natural Language Suggestion Quick Pills */}
        <div className="px-4 py-2 bg-[#f8fafd] border-b border-[#e8eaed] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Try:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => setSearchTerm(sq)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              ⚡ {sq}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[55vh] overflow-y-auto p-2 divide-y divide-[#f1f3f4]">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#5f6368] uppercase tracking-wider flex items-center justify-between">
            <span>
              {searchTerm.trim() 
                ? (language === 'hi' ? `खोज परिणाम (${results.length})` : `Shortest Route Candidates (${results.length})`) 
                : (language === 'hi' ? 'लोकप्रिय कैंपस स्थल' : 'Popular Destinations')}
            </span>
            {nlpMatched && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>AI Destination Identified</span>
              </span>
            )}
          </div>

          {results.map((loc, idx) => {
            const isTopMatch = idx === 0 && (nlpMatched?.id === loc.id || searchTerm.trim().length > 0);
            return (
              <div
                key={loc.id}
                onClick={() => {
                  onSelectLocation(loc);
                  onStartNavigation(loc);
                  onClose();
                }}
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between group transition-all ${
                  isTopMatch 
                    ? 'bg-sky-50/70 border border-sky-200/80 shadow-xs' 
                    : 'hover:bg-[#f8f9fa]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isTopMatch 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-[#e8f0fe] text-[#1a73e8]'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">
                        {locName(loc)}
                      </p>
                      {isTopMatch && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          ⚡ Top Match
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5f6368]">
                      {loc.building} · {floorLabel(loc.floor)} {loc.room ? `(${loc.room})` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLocation(loc);
                      onStartNavigation(loc);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isTopMatch
                        ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-500/20'
                        : 'bg-[#1a73e8] hover:bg-[#155724] text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Shortest Route</span>
                  </button>
                </div>
              </div>
            );
          })}

          {results.length === 0 && (
            <div className="p-8 text-center text-xs text-[#5f6368]">
              {language === 'hi' 
                ? `"${searchTerm}" से मेल खाता कोई स्थान नहीं मिला। "Library", "Main Block", या "Canteen" खोजें।`
                : `No campus locations found matching "${searchTerm}". Try "Library", "Main Block", or "Canteen".`}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#f8f9fa] border-t border-[#dadce0] flex items-center justify-between text-[11px] text-[#5f6368]">
          <span className="flex items-center gap-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Automatic Minimum Shortest Walking Distance Calculation
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#dadce0] font-mono text-[10px]">ESC</kbd>
            {language === 'hi' ? 'बंद करने के लिए' : 'to close'}
          </span>
        </div>

      </div>
    </div>
  );
};
