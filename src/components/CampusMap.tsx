import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  MapPin, 
  Navigation, 
  Layers, 
  GraduationCap, 
  FlaskConical, 
  BookOpen, 
  Utensils, 
  Car, 
  HeartPulse, 
  Sparkles,
  Footprints,
  Maximize2,
  Droplets,
  Building as BuildingIcon,
  Compass,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  ArrowRightLeft,
  X,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  Volume2,
  VolumeX,
  ListOrdered,
  Radio,
  Users,
  Share2,
  LocateFixed,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { CampusLocation, Building, NavigationRoute, LocationCategory, SharedLocation, UserLivePosition, NavigationStep } from '../types/campus';
import { MapLegend, getCategoryPinColor } from './MapLegend';
import { BuildingPlans } from './BuildingPlans';
import { SatelliteCampusGraphics } from './SatelliteCampusGraphics';
import { useLanguage } from '../context/LanguageContext';


interface CampusMapProps {
  buildings: Building[];
  locations: CampusLocation[];
  selectedLocation: CampusLocation | null;
  onSelectLocation: (loc: CampusLocation) => void;
  activeRoute: NavigationRoute | null;
  userNodeId: string;
  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isSimulatingWalking?: boolean;
  simulationStepIndex?: number;
  isSatelliteTheme?: boolean;
  onToggleSatelliteTheme?: (val: boolean) => void;
  onStartNavigation?: (dest: CampusLocation, customSourceId?: string) => void;
  onUpdateDestination?: (destLocationId: string) => void;
  onUpdateSource?: (sourceNodeId: string) => void;
  onCancelNavigation?: () => void;
  onSwapDirection?: () => void;
  onToggleWalkingSimulation?: () => void;
  accessibleMode?: boolean;
  sharedLocations?: SharedLocation[];
  myActiveShare?: SharedLocation | null;
  onOpenShareModal?: (location?: CampusLocation) => void;
  onOpenRadar?: () => void;
  onSelectShare?: (share: SharedLocation) => void;
  selectedShare?: SharedLocation | null;
  onDropPinToShare?: (coords: { x: number; y: number }) => void;

  // Real-time walking navigation additions
  userPosition?: UserLivePosition;
  isNavigating?: boolean;
  isPaused?: boolean;
  isDemoMode?: boolean;
  currentStep?: NavigationStep | null;
  nextStep?: NavigationStep | null;
  distanceRemaining?: number;
  timeRemainingMinutes?: number;
  hasArrived?: boolean;
  isGpsLowAccuracy?: boolean;
  onPauseNavigation?: () => void;
  onRecalculateRoute?: () => void;
  onEndNavigation?: () => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  buildings,
  locations,
  selectedLocation,
  onSelectLocation,
  activeRoute,
  userNodeId,
  selectedFloor,
  setSelectedFloor,
  selectedCategory,
  setSelectedCategory,
  isSimulatingWalking = false,
  simulationStepIndex = 0,
  isSatelliteTheme = true,
  onToggleSatelliteTheme,
  onStartNavigation,
  onUpdateDestination,
  onUpdateSource,
  onCancelNavigation,
  onSwapDirection,
  onToggleWalkingSimulation,
  accessibleMode = false,
  sharedLocations = [],
  myActiveShare = null,
  onOpenShareModal,
  onOpenRadar,
  onSelectShare,
  selectedShare = null,
  onDropPinToShare,

