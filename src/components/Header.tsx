import React from 'react';
import { SprintWeek } from '../types';
import { Calendar, CheckCircle2, ChevronDown, Menu, User, Palette } from 'lucide-react';

interface HeaderProps {
  currentWeek: SprintWeek;
  weeks: SprintWeek[];
  onSelectWeek: (weekId: string) => void;
  onOpenMobileMenu?: () => void;
  themeColor: 'green' | 'indigo';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeek,
  weeks,
  onSelectWeek,
  onOpenMobileMenu,
  themeColor,
  onToggleTheme,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-between px-4 sm:px-6 border-b border-[#e5e1e7] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
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
              // Graceful SVG fallback if external link is restricted
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
            </div>
            <span className="text-[11px] text-[#404a3a] leading-tight hidden sm:inline-block font-medium">
              Weekly Deliverables & Meeting Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Header Context Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Sprint Week Switcher */}
        <div className="relative inline-flex items-center bg-[#f6f2f8] border border-[#e5e1e7] hover:border-[#bfcab5] rounded-full px-3 py-1 shadow-sm transition-all">
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

        {/* Auto-saved Live Ping Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#beedd3]/50 px-2.5 py-1 rounded-full text-[#3c6753]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#186700] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#186700]"></span>
          </span>
          <span className="text-[11px] font-semibold whitespace-nowrap">Auto-saved locally</span>
        </div>

        {/* Theme Accent Switcher */}
        <button
          onClick={onToggleTheme}
          title={`Switch color theme (currently ${themeColor})`}
          className="flex items-center gap-1 p-1.5 rounded-lg text-[#404a3a] hover:bg-[#f0ecf2] hover:text-[#1c1b1f] transition-colors"
          type="button"
        >
          <Palette className="w-4 h-4" />
          <span className="text-[11px] font-mono hidden md:inline capitalize">{themeColor}</span>
        </button>

        {/* Workspace Identity Profile */}
        <div className="hidden xl:flex flex-col text-right">
          <span className="text-[13px] text-[#1c1b1f] font-semibold leading-none">Solo Workspace</span>
          <span className="text-[11px] text-[#404a3a] leading-tight">Senior Product Designer</span>
        </div>

        {/* User Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-[13px] shadow-sm ${
            themeColor === 'indigo'
              ? 'bg-[#4f46e5] text-white'
              : 'bg-[#218300] text-white'
          }`}
          title="Solo Workspace Account Profile"
        >
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
