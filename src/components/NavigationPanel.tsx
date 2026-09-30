import React, { useState, useEffect } from 'react';
import { 
  X, 
  Navigation, 
  CornerUpRight, 
  CornerUpLeft, 
  ArrowUp, 
  RotateCw,
  RotateCcw,
  Footprints, 
  Building, 
  CheckCircle2, 
  Flame, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  RefreshCw,
  Sparkles,
  Accessibility,
  Radio,
  AlertTriangle,
  LocateFixed,
  MapPin,
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NavigationRoute, CampusLocation, NavigationStep, UserLivePosition, StepDirectionType } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';

interface NavigationPanelProps {
  route: NavigationRoute | null;
  allLocations: CampusLocation[];
  onClose: () => void;
  onUpdateSource: (sourceNodeId: string) => void;
  onUpdateDestination: (destLocationId: string) => void;
  accessibleMode: boolean;
  setAccessibleMode: (val: boolean) => void;
  isSatelliteTheme?: boolean;

  // Real-time navigation & Demo controls from hook
  isNavigating?: boolean;
  isPaused?: boolean;
  isDemoMode?: boolean;
  demoSpeed?: number;
  setDemoSpeed?: (speed: number) => void;
  userPosition?: UserLivePosition;
  currentStepIndex?: number;
  currentStep?: NavigationStep | null;
  nextStep?: NavigationStep | null;
  distanceRemaining?: number;
  timeRemainingMinutes?: number;
  hasArrived?: boolean;
  isRecalculating?: boolean;
  isGpsLowAccuracy?: boolean;
  gpsError?: string | null;
  statusNotification?: { message: string; sub?: string; type: 'info' | 'success' | 'warning' | 'reroute' } | null;

  onStartNavigation?: () => void;
  onPauseNavigation?: () => void;
  onRecalculateRoute?: () => void;
  onEndNavigation?: () => void;
  onStartDemoNavigation?: () => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  route,
  allLocations,
  onClose,
  onUpdateSource,
  onUpdateDestination,
  accessibleMode,
  setAccessibleMode,
  isSatelliteTheme = true,

  isNavigating = false,
  isPaused = false,
  isDemoMode = false,
  demoSpeed = 1,
  setDemoSpeed,
  userPosition,
  currentStepIndex = 0,
  currentStep,
  nextStep,
  distanceRemaining,
  timeRemainingMinutes,
  hasArrived = false,
  isRecalculating = false,
  isGpsLowAccuracy = false,
  gpsError = null,
  statusNotification = null,