  userPosition,
  isNavigating = false,
  isPaused = false,
  isDemoMode = false,
  currentStep,
  nextStep,
  distanceRemaining,
  timeRemainingMinutes,
  hasArrived = false,
  isGpsLowAccuracy = false,
  onPauseNavigation,
  onRecalculateRoute,
  onEndNavigation,
}) => {
  const { t, language, locName, bldgName, categoryLabel, floorLabel } = useLanguage();
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);

  // New Google Satellite & Map Themes State
  const [mapTheme, setMapThemeState] = useState<'satellite' | 'blueprint' | 'standard'>(
    isSatelliteTheme ? 'satellite' : 'standard'
  );

  const setMapTheme = (theme: 'satellite' | 'blueprint' | 'standard') => {
    setMapThemeState(theme);
    onToggleSatelliteTheme?.(theme === 'satellite');
  };

  const [showBuildingPlans, setShowBuildingPlans] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);

  // Touch-to-Touch Point-to-Point & Touch-to-Change-Direction State
  const [touchOrigin, setTouchOrigin] = useState<CampusLocation | null>(null);
  const [touchToast, setTouchToast] = useState<{
    message: string;
    sub?: string;
    type: 'info' | 'success' | 'reroute';
  } | null>(null);
  const [showStepsDrawer, setShowStepsDrawer] = useState<boolean>(false);

  // Custom Meetup Pin Drop Mode State
  const [isDropPinMode, setIsDropPinMode] = useState<boolean>(false);
  const [customMeetupPin, setCustomMeetupPin] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = mapTheme === 'satellite' || mapTheme === 'blueprint';

  // Handle Drop Pin Click on SVG Canvas
  const handleSvgCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDropPinMode && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left - pan.x;
      const clickY = e.clientY - rect.top - pan.y;
      const svgX = Math.round((clickX / (rect.width * zoom)) * 1000);
      const svgY = Math.round((clickY / (rect.height * zoom)) * 800);
      const clampedX = Math.max(60, Math.min(940, svgX));
      const clampedY = Math.max(60, Math.min(740, svgY));
      setCustomMeetupPin({ x: clampedX, y: clampedY });
      setIsDropPinMode(false);
      setTouchToast({
        message: `📍 Meetup Pin Placed! (${clampedX}, ${clampedY})`,
        sub: `Opening share dialog to broadcast this location...`,
        type: 'success',
      });
      onDropPinToShare?.({ x: clampedX, y: clampedY });
    }
  };

  // Automatically dismiss touch toast after 4.5 seconds
  useEffect(() => {
    if (touchToast) {
      const timer = setTimeout(() => {
        setTouchToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [touchToast]);

  // Categories list for top filter
  const categories = [
    { label: t.catAll, value: 'All', icon: Layers },
    { label: t.catClassroom, value: 'Classroom', icon: GraduationCap },
    { label: t.catLaboratory, value: 'Laboratory', icon: FlaskConical },
    { label: t.catLibrary, value: 'Library', icon: BookOpen },
    { label: t.catCanteen, value: 'Canteen', icon: Utensils },
    { label: t.catWashroom, value: 'Washroom', icon: Droplets },
    { label: t.catMedical, value: 'Medical', icon: HeartPulse },
    { label: t.catParking, value: 'Parking', icon: Car },
  ];

  // Filter locations by category and floor (or show outdoor landmarks)
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      // Category filter
      if (selectedCategory !== 'All' && loc.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Floor filter (outdoor landmarks with floor 0 always show, or matches selected floor)
      if (loc.floor !== selectedFloor && selectedFloor !== 0 && loc.floor > 0) {
        return false;
      }
      return true;
    });
  }, [locations, selectedCategory, selectedFloor]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Build SVG path string for active navigation route
  const routePathD = useMemo(() => {
    if (!activeRoute || activeRoute.pathNodes.length === 0) return '';
    return activeRoute.pathNodes.reduce((acc, node, idx) => {
      return idx === 0 ? `M ${node.x} ${node.y}` : `${acc} L ${node.x} ${node.y}`;
    }, '');
  }, [activeRoute]);

  // Walking simulation coordinates
  const simulatedCoord = useMemo(() => {
    if (!activeRoute || activeRoute.pathNodes.length === 0) return null;
    const clampedIndex = Math.min(simulationStepIndex, activeRoute.pathNodes.length - 1);
    return activeRoute.pathNodes[clampedIndex];
  }, [activeRoute, simulationStepIndex]);

  // ==============================================================
  // CORE FEATURE: TOUCH ONE LOCATION TO ANOTHER -> CHANGE DIRECTION & SEE DIRECTION
  // ==============================================================
  const handleLocationTouch = (loc: CampusLocation) => {
    // 1. If an active route is ALREADY running:
    if (activeRoute) {
      // Touching a different location immediately changes the direction to the new touch location!
      if (loc.id !== activeRoute.destinationId) {
        onStartNavigation?.(loc, activeRoute.sourceId);
        onSelectLocation(loc);
        if (loc.floor > 0) setSelectedFloor(loc.floor);

        setTouchToast({
          message: `🎯 Direction changed to ${loc.name}`,
          sub: `Recalculated from ${activeRoute.sourceName}`,
          type: 'reroute',
        });
        setTouchOrigin(null);
      } else {
        // Touching the existing destination shows steps drawer
        onSelectLocation(loc);
        setShowStepsDrawer(true);
      }
      return;
    }

    // 2. If NO active route currently:
    if (!touchOrigin || touchOrigin.id === loc.id) {
      // First Touch: Set Point A (Origin)
      setTouchOrigin(loc);
      onSelectLocation(loc);
      if (loc.floor > 0) setSelectedFloor(loc.floor);

      setTouchToast({
        message: `📍 Point A selected: ${loc.name}`,
        sub: `Now touch any 2nd location or building to see walking directions!`,
        type: 'info',
      });
    } else {
      // Second Touch: Point B! Calculate direction from Point A (touchOrigin) to Point B (loc)
      const fromLoc = touchOrigin;
      onStartNavigation?.(loc, fromLoc.nodeId || fromLoc.id);
      onSelectLocation(loc);
      if (loc.floor > 0) setSelectedFloor(loc.floor);

      setTouchToast({
        message: `🚀 Directions: ${fromLoc.name} ➔ ${loc.name}`,
        sub: `Shortest walking route calculated. Tap "Steps" to see directions!`,
        type: 'success',
      });
      setTouchOrigin(null);
      setShowStepsDrawer(true);
    }
  };

  // Touching a building also routes to that building's primary room/landmark
  const handleBuildingClick = (b: Building) => {
    const bLoc = locations.find(l => l.buildingId === b.id) ||
                 locations.find(l => l.building.toLowerCase().includes(b.shortName.toLowerCase()));
    if (bLoc) {
      handleLocationTouch(bLoc);
    } else {
      setHoveredBuilding(b);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden border shadow-md flex flex-col select-none transition-colors duration-300 ${
      mapTheme === 'satellite'
        ? 'bg-[#0f1d15] border-[#223829]'
        : mapTheme === 'blueprint'
          ? 'bg-[#082f49] border-[#0284c7]'
          : 'bg-[#f8f9fa] border-[#dadce0]'
    }`}>
      
      {/* Top Filter Chips Bar & Floor Switcher */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2 flex-wrap">
        
        {/* Category Filter Chips */}
        <div className={`flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 pointer-events-auto backdrop-blur-md rounded-full border shadow-sm scrollbar-none transition-colors ${
          isDark 
            ? 'bg-[#0f172a]/85 border-[#334155] text-slate-200' 
            : 'bg-white/95 border-[#dadce0] text-[#5f6368]'
        }`}>
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? isDark 
                      ? 'bg-sky-500 text-white font-semibold shadow-xs' 
                      : 'bg-[#1a73e8] text-white shadow-xs'
                    : isDark 
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                      : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: Location Sharing + Radar + Building Plan Toggle + Floor Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 flex-wrap justify-end">
          
          {/* Share My Location Button */}
          <button
            onClick={() => onOpenShareModal?.()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
              myActiveShare
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/50'
                : isDark
                  ? 'bg-sky-500/20 border-sky-400/50 text-sky-300 hover:bg-sky-500/30'
                  : 'bg-[#e8f0fe] border-[#1a73e8]/40 text-[#1a73e8] hover:bg-[#d2e3fc]'
            }`}
            title={myActiveShare ? `${t.active}: ${myActiveShare.shareCode}` : t.shareCampusLocation}
          >
            <Radio className={`w-3.5 h-3.5 ${myActiveShare ? 'text-emerald-400 animate-pulse' : 'text-sky-400'}`} />
            <span className="hidden sm:inline">{myActiveShare ? t.broadcasting : t.shareLocation}</span>
          </button>

          {/* Campus Live Radar Button */}
          {onOpenRadar && (
            <button
              onClick={onOpenRadar}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'bg-white/90 border-[#dadce0] text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
              title="View people currently sharing location on campus"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.radar}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold">
                {sharedLocations.length}
              </span>
            </button>
          )}

          {/* Drop Meetup Pin Toggle Button */}
          <button
            onClick={() => {
              setIsDropPinMode(prev => !prev);
              setTouchToast({
                message: !isDropPinMode ? `📍 ${t.dropPin}` : 'Drop Pin Mode Deactivated',
                sub: !isDropPinMode ? t.clickMapToDrop : undefined,
                type: 'info',
              });
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
              isDropPinMode
                ? 'bg-amber-500 text-white border-amber-400 animate-pulse ring-2 ring-amber-300/50'
                : isDark
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-white/90 border-[#dadce0] text-[#5f6368] hover:text-[#202124]'
            }`}
            title={t.dropPin}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">{isDropPinMode ? t.clickMapToDrop : t.dropPin}</span>
          </button>

          {/* Quick Building Plans Toggle Button */}
          <button
            onClick={() => setShowBuildingPlans(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
              showBuildingPlans
                ? isDark
                  ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                  : 'bg-[#e8f0fe] border-[#1a73e8]/40 text-[#1a73e8]'
                : isDark
                  ? 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                  : 'bg-white/90 border-[#dadce0] text-[#5f6368] hover:text-[#202124]'
            }`}
            title="Toggle architectural building plans & internal room layouts"
          >
            <BuildingIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.buildingPlans}</span>
            <span className={`text-[10px] px-1 rounded ${showBuildingPlans ? 'bg-sky-500 text-white' : 'bg-slate-600 text-white'}`}>
              {showBuildingPlans ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Floor Switcher (Ground, 1, 2, 3) */}
          <div className={`flex items-center gap-1 backdrop-blur-md px-2 py-1 rounded-full border shadow-sm transition-colors ${
            isDark 
              ? 'bg-[#0f172a]/85 border-[#334155]' 
              : 'bg-white/95 border-[#dadce0]'
          }`}>
            <span className={`text-[11px] font-semibold uppercase px-1 hidden sm:inline ${
              isDark ? 'text-slate-400' : 'text-[#5f6368]'
            }`}>
              {t.floor}:
            </span>
            {[0, 1, 2, 3].map(floor => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  selectedFloor === floor
                    ? isDark 
                      ? 'bg-sky-500 text-white shadow-xs' 
                      : 'bg-[#1a73e8] text-white shadow-xs'
                    : isDark 
                      ? 'text-slate-300 hover:bg-slate-800' 
                      : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
                title={floorLabel(floor)}
              >
                {floor === 0 ? (language === 'hi' ? 'भू' : 'G') : (language === 'hi' ? `मं${floor}` : `F${floor}`)}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* FLOATING DIRECTION HUD BAR (Touch-to-Touch & Direction Controls) */}
      {/* ============================================================== */}
      <div className="absolute top-16 left-3 right-3 z-30 pointer-events-none flex flex-col items-center gap-2">
        
        {/* CASE A: ACTIVE NAVIGATION ROUTE HUD BAR */}
        {activeRoute && (
          <div className={`w-full max-w-2xl px-4 py-2.5 rounded-2xl backdrop-blur-md border shadow-xl flex items-center justify-between pointer-events-auto gap-3 animate-fadeIn ${
            isDark
              ? 'bg-[#0f172a]/95 border-sky-500/40 text-white shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
              : 'bg-white/95 border-sky-400 text-[#202124] shadow-[0_4px_20px_rgba(26,115,232,0.15)]'
          }`}>
            
            {/* Origin & Destination Display */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Origin badge */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/40 flex-shrink-0" />
                <span className="font-semibold text-xs truncate max-w-[110px] sm:max-w-[150px]">
                  {activeRoute.sourceName}
                </span>
              </div>

              {/* Direction Swap Button */}
              <button
                onClick={onSwapDirection}
                className="p-1 rounded-full text-sky-400 hover:bg-sky-500/20 transition-colors cursor-pointer flex-shrink-0"
                title="Swap Direction (Reverse Route)"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {/* Destination badge */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-400/40 flex-shrink-0 animate-ping" />
                <span className="font-bold text-xs truncate max-w-[120px] sm:max-w-[160px] text-sky-400">
                  {activeRoute.destinationName}
                </span>
              </div>
            </div>

            {/* Distance & Walking Time Stats */}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-700/40 pl-3 text-xs">
              <span className="font-bold text-sky-300">
                {activeRoute.totalDistance} {t.meters}
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-medium text-slate-300">
                ~{activeRoute.estimatedMinutes} {t.minWalk}
              </span>
            </div>

            {/* Quick Actions: Walk Simulation, See Steps, Exit */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* See Direction Steps Drawer Toggle */}
              <button
                onClick={() => setShowStepsDrawer(prev => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  showStepsDrawer
                    ? 'bg-sky-500 text-white'
                    : isDark
                      ? 'bg-slate-800 text-sky-300 hover:bg-slate-700 border border-slate-700'
                      : 'bg-sky-50 text-[#1a73e8] hover:bg-sky-100 border border-sky-200'
                }`}
                title={t.seeDirection}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.seeDirection}</span>
              </button>

              {/* Live Walking Simulation */}
              <button
                onClick={onToggleWalkingSimulation}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isSimulatingWalking
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : isDark
                      ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-slate-700'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
                title={isSimulatingWalking ? 'Pause walking simulation' : 'Start walking simulation'}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{isSimulatingWalking ? t.walking : t.walk}</span>
              </button>

              {/* Cancel Route */}
              <button
                onClick={onCancelNavigation}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title={t.cancelRoute}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* CASE B: POINT A SELECTED (Waiting for Touch 2 or Direct Navigation) */}
        {!activeRoute && touchOrigin && (
          <div className={`px-4 py-2 rounded-2xl backdrop-blur-md border shadow-xl flex items-center gap-3 pointer-events-auto animate-fadeIn ${
            isDark
              ? 'bg-[#0f172a]/95 border-emerald-500/40 text-white'
              : 'bg-white/95 border-emerald-400 text-[#202124]'
          }`}>
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-400/40 flex-shrink-0 animate-ping" />
            <div className="text-xs">
              <span className="font-bold text-emerald-400">Point A: {touchOrigin.name}</span>
              <span className="text-slate-400 hidden sm:inline ml-1.5">
                (Touch any 2nd location to calculate directions)
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => onStartNavigation?.(touchOrigin, userNodeId)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-all cursor-pointer"
                title="Navigate from Campus Main Gate to Point A"
              >
                Navigate from Gate
              </button>

              <button
                onClick={() => setTouchOrigin(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Touch Notification Toast (Direction Updates & Confirmations) */}
        {touchToast && (
          <div className={`px-3.5 py-1.5 rounded-xl backdrop-blur-md border shadow-lg flex items-center gap-2 text-xs animate-bounce cursor-pointer ${
            touchToast.type === 'reroute'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : touchToast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : 'bg-sky-950/90 border-sky-500/50 text-sky-200'
          }`}>
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <div>
              <div className="font-bold">{touchToast.message}</div>
              {touchToast.sub && (
                <div className="text-[10px] opacity-80">{touchToast.sub}</div>
              )}
            </div>
            <button onClick={() => setTouchToast(null)} className="ml-1 opacity-60 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* ON-MAP "SEE DIRECTION" STEPS DRAWER */}
      {/* ============================================================== */}
      {activeRoute && showStepsDrawer && (
        <div className="absolute top-28 right-4 z-30 w-80 max-h-[460px] overflow-hidden rounded-2xl backdrop-blur-md border shadow-2xl flex flex-col pointer-events-auto animate-fadeIn">
          {/* Header */}
          <div className={`px-3.5 py-2.5 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#202124]'
          }`}>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-400" />
              <div>
                <h4 className="font-bold text-xs leading-tight">{t.turnByTurnDirections}</h4>
                <p className="text-[10px] text-slate-400">{activeRoute.steps.length} {t.stepsTotal} · {activeRoute.totalDistance} {t.meters}</p>
              </div>
            </div>
            <button
              onClick={() => setShowStepsDrawer(false)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Steps List */}
          <div className={`flex-1 overflow-y-auto p-2.5 space-y-2 text-xs scrollbar-thin ${
            isDark ? 'bg-slate-950/90 text-slate-200 divide-slate-800' : 'bg-white text-slate-800 divide-slate-100'
          }`}>
            {activeRoute.steps.map((step, idx) => {
              const isCurrent = isSimulatingWalking && simulationStepIndex === idx;

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border transition-all flex items-start gap-2.5 ${
                    isCurrent
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 ring-1 ring-sky-400'
                      : isDark
                        ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {/* Step Icon */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    step.type === 'destination'
                      ? 'bg-rose-500 text-white'
                      : step.type === 'start'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-sky-500/20 text-sky-400'
                  }`}>
                    {step.type === 'turn-left' ? (
                      <CornerUpLeft className="w-3.5 h-3.5" />
                    ) : step.type === 'turn-right' ? (
                      <CornerUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowUp className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs leading-snug">{step.instruction}</div>
                    {step.subInstruction && (
                      <div className="text-[10px] text-slate-400 mt-0.5">{step.subInstruction}</div>
                    )}
                    {step.distance > 0 && (
                      <div className="text-[9.5px] text-sky-400 font-mono mt-0.5">{step.distance} {t.meters}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className={`px-3 py-2 border-t text-[10.5px] text-center ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            {t.touchOtherToReroute}
          </div>
        </div>
      )}

      {/* Map Canvas SVG Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full flex-1 relative overflow-hidden cursor-${isDragging ? 'grabbing' : 'grab'}`}
      >
        <svg
          viewBox="0 0 1000 800"
          onClick={handleSvgCanvasClick}
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '500px 400px',
          }}
        >
          <defs>
            {/* Standard Light Mode Gradients & Filters */}
            <linearGradient id="campusGround" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f8ed" />
              <stop offset="100%" stopColor="#e5f2e0" />
            </linearGradient>

            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Standard Vector Map Base Ground (When standard theme is chosen) */}
          {mapTheme === 'standard' && (
            <>
              <rect x="0" y="0" width="1000" height="800" fill="url(#campusGround)" />
              <rect x="40" y="40" width="920" height="720" rx="30" fill="none" stroke="#bdc1c6" strokeWidth="2" strokeDasharray="8,6" />
            </>
          )}

          {/* Satellite or Blueprint Campus Graphics (Lawns, Tartan Track, Asphalt Roads, Zebra Crossings, Parking Plaza with cars, Solar arrays, Trees) */}
          <SatelliteCampusGraphics
            theme={mapTheme}
            buildings={buildings}
            showPlans={showBuildingPlans}
          />

          {/* Buildings Outer Shells & 3D Extrusion */}
          {buildings.map(b => {
            const isHovered = hoveredBuilding?.id === b.id;
            const isSelectedBuilding = selectedLocation?.buildingId === b.id;

            return (
              <g 
                key={b.id} 
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredBuilding(b)}
                onMouseLeave={() => setHoveredBuilding(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuildingClick(b);
                }}
              >
                {/* Building Drop Shadow (Realistic Sun Angle from Top-Left) */}
                <rect
                  x={b.coordinates.x + 8}
                  y={b.coordinates.y + 10}
                  width={b.coordinates.width}
                  height={b.coordinates.height}
                  rx="10"
                  fill="rgba(0, 0, 0, 0.45)"
                  filter={mapTheme === 'satellite' ? 'url(#satelliteShadow)' : undefined}
                />

                {/* Building Wall Perimeter Base */}
                <rect
                  x={b.coordinates.x}
                  y={b.coordinates.y}
                  width={b.coordinates.width}
                  height={b.coordinates.height}
                  rx="10"
                  fill={
                    showBuildingPlans
                      ? mapTheme === 'blueprint'
                        ? 'rgba(8, 47, 73, 0.85)'
                        : mapTheme === 'satellite'
                          ? 'rgba(15, 23, 42, 0.85)'
                          : '#ffffff'
                      : mapTheme === 'satellite'
                        ? '#334155'
                        : '#ffffff'
                  }
                  stroke={
                    isSelectedBuilding 
                      ? '#38bdf8' 
                      : isHovered 
                        ? '#60a5fa' 
                        : mapTheme === 'blueprint' 
                          ? '#0284c7' 
                          : mapTheme === 'satellite' 
                            ? '#64748b' 
                            : '#dadce0'
                  }
                  strokeWidth={isSelectedBuilding ? 3 : isHovered ? 2.5 : 1.5}
                />

                {/* Header Ribbon / Code Badge when in Rooftop mode */}
                {!showBuildingPlans && (
                  <>
                    <path
                      d={`M ${b.coordinates.x} ${b.coordinates.y + 10} A 10 10 0 0 1 ${b.coordinates.x + 10} ${b.coordinates.y} L ${b.coordinates.x + b.coordinates.width - 10} ${b.coordinates.y} A 10 10 0 0 1 ${b.coordinates.x + b.coordinates.width} ${b.coordinates.y + 10} L ${b.coordinates.x + b.coordinates.width} ${b.coordinates.y + 22} L ${b.coordinates.x} ${b.coordinates.y + 22} Z`}
                      fill={b.color}
                    />
                    <text
                      x={b.coordinates.x + b.coordinates.width / 2}
                      y={b.coordinates.y + 15}
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                      letterSpacing="0.5"
                      textAnchor="middle"
                    >
                      {b.code} · {b.shortName}
                    </text>
                  </>
                )}

                {/* Architectural Building Plan Label Header (When showBuildingPlans is TRUE) */}
                {showBuildingPlans && (
                  <g>
                    <rect
                      x={b.coordinates.x}
                      y={b.coordinates.y - 12}
                      width={b.shortName.length * 6.5 + 46}
                      height="16"
                      rx="4"
                      fill={b.color}
                      className="shadow-sm"
                    />
                    <text
                      x={b.coordinates.x + 6}
                      y={b.coordinates.y - 1}
                      fill="#ffffff"
                      fontSize="8.5"
                      fontWeight="bold"
                      letterSpacing="0.4"
                    >
                      {b.code} · {b.shortName} (F{selectedFloor})
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Architectural Building Plans Layer (Walls, Desks, Labs, Classrooms, Doors, Fixtures) */}
          <BuildingPlans
            buildings={buildings}
            selectedFloor={selectedFloor}
            theme={mapTheme}
            showPlans={showBuildingPlans}
            hoveredBuildingId={hoveredBuilding?.id || null}
            selectedBuildingId={selectedLocation?.buildingId || null}
          />

          {/* Active Navigation Route Path (Bold Google Blue with animated directional flow) */}
          {activeRoute && (
            <g filter="url(#routeGlow)">
              {/* Outer soft buffer line */}
              <path
                d={routePathD}
                fill="none"
                stroke={mapTheme === 'satellite' ? '#38bdf8' : '#1a73e8'}
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.45"
              />
              {/* Main solid route line */}
              <path
                d={routePathD}
                fill="none"
                stroke={mapTheme === 'satellite' ? '#0ea5e9' : '#1a73e8'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated directional pulsing dots along path */}
              <path
                d={routePathD}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="8,12"
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="40"
                  to="0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}

          {/* Blue Live Location Marker: 📍 YOU ARE HERE */}
          {(() => {
            const liveX = userPosition ? userPosition.canvas.x : (isSimulatingWalking && simulatedCoord ? simulatedCoord.x : 490);
            const liveY = userPosition ? userPosition.canvas.y : (isSimulatingWalking && simulatedCoord ? simulatedCoord.y : 730);

            return (
              <g transform={`translate(${liveX}, ${liveY})`} className="transition-transform duration-300">
                {/* Live Pulsing Beacon Wave */}
                <circle cx="0" cy="0" r="22" fill="#1a73e8" opacity="0.35">
                  <animate attributeName="r" values="14;28;14" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.45;0.05;0.45" dur="1.8s" repeatCount="indefinite" />
                </circle>

                {/* GPS Accuracy Indicator */}
                {userPosition?.accuracy && userPosition.accuracy > 12 && (
                  <circle
                    cx="0"
                    cy="0"
                    r={Math.min(50, userPosition.accuracy * 1.5)}
                    fill="#38bdf8"
                    opacity="0.12"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="4,3"
                  />
                )}

                {/* Solid Blue Location Pin Center */}
                <circle cx="0" cy="0" r="14" fill="#1a73e8" stroke="#ffffff" strokeWidth="3.5" className="drop-shadow-lg" />
                <circle cx="0" cy="0" r="5.5" fill="#ffffff" />

                {/* Optional Heading Indicator Cone */}
                {userPosition?.heading !== undefined && userPosition?.heading !== null && (
                  <polygon points="0,-18 5,-13 -5,-13" fill="#ffffff" transform={`rotate(${userPosition.heading})`} />
                )}

                {/* Live Location Label Badge: 📍 YOU ARE HERE */}
                <g transform="translate(0, -28)">
                  <rect
                    x="-58"
                    y="-12"
                    width="116"
                    height="20"
                    rx="10"
                    fill={isNavigating ? '#1a73e8' : isDark ? '#0f172a' : '#1a73e8'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="shadow-xl"
                  />
                  <text
                    x="0"
                    y="2"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    📍 YOU ARE HERE
                  </text>
                </g>
              </g>
            );
          })()}

          {/* Simulated Walker Dot during Active Walking Navigation */}
          {isSimulatingWalking && simulatedCoord && (
            <g className="transition-all duration-300">
              <circle
                cx={simulatedCoord.x}
                cy={simulatedCoord.y}
                r="18"
                fill="#22c55e"
                opacity="0.35"
              >
                <animate
                  attributeName="r"
                  values="14;24;14"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={simulatedCoord.x}
                cy={simulatedCoord.y}
                r="10"
                fill="#22c55e"
                stroke="#ffffff"
                strokeWidth="3"
                className="drop-shadow-md"
              />
            </g>
          )}

          {/* Location Pins / Markers (with showLabels toggle) */}
          {showLabels && filteredLocations.map(loc => {
            const isSelected = selectedLocation?.id === loc.id;
            const isDest = activeRoute?.destinationId === loc.id;
            const isTouchPointA = touchOrigin?.id === loc.id;

            return (
              <g
                key={loc.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLocationTouch(loc);
                }}
                className="cursor-pointer group"
                transform={`translate(${loc.coordinates.x}, ${loc.coordinates.y})`}
              >
                {/* Pin Shadow */}
                <ellipse cx="0" cy="4" rx="8" ry="4" fill="rgba(0,0,0,0.35)" />

                {/* Point A Pulsing Halo Ring (when selected as 1st touch point) */}
                {isTouchPointA && (
                  <circle
                    cx="0"
                    cy="-21"
                    r="16"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeDasharray="4,3"
                    className="animate-spin"
                  />
                )}

                {/* Destination Target Pulsing Ring */}
                {isDest && (
                  <circle
                    cx="0"
                    cy="-21"
                    r="16"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeDasharray="4,3"
                    className="animate-spin"
                  />
                )}

                {/* Pin Marker Pinhead */}
                <g className="transition-transform duration-200 group-hover:-translate-y-1.5">
                  <path
                    d="M 0 0 C -9 -14 -12 -22 0 -34 C 12 -22 9 -14 0 0 Z"
                    fill={
                      isDest 
                        ? '#ea4335' 
                        : isTouchPointA 
                          ? '#10b981' 
                          : isSelected 
                            ? '#1a73e8' 
                            : getCategoryPinColor(loc.category)
                    }
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />
                  <circle cx="0" cy="-21" r="5" fill="#ffffff" />
                </g>

                {/* Tooltip / Label */}
                <g transform="translate(0, -42)">
                  <rect
                    x={-loc.name.length * 3.8 - 8}
                    y="-12"
                    width={loc.name.length * 7.6 + 16}
                    height="20"
                    rx="10"
                    fill={
                      isDest
                        ? '#ef4444'
                        : isTouchPointA
                          ? '#10b981'
                          : isSelected
                            ? '#1a73e8' 
                            : isDark 
                              ? '#0f172a' 
                              : '#ffffff'
                    }
                    stroke={
                      isDest || isTouchPointA || isSelected
                        ? '#ffffff' 
                        : isDark 
                          ? '#334155' 
                          : '#dadce0'
                    }
                    strokeWidth="1"
                    className="shadow-md"
                  />
                  <text
                    x="0"
                    y="2"
                    fill={
                      isDest || isTouchPointA || isSelected
                        ? '#ffffff' 
                        : isDark 
                          ? '#f8fafc' 
                          : '#202124'
                    }
                    fontSize="9.5"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {isTouchPointA ? `${language === 'hi' ? 'बिंदु A' : 'Point A'}: ${locName(loc)}` : locName(loc)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Active Live Shared Locations on Campus */}
          {sharedLocations && sharedLocations.map(share => {
            const isSelected = selectedShare?.id === share.id;
            return (
              <g
                key={share.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectShare?.(share);
                }}
                className="cursor-pointer group"
                transform={`translate(${share.coordinates.x}, ${share.coordinates.y})`}
              >
                {/* Shadow */}
                <ellipse cx="0" cy="5" rx="10" ry="5" fill="rgba(0,0,0,0.4)" />

                {/* Live Radar Ripples */}
                <circle cx="0" cy="0" r="16" fill={share.avatarColor || '#10b981'} opacity="0.3">
                  <animate attributeName="r" values="12;26;12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.45;0.05;0.45" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Avatar Circle */}
                <circle
                  cx="0"
                  cy="0"
                  r="13"
                  fill={share.avatarColor || '#10b981'}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="drop-shadow-md"
                />

                {/* Sender Initial */}
                <text
                  x="0"
                  y="4"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {share.senderName.charAt(0)}
                </text>

                {/* Live Beacon Dot */}
                <circle cx="9" cy="-9" r="4.5" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5">
                  <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
                </circle>

                {/* Label Tooltip Above */}
                <g transform="translate(0, -22)">
                  <rect
                    x={-share.senderName.length * 3.8 - 14}
                    y="-12"
                    width={share.senderName.length * 7.6 + 28}
                    height="19"
                    rx="9.5"
                    fill={isSelected ? '#10b981' : isDark ? '#0f172a' : '#ffffff'}
                    stroke={share.avatarColor || '#10b981'}
                    strokeWidth="1.5"
                    className="shadow-lg"
                  />
                  <text
                    x="0"
                    y="2"
                    fill={isSelected ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a'}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    📍 {share.senderName} ({share.shareCode})
                  </text>
                </g>
              </g>
            );
          })}

          {/* Custom Dropped Meetup Pin (when user clicks canvas in Drop Pin mode) */}
          {customMeetupPin && (
            <g
              transform={`translate(${customMeetupPin.x}, ${customMeetupPin.y})`}
              className="cursor-pointer animate-bounce"
              onClick={(e) => {
                e.stopPropagation();
                onDropPinToShare?.(customMeetupPin);
              }}
            >
              <ellipse cx="0" cy="4" rx="8" ry="4" fill="rgba(0,0,0,0.4)" />
              <path
                d="M 0 0 C -9 -14 -12 -22 0 -34 C 12 -22 9 -14 0 0 Z"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="drop-shadow-lg"
              />
              <circle cx="0" cy="-21" r="5" fill="#ffffff" />
              <g transform="translate(0, -42)">
                <rect
                  x="-65"
                  y="-12"
                  width="130"
                  height="20"
                  rx="10"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="shadow-md"
                />
                <text
                  x="0"
                  y="2"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {language === 'hi' ? '📍 कस्टम मिलने का स्थान' : '📍 Custom Meetup Spot'}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Building Hover Details HUD Bar (Appears on Hover) */}
      {hoveredBuilding && (
        <div className="absolute top-28 left-4 z-20 pointer-events-none animate-fadeIn">
          <div className={`px-3 py-2 rounded-xl backdrop-blur-md border shadow-lg flex items-center gap-2.5 text-xs ${
            isDark 
              ? 'bg-[#0f172a]/92 border-[#334155] text-white' 
              : 'bg-white/95 border-[#dadce0] text-[#202124]'
          }`}>
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: hoveredBuilding.color }} />
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span>{bldgName(hoveredBuilding)}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono">
                  {hoveredBuilding.code}
                </span>
              </div>
              <div className={`text-[10.5px] ${isDark ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                {hoveredBuilding.totalFloors} {language === 'hi' ? 'मंजिलें · मार्ग चुनने के लिए छुएं' : 'Floors · Touch to set as route location'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Control Buttons & Layers Switcher Floating Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        
        {/* Google Maps Style Layer Switcher Menu Popover */}
        {isLayersOpen && (
          <div className={`w-56 p-3 rounded-2xl backdrop-blur-md border shadow-xl flex flex-col gap-2.5 text-xs mb-1 animate-fadeIn transition-colors ${
            isDark 
              ? 'bg-[#0f172a]/95 border-[#334155] text-slate-200' 
              : 'bg-white/95 border-[#dadce0] text-[#202124]'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
              <span className="font-bold text-[12px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Map Theme & Layers
              </span>
              <button 
                onClick={() => setIsLayersOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Theme Selector: Satellite, Blueprint, Standard */}
            <div className="space-y-1">
              <span className={`text-[10px] font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Theme Style
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setMapTheme('satellite')}
                  className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    mapTheme === 'satellite'
                      ? 'border-sky-500 bg-sky-500/20 text-sky-300 font-bold ring-1 ring-sky-500'
                      : isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="w-full h-7 rounded bg-gradient-to-br from-[#143820] to-[#0f1d15] flex items-center justify-center text-[10px]">
                    🛰️
                  </div>
                  <span className="text-[10px]">{t.satellite}</span>
                </button>

                <button
                  onClick={() => setMapTheme('blueprint')}
                  className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    mapTheme === 'blueprint'
                      ? 'border-sky-500 bg-sky-500/20 text-sky-300 font-bold ring-1 ring-sky-500'
                      : isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="w-full h-7 rounded bg-[#082f49] flex items-center justify-center text-[10px] border border-sky-400/40">
                    📐
                  </div>
                  <span className="text-[10px]">{t.blueprint}</span>
                </button>

                <button
                  onClick={() => setMapTheme('standard')}
                  className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    mapTheme === 'standard'
                      ? 'border-sky-500 bg-sky-500/20 text-sky-300 font-bold ring-1 ring-sky-500'
                      : isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="w-full h-7 rounded bg-[#f1f8ed] flex items-center justify-center text-[10px] border border-slate-300">
                    🗺️
                  </div>
                  <span className="text-[10px]">{t.vector}</span>
                </button>
              </div>
            </div>

            {/* Overlays Toggles */}
            <div className="space-y-1.5 pt-1 border-t border-slate-700/40">
              <span className={`text-[10px] font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'hi' ? 'विशेषताएं' : 'Features'}
              </span>

              {/* Building Plans Checkbox */}
              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <span className="flex items-center gap-1.5">
                  <BuildingIcon className="w-3.5 h-3.5 text-sky-400" />
                  {t.buildingPlans}
                </span>
                <input
                  type="checkbox"
                  checked={showBuildingPlans}
                  onChange={(e) => setShowBuildingPlans(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-0 cursor-pointer"
                />
              </label>

              {/* Location Pins & Tooltips */}
              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {language === 'hi' ? 'स्थान पिन' : 'Location Pins'}
                </span>
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* Floating Google Maps-Style Layer Button */}
        <button
          onClick={() => setIsLayersOpen(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border shadow-md transition-all cursor-pointer ${
            isLayersOpen
              ? 'bg-sky-500 text-white border-sky-400'
              : isDark
                ? 'bg-[#0f172a]/90 hover:bg-[#1e293b] border-[#334155] text-slate-200'
                : 'bg-white hover:bg-slate-50 border-[#dadce0] text-[#3c4043]'
          }`}
          title="Map Layers & Themes"
        >
          <div className="w-5 h-5 rounded-md overflow-hidden border border-white/40 flex items-center justify-center bg-gradient-to-br from-[#143820] to-[#0f1d15] text-[10px]">
            {mapTheme === 'satellite' ? '🛰️' : mapTheme === 'blueprint' ? '📐' : '🗺️'}
          </div>
          <span className="text-xs font-semibold">
            {mapTheme === 'satellite' ? t.satellite : mapTheme === 'blueprint' ? t.blueprint : t.vector}
          </span>
          <ChevronDown className="w-3 h-3 text-current" />
        </button>

        {/* Zoom In/Out & Reset View */}
        <div className={`flex flex-col rounded-xl shadow-md border overflow-hidden backdrop-blur-md ${
          isDark 
            ? 'bg-[#0f172a]/90 border-[#334155] text-slate-200' 
            : 'bg-white border-[#dadce0] text-[#5f6368]'
        }`}>
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 2.5))}
            className={`p-2.5 transition-colors border-b cursor-pointer ${
              isDark 
                ? 'hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700' 
                : 'hover:bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124] border-[#dadce0]'
            }`}
            title={t.zoomIn}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.75))}
            className={`p-2.5 transition-colors cursor-pointer ${
              isDark 
                ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                : 'hover:bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124]'
            }`}
            title={t.zoomOut}
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={resetView}
          className={`p-2.5 rounded-xl shadow-md border transition-colors cursor-pointer backdrop-blur-md ${
            isDark 
              ? 'bg-[#0f172a]/90 hover:bg-[#1e293b] border-[#334155] text-slate-300 hover:text-white' 
              : 'bg-white hover:bg-[#f1f3f4] border-[#dadce0] text-[#5f6368] hover:text-[#202124]'
          }`}
          title={t.resetView}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Map Legend Component Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-20 max-w-[calc(100%-80px)] pointer-events-auto">
        <MapLegend
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          locations={locations}
          activeRoute={activeRoute}
          theme={mapTheme}
        />
      </div>

      {/* ============================================================== */}
      {/* MOBILE-RESPONSIVE LIVE WALKING NAVIGATION HUD CARD */}
      {/* ============================================================== */}
      {isNavigating && activeRoute && (
        <div className="absolute bottom-16 sm:bottom-6 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[460px] z-30 pointer-events-auto animate-fadeIn">
          <div className={`p-3.5 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all ${
            hasArrived
              ? 'bg-[#064e3b]/95 border-emerald-500/50 text-emerald-100 ring-2 ring-emerald-500/50'
              : isDark
                ? 'bg-[#0f172a]/95 border-blue-500/40 text-white'
                : 'bg-white/95 border-blue-400 text-slate-800'
          }`}>
            {hasArrived ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                    🎯
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm leading-tight text-white">YOU HAVE ARRIVED</h4>
                    <p className="text-xs text-emerald-300 font-semibold">{activeRoute.destinationName} • 0 m</p>
                  </div>
                </div>
                <button
                  onClick={onEndNavigation}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  FINISH
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Header: Destination & Stats */}
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5 font-bold text-sky-400 truncate max-w-[240px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span>WALKING TO {activeRoute.destinationName.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-300 shrink-0">
                    <span className="text-sky-300">{distanceRemaining !== undefined ? distanceRemaining : activeRoute.totalDistance} m</span>
                    <span>•</span>
                    <span className="text-emerald-400">~{timeRemainingMinutes !== undefined ? timeRemainingMinutes : activeRoute.estimatedMinutes} min</span>
                  </div>
                </div>

                {/* Big Direction Instruction */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
                    {currentStep?.type === 'turn-left' || currentStep?.type === 'slight-left' ? (
                      '↰'
                    ) : currentStep?.type === 'turn-right' || currentStep?.type === 'slight-right' ? (
                      '↱'
                    ) : currentStep?.type === 'u-turn' ? (
                      '🔄'
                    ) : currentStep?.type === 'destination' ? (
                      '🎯'
                    ) : (
                      '⬆️'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm leading-snug line-clamp-2">
                      {currentStep?.instruction || 'Walk straight along campus path'}
                    </div>
                    {nextStep && (
                      <div className="text-[11px] text-sky-400 mt-0.5 font-semibold truncate">
                        Next: {nextStep.nextPreview || nextStep.instruction}
                      </div>
                    )}
                  </div>
                </div>

                {/* Walking Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                  <button
                    onClick={onPauseNavigation}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      isPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/15'
                    }`}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
                  </button>

                  <button
                    onClick={onRecalculateRoute}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/15 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RECALCULATE</span>
                  </button>

                  <button
                    onClick={onEndNavigation}
                    className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    END
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
