import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Navigation, 
  Zap, 
  MapPin, 
  Footprints 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusLocation } from '../types/campus';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: CampusLocation[];
  onExecuteDemoStep: (stepNumber: number) => void;
  onLaunchShortestRouteDemo?: () => void;
}

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({
  isOpen,
  onClose,
  locations,
  onExecuteDemoStep,
  onLaunchShortestRouteDemo,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Step 1: Detect Start Location (Main Block)',
      description: 'System identifies user position at Main Block (Academic Block A Entrance).',
      badge: 'Location Detect',
      actionText: 'Next: Select Destination',
    },
    {
      step: 2,
      title: 'Step 2: Destination Selected (Library)',
      description: 'User requests: "Where is the library?" or selects Central University Library.',
      badge: 'Smart Search',
      actionText: 'Next: Calculate Routes',
    },
    {
      step: 3,
      title: 'Step 3: Graph Pathfinding & Route Comparison',
      description: 'Calculates available walking paths: Route A = 450 m, Route B = 320 m, Route C = 380 m.',
      badge: 'A* / Dijkstra',
      actionText: 'Next: Auto-Select Shortest',
    },
    {
      step: 4,
      title: 'Step 4: Auto-Select Minimum Walking Distance',
      description: 'System selects Route B – 320 m as ⚡ SHORTEST ROUTE (4 min walk). Avoids wanderings!',
      badge: 'Minimum Distance',
      actionText: 'Next: Live Map View',
    },
    {
      step: 5,
      title: 'Step 5: Visual Map Route Display',
      description: 'Draws shortest blue route on campus road network with segment distance markers (+110m, +140m, +70m).',
      badge: 'Campus Map',
      actionText: 'Next: Start Walk',
    },
    {
      step: 6,
      title: 'Step 6: Live Walking Guidance to Destination',
      description: 'Simulates walking guidance from Main Block to Central Library foyer with 0 wrong turns!',
      badge: 'Arrived',
      actionText: 'Replay Demo',
    },
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onExecuteDemoStep(next);
      if (next === 6) {
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        } catch {}
      }
    } else {
      setCurrentStep(1);
      onExecuteDemoStep(1);
    }
  };

  const handleJumpTo = (stepNum: number) => {
    setCurrentStep(stepNum);
    onExecuteDemoStep(stepNum);
    if (stepNum === 6) {
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch {}
    }
  };

  const activeInfo = demoSteps[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a73e8] via-[#0284c7] to-[#15803d] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-['Google_Sans',sans-serif]">
                Minimum Shortest Distance Navigation Demo
              </h2>
              <p className="text-[11px] text-white/80">
                MCA Hackathon Presentation & Judge Flow: Main Block ➔ Library
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="px-6 py-3 bg-[#f8f9fa] border-b border-[#dadce0] flex items-center justify-between">
          {demoSteps.map(s => (
            <button
              key={s.step}
              onClick={() => handleJumpTo(s.step)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentStep === s.step
                  ? 'text-[#1a73e8] font-bold'
                  : currentStep > s.step
                    ? 'text-[#1e8e3e]'
                    : 'text-[#80868b]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === s.step
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : currentStep > s.step
                    ? 'bg-[#e6f4ea] text-[#1e8e3e]'
                    : 'bg-[#e8eaed] text-[#5f6368]'
              }`}>
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span className="hidden sm:inline text-xs">
                {s.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="p-6 space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
              Demo Scenario: Main Block ➔ Library
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Step {currentStep} of 6
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#202124] flex items-center gap-2">
              <span>{activeInfo.title}</span>
            </h3>
            <p className="text-xs text-[#5f6368] mt-1.5 leading-relaxed">
              {activeInfo.description}
            </p>
          </div>

          {/* Demonstration Highlight Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#f8fafd] to-[#e8f0fe] border border-blue-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">📍 Start: Main Block</span>
              <span className="font-semibold text-slate-700">🎯 Destination: Library</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-blue-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>⚡ SHORTEST ROUTE (Route B)</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Route A: 450 m | <strong className="text-blue-700">Route B: 320 m ✓</strong> | Route C: 380 m
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-blue-700 font-['Product_Sans',sans-serif]">320 m</div>
                <div className="text-[11px] text-emerald-600 font-bold">4 min walk</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 italic">
              "CampusNav AI automatically selects Route B – 320 m, preventing users from wandering around or turning back."
            </p>
          </div>

          {/* Action Button Strip */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                onLaunchShortestRouteDemo?.();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch 320m Route on Map</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#155724] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>{activeInfo.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
