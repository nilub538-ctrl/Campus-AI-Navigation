import React from 'react';
import { 
  X, 
  Navigation, 
  Clock, 
  MapPin, 
  Building, 
  Layers, 
  Accessibility, 
  Bookmark, 
  Share2, 
  Check, 
  GraduationCap, 
  FlaskConical, 
  BookOpen, 
  Utensils, 
  HeartPulse,
  Info
} from 'lucide-react';
import { CampusLocation } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';

interface LocationDetailsModalProps {
  location: CampusLocation | null;
  onClose: () => void;
  onStartNavigation: (location: CampusLocation) => void;
  isFavorite: boolean;
  onToggleFavorite: (locationId: string) => void;
  distanceMeters?: number;
  walkingMinutes?: number;
  isSatelliteTheme?: boolean;
  onOpenShareModal?: (location: CampusLocation) => void;
}

export const LocationDetailsModal: React.FC<LocationDetailsModalProps> = ({
  location,
  onClose,
  onStartNavigation,
  isFavorite,
  onToggleFavorite,
  distanceMeters,
  walkingMinutes,
  isSatelliteTheme = true,
  onOpenShareModal,
}) => {
  const [copied, setCopied] = React.useState(false);
  const { t, language, locName, locDesc, categoryLabel, floorLabel } = useLanguage();

  if (!location) return null;

  const handleShare = () => {
    if (onOpenShareModal) {
      onOpenShareModal(location);
      return;
    }
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (location.category) {
      case 'Classroom': return GraduationCap;
      case 'Laboratory': return FlaskConical;
      case 'Library': return BookOpen;
      case 'Canteen': return Utensils;
      case 'Medical': return HeartPulse;
      default: return MapPin;
    }
  };

  const isSat = isSatelliteTheme;

  return (
    <div 
      className={`rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all animate-in fade-in slide-in-from-bottom-3 ${
        isSat
          ? 'bg-[#121924] border-white/10 text-slate-100'
          : 'bg-white border-[#dadce0] text-[#3c4043]'
      }`}
    >
      {/* Top Banner / Color Header */}
      <div className="relative bg-gradient-to-r from-[#1a73e8] via-[#0284c7] to-[#047857] px-5 py-4 text-white">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/30 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
            {categoryLabel(location.category)}
          </span>
          <span className="text-xs text-white/80 font-mono">
            {location.code}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white font-['Google_Sans',sans-serif] leading-tight">
          {locName(location)}
        </h3>
        <p className="text-xs text-white/90 mt-0.5">
          {location.building} · {floorLabel(location.floor)}{location.room ? ` · ${location.room}` : ''}
        </p>
      </div>

      {/* Main Content Info */}
      <div className="p-5 overflow-y-auto space-y-4 text-sm">
        {/* Quick Distance & Walking Time Banner */}
        <div 
          className={`flex items-center justify-between p-3 rounded-xl border ${
            isSat
              ? 'bg-[#182332] border-white/10 text-slate-200'
              : 'bg-[#f8f9fa] border-[#e8eaed] text-[#3c4043]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8]/20 text-[#38bdf8] flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-xs font-medium ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                {t.distanceFromGate}
              </p>
              <p className={`text-sm font-semibold ${isSat ? 'text-white' : 'text-[#202124]'}`}>
                {distanceMeters ?? 380} {t.meters} · ~{walkingMinutes ?? 5} {t.minWalk}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#4ade80] bg-[#064e3b]/80 border border-[#10b981]/30 px-2 py-1 rounded-full">
            {t.wheelchairAccessible}
          </span>
        </div>

        {/* Description */}
        <div>
          <h4 className={`text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
            isSat ? 'text-slate-400' : 'text-[#5f6368]'
          }`}>
            <Info className="w-3.5 h-3.5 text-[#38bdf8]" />
            {t.aboutLocation}
          </h4>
          <p className={`text-xs leading-relaxed ${isSat ? 'text-slate-300' : 'text-[#3c4043]'}`}>
            {locDesc(location)}
          </p>
        </div>

        {/* Operating Hours */}
        <div className="flex items-start gap-2.5">
          <Clock className={`w-4 h-4 shrink-0 mt-0.5 ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`} />
          <div>
            <p className={`text-xs font-semibold ${isSat ? 'text-white' : 'text-[#202124]'}`}>{t.operatingHours}</p>
            <p className={`text-xs ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>{location.openingHours}</p>
          </div>
        </div>

        {/* Building & Room info */}
        <div className="flex items-start gap-2.5">
          <Building className={`w-4 h-4 shrink-0 mt-0.5 ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`} />
          <div>
            <p className={`text-xs font-semibold ${isSat ? 'text-white' : 'text-[#202124]'}`}>{t.locationDetails}</p>
            <p className={`text-xs ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
              {location.building}, {floorLabel(location.floor)} {location.room ? `(${location.room})` : ''}
            </p>
            {location.contactPerson && (
              <p className="text-xs text-[#38bdf8] mt-0.5">{t.contact}: {location.contactPerson}</p>
            )}
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="flex items-start gap-2.5">
          <Accessibility className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
          <div>
            <p className={`text-xs font-semibold ${isSat ? 'text-white' : 'text-[#202124]'}`}>{t.accessibilityFeatures}</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {location.accessibility.wheelchair && (
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  isSat 
                    ? 'bg-[#064e3b]/70 text-[#6ee7b7] border border-[#059669]/30' 
                    : 'bg-[#e6f4ea] text-[#137333]'
                }`}>
                  {t.wheelchairAccessible}
                </span>
              )}
              {location.accessibility.elevatorAvailable && (
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  isSat 
                    ? 'bg-[#1e3a8a]/70 text-[#93c5fd] border border-[#2563eb]/30' 
                    : 'bg-[#e8f0fe] text-[#1a73e8]'
                }`}>
                  {t.elevatorAvailable}
                </span>
              )}
              {location.accessibility.tactilePaving && (
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  isSat 
                    ? 'bg-[#78350f]/70 text-[#fde68a] border border-[#d97706]/30' 
                    : 'bg-[#fef7e0] text-[#b06000]'
                }`}>
                  {t.tactilePaving}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {location.tags.length > 0 && (
          <div className={`pt-2 border-t ${isSat ? 'border-white/10' : 'border-[#f1f3f4]'}`}>
            <div className="flex flex-wrap gap-1">
              {location.tags.map(tag => (
                <span
                  key={tag}
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSat 
                      ? 'text-slate-400 bg-white/5 border border-white/5' 
                      : 'text-[#5f6368] bg-[#f1f3f4]'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div 
        className={`p-4 border-t flex items-center gap-2 ${
          isSat
            ? 'bg-[#10151f] border-white/10'
            : 'bg-[#f8f9fa] border-[#dadce0]'
        }`}
      >
        <button
          onClick={() => onStartNavigation(location)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#1a73e8] hover:bg-[#155724] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>{t.navigateHere}</span>
        </button>

        <button
          onClick={() => onToggleFavorite(location.id)}
          className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
            isFavorite
              ? isSat
                ? 'bg-[#78350f]/70 text-[#fbbf24] border-[#b45309]'
                : 'bg-[#fef7e0] text-[#f29900] border-[#fce8b2]'
              : isSat
                ? 'bg-[#182332] text-slate-300 border-white/10 hover:bg-white/10'
                : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f1f3f4]'
          }`}
          title={isFavorite ? t.savedInFavorites : t.saveToFavorites}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        <button
          onClick={handleShare}
          className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
            isSat
              ? 'bg-[#182332] text-slate-300 border-white/10 hover:bg-white/10'
              : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f1f3f4]'
          }`}
          title={t.sharePlace}
        >
          {copied ? <Check className="w-4 h-4 text-[#4ade80]" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
