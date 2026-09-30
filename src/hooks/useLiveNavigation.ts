import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  NavigationRoute, 
  NavigationStep, 
  UserLivePosition, 
  LiveNavigationState,
  CampusLocation
} from '../types/campus';
import { 
  fetchBackendRoute, 
  recalculateBackendRoute, 
  syncLocationWithBackend 
} from '../services/navigationService';

// Bounds to convert lat/lng to canvas
const CAMPUS_GEO_BOUNDS = {
  minLat: 20.24750,
  minLng: 85.79600,
  maxLat: 20.25330,
  maxLng: 85.80320,
  canvasWidth: 1000,
  canvasHeight: 800,
};

function latLngToCanvas(lat: number, lng: number): { x: number; y: number } {
  const { minLat, maxLat, minLng, maxLng, canvasWidth, canvasHeight } = CAMPUS_GEO_BOUNDS;
  const clampedLat = Math.max(minLat, Math.min(maxLat, lat));
  const clampedLng = Math.max(minLng, Math.min(maxLng, lng));
  const normY = (maxLat - clampedLat) / (maxLat - minLat);
  const normX = (clampedLng - minLng) / (maxLng - minLng);
  return {
    x: Math.round(normX * canvasWidth),
    y: Math.round(normY * canvasHeight),
  };
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) *
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface UseLiveNavigationProps {
  activeRoute: NavigationRoute | null;
  setActiveRoute: (route: NavigationRoute | null) => void;
  allLocations: CampusLocation[];
  accessibleMode: boolean;
  voiceEnabled: boolean;
}

