import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  QrCode, 
  Copy, 
  Check, 
  Navigation, 
  Radio, 
  Clock, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  MessageSquare, 
  ExternalLink,
  Trash2,
  Building,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import { CampusLocation, SharedLocation, UserProfile } from '../types/campus';
import { useLanguage } from '../context/LanguageContext';
import { 
  createShare, 
  deleteShare, 
  generateShareUrl, 
  generateWhatsAppLink, 
  generateQrCodeDataUrl,
  getCampusPositionFromGeo
} from '../services/shareService';

interface LocationShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  locations: CampusLocation[];
  activeShare: SharedLocation | null;
  onShareCreated: (share: SharedLocation) => void;
  onShareEnded: () => void;
  initialLocation?: CampusLocation | null;
  currentUserNodeId: string;
  isSatelliteTheme?: boolean;
}

export const LocationShareModal: React.FC<LocationShareModalProps> = ({
  isOpen,
  onClose,
  user,
  locations,
  activeShare,
  onShareCreated,
  onShareEnded,
  initialLocation,
  currentUserNodeId,
  isSatelliteTheme = true,
}) => {
  const { t, language, locName, floorLabel } = useLanguage();
  // Tabs: 'create' | 'active' | 'qr'
  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'qr'>('create');
  
  // Form fields
  const [title, setTitle] = useState(`${user.name}'s Campus Meetup`);
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    initialLocation?.id || locations.find(l => l.nodeId === currentUserNodeId)?.id || locations[0]?.id || ''
  );
  const [note, setNote] = useState('Hey, meet me here! Follow the directions on CampusNav.');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [isLiveGps, setIsLiveGps] = useState<boolean>(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrTargetUrl, setQrTargetUrl] = useState<string>('');
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  // Sync initial location when provided
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocationId(initialLocation.id);
      setTitle(`Meet me at ${initialLocation.name}`);
      setNote(`I'm currently at ${initialLocation.name} (${initialLocation.building}, Floor ${initialLocation.floor}).`);
    } else if (activeShare) {
      setActiveTab('active');
    }
  }, [initialLocation, activeShare]);

  // Generate QR code when active share or target changes
  useEffect(() => {
    const target = activeShare ? generateShareUrl(activeShare) : window.location.href;
    setQrTargetUrl(target);
    generateQrCodeDataUrl(target).then(setQrDataUrl);
  }, [activeShare]);

  if (!isOpen) return null;

  const isSat = isSatelliteTheme;
  const currentLocationObj = locations.find(l => l.id === selectedLocationId) || locations[0];

  // Request actual browser GPS
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        const campusPos = getCampusPositionFromGeo(latitude, longitude);
        setGpsCoordinates({
          x: campusPos.x,
          y: campusPos.y,
          lat: latitude,
          lng: longitude,
        });
        setIsLiveGps(true);
      },
      (err) => {
        setGpsLoading(false);
        console.warn('Geolocation permission error or timeout:', err.message);
        // Fallback gracefully
        setIsLiveGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Submit new share session
  const handleStartSharing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const coords = isLiveGps && gpsCoordinates 
      ? { x: gpsCoordinates.x, y: gpsCoordinates.y, latitude: gpsCoordinates.lat, longitude: gpsCoordinates.lng }
      : currentLocationObj.coordinates;

    const payload: Partial<SharedLocation> = {
      senderName: user.name,
      senderRole: user.role,
      title: title.trim() || `${user.name}'s Location`,
      note: note.trim(),
      locationId: currentLocationObj.id,
      buildingName: currentLocationObj.building,
      floor: currentLocationObj.floor,
      coordinates: coords,
      nodeId: currentLocationObj.nodeId,
      durationMinutes,
      isLive: true,
      avatarColor: user.role === 'Faculty' ? '#8b5cf6' : user.role === 'Admin' ? '#ea4335' : '#1a73e8',
    };

    const created = await createShare(payload);
    setIsSubmitting(false);

    if (created) {
      onShareCreated(created);
      const url = generateShareUrl(created);
      setQrTargetUrl(url);
      const qr = await generateQrCodeDataUrl(url);
      setQrDataUrl(qr);
      setActiveTab('active');
    }
  };

  // Stop sharing
  const handleStopSharing = async () => {
    if (!activeShare) return;
    await deleteShare(activeShare.id);
    onShareEnded();
    setActiveTab('create');
  };

  // Share link copy
  const handleCopyLink = () => {
    const url = activeShare ? generateShareUrl(activeShare) : window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Share code copy
  const handleCopyCode = () => {
    if (!activeShare) return;
    navigator.clipboard.writeText(activeShare.shareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  // Native Web Share
  const handleNativeShare = async () => {
    if (!activeShare) return;
    const url = generateShareUrl(activeShare);
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeShare.title,
          text: `📍 ${activeShare.senderName} shared their campus location: "${activeShare.note}"`,
          url,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback
      }
    }
    handleCopyLink();
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    if (!activeShare) return;
    const url = generateShareUrl(activeShare);
    const text = `📍 *Campus Location from ${activeShare.senderName}*\n"${activeShare.note}"\nBuilding: ${activeShare.buildingName} (Floor ${activeShare.floor})`;
    const waUrl = generateWhatsAppLink(text, url);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isSat 
            ? 'bg-[#121924] border-white/10 text-slate-100' 
            : 'bg-white border-[#dadce0] text-[#3c4043]'
        }`}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#1a73e8] via-[#0284c7] to-[#0d9488] px-5 py-4 text-white">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
              <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
              {t.liveCampusSharing}
            </span>
            {activeShare && (
              <span className="text-[10px] font-mono bg-emerald-500/80 px-2 py-0.5 rounded-full text-white font-semibold">
                {t.active} · {activeShare.shareCode}
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold font-['Google_Sans',sans-serif]">
            {activeShare ? t.broadcastingLive : t.shareCampusLocation}
          </h2>
          <p className="text-xs text-white/90 mt-0.5">
            {t.shareSubtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b text-xs font-semibold ${
          isSat ? 'border-white/10 bg-[#10151f]' : 'border-[#dadce0] bg-[#f8f9fa]'
        }`}>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'create'
                ? 'border-[#1a73e8] text-[#38bdf8] font-bold bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.createShare}</span>
          </button>

          {activeShare && (
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'active'
                  ? 'border-[#1a73e8] text-[#38bdf8] font-bold bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{t.activeBroadcast}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'qr'
                ? 'border-[#1a73e8] text-[#38bdf8] font-bold bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.scanQrCode}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {/* TAB 1: CREATE SHARE */}
          {activeTab === 'create' && (
            <form onSubmit={handleStartSharing} className="space-y-4">
              {/* Meetup Title */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  isSat ? 'text-slate-300' : 'text-[#5f6368]'
                }`}>
                  {t.meetupTitle}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Group Study Session / Nilu's Location"
                  required
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                    isSat 
                      ? 'bg-[#182332] border-white/10 text-white focus:border-sky-400' 
                      : 'bg-white border-[#dadce0] text-[#202124] focus:border-[#1a73e8]'
                  }`}
                />
              </div>

              {/* Location Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${
                    isSat ? 'text-slate-300' : 'text-[#5f6368]'
                  }`}>
                    {t.selectLocationOrRoom}
                  </label>
                  <button
                    type="button"
                    onClick={handleRequestGps}
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 cursor-pointer font-medium"
                    title="Detect real device GPS"
                  >
                    <LocateFixed className="w-3 h-3" />
                    <span>{gpsLoading ? t.calibratingGps : t.useMyGps}</span>
                  </button>
                </div>

                <select
                  value={selectedLocationId}
                  onChange={(e) => {
                    setSelectedLocationId(e.target.value);
                    setIsLiveGps(false);
                  }}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all cursor-pointer ${
                    isSat 
                      ? 'bg-[#182332] border-white/10 text-white focus:border-sky-400' 
                      : 'bg-white border-[#dadce0] text-[#202124] focus:border-[#1a73e8]'
                  }`}
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                      {locName(loc)} · {loc.building} ({floorLabel(loc.floor)})
                    </option>
                  ))}
                </select>

                {isLiveGps && gpsCoordinates && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Device GPS locked on campus ({gpsCoordinates.lat.toFixed(4)}, {gpsCoordinates.lng.toFixed(4)})</span>
                  </div>
                )}
              </div>

              {/* Note / Instruction to Friends */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  isSat ? 'text-slate-300' : 'text-[#5f6368]'
                }`}>
                  {t.meetupNote}
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Sitting on the 1st floor corner desk. Call if you can't find me!"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all resize-none ${
                    isSat 
                      ? 'bg-[#182332] border-white/10 text-white focus:border-sky-400' 
                      : 'bg-white border-[#dadce0] text-[#202124] focus:border-[#1a73e8]'
                  }`}
                />
              </div>

              {/* Duration Selector */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  isSat ? 'text-slate-300' : 'text-[#5f6368]'
                }`}>
                  {t.liveSharingDuration}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: t.duration15Min, val: 15 },
                    { label: t.duration1Hour, val: 60 },
                    { label: t.duration4Hours, val: 240 },
                    { label: t.durationAllDay, val: 1440 },
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setDurationMinutes(item.val)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        durationMinutes === item.val
                          ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-sm'
                          : isSat
                            ? 'bg-[#182332] border-white/10 text-slate-300 hover:border-sky-400/50'
                            : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Share Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1a73e8] to-[#0284c7] hover:from-[#155724] hover:to-[#047857] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Radio className="w-4 h-4 animate-pulse text-emerald-300" />
                  <span>{isSubmitting ? 'Starting...' : t.broadcastMyLocation}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ACTIVE SHARE MANAGEMENT */}
          {activeTab === 'active' && activeShare && (
            <div className="space-y-4 animate-fadeIn">
              {/* Live Status Card */}
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {t.broadcastingLive}
                    </span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                      {activeShare.shareCode}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5 truncate">
                    {activeShare.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {activeShare.buildingName} · {floorLabel(activeShare.floor)}
                  </p>
                  {activeShare.note && (
                    <p className="text-xs italic text-slate-400 mt-1 bg-black/20 p-2 rounded-lg">
                      "{activeShare.note}"
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>{language === 'hi' ? 'समाप्त:' : 'Expires:'} {new Date(activeShare.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Share Code & Quick Copy Bar */}
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                isSat ? 'bg-[#182332] border-white/10' : 'bg-[#f8f9fa] border-[#dadce0]'
              }`}>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {t.sixCharMeetupCode}
                  </span>
                  <span className="text-lg font-mono font-bold text-sky-400 tracking-wider">
                    {activeShare.shareCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a73e8] hover:bg-[#155724] text-white transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? t.codeCopied : t.copyCode}</span>
                </button>
              </div>

              {/* Instant Social / Chat Sharing */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t.instantShareChannels}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.whatsApp}</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1a73e8] hover:bg-[#155724] text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? t.linkCopied : t.copyLink}</span>
                  </button>
                </div>

                <button
                  onClick={handleNativeShare}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    isSat 
                      ? 'border-white/10 hover:bg-white/5 text-slate-200' 
                      : 'border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.deviceShareSheet}</span>
                </button>
              </div>

              {/* Stop Sharing Button */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={handleStopSharing}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t.stopBroadcast}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: QR CODE SCANNER VIEW */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-2 animate-fadeIn">
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-200">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Campus Location QR Code"
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                    Generating QR code...
                  </div>
                )}
              </div>

              <div className="text-center max-w-xs space-y-1">
                <p className="text-xs font-bold text-white">
                  {t.scanToOpenPhone}
                </p>
                <p className="text-[11px] text-slate-400">
                  {t.pointPhoneCamera}
                </p>
              </div>

              {qrTargetUrl && (
                <div className="w-full flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={qrTargetUrl}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-[11px] border font-mono truncate ${
                      isSat ? 'bg-black/30 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#1a73e8] text-white text-xs font-semibold cursor-pointer"
                  >
                    {copiedLink ? t.codeCopied : t.copyLink}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-5 py-3 border-t flex items-center justify-between text-xs ${
          isSat ? 'bg-[#0f141d] border-white/10 text-slate-400' : 'bg-[#f8f9fa] border-[#dadce0] text-[#5f6368]'
        }`}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted · Auto-expires securely</span>
          </div>
          <button
            onClick={onClose}
            className="hover:underline font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
