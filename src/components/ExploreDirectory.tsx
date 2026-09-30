import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  GraduationCap, 
  FlaskConical, 
  BookOpen, 
  Utensils, 
  HeartPulse, 
  Car, 
  Building as BuildingIcon, 
  Layers, 
  Filter,
  Check,
  Share2
} from 'lucide-react';
import { CampusLocation, Building } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';

interface ExploreDirectoryProps {
  locations: CampusLocation[];
  buildings: Building[];
  onSelectLocation: (loc: CampusLocation) => void;
  onStartNavigation: (loc: CampusLocation) => void;
  onOpenShareModal?: (loc: CampusLocation) => void;
}

export const ExploreDirectory: React.FC<ExploreDirectoryProps> = ({
  locations,
  buildings,
  onSelectLocation,
  onStartNavigation,
  onOpenShareModal,
}) => {
  const { t, language, locName, locDesc, bldgName, categoryLabel, floorLabel } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [selectedFloor, setSelectedFloor] = useState<number | 'All'>('All');

  const categories = [
    'All',
    'Classroom',
    'Laboratory',
    'Department',
    'Library',
    'Canteen',
    'Administrative',
    'Medical',
    'Hostel',
    'Parking',
    'Playground',
    'Washroom',
  ];

  const filtered = useMemo(() => {
    return locations.filter(loc => {
      if (selectedCategory !== 'All' && loc.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedBuilding !== 'All' && loc.buildingId !== selectedBuilding) {
        return false;
      }
      if (selectedFloor !== 'All' && loc.floor !== selectedFloor) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(q) || locName(loc).toLowerCase().includes(q);
        const matchesBldg = loc.building.toLowerCase().includes(q);
        const matchesCode = loc.code.toLowerCase().includes(q);
        const matchesTags = loc.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBldg && !matchesCode && !matchesTags) return false;
      }
      return true;
    });
  }, [locations, selectedCategory, selectedBuilding, selectedFloor, search, locName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dadce0] shadow-xs">
        <h1 className="text-2xl font-bold text-[#202124] font-['Google_Sans',sans-serif]">
          {t.directoryTitle}
        </h1>
        <p className="text-xs text-[#5f6368] mt-1">
          {language === 'hi'
            ? `सभी ${locations.length} कक्षाओं, प्रयोगशालाओं, व्याख्यान कक्षों, कार्यालयों और सुविधाओं को देखें।`
            : `Explore all ${locations.length} classrooms, labs, lecture halls, offices, and campus facilities.`}
        </p>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {/* Text Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'hi' ? 'नाम, कमरा या टैग से खोजें...' : 'Search by name, room, tag...'}
              className="w-full pl-9 pr-3 py-2 text-xs text-[#202124] bg-[#f1f3f4] focus:bg-white rounded-xl border border-transparent focus:border-[#1a73e8] focus:outline-none transition-colors"
            />
          </div>

          {/* Building Filter */}
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full text-xs font-medium text-[#202124] bg-[#f1f3f4] focus:bg-white border border-transparent focus:border-[#1a73e8] rounded-xl px-3 py-2 focus:outline-none transition-colors"
          >
            <option value="All">{t.allBuildings}</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{bldgName(b)}</option>
            ))}
          </select>

          {/* Floor Filter */}
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="w-full text-xs font-medium text-[#202124] bg-[#f1f3f4] focus:bg-white border border-transparent focus:border-[#1a73e8] rounded-xl px-3 py-2 focus:outline-none transition-colors"
          >
            <option value="All">{t.allFloors}</option>
            <option value={0}>{floorLabel(0)} (0)</option>
            <option value={1}>{floorLabel(1)}</option>
            <option value={2}>{floorLabel(2)}</option>
            <option value={3}>{floorLabel(3)}</option>
          </select>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-4 pt-4 border-t border-[#f1f3f4] scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-[#5f6368] hover:text-[#202124] bg-[#f8f9fa] hover:bg-[#e8eaed]'
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#5f6368] px-1">
        <span>
          {language === 'hi' 
            ? `${locations.length} में से ${filtered.length} ${t.showingPlaces}` 
            : `Showing ${filtered.length} of ${locations.length} ${t.showingPlaces}`}
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(loc => (
          <div
            key={loc.id}
            className="p-5 rounded-2xl bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:shadow-sm transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#e8f0fe] text-[#1967d2]">
                  {categoryLabel(loc.category)}
                </span>
                <span className="text-xs text-[#5f6368] font-mono">
                  {loc.code}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#202124] leading-snug">
                {locName(loc)}
              </h3>

              <p className="text-xs text-[#5f6368] mt-1">
                {loc.building} · {floorLabel(loc.floor)} {loc.room ? `(${loc.room})` : ''}
              </p>

              <p className="text-xs text-[#5f6368] mt-2 line-clamp-2 leading-relaxed">
                {locDesc(loc)}
              </p>
            </div>

            <div className="pt-3 border-t border-[#f1f3f4] flex items-center gap-2">
              <button
                onClick={() => onStartNavigation(loc)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1a73e8] hover:bg-[#155724] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.navigateBtn}</span>
              </button>
              <button
                onClick={() => onSelectLocation(loc)}
                className="px-3 py-2 rounded-lg bg-white border border-[#dadce0] hover:bg-[#f8f9fa] text-xs font-medium text-[#3c4043] transition-colors"
              >
                {t.mapBtn}
              </button>
              {onOpenShareModal && (
                <button
                  onClick={() => onOpenShareModal(loc)}
                  className="p-2 rounded-lg bg-white border border-[#dadce0] hover:bg-[#e8f0fe] hover:border-[#1a73e8]/40 text-xs font-medium text-[#1a73e8] transition-colors cursor-pointer"
                  title="Share this campus location"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