export function useLiveNavigation({
  activeRoute,
  setActiveRoute,
  allLocations,
  accessibleMode,
  voiceEnabled,
}: UseLiveNavigationProps) {
  // Navigation active state
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoSpeed, setDemoSpeed] = useState<number>(1); // 1x or 2x

  // Live Location
  const [userPosition, setUserPosition] = useState<UserLivePosition>({
    latitude: 20.24840,
    longitude: 85.79940,
    accuracy: 5,
    timestamp: Date.now(),
    canvas: { x: 490, y: 730 },
  });

  // Current turn instruction & progress
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState<number>(0);
  const [timeRemainingMinutes, setTimeRemainingMinutes] = useState<number>(0);
  const [hasArrived, setHasArrived] = useState(false);

  // Status Alerts & Warnings
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{
    message: string;
    sub?: string;
    type: 'info' | 'success' | 'warning' | 'reroute';
  } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isGpsLowAccuracy, setIsGpsLowAccuracy] = useState(false);

  // Refs for tracking
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<UserLivePosition>(userPosition);
  const lastSpokenStepRef = useRef<number>(-1);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const demoSubStepRef = useRef<number>(0);

  // Speech helper
  const speakInstruction = useCallback(
    (text: string) => {
      if (!voiceEnabled || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled]
  );

  // Initialize remaining distance when route changes
  useEffect(() => {
    if (activeRoute) {
      setDistanceRemaining(activeRoute.totalDistance);
      setTimeRemainingMinutes(activeRoute.estimatedMinutes);
      setCurrentStepIndex(0);
      setHasArrived(false);
      lastSpokenStepRef.current = -1;
    }
  }, [activeRoute]);

  // Recalculate route on demand or when off-route
  const triggerRecalculate = useCallback(
    async (reason = 'Manual recalculation requested') => {
      if (!activeRoute) return;
      setIsRecalculating(true);
      setStatusNotification({
        message: 'Route updated',
        sub: 'Finding a better route...',
        type: 'reroute',
      });

      try {
        const newRoute = await recalculateBackendRoute({
          currentLocation: {
            latitude: userPosition.latitude,
            longitude: userPosition.longitude,
          },
          destinationId: activeRoute.destinationId,
          accessibleMode,
          reason,
        });

        if (newRoute) {
          setActiveRoute(newRoute);
          setCurrentStepIndex(0);
          setDistanceRemaining(newRoute.totalDistance);
          setTimeRemainingMinutes(newRoute.estimatedMinutes);
          speakInstruction(`Route updated. ${newRoute.steps[0].instruction}`);
          setStatusNotification({
            message: 'New Shortest Route Found',
            sub: `${newRoute.totalDistance} m • ${newRoute.estimatedMinutes} min`,
            type: 'success',
          });
        }
      } catch (err) {
        console.error('Recalculation error:', err);
      } finally {
        setIsRecalculating(false);
        setTimeout(() => setStatusNotification(null), 4000);
      }
    },
    [activeRoute, userPosition, accessibleMode, setActiveRoute, speakInstruction]
  );

  // Handle GPS Position Update with Smoothing
  const handlePositionUpdate = useCallback(
    (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy, heading, speed } = pos.coords;

      // Accuracy check: if poor, notify user
      if (accuracy > 35) {
        setIsGpsLowAccuracy(true);
      } else {
        setIsGpsLowAccuracy(false);
      }

      // GPS smoothing: ignore movements < 2 meters unless heading changed significantly
      const prev = lastPositionRef.current;
      const distFromPrev = haversineMeters(prev.latitude, prev.longitude, latitude, longitude);
      if (distFromPrev < 2.0 && accuracy > 10) {
        return; // Filter out GPS jitter
      }

      const canvas = latLngToCanvas(latitude, longitude);
      const newPos: UserLivePosition = {
        latitude,
        longitude,
        accuracy,
        timestamp: pos.timestamp || Date.now(),
        heading,
        speed,
        canvas,
        isSimulated: false,
      };

      lastPositionRef.current = newPos;
      setUserPosition(newPos);
      setGpsError(null);

      // If active navigation is in progress, sync with backend
      if (isNavigating && !isPaused && activeRoute && !hasArrived) {
        syncLocationWithBackend({
          latitude,
          longitude,
          accuracy,
          timestamp: newPos.timestamp,
          routeId: activeRoute.routeId,
          destinationId: activeRoute.destinationId,
          currentStepIndex,
          accessibleMode,
        }).then(res => {
          if (!res) return;

          // Check if user has arrived
          if (res.navigationState?.hasArrived) {
            triggerArrival();
            return;
          }

          // Check if auto-recalculate triggered by backend deviation
          if (res.shouldRecalculate && res.recalculatedRoute) {
            setActiveRoute(res.recalculatedRoute);
            setCurrentStepIndex(0);
            speakInstruction(`Route updated. ${res.recalculatedRoute.steps[0].instruction}`);
            setStatusNotification({
              message: 'Route updated',
              sub: 'Finding a better route...',
              type: 'reroute',
            });
            setTimeout(() => setStatusNotification(null), 3500);
            return;
          }

          // Advance step index and update distance
          if (res.navigationState) {
            const nextIdx = res.navigationState.currentStepIndex;
            setCurrentStepIndex(nextIdx);
            setDistanceRemaining(res.navigationState.distanceRemainingMeters);
            setTimeRemainingMinutes(res.navigationState.estimatedMinutesRemaining);

            if (nextIdx !== lastSpokenStepRef.current && activeRoute.steps[nextIdx]) {
              lastSpokenStepRef.current = nextIdx;
              speakInstruction(activeRoute.steps[nextIdx].instruction);
            }
          }
        });
      }
    },
    [isNavigating, isPaused, activeRoute, hasArrived, currentStepIndex, accessibleMode, setActiveRoute, speakInstruction]
  );

  // Trigger arrival state
  const triggerArrival = useCallback(() => {
    setHasArrived(true);
    setIsNavigating(false);
    setIsDemoMode(false);
    setDistanceRemaining(0);
    setTimeRemainingMinutes(0);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (activeRoute) {
      speakInstruction(`You have arrived at ${activeRoute.destinationName}`);
    }

    setStatusNotification({
      message: '🎯 YOU HAVE ARRIVED',
      sub: activeRoute ? activeRoute.destinationName : 'Destination reached',
      type: 'success',
    });
  }, [activeRoute, speakInstruction]);

  // Start continuous GPS tracking via navigator.geolocation.watchPosition
  const startGpsWatching = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 12000,
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        err => {
          console.warn('Geolocation error:', err.message);
          if (err.code === err.PERMISSION_DENIED) {
            setGpsError('Location permission is required for live walking navigation.');
          } else {
            setGpsError('Unable to access your current location. Move to an open area.');
          }
        },
        options
      );
    } catch (e: any) {
      setGpsError(e.message || 'Unable to start GPS tracking.');
    }
  }, [handlePositionUpdate]);

  // Stop GPS watching
  const stopGpsWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // START NAVIGATION
  const startNavigation = useCallback(() => {
    if (!activeRoute) return;
    setIsNavigating(true);
    setIsPaused(false);
    setIsDemoMode(false);
    setHasArrived(false);
    setCurrentStepIndex(0);
    setDistanceRemaining(activeRoute.totalDistance);
    setTimeRemainingMinutes(activeRoute.estimatedMinutes);

    startGpsWatching();

    const firstStep = activeRoute.steps[0];
    if (firstStep) {
      speakInstruction(`Starting navigation to ${activeRoute.destinationName}. ${firstStep.instruction}`);
    }
  }, [activeRoute, startGpsWatching, speakInstruction]);

  // PAUSE NAVIGATION
  const pauseNavigation = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // END NAVIGATION
  const endNavigation = useCallback(() => {
    setIsNavigating(false);
    setIsPaused(false);
    setIsDemoMode(false);
    setHasArrived(false);
    stopGpsWatching();
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    window.speechSynthesis?.cancel();
  }, [stopGpsWatching]);

  // DEMO / SIMULATION MODE FOR PRESENTATION
  const startDemoNavigation = useCallback(() => {
    if (!activeRoute || activeRoute.steps.length === 0) return;

    setIsNavigating(true);
    setIsPaused(false);
    setIsDemoMode(true);
    setHasArrived(false);
    setCurrentStepIndex(0);
    demoSubStepRef.current = 0;
    stopGpsWatching();

    const nodes = activeRoute.pathNodes;
    if (nodes.length === 0) return;

    // Set user to first node
    const startNode = nodes[0];
    setUserPosition({
      latitude: startNode.lat || 20.24840,
      longitude: startNode.lng || 85.79940,
      accuracy: 3,
      timestamp: Date.now(),
      canvas: { x: startNode.x, y: startNode.y },
      isSimulated: true,
    });

    const firstStep = activeRoute.steps[0];
    speakInstruction(`Starting demo navigation to ${activeRoute.destinationName}. ${firstStep.instruction}`);

    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
    }

    // Step through route nodes smoothly
    let stepIndex = 0;
    const intervalMs = Math.round(3000 / demoSpeed);

    demoIntervalRef.current = setInterval(() => {
      stepIndex += 1;

      if (stepIndex >= activeRoute.steps.length) {
        if (demoIntervalRef.current) {
          clearInterval(demoIntervalRef.current);
          demoIntervalRef.current = null;
        }
        triggerArrival();
        return;
      }

      setCurrentStepIndex(stepIndex);
      const activeStep = activeRoute.steps[stepIndex];
      const matchedNode = activeRoute.pathNodes[Math.min(stepIndex, activeRoute.pathNodes.length - 1)];

      if (matchedNode) {
        setUserPosition({
          latitude: matchedNode.lat || 20.25000,
          longitude: matchedNode.lng || 85.79900,
          accuracy: 2,
          timestamp: Date.now(),
          canvas: { x: matchedNode.x, y: matchedNode.y },
          isSimulated: true,
        });
      }

      // Calculate remaining distance
      let remaining = 0;
      for (let i = stepIndex; i < activeRoute.steps.length; i++) {
        remaining += activeRoute.steps[i].distance;
      }
      setDistanceRemaining(remaining);
      setTimeRemainingMinutes(Math.max(1, Math.ceil((remaining / 1.35) / 60)));

      if (activeStep) {
        speakInstruction(activeStep.instruction);
      }
    }, intervalMs);
  }, [activeRoute, demoSpeed, stopGpsWatching, speakInstruction, triggerArrival]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      stopGpsWatching();
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  }, [stopGpsWatching]);

  return {
    isNavigating,
    isPaused,
    isDemoMode,
    demoSpeed,
    setDemoSpeed,
    userPosition,
    setUserPosition,
    currentStepIndex,
    currentStep: activeRoute?.steps[currentStepIndex] || activeRoute?.steps[0] || null,
    nextStep: activeRoute?.steps[currentStepIndex + 1] || null,
    distanceRemaining,
    timeRemainingMinutes,
    hasArrived,
    isRecalculating,
    statusNotification,
    setStatusNotification,
    gpsError,
    isGpsLowAccuracy,
    startNavigation,
    pauseNavigation,
    endNavigation,
    startDemoNavigation,
    triggerRecalculate,
    triggerArrival,
    startGpsWatching,
  };
}
