import React, { useState } from 'react';
import { SprintWeek, UserProfile } from '../types';
import {
  Calendar,
  ChevronDown,
  Menu,
  Palette,
  LogIn,
  LogOut,
  Cloud,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  currentWeek: SprintWeek;
  weeks: SprintWeek[];
  onSelectWeek: (weekId: string) => void;
  onOpenMobileMenu?: () => void;
  themeColor: 'green' | 'indigo';
  onToggleTheme: () => void;
  user: FirebaseUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing: boolean;
  userProfile: UserProfile;
  onOpenEditProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeek,
  weeks,
  onSelectWeek,
  onOpenMobileMenu,
  themeColor,
  onToggleTheme,
  user,
  onSignIn,
  onSignOut,
  isSyncing,
  userProfile,
  onOpenEditProfile
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Active display name and email prioritizing Google Auth, falling back to local userProfile
  const activeDisplayName = user?.displayName || userProfile.name || 'Amri Faizal';
  const activeEmail = user?.email || userProfile.email || 'amri.faizal@bigtree.com.my';
  const activePhoto = user?.photoURL || userProfile.avatarUrl;

  // Generate initials (e.g., "Amri Faizal" -> "AF")
  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase() || 'AF';
  };

  const initials = getInitials(activeDisplayName);

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-between px-3 sm:px-6 border-b border-[#e5e1e7] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      {/* Brand & App Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-[#404a3a] hover:bg-[#f0ecf2] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1Uj344hP7thjTEqeTYaY8CD_ZxukUtVk_8xPRKflGGklWHA5Ojqge_i-g4bbmT96zehV1iYkM6S67yKrz-5fGD4q5BZzC-4ICvKIsBfoQRVp8c1uMhv291LU4PmMFwmf8rvvJ1Gh_qu6oberMll0sL-DVQ19NSjJzSKvowiE0VwG_wDNz4mnP8CtTISehYNBh_r-OdUeIzBLfRNBRWpAXEr-oWH39hfHk7F58n2Dz_jxa1jyf2DxVHwZg"
            alt="WIP Tracker Logo"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] text-[#1c1b1f] font-bold leading-none tracking-tight">
                WIP Tracker
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                  themeColor === 'indigo'
                    ? 'bg-[#4f46e5] text-white'
                    : 'bg-[#218300] text-[#e5ffd5]'
                }`}
              >
                v2.4
              </span>
              {user && (
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                  🔥 Cloud
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#404a3a] leading-tight hidden sm:inline-block font-medium">
              Weekly Deliverables & Meeting Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Header Context Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Sprint Week Switcher */}
        <div className="relative inline-flex items-center bg-[#f6f2f8] border border-[#e5e1e7] hover:border-[#bfcab5] rounded-full px-2.5 sm:px-3 py-1 shadow-sm transition-all">
          <Calendar className="w-3.5 h-3.5 text-[#404a3a] mr-1.5 shrink-0" />
          <span className="text-[12px] text-[#1c1b1f] font-semibold mr-1.5 whitespace-nowrap">
            {currentWeek.shortLabel || `Week ${currentWeek.weekNumber}`}
          </span>
          <span className="text-[11px] text-[#404a3a] hidden lg:inline mr-1 whitespace-nowrap">
            ({currentWeek.dateRange})
          </span>
          <select
            value={currentWeek.id}
            onChange={(e) => onSelectWeek(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
            aria-label="Change current sprint week"
          >
            {weeks.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#404a3a] pointer-events-none" />
        </div>

        {/* Cloud Sync Status Badge */}
        {user ? (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#beedd3]/50 px-2.5 py-1 rounded-full text-[#005338]">
            <span className="relative flex h-2 w-2">
              <span
                className={`inline-flex h-full w-full rounded-full bg-[#186700] ${
                  isSyncing ? 'animate-ping' : ''
                }`}
              />
            </span>
            <Cloud className="w-3 h-3 text-[#186700]" />
            <span className="text-[11px] font-semibold whitespace-nowrap hidden lg:inline">
              Firestore Synced
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#f0ecf2] px-2.5 py-1 rounded-full text-[#404a3a]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#404a3a]" />
            <span className="text-[11px] font-medium whitespace-nowrap hidden lg:inline">
              Local Storage
            </span>
          </div>
        )}

        {/* Theme Accent Switcher */}
        <button
          onClick={onToggleTheme}
          title={`Switch color theme (currently ${themeColor})`}
          className="flex items-center gap-1 p-1.5 rounded-lg text-[#404a3a] hover:bg-[#f0ecf2] hover:text-[#1c1b1f] transition-colors"
          type="button"
        >
          <Palette className="w-4 h-4" />
          <span className="text-[11px] font-mono hidden xl:inline capitalize">{themeColor}</span>
        </button>

        {/* PROMINENT USER NAME DISPLAY & PROFILE PILL */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#f6f2f8] border border-[#e5e1e7] hover:border-[#218300]/40 hover:bg-[#efeaf2] transition-all shadow-xs"
            type="button"
            title="Profil Pengguna & Tetapan Akaun"
          >
            {/* Avatar image or Initials badge */}
            {activePhoto ? (
              <img
                src={activePhoto}
                alt={activeDisplayName}
                className="w-7 h-7 rounded-full object-cover border border-[#e5e1e7]"
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] text-white shadow-xs ${
                  themeColor === 'indigo' ? 'bg-[#4f46e5]' : 'bg-[#218300]'
                }`}
              >
                {initials}
              </div>
            )}

            {/* User Name & Role (Visible in Header!) */}
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-bold text-[#1c1b1f] leading-tight truncate max-w-[120px] sm:max-w-[160px]">
                {activeDisplayName}
              </span>
              <span className="text-[10px] text-[#556050] leading-none truncate max-w-[120px] sm:max-w-[160px] hidden sm:inline">
                {user ? 'Google Account' : userProfile.role || 'Senior Product Designer'}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#556050] ml-0.5" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e5e1e7] py-2.5 z-50 animate-in fade-in zoom-in-95">
              {/* Profile Card Summary */}
              <div className="px-4 py-3 border-b border-[#e5e1e7] bg-[#fcf8fe]/60">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-xs shrink-0 ${
                      themeColor === 'indigo' ? 'bg-[#4f46e5]' : 'bg-[#218300]'
                    }`}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1c1b1f] truncate">
                      {activeDisplayName}
                    </p>
                    <p className="text-[11px] text-[#556050] truncate">{activeEmail}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e5e1e7] text-[#404a3a]">
                      {userProfile.role}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#186700] font-medium bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{user ? 'Disegerakkan dengan Firebase Cloud' : 'Storan Tempatan (Offline-First)'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-2 pt-2 flex flex-col gap-1">
                {/* Edit Profile / Name */}
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenEditProfile();
                  }}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-[#1c1b1f] hover:bg-[#f6f2f8] rounded-xl transition-colors text-left"
                >
                  <Edit3 className="w-4 h-4 text-[#556050]" />
                  <span>Kemaskini Nama & Jawatan</span>
                </button>

                {/* Google Sign In / Sign Out */}
                {user ? (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut();
                    }}
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Keluar dari Firebase</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignIn();
                    }}
                    type="button"
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-[12px] font-semibold ${primaryBtnClass} rounded-xl shadow-xs transition-all mt-1`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log Masuk dengan Google</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
