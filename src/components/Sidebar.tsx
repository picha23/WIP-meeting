import React from 'react';
import { WorkspaceView, UserProfile } from '../types';
import {
  CheckSquare,
  FileText,
  Archive,
  AlertTriangle,
  HardDrive,
  ExternalLink,
  X,
  Cloud
} from 'lucide-react';

interface SidebarProps {
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  storageUsage: string;
  onOpenStorageModal: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  themeColor: 'green' | 'indigo';
  blockerCount: number;
  isCloudConnected?: boolean;
  userProfile?: UserProfile;
  userPhoto?: string;
  onOpenEditProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  storageUsage,
  onOpenStorageModal,
  isOpenMobile = false,
  onCloseMobile,
  themeColor,
  blockerCount,
  isCloudConnected = false,
  userProfile = {
    name: 'Amri Faizal',
    email: 'amri.faizal@bigtree.com.my',
    role: 'Senior Product Designer'
  },
  userPhoto,
  onOpenEditProfile
}) => {
  const navItems = [
    {
      id: 'weekly-deliverables' as WorkspaceView,
      label: 'Weekly Deliverables',
      icon: CheckSquare,
      badge: null
    },
    {
      id: 'report-generator' as WorkspaceView,
      label: 'Report Generator',
      icon: FileText,
      badge: 'Live'
    },
    {
      id: 'weekly-sprints-archive' as WorkspaceView,
      label: 'Weekly Sprints Archive',
      icon: Archive,
      badge: null
    },
    {
      id: 'blockers-and-risks' as WorkspaceView,
      label: 'Blockers & Risks',
      icon: AlertTriangle,
      badge: blockerCount > 0 ? `${blockerCount}` : null,
      badgeError: true
    }
  ];

  const primaryContainerClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white shadow-sm'
      : 'bg-[#218300] text-white shadow-sm';

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase() || 'AF';
  };

  const initials = getInitials(userProfile.name);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-14 bottom-0 w-64 bg-white z-40 flex flex-col justify-between p-3.5 border-r border-[#e5e1e7] shadow-[0_1px_8px_rgba(0,0,0,0.02)] transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-2">
          {/* Mobile close button */}
          <div className="flex items-center justify-between px-2 py-1 md:hidden">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#404a3a]">
              Navigation
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 text-[#404a3a] hover:text-[#1c1b1f] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Workspace Profile Card */}
          <div
            onClick={onOpenEditProfile}
            className="mb-1 p-2.5 rounded-xl bg-gradient-to-br from-[#f8f5fa] to-[#edf7ee] border border-[#e5e1e7] hover:border-[#218300]/40 transition-all cursor-pointer group shadow-xs"
            title="Klik untuk kemaskini nama & profil pengguna"
          >
            <div className="flex items-center gap-2.5">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userProfile.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#e5e1e7] shrink-0"
                />
              ) : (
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${
                    themeColor === 'indigo' ? 'bg-[#4f46e5]' : 'bg-[#218300]'
                  }`}
                >
                  {initials}
                </div>
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#1c1b1f] truncate leading-tight group-hover:text-[#218300] transition-colors">
                    {userProfile.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Aktif" />
                </div>
                <span className="text-[10px] text-[#556050] truncate font-medium">
                  {userProfile.role}
                </span>
              </div>
            </div>
          </div>

          <div className="px-2 pt-1 text-[#404a3a] text-[11px] font-semibold uppercase tracking-wider hidden md:block">
            Workspace Views
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] leading-[18px] font-medium transition-all ${
                    isActive
                      ? `${primaryContainerClass} font-semibold`
                      : 'text-[#404a3a] hover:bg-[#f6f2f8] hover:text-[#1c1b1f]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeError
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#ebe7ec] text-[#404a3a]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Storage Engine Widget */}
        <div className="p-3 rounded-xl bg-[#f6f2f8] border border-[#e5e1e7] flex flex-col gap-2">
          <div className="flex items-center justify-between text-[#1c1b1f] text-[11px] font-semibold tracking-wider">
            <span className="flex items-center gap-1.5">
              {isCloudConnected ? (
                <Cloud className="w-3.5 h-3.5 text-[#186700]" />
              ) : (
                <HardDrive className="w-3.5 h-3.5 text-[#186700]" />
              )}
              <span>Storage Engine</span>
            </span>
            <span className="text-[10px] text-[#186700] font-mono font-semibold">
              {isCloudConnected ? 'Cloud Firestore' : 'Local IndexedDB'}
            </span>
          </div>

          <div className="w-full bg-[#e5e1e7] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${isCloudConnected ? 'w-[75%]' : 'w-[38%]'} rounded-full ${
                themeColor === 'indigo' ? 'bg-[#4f46e5]' : 'bg-[#218300]'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[#404a3a] text-[11px]">
            <span>{isCloudConnected ? 'Real-time sync' : storageUsage}</span>
            <button
              onClick={onOpenStorageModal}
              className={`font-semibold hover:underline flex items-center gap-0.5 ${
                themeColor === 'indigo' ? 'text-[#4f46e5]' : 'text-[#186700]'
              }`}
            >
              <span>Manage</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
