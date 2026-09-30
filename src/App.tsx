/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { CampusMap } from './components/CampusMap';
import { LocationDetailsModal } from './components/LocationDetailsModal';
import { NavigationPanel } from './components/NavigationPanel';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { DashboardView } from './components/DashboardView';
import { ExploreDirectory } from './components/ExploreDirectory';
import { AdminPanel } from './components/AdminPanel';
import { HackathonDemoModal } from './components/HackathonDemoModal';
import { SearchDialog } from './components/SearchDialog';
import { LocationShareModal } from './components/LocationShareModal';
import { SharedLocationBanner } from './components/SharedLocationBanner';
import { FriendRadarDrawer } from './components/FriendRadarDrawer';

import { 
  CampusLocation, 
  Building, 
  NavigationRoute, 
  UserProfile,
  SharedLocation
} from './types/campus';
import { INITIAL_LOCATIONS, CAMPUS_BUILDINGS } from './data/campusData';
import { calculateRoute } from './utils/dijkstra';
import { useLiveNavigation } from './hooks/useLiveNavigation';
import { fetchBackendRoute } from './services/navigationService';
import { 
  fetchLocations, 
  fetchBuildings, 
  addLocation as apiAddLocation, 
  deleteLocation as apiDeleteLocation 
} from './services/api';
import { 
  fetchActiveShares, 
  fetchShareById, 
  getLocalActiveShare 
} from './services/shareService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'map' | 'assistant' | 'dashboard' | 'directory' | 'admin'>('home');
  const [locations, setLocations] = useState<CampusLocation[]>(INITIAL_LOCATIONS);
  const [buildings, setBuildings] = useState<Building[]>(CAMPUS_BUILDINGS);
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);
  const [userNodeId, setUserNodeId] = useState<string>('node_main_gate');
  const [accessibleMode, setAccessibleMode] = useState<boolean>(false);
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSatelliteTheme, setIsSatelliteTheme] = useState<boolean>(true);

  // Real-time Live Walking Navigation Engine
  const liveNav = useLiveNavigation({
    activeRoute,
    setActiveRoute,
    allLocations: locations,
    accessibleMode,
    voiceEnabled: true,
  });

  // Location Sharing & Friend Radar State
  const [activeShares, setActiveShares] = useState<SharedLocation[]>([]);
  const [myActiveShare, setMyActiveShare] = useState<SharedLocation | null>(null);
  const [selectedSharedLocation, setSelectedSharedLocation] = useState<SharedLocation | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareModalInitialLocation, setShareModalInitialLocation] = useState<CampusLocation | null>(null);
  const [showRadarDrawer, setShowRadarDrawer] = useState<boolean>(false);

  // Modals
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    name: 'Nilu',
    role: 'Student',
    department: 'Department of Computer Applications (MCA)',
    savedFavorites: ['loc_mca_class', 'loc_comp_lab_2', 'loc_central_library'],
    recentSearches: ['MCA Classroom', 'Computer Lab 2', 'Central Library'],
  });

  // Load backend data and active shares on initial mount
  useEffect(() => {
    fetchLocations().then(data => {
      if (data && data.length > 0) setLocations(data);
    });
    fetchBuildings().then(b => {
      if (b && b.length > 0) setBuildings(b);
    });

    // Check my locally saved active share session
    const local = getLocalActiveShare();
    if (local) setMyActiveShare(local);

    // Fetch live active shares
    fetchActiveShares().then(shares => {
      if (shares && shares.length > 0) setActiveShares(shares);
    });

    // Poll active shares every 30 seconds
    const interval = setInterval(() => {
      fetchActiveShares().then(shares => {
        if (shares) setActiveShares(shares);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle URL deep-linking (?share=... or ?loc=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareQuery = urlParams.get('share');
    const locQuery = urlParams.get('loc');

    if (shareQuery) {
      fetchShareById(shareQuery).then(share => {
        if (share) {
          setSelectedSharedLocation(share);
          if (share.floor !== undefined) setSelectedFloor(share.floor);
          setCurrentTab('map');
        }
      });
    } else if (locQuery) {
      fetchLocations().then(locs => {
        const found = locs.find(l => l.id === locQuery);
        if (found) {
          setSelectedLocation(found);
          if (found.floor > 0) setSelectedFloor(found.floor);
          setCurrentTab('map');
        }
      });
    }
  }, []);

  // Recalculate route if accessibleMode changes or user origin changes
  useEffect(() => {
    if (activeRoute) {
      const updated = calculateRoute(userNodeId, activeRoute.destinationId, accessibleMode, locations);
      if (updated) setActiveRoute(updated);
    }
  }, [accessibleMode, userNodeId, locations]);

  // Keyboard shortcut for Search Dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchDialog(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Location Select
  const handleSelectLocation = (loc: CampusLocation) => {
    setSelectedLocation(loc);
    if (loc.floor > 0) {
      setSelectedFloor(loc.floor);
    }
  };

  // Handle Start Navigation (supports backend routing, live GPS origin, or custom origin)
  const handleStartNavigation = async (loc: CampusLocation, customSourceId?: string, autoStartLive = false) => {
    const startLocation = customSourceId
      ? { nodeId: customSourceId }
      : liveNav.userPosition
      ? { latitude: liveNav.userPosition.latitude, longitude: liveNav.userPosition.longitude }
      : { nodeId: userNodeId };

    const route = await fetchBackendRoute({
      startLocation,
      destination: { id: loc.id, name: loc.name },
      accessibleMode,
    }, locations);

    if (route) {
      setActiveRoute(route);
      setSelectedLocation(loc);
      if (loc.floor > 0) {
        setSelectedFloor(loc.floor);
      }
      setCurrentTab('map');
      if (autoStartLive) {
        liveNav.startNavigation();
      }
    }
  };

  // Swap Route Direction (Reverse Start & Destination)
  const handleSwapRouteDirection = () => {
    if (!activeRoute) return;
    const oldSourceLoc = locations.find(l => l.nodeId === activeRoute.sourceId || l.id === activeRoute.sourceId);
    const oldDestLoc = locations.find(l => l.id === activeRoute.destinationId);
    if (oldDestLoc) {
      const newSourceNode = oldDestLoc.nodeId;
      const targetLoc = oldSourceLoc || locations.find(l => l.nodeId === activeRoute.sourceId) || locations[0];
      if (targetLoc) {
        handleStartNavigation(targetLoc, newSourceNode);
      }
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (locId: string) => {
    setUser(prev => {
      const exists = prev.savedFavorites.includes(locId);
      return {
        ...prev,
        savedFavorites: exists
          ? prev.savedFavorites.filter(id => id !== locId)
          : [...prev.savedFavorites, locId],
      };
    });
  };

  // Location Sharing Handlers
  const handleOpenShareModal = (initialLoc?: CampusLocation | null) => {
    setShareModalInitialLocation(initialLoc || selectedLocation || null);
    setShowShareModal(true);
  };

  const handleShareCreated = (share: SharedLocation) => {
    setMyActiveShare(share);
    setActiveShares(prev => [share, ...prev.filter(s => s.id !== share.id)]);
  };

  const handleShareEnded = () => {
    setMyActiveShare(null);
  };

  const handleSelectSharedLocation = (share: SharedLocation) => {
    setSelectedSharedLocation(share);
    if (share.floor !== undefined) {
      setSelectedFloor(share.floor);
    }
    setCurrentTab('map');
  };

  const handleNavigateToSharedLocation = (share: SharedLocation) => {
    // If matched to an existing campus location, use that directly
    if (share.locationId) {
      const loc = locations.find(l => l.id === share.locationId);
      if (loc) {
        handleStartNavigation(loc);
        return;
      }
    }

    // Otherwise calculate route to share's nodeId or nearest node
    const targetNodeId = share.nodeId || 'node_canteen';
    const route = calculateRoute(userNodeId, targetNodeId, accessibleMode, locations);
    if (route) {
      const updatedRoute: NavigationRoute = {
        ...route,
        destinationName: `${share.senderName} (${share.title})`,
      };
      setActiveRoute(updatedRoute);
      if (share.floor !== undefined) {
        setSelectedFloor(share.floor);
      }
      setCurrentTab('map');
    }
  };

  const handleDropPinToShare = (coords: { x: number; y: number }) => {
    const syntheticLoc: CampusLocation = {
      id: `custom_pin_${Date.now()}`,
      name: 'Custom Meetup Spot',
      code: 'PIN-MEET',
      category: 'Administrative',
      building: 'Campus Plaza Grounds',
      buildingId: 'acad_b',
      floor: selectedFloor,
      coordinates: coords,
      nodeId: userNodeId || 'node_central_plaza',
      description: `Custom dropped meetup pin at coordinates (${coords.x}, ${coords.y}) on Floor ${selectedFloor}.`,
      openingHours: 'Always Open',
      accessibility: { wheelchair: true, elevatorAvailable: true },
      tags: ['meetup', 'shared-pin'],
    };
    handleOpenShareModal(syntheticLoc);
  };

  // Admin Actions
  const handleAddLocation = async (newLoc: Partial<CampusLocation>) => {
    const created = await apiAddLocation(newLoc);
    if (created) {
      setLocations(prev => [created, ...prev]);
    } else {
      // Local fallback
      const fallbackLoc: CampusLocation = {
        id: `loc_${Date.now()}`,
        name: newLoc.name || 'New Location',
        code: newLoc.code || 'LOC-NEW',
        category: newLoc.category || 'Classroom',
        building: newLoc.building || 'Academic Block B',
        buildingId: newLoc.buildingId || 'acad_b',
        floor: newLoc.floor ?? 1,
        room: newLoc.room,
        coordinates: newLoc.coordinates || { x: 500, y: 400 },
        nodeId: newLoc.nodeId || 'node_central_plaza',
        description: newLoc.description || '',
        openingHours: newLoc.openingHours || '8:00 AM – 6:00 PM',
        accessibility: newLoc.accessibility || { wheelchair: true, elevatorAvailable: true },
        tags: newLoc.tags || [],
      };
      setLocations(prev => [fallbackLoc, ...prev]);
    }
  };

  const handleEditLocation = (id: string, updated: Partial<CampusLocation>) => {
    setLocations(prev => prev.map(l => (l.id === id ? { ...l, ...updated } : l)));
  };

  const handleDeleteLocation = async (id: string) => {
    await apiDeleteLocation(id);
    setLocations(prev => prev.filter(l => l.id !== id));
    if (selectedLocation?.id === id) setSelectedLocation(null);
    if (activeRoute?.destinationId === id) setActiveRoute(null);
  };

  // Demo step dispatcher for Hackathon presentation
  const handleExecuteDemoStep = (stepNumber: number) => {
    const library = locations.find(l => l.id === 'loc_central_library') || locations[0];
    
    if (stepNumber === 1) {
      setCurrentTab('map');
      setActiveRoute(null);
      setSelectedLocation(null);
      liveNav.endNavigation();
    } else if (stepNumber === 2) {
      setCurrentTab('assistant');
    } else if (stepNumber === 3) {
      handleSelectLocation(library);
      setCurrentTab('map');
    } else if (stepNumber === 4) {
      handleStartNavigation(library);
    } else if (stepNumber === 5) {
      liveNav.startDemoNavigation();
    } else if (stepNumber === 6) {
      liveNav.triggerArrival();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-['Roboto',sans-serif]">
      {/* Google-grade Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        setUser={setUser}
        accessibleMode={accessibleMode}
        setAccessibleMode={setAccessibleMode}
        onOpenDemo={() => setShowDemoModal(true)}
        onOpenSearch={() => setShowSearchDialog(true)}
        onOpenShareModal={() => handleOpenShareModal()}
        activeShare={myActiveShare}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {/* TAB 1: HOME VIEW */}
        {currentTab === 'home' && (
          <HomeHero
            locations={locations}
            onSearchSelect={(loc) => {
              handleSelectLocation(loc);
              handleStartNavigation(loc);
            }}
            onExploreMap={() => setCurrentTab('map')}
            onOpenAssistant={() => setCurrentTab('assistant')}
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              setCurrentTab('map');
            }}
            onOpenDemo={() => setShowDemoModal(true)}
          />
        )}

        {/* TAB 2: CAMPUS MAP & NAVIGATION VIEW */}
        {currentTab === 'map' && (
          <div className={`flex-1 w-full transition-colors duration-300 ${isSatelliteTheme ? 'bg-[#0a0f16]' : 'bg-[#f8f9fa]'} p-3 sm:p-6`}>
            {/* Top Shared Location Meetup Banner (If opened from share link or friend selected) */}
            {selectedSharedLocation && (
              <div className="max-w-7xl mx-auto mb-4">
                <SharedLocationBanner
                  share={selectedSharedLocation}
                  onNavigateToFriend={handleNavigateToSharedLocation}
                  onFocusFriend={(share) => {
                    if (share.floor !== undefined) setSelectedFloor(share.floor);
                  }}
                  onDismiss={() => setSelectedSharedLocation(null)}
                  isSatelliteTheme={isSatelliteTheme}
                />
              </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Map Canvas: 7 cols on large screens, or 8 cols when no route */}
              <div className="lg:col-span-8 flex flex-col h-[650px] lg:h-[720px]">
                <CampusMap
                  buildings={buildings}
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onSelectLocation={handleSelectLocation}
                  activeRoute={activeRoute}
                  userNodeId={userNodeId}
                  selectedFloor={selectedFloor}
                  setSelectedFloor={setSelectedFloor}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  isSatelliteTheme={isSatelliteTheme}
                  onToggleSatelliteTheme={setIsSatelliteTheme}
                  onStartNavigation={handleStartNavigation}
                  onUpdateDestination={(destId) => {
                    const dest = locations.find(l => l.id === destId);
                    if (dest) handleStartNavigation(dest, activeRoute?.sourceId || userNodeId);
                  }}
                  onUpdateSource={(src) => setUserNodeId(src)}
                  onCancelNavigation={() => {
                    liveNav.endNavigation();
                    setActiveRoute(null);
                  }}
                  onSwapDirection={handleSwapRouteDirection}
                  onToggleWalkingSimulation={() => {
                    if (liveNav.isNavigating) {
                      liveNav.endNavigation();
                    } else {
                      liveNav.startDemoNavigation();
                    }
                  }}
                  accessibleMode={accessibleMode}
                  sharedLocations={activeShares}
                  myActiveShare={myActiveShare}
                  onOpenShareModal={handleOpenShareModal}
                  onOpenRadar={() => setShowRadarDrawer(true)}
                  onSelectShare={handleSelectSharedLocation}
                  selectedShare={selectedSharedLocation}
                  onDropPinToShare={handleDropPinToShare}

                  // Live Navigation props
                  userPosition={liveNav.userPosition}
                  isNavigating={liveNav.isNavigating}
                  isPaused={liveNav.isPaused}
                  isDemoMode={liveNav.isDemoMode}
                  currentStep={liveNav.currentStep}
                  nextStep={liveNav.nextStep}
                  distanceRemaining={liveNav.distanceRemaining}
                  timeRemainingMinutes={liveNav.timeRemainingMinutes}
                  hasArrived={liveNav.hasArrived}
                  isGpsLowAccuracy={liveNav.isGpsLowAccuracy}
                  onPauseNavigation={liveNav.pauseNavigation}
                  onRecalculateRoute={liveNav.triggerRecalculate}
                  onEndNavigation={liveNav.endNavigation}
                />
              </div>

              {/* Side Panel: 4 cols for Location Details or Turn-by-Turn Route or Assistant */}
              <div className="lg:col-span-4 flex flex-col h-fit lg:max-h-[720px]">
                {activeRoute ? (
                  <NavigationPanel
                    route={activeRoute}
                    allLocations={locations}
                    onClose={() => {
                      liveNav.endNavigation();
                      setActiveRoute(null);
                    }}
                    onUpdateSource={(src) => setUserNodeId(src)}
                    onUpdateDestination={(destId) => {
                      const dest = locations.find(l => l.id === destId);
                      if (dest) handleStartNavigation(dest);
                    }}
                    accessibleMode={accessibleMode}
                    setAccessibleMode={setAccessibleMode}
                    isSatelliteTheme={isSatelliteTheme}

                    // Real-time walking navigation controls
                    isNavigating={liveNav.isNavigating}
                    isPaused={liveNav.isPaused}
                    isDemoMode={liveNav.isDemoMode}
                    demoSpeed={liveNav.demoSpeed}
                    setDemoSpeed={liveNav.setDemoSpeed}
                    userPosition={liveNav.userPosition}
                    currentStepIndex={liveNav.currentStepIndex}
                    currentStep={liveNav.currentStep}
                    nextStep={liveNav.nextStep}
                    distanceRemaining={liveNav.distanceRemaining}
                    timeRemainingMinutes={liveNav.timeRemainingMinutes}
                    hasArrived={liveNav.hasArrived}
                    isRecalculating={liveNav.isRecalculating}
                    isGpsLowAccuracy={liveNav.isGpsLowAccuracy}
                    gpsError={liveNav.gpsError}
                    statusNotification={liveNav.statusNotification}
                    onStartNavigation={liveNav.startNavigation}
                    onPauseNavigation={liveNav.pauseNavigation}
                    onRecalculateRoute={liveNav.triggerRecalculate}
                    onEndNavigation={liveNav.endNavigation}
                    onStartDemoNavigation={liveNav.startDemoNavigation}
                  />
                ) : selectedLocation ? (
                  <LocationDetailsModal
                    location={selectedLocation}
                    onClose={() => setSelectedLocation(null)}
                    onStartNavigation={handleStartNavigation}
                    isFavorite={user.savedFavorites.includes(selectedLocation.id)}
                    onToggleFavorite={handleToggleFavorite}
                    isSatelliteTheme={isSatelliteTheme}
                    onOpenShareModal={handleOpenShareModal}
                  />
                ) : (
                  <AIAssistantDrawer
                    onStartNavigation={handleStartNavigation}
                    userLocationNodeId={userNodeId}
                    allLocations={locations}
                    isSatelliteTheme={isSatelliteTheme}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEDICATED AI ASSISTANT VIEW */}
        {currentTab === 'assistant' && (
          <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col">
            <AIAssistantDrawer
              onStartNavigation={(loc) => {
                handleStartNavigation(loc);
                setCurrentTab('map');
              }}
              userLocationNodeId={userNodeId}
              allLocations={locations}
              isFullPage
            />
          </div>
        )}

        {/* TAB 4: DASHBOARD VIEW */}
        {currentTab === 'dashboard' && (
          <DashboardView
            user={user}
            locations={locations}
            onOpenMap={() => setCurrentTab('map')}
            onOpenAssistant={() => setCurrentTab('assistant')}
            onSelectLocation={(loc) => {
              handleSelectLocation(loc);
              setCurrentTab('map');
            }}
            onStartNavigation={(loc) => {
              handleStartNavigation(loc);
              setCurrentTab('map');
            }}
          />
        )}

        {/* TAB 5: DIRECTORY EXPLORER */}
        {currentTab === 'directory' && (
          <ExploreDirectory
            locations={locations}
            buildings={buildings}
            onSelectLocation={(loc) => {
              handleSelectLocation(loc);
              setCurrentTab('map');
            }}
            onStartNavigation={(loc) => {
              handleStartNavigation(loc);
              setCurrentTab('map');
            }}
            onOpenShareModal={handleOpenShareModal}
          />
        )}

        {/* TAB 6: ADMIN PANEL */}
        {currentTab === 'admin' && (
          <AdminPanel
            locations={locations}
            buildings={buildings}
            onAddLocation={handleAddLocation}
            onEditLocation={handleEditLocation}
            onDeleteLocation={handleDeleteLocation}
          />
        )}
      </main>

      {/* Global Hackathon Presentation Modal */}
      <HackathonDemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        locations={locations}
        onExecuteDemoStep={handleExecuteDemoStep}
      />

      {/* Global Search Palette (Ctrl + K) */}
      <SearchDialog
        isOpen={showSearchDialog}
        onClose={() => setShowSearchDialog(false)}
        locations={locations}
        onSelectLocation={(loc) => {
          handleSelectLocation(loc);
          setCurrentTab('map');
        }}
        onStartNavigation={(loc) => {
          handleStartNavigation(loc);
          setCurrentTab('map');
        }}
      />

      {/* Location Sharing Dialog (Live Share, Meetup Note, WhatsApp, QR Code) */}
      <LocationShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        user={user}
        locations={locations}
        activeShare={myActiveShare}
        onShareCreated={handleShareCreated}
        onShareEnded={handleShareEnded}
        initialLocation={shareModalInitialLocation}
        currentUserNodeId={userNodeId}
        isSatelliteTheme={isSatelliteTheme}
      />

      {/* Campus Live Radar (Active Friends, Faculty, Classmates) */}
      <FriendRadarDrawer
        isOpen={showRadarDrawer}
        onClose={() => setShowRadarDrawer(false)}
        shares={activeShares}
        onSelectShare={(share) => {
          handleSelectSharedLocation(share);
          setShowRadarDrawer(false);
        }}
        onNavigateToShare={(share) => {
          handleNavigateToSharedLocation(share);
          setShowRadarDrawer(false);
        }}
        onOpenShareModal={() => {
          setShowRadarDrawer(false);
          handleOpenShareModal();
        }}
        myActiveShare={myActiveShare}
        isSatelliteTheme={isSatelliteTheme}
      />
    </div>
  );
}