  onStartNavigation,
  onPauseNavigation,
  onRecalculateRoute,
  onEndNavigation,
  onStartDemoNavigation,
}) => {
  const { t, language, locName, landmarkLabel, localizeStepInstruction, floorLabel } = useLanguage();
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Available starting landmarks
  const startingLandmarks = [
    { id: 'node_main_gate', label: landmarkLabel('node_main_gate', 'Main Gate Entrance (You Are Here)') },
    { id: 'node_parking_entrance', label: landmarkLabel('node_parking_entrance', 'North-West Parking Plaza') },
    { id: 'node_hostel_b_entrance', label: landmarkLabel('node_hostel_b_entrance', "Boys' Hostel Residence") },
    { id: 'node_hostel_g_entrance', label: landmarkLabel('node_hostel_g_entrance', "Girls' Hostel Residence") },
    { id: 'node_canteen_entrance', label: landmarkLabel('node_canteen_entrance', 'Campus Canteen & Student Hub') },
    { id: 'node_central_plaza', label: landmarkLabel('node_central_plaza', 'Central Circle Plaza') },
  ];

  if (!route) return null;

  const isSat = isSatelliteTheme;
  const activeDistance = distanceRemaining !== undefined ? distanceRemaining : route.totalDistance;
  const activeMinutes = timeRemainingMinutes !== undefined ? timeRemainingMinutes : route.estimatedMinutes;
  const stepsCount = Math.round(activeDistance * 1.35); // estimated walking paces
  const caloriesBurned = Math.round(activeDistance * 0.045); // estimated calories

  const activeStep = currentStep || route.steps[currentStepIndex] || route.steps[0];
  const upcomingStep = nextStep || route.steps[currentStepIndex + 1];

  return (
    <div 
      className={`w-full rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all ${
        isSat
          ? 'bg-[#121924] border-white/10 text-slate-100'
          : 'bg-white border-[#dadce0] text-[#202124]'
      }`}
    >
      {/* Top Header: Route Inputs & Controls */}
      <div 
        className={`p-4 relative border-b ${
          isSat
            ? 'bg-[#182332] border-white/10'
            : 'bg-[#f8f9fa] border-[#dadce0]'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-3.5 right-3.5 p-1 rounded-full transition-colors cursor-pointer ${
            isSat
              ? 'text-slate-400 hover:text-white hover:bg-white/10'
              : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed]'
          }`}
          title="Exit navigation"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-[#1a73e8] text-white flex items-center justify-center shadow-sm">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <span className={`text-xs font-bold font-['Google_Sans',sans-serif] ${isSat ? 'text-white' : 'text-[#202124]'}`}>
            {t.turnByTurnRoute}
          </span>
          {isDemoMode ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold animate-pulse border border-amber-500/30">
              SIMULATION / DEMO
            </span>
          ) : isNavigating ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE GPS TRACKING
            </span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-[#38bdf8] font-mono">
              BACKEND A* ROUTING
            </span>
          )}
        </div>

        {/* Origin & Destination pickers */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center justify-center py-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] ring-2 ring-[#38bdf8]/30" />
            <div className={`w-0.5 h-6 my-0.5 ${isSat ? 'bg-slate-600' : 'bg-[#dadce0]'}`} />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] ring-2 ring-[#ef4444]/30" />
          </div>

          <div className="flex-1 space-y-2">
            {/* Origin Select */}
            <select
              value={route.sourceId}
              disabled={isNavigating}
              onChange={(e) => onUpdateSource(e.target.value)}
              className={`w-full text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none transition-colors ${
                isNavigating ? 'opacity-70 cursor-not-allowed' : ''
              } ${
                isSat
                  ? 'bg-[#10151f] text-slate-200 border border-white/15 focus:border-[#38bdf8]'
                  : 'bg-white text-[#202124] border border-[#dadce0] focus:border-[#1a73e8]'
              }`}
            >
              {startingLandmarks.map(lm => (
                <option key={lm.id} value={lm.id} className={isSat ? 'bg-[#121924] text-white' : ''}>
                  {lm.label}
                </option>
              ))}
            </select>

            {/* Destination Select */}
            <select
              value={route.destinationId}
              disabled={isNavigating}
              onChange={(e) => onUpdateDestination(e.target.value)}
              className={`w-full text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none transition-colors ${
                isNavigating ? 'opacity-70 cursor-not-allowed' : ''
              } ${
                isSat
                  ? 'bg-[#10151f] text-slate-100 border border-white/15 focus:border-[#38bdf8]'
                  : 'bg-white text-[#202124] border border-[#dadce0] focus:border-[#1a73e8]'
              }`}
            >
              {allLocations.map(loc => (
                <option key={loc.id} value={loc.id} className={isSat ? 'bg-[#121924] text-white' : ''}>
                  {locName(loc)} ({loc.building})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Accessible Mode & Voice Toggles */}
        <div className={`flex items-center justify-between mt-3 pt-2.5 border-t ${
          isSat ? 'border-white/10' : 'border-[#e8eaed]'
        }`}>
          <button
            onClick={() => setAccessibleMode(!accessibleMode)}
            className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md transition-colors cursor-pointer ${
              accessibleMode
                ? isSat
                  ? 'bg-[#064e3b]/80 text-[#6ee7b7]'
                  : 'bg-[#e6f4ea] text-[#137333]'
                : isSat
                  ? 'text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  : 'text-[#5f6368] hover:bg-[#e8eaed]'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>{accessibleMode ? t.wheelchairElevatorsOnly : t.standardWalking}</span>
          </button>

          <div className="flex items-center gap-2">
            {isDemoMode && setDemoSpeed && (
              <button
                onClick={() => setDemoSpeed(demoSpeed === 1 ? 2 : 1)}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer"
                title="Toggle simulation speed"
              >
                Speed: {demoSpeed}x
              </button>
            )}

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-1 transition-colors cursor-pointer ${
                isSat ? 'text-slate-400 hover:text-white' : 'text-[#5f6368] hover:text-[#202124]'
              }`}
              title={voiceEnabled ? 'Mute voice instructions' : 'Enable voice instructions'}
            >
              {voiceEnabled ? (
                <Volume2 className={`w-3.5 h-3.5 ${isSat ? 'text-[#38bdf8]' : 'text-[#1a73e8]'}`} />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* GPS Low Accuracy Warning */}
      {isGpsLowAccuracy && !isDemoMode && (
        <div className="px-3 py-2 bg-amber-950/90 border-b border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>GPS accuracy is low. Move to an open area for better navigation.</span>
        </div>
      )}

      {/* GPS Error Banner */}
      {gpsError && (
        <div className="px-3 py-2 bg-rose-950/90 border-b border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{gpsError}</span>
          </div>
          <button
            onClick={onStartNavigation}
            className="text-[10px] underline font-bold hover:text-white cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Dynamic Status / Recalculation Alert */}
      {statusNotification && (
        <div className={`px-3 py-2 border-b flex items-center gap-2 text-xs font-semibold ${
          statusNotification.type === 'reroute'
            ? 'bg-sky-950/90 border-sky-500/40 text-sky-200'
            : statusNotification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900 border-white/10 text-slate-200'
        }`}>
          <RefreshCw className={`w-3.5 h-3.5 ${statusNotification.type === 'reroute' ? 'animate-spin text-sky-400' : ''}`} />
          <div>
            <span>{statusNotification.message}</span>
            {statusNotification.sub && <span className="opacity-75 text-[10.5px] ml-1.5 font-normal">({statusNotification.sub})</span>}
          </div>
        </div>
      )}

      {/* Route Quick Stats Bar */}
      <div 
        className={`grid grid-cols-4 divide-x border-b text-center py-2.5 ${
          isSat
            ? 'bg-[#10151f] divide-white/10 border-white/10'
            : 'bg-white divide-[#f1f3f4] border-[#dadce0]'
        }`}
      >
        <div>
          <span className={`text-[10px] uppercase font-medium ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
            {t.distance}
          </span>
          <p className={`text-xs font-bold ${isSat ? 'text-white' : 'text-[#202124]'}`}>{activeDistance} m</p>
        </div>
        <div>
          <span className={`text-[10px] uppercase font-medium ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
            {t.time}
          </span>
          <p className="text-xs font-bold text-[#38bdf8]">{activeMinutes} min</p>
        </div>
        <div>
          <span className={`text-[10px] uppercase font-medium ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
            {t.steps}
          </span>
          <p className={`text-xs font-bold ${isSat ? 'text-white' : 'text-[#202124]'}`}>~{stepsCount}</p>
        </div>
        <div>
          <span className={`text-[10px] uppercase font-medium ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
            {t.calories}
          </span>
          <p className="text-xs font-bold text-[#4ade80]">~{caloriesBurned} kcal</p>
        </div>
      </div>

      {/* PROMINENT LIVE ACTIVE WALKING HUD BANNER (Turns, Arrows, Next) */}
      <div 
        className={`p-4 border-b flex flex-col gap-2.5 ${
          hasArrived
            ? isSat
              ? 'bg-[#064e3b]/90 border-emerald-500/40 text-emerald-200'
              : 'bg-[#e6f4ea] border-[#ceead6] text-[#137333]'
            : isSat
              ? 'bg-[#132338] border-blue-500/25'
              : 'bg-[#e8f0fe] border-[#c2e7ff]'
        }`}
      >
        {hasArrived ? (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">🎯 YOU HAVE ARRIVED</h3>
            <p className="text-sm font-bold text-emerald-200 mt-0.5">{route.destinationName}</p>
            <p className="text-xs opacity-80 mt-1">Distance: 0 m • 0 min</p>
          </div>
        ) : (
          <>
            {/* Step Counter & Live Badge */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#38bdf8]">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>WALKING TO {route.destinationName.toUpperCase()}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                Step {currentStepIndex + 1} of {route.steps.length}
              </span>
            </div>

            {/* Giant Turn-by-Turn Card */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1a73e8] text-white flex items-center justify-center shrink-0 shadow-lg">
                <LargeDirectionIcon type={activeStep?.type || 'straight'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-extrabold leading-snug text-white">
                  {localizeStepInstruction(activeStep?.instruction || 'Proceed straight')}
                </div>
                {activeStep?.subInstruction && (
                  <div className="text-xs text-slate-300 mt-0.5 font-medium">
                    {localizeStepInstruction(activeStep.subInstruction)}
                  </div>
                )}
                {upcomingStep && (
                  <div className="text-[11px] text-sky-300 mt-1 font-semibold flex items-center gap-1">
                    <span>Next:</span>
                    <span>{upcomingStep.nextPreview || upcomingStep.instruction}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Primary Action Buttons: START, PAUSE, RECALCULATE, END */}
      <div 
        className={`p-3 border-b flex flex-wrap items-center justify-between gap-2 ${
          isSat ? 'bg-[#0f1722] border-white/10' : 'bg-[#f1f3f4] border-[#dadce0]'
        }`}
      >
        <div className="flex items-center gap-1.5 flex-1">
          {!isNavigating ? (
            <button
              onClick={onStartNavigation}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1a73e8] hover:bg-[#155724] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START NAVIGATION</span>
            </button>
          ) : (
            <>
              <button
                onClick={onPauseNavigation}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPaused
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
              </button>

              <button
                onClick={onRecalculateRoute}
                disabled={isRecalculating}
                className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Force backend route recalculation"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
                <span>RECALCULATE</span>
              </button>
            </>
          )}

          {isNavigating && (
            <button
              onClick={onEndNavigation}
              className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              END NAVIGATION
            </button>
          )}
        </div>

        {/* Demo Navigation Button for Hackathon */}
        <button
          onClick={onStartDemoNavigation}
          className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            isDemoMode
              ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-500/50'
              : isSat
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
          }`}
          title="Simulate walking along route for presentations"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>DEMO NAVIGATION</span>
        </button>
      </div>

      {/* Scrollable Turn-by-Turn Instruction Steps */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
          isSat ? 'text-slate-400' : 'text-[#5f6368]'
        }`}>
          {t.directions} ({route.steps.length} {t.stepsTotal})
        </h4>

        {route.steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                isCurrent
                  ? isSat
                    ? 'bg-[#17253b] border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.25)] ring-1 ring-[#38bdf8]'
                    : 'bg-[#e8f0fe] border-[#1a73e8] shadow-xs'
                  : isCompleted
                  ? isSat
                    ? 'bg-[#0f1722] border-white/5 opacity-55'
                    : 'bg-[#f8f9fa] border-[#e8eaed] opacity-70'
                  : isSat
                    ? 'bg-[#182332]/60 border-white/10 hover:border-white/20'
                    : 'bg-white border-[#dadce0] hover:border-[#bdc1c6]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-[#1a73e8] text-white font-bold text-xs shadow-sm'
                    : isCompleted
                    ? isSat
                      ? 'bg-[#064e3b] text-[#6ee7b7]'
                      : 'bg-[#e6f4ea] text-[#137333]'
                    : isSat
                      ? 'bg-white/10 text-slate-300'
                      : 'bg-[#f1f3f4] text-[#5f6368]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <StepIcon type={step.type} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-xs font-semibold ${
                    isCurrent 
                      ? isSat ? 'text-[#38bdf8]' : 'text-[#1967d2]' 
                      : isSat ? 'text-white' : 'text-[#202124]'
                  }`}>
                    {localizeStepInstruction(step.instruction)}
                  </p>
                  {step.distance > 0 && (
                    <span className={`text-[10px] font-mono shrink-0 ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                      {step.distance} m
                    </span>
                  )}
                </div>

                {step.subInstruction && (
                  <p className={`text-[11px] mt-0.5 ${isSat ? 'text-slate-300' : 'text-[#5f6368]'}`}>
                    {localizeStepInstruction(step.subInstruction)}
                  </p>
                )}

                {step.floor > 0 && (
                  <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                    isSat
                      ? 'text-[#38bdf8] bg-blue-950/60 border-blue-500/30'
                      : 'text-[#1a73e8] bg-white border-[#d2e3fc]'
                  }`}>
                    {floorLabel(step.floor)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function LargeDirectionIcon({ type }: { type: StepDirectionType }) {
  switch (type) {
    case 'start':
    case 'straight':
      return <ArrowUp className="w-7 h-7" strokeWidth={3} />;
    case 'turn-right':
    case 'slight-right':
      return <CornerUpRight className="w-7 h-7" strokeWidth={3} />;
    case 'turn-left':
    case 'slight-left':
      return <CornerUpLeft className="w-7 h-7" strokeWidth={3} />;
    case 'u-turn':
      return <RotateCw className="w-7 h-7" strokeWidth={3} />;
    case 'destination':
      return <CheckCircle2 className="w-7 h-7 text-[#ef4444]" strokeWidth={3} />;
    case 'stairs':
    case 'elevator':
    case 'enter-building':
      return <Building className="w-7 h-7" strokeWidth={2.5} />;
    default:
      return <ArrowUp className="w-7 h-7" strokeWidth={3} />;
  }
}

function StepIcon({ type }: { type: StepDirectionType }) {
  switch (type) {
    case 'start': return <Footprints className="w-3.5 h-3.5" />;
    case 'turn-right':
    case 'slight-right':
      return <CornerUpRight className="w-3.5 h-3.5" />;
    case 'turn-left':
    case 'slight-left':
      return <CornerUpLeft className="w-3.5 h-3.5" />;
    case 'u-turn':
      return <RotateCw className="w-3.5 h-3.5" />;
    case 'stairs':
    case 'elevator':
    case 'enter-building':
      return <Building className="w-3.5 h-3.5" />;
    case 'destination':
      return <CheckCircle2 className="w-3.5 h-3.5 text-[#ef4444]" />;
    default:
      return <ArrowUp className="w-3.5 h-3.5" />;
  }
}
