import React, { useState } from 'react';
import { 
  Users, 
  Radio, 
  MapPin, 
  Navigation, 
  X, 
  Search, 
  Plus, 
  Clock, 
  Share2,
  GraduationCap,
  Building,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SharedLocation, UserProfile } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';

interface FriendRadarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shares: SharedLocation[];
  onSelectShare: (share: SharedLocation) => void;
  onNavigateToShare: (share: SharedLocation) => void;
  onOpenShareModal: () => void;
  myActiveShare: SharedLocation | null;
  isSatelliteTheme?: boolean;
}

export const FriendRadarDrawer: React.FC<FriendRadarDrawerProps> = ({
  isOpen,
  onClose,
  shares,
  onSelectShare,
  onNavigateToShare,
  onOpenShareModal,
  myActiveShare,
  isSatelliteTheme = true,
}) => {
  const { t, language, floorLabel } = useLanguage();
  const [filterRole, setFilterRole] = useState<'All' | 'Student' | 'Faculty' | 'Staff'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const isSat = isSatelliteTheme;

  const getRoleName = (r: string) => {
    if (language === 'hi') {
      if (r === 'All') return t.allPeople;
      if (r === 'Student') return t.students;
      if (r === 'Faculty') return t.faculty;
      if (r === 'Staff') return t.staff;
    }
    return r === 'All' ? 'All People' : r;
  };

  const filteredShares = shares.filter(s => {
    if (filterRole !== 'All' && s.senderRole !== filterRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.senderName.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        (s.note && s.note.toLowerCase().includes(q)) ||
        (s.buildingName && s.buildingName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 shadow-2xl border-l flex flex-col animate-slideInRight ${
      isSat 
        ? 'bg-[#0f172a] border-white/10 text-slate-100' 
        : 'bg-white border-[#dadce0] text-[#202124]'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#0284c7] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Radio className="w-4 h-4 text-emerald-200 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Google_Sans',sans-serif] leading-tight">
              {t.campusLiveRadar}
            </h3>
            <p className="text-[11px] text-white/80">
              {shares.length} {t.activeBroadcasts}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-black/20 text-white transition-colors cursor-pointer"
          title="Close Radar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Broadcast My Location Callout / Active share status */}
      <div className={`p-3 border-b ${isSat ? 'bg-[#182332] border-white/10' : 'bg-[#f8f9fa] border-[#e8eaed]'}`}>
        {myActiveShare ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-emerald-400 truncate">
                  {language === 'hi' ? `आपकी लोकेशन लाइव है (${myActiveShare.shareCode})` : `You are broadcasting (${myActiveShare.shareCode})`}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {myActiveShare.buildingName} · {floorLabel(myActiveShare.floor)}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenShareModal}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer"
            >
              {language === 'hi' ? 'प्रबंधन' : 'Manage'}
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenShareModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#1a73e8] to-[#0284c7] hover:from-[#155724] hover:to-[#047857] text-white text-xs font-bold shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.shareCampusLocation}</span>
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
          isSat ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124]'
        }`}>
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'सहपाठी, शिक्षक, कक्ष खोजें...' : 'Search classmate, teacher, room...'}
            className="w-full bg-transparent outline-none text-xs"
          />
        </div>

        {/* Role Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['All', 'Student', 'Faculty', 'Staff'] as const).map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                filterRole === role
                  ? 'bg-emerald-500 text-white'
                  : isSat
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {getRoleName(role)}
            </button>
          ))}
        </div>
      </div>

      {/* List of Shares */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredShares.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Radio className="w-8 h-8 mx-auto text-slate-500 opacity-50" />
            <p className="text-xs font-medium">{t.noBroadcastsMatch}</p>
            <button
              onClick={onOpenShareModal}
              className="text-xs text-sky-400 hover:underline font-semibold cursor-pointer"
            >
              {t.beFirstToShare}
            </button>
          </div>
        ) : (
          filteredShares.map(share => {
            return (
              <div
                key={share.id}
                onClick={() => onSelectShare(share)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                  isSat
                    ? 'bg-[#182332] border-white/10 hover:border-emerald-500/50 hover:bg-[#1e2c3f]'
                    : 'bg-white border-[#dadce0] hover:border-emerald-500 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm flex-shrink-0"
                      style={{ backgroundColor: share.avatarColor || '#10b981' }}
                    >
                      {share.senderName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {share.senderName}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300">
                          {share.senderRole}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-sky-400 truncate mt-0.5">
                        {share.title}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex-shrink-0">
                    {share.shareCode}
                  </span>
                </div>

                {share.note && (
                  <p className="text-[11px] text-slate-300 italic mt-2 line-clamp-2 bg-black/20 p-2 rounded-lg">
                    "{share.note}"
                  </p>
                )}

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{share.buildingName} · {floorLabel(share.floor)}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToShare(share);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10.5px] transition-colors flex-shrink-0 shadow-sm"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{t.walkHere}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className={`p-3 border-t text-[11px] text-center text-slate-400 ${
        isSat ? 'bg-[#0b1019] border-white/10' : 'bg-[#f8f9fa] border-[#dadce0]'
      }`}>
        {language === 'hi' ? 'लाइव पिन अपडेट होते हैं। छात्रों की गोपनीयता के लिए लोकेशन स्वतः समाप्त हो जाती है।' : 'Pins update live. Locations expire automatically for student privacy.'}
      </div>
    </div>
  );
};
