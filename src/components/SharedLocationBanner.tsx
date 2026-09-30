import React from 'react';
import { 
  Radio, 
  Navigation, 
  MapPin, 
  X, 
  Clock, 
  Sparkles,
  User,
  ArrowRight
} from 'lucide-react';
import { SharedLocation } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';

interface SharedLocationBannerProps {
  share: SharedLocation;
  distanceMeters?: number;
  walkingMinutes?: number;
  onNavigateToFriend: (share: SharedLocation) => void;
  onFocusFriend: (share: SharedLocation) => void;
  onDismiss: () => void;
  isSatelliteTheme?: boolean;
}

export const SharedLocationBanner: React.FC<SharedLocationBannerProps> = ({
  share,
  distanceMeters = 340,
  walkingMinutes = 4,
  onNavigateToFriend,
  onFocusFriend,
  onDismiss,
  isSatelliteTheme = true,
}) => {
  const { t, language, floorLabel } = useLanguage();
  const isSat = isSatelliteTheme;

  return (
    <div className={`w-full max-w-2xl mx-auto rounded-2xl border shadow-2xl p-3 sm:p-4 transition-all animate-fadeIn ${
      isSat
        ? 'bg-[#0f172a]/95 border-emerald-500/40 text-white backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
        : 'bg-white/95 border-emerald-500/30 text-[#202124] backdrop-blur-md shadow-[0_8px_24px_rgba(16,185,129,0.15)]'
    }`}>
      <div className="flex items-start justify-between gap-3">
        {/* Left Avatar & Live Beacon */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md text-sm"
              style={{ backgroundColor: share.avatarColor || '#10b981' }}
            >
              {share.senderName.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#0f172a] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                {t.liveCampusSharing}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                {share.shareCode}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                {share.senderRole}
              </span>
            </div>

            <h3 className="text-sm font-bold truncate mt-0.5 text-white">
              {share.senderName}: {share.title}
            </h3>

            {share.note && (
              <p className="text-xs text-slate-300 italic mt-0.5 line-clamp-1">
                "{share.note}"
              </p>
            )}

            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
              <span className="text-sky-300 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {share.buildingName} · {floorLabel(share.floor)}
              </span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">
                {distanceMeters}m (~{walkingMinutes} {t.minWalk})
              </span>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
        <button
          onClick={() => onFocusFriend(share)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-400 hover:bg-sky-500/10 border border-sky-500/30 transition-colors cursor-pointer"
        >
          {t.locateOnMap}
        </button>

        <button
          onClick={() => onNavigateToFriend(share)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{t.walkTo} {share.senderName.split(' ')[0]}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
