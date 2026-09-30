import React from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  Bot, 
  LayoutDashboard, 
  ShieldCheck, 
  Accessibility, 
  Sparkles,
  Layers,
  ChevronDown,
  Radio,
  Share2
} from 'lucide-react';
import { UserProfile, SharedLocation } from '../types/campus';
import { CampusNavLogo } from './CampusNavLogo';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface NavbarProps {
  currentTab: 'home' | 'map' | 'assistant' | 'dashboard' | 'directory' | 'admin';
  setCurrentTab: (tab: 'home' | 'map' | 'assistant' | 'dashboard' | 'directory' | 'admin') => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  accessibleMode: boolean;
  setAccessibleMode: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenDemo: () => void;
  onOpenSearch: () => void;
  onOpenShareModal?: () => void;
  activeShare?: SharedLocation | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  setUser,
  accessibleMode,
  setAccessibleMode,
  onOpenDemo,
  onOpenSearch,
  onOpenShareModal,
  activeShare,
}) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const { t, language } = useLanguage();

  const roles: UserProfile['role'][] = ['Student', 'Faculty', 'Visitor', 'Admin'];

  const getRoleLabel = (r: UserProfile['role']) => {
    if (language === 'hi') {
      switch (r) {
        case 'Student': return 'छात्र';
        case 'Faculty': return 'प्राध्यापक';
        case 'Visitor': return 'आगंतुक';
        case 'Admin': return 'व्यवस्थापक';
        default: return r;
      }
    }
    return r;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#dadce0] shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo - NIIS CampusNav */}
        <div 
          onClick={() => setCurrentTab('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <CampusNavLogo className="w-10 h-10" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[19px] font-bold tracking-tight text-[#202124] font-['Google_Sans',sans-serif]">
                Campus<span className="text-[#1a73e8]">Nav</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1967d2]">
                NIIS
              </span>
            </div>
            <span className="text-[11px] text-[#5f6368] font-medium tracking-wide">
              {t.brandTagline}
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'home'
                ? 'bg-[#e8f0fe] text-[#1967d2]'
                : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
            }`}
          >
            {t.navHome}
          </button>
          
          <button
            onClick={() => setCurrentTab('map')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'map'
                ? 'bg-[#e8f0fe] text-[#1967d2]'
                : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
            }`}
          >
            <Compass className="w-4 h-4" />
            {t.navMap}
          </button>

          <button
            onClick={() => setCurrentTab('assistant')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'assistant'
                ? 'bg-[#e8f0fe] text-[#1967d2]'
                : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
            }`}
          >
            <Bot className="w-4 h-4 text-[#1a73e8]" />
            {t.navAssistant}
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-[#e8f0fe] text-[#1967d2]'
                : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {t.navDashboard}
          </button>

          <button
            onClick={() => setCurrentTab('directory')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'directory'
                ? 'bg-[#e8f0fe] text-[#1967d2]'
                : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t.navDirectory}
          </button>

          {user.role === 'Admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-[#e8f0fe] text-[#1967d2]'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#ea4335]" />
              {t.navAdmin}
            </button>
          )}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Toggle */}
          <LanguageToggle />

          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
            title={t.searchPlaceholder}
            aria-label={t.searchAria}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Accessibility Route Toggle */}
          <button
            onClick={() => setAccessibleMode(!accessibleMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              accessibleMode
                ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f8f9fa]'
            }`}
            title="Toggle Step-free / Wheelchair Accessible Routes"
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">
              {accessibleMode ? t.accessibleOn : t.stepFree}
            </span>
          </button>

          {/* Live Location Share Button */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeShare
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                  : 'bg-white text-[#1a73e8] border-[#dadce0] hover:bg-[#e8f0fe] hover:border-[#1a73e8]/30'
              }`}
              title={activeShare ? `Active share: ${activeShare.shareCode}` : t.shareCampusLocation}
            >
              <Radio className={`w-3.5 h-3.5 ${activeShare ? 'text-emerald-500 animate-pulse' : 'text-[#1a73e8]'}`} />
              <span className="hidden sm:inline">{activeShare ? t.broadcasting : t.shareLocation}</span>
            </button>
          )}

          {/* Hackathon Demo Flow Quick Launcher */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#1a73e8] to-[#155724] text-white text-xs font-medium shadow-sm hover:shadow transition-all hover:opacity-95 cursor-pointer"
            title="Launch Hackathon Demo Flow"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">{t.judgeDemo}</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full border border-[#dadce0] hover:bg-[#f8f9fa] transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#1a73e8] text-white font-medium text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-[#202124]">
                {getRoleLabel(user.role)}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#5f6368]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#dadce0] py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-2 border-b border-[#f1f3f4]">
                  <p className="text-xs font-semibold text-[#202124]">{user.name}</p>
                  <p className="text-[11px] text-[#5f6368]">{user.department || getRoleLabel(user.role)}</p>
                </div>

                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                  {t.switchRole}
                </div>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setUser(prev => ({ ...prev, role: r }));
                      setUserMenuOpen(false);
                      if (r === 'Admin') setCurrentTab('admin');
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-[#f1f3f4] cursor-pointer ${
                      user.role === r ? 'text-[#1a73e8] font-semibold bg-[#e8f0fe]' : 'text-[#3c4043]'
                    }`}
                  >
                    <span>{getRoleLabel(r)}</span>
                    {user.role === r && <span className="text-[10px] text-[#1a73e8]">{t.active}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile bottom-style bar or secondary menu */}
      <div className="md:hidden flex items-center justify-around border-t border-[#f1f3f4] py-1 bg-white">
        <button
          onClick={() => setCurrentTab('home')}
          className={`px-3 py-1 text-xs font-medium cursor-pointer ${currentTab === 'home' ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}
        >
          {t.navHome}
        </button>
        <button
          onClick={() => setCurrentTab('map')}
          className={`px-3 py-1 text-xs font-medium cursor-pointer ${currentTab === 'map' ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}
        >
          {t.navMap}
        </button>
        <button
          onClick={() => setCurrentTab('assistant')}
          className={`px-3 py-1 text-xs font-medium cursor-pointer ${currentTab === 'assistant' ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}
        >
          {t.navAssistant}
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-3 py-1 text-xs font-medium cursor-pointer ${currentTab === 'dashboard' ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}
        >
          {t.navDashboard}
        </button>
        <button
          onClick={() => setCurrentTab('directory')}
          className={`px-3 py-1 text-xs font-medium cursor-pointer ${currentTab === 'directory' ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}
        >
          {t.navDirectory}
        </button>
      </div>
    </header>
  );
};

