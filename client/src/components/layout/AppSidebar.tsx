import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  House,
  ClipboardText,
  Calendar,
  QrCode,
  Clock,
  ChartLineUp,
  Certificate,
  IdentificationCard,
  User as UserIcon,
  UsersThree,
  Megaphone,
  ChartBar,
  Money,
  ArrowsClockwise,
  Gear,
  Scroll,
  SignOut,
  Envelope,
  Bell,
  SidebarSimple,
  ChatCircleText,
  PlusCircle,
  Star,
  Buildings,
  ShieldCheck,
  UserPlus,
} from '@phosphor-icons/react';
import { Avatar } from '../ui/Avatar';
import { TrailMeter } from '../signature';
import { formatRank, formatRole } from '../../utils/format';
import { User, VolunteerProfile, PermissionModule, PermissionAction } from '../../types';
import { can } from '../../utils/permissions';

export interface NavGroupConfig {
  title?: string;
  items: {
    to: string;
    label: string;
    icon: React.ReactNode;
    badgeCount?: number;
    badgeVariant?: 'teamlead' | 'manager' | 'finance' | 'neutral';
    module?: PermissionModule;
    action?: PermissionAction;
  }[];
}

interface AppSidebarProps {
  user: User;
  profile?: VolunteerProfile | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut: () => void;
  onOpenPhotoModal: () => void;
  onOpenEmailInbox?: () => void;
  badgeCounts: {
    hoursWaiting?: number;
    applicationsWaiting?: number;
    promotionsWaiting?: number;
    needsReview?: number;
    unreadNotifications?: number;
  };
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  profile,
  isCollapsed,
  onToggleCollapse,
  onSignOut,
  onOpenPhotoModal,
  onOpenEmailInbox,
  badgeCounts,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const displayName =
    profile?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    user?.username ||
    'Volunteer';

  const roleMeta = {
    applicant: { color: '#E58B05', label: 'Applicant desk' },
    volunteer: { color: '#1E824C', label: 'Volunteer trail' },
    team_lead: { color: '#D63927', label: 'Team lead dispatch' },
    manager: { color: '#0E6266', label: 'Operations desk' },
    finance: { color: '#111315', label: 'Finance desk' },
    admin: { color: '#202328', label: 'Admin home' },
  }[user.role] || { color: '#1E824C', label: 'Volunteer' };

  // Role navigation groups
  const getNavGroups = (): NavGroupConfig[] => {
    switch (user.role) {
      case 'applicant':
        return [
          {
            title: 'Application trail',
            items: [
              { to: '/applicant/status', label: 'My status', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
              { to: '/applicant/apply', label: 'Application form', icon: <UserIcon className="w-5 h-5" weight="bold" /> },
              { to: '/applicant/payment', label: 'Telebirr payment', icon: <Money className="w-5 h-5" weight="bold" /> },
              {
                to: '/applicant/notifications',
                label: 'Messages',
                icon: <Bell className="w-5 h-5" weight="bold" />,
                badgeCount: badgeCounts.unreadNotifications,
                badgeVariant: 'teamlead',
              },
            ],
          },
        ];

      case 'volunteer':
        return [
          {
            title: 'Service trail',
            items: [
              { to: '/volunteer/home', label: 'Trail home', icon: <House className="w-5 h-5" weight="bold" /> },
              { to: '/volunteer/activities', label: 'Activities', icon: <Calendar className="w-5 h-5" weight="bold" /> },
              { to: '/volunteer/my-activities', label: 'My roster', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
              { to: '/volunteer/check-in', label: 'Check-in', icon: <QrCode className="w-5 h-5" weight="bold" /> },
            ],
          },
          {
            title: 'Milestones',
            items: [
              { to: '/volunteer/hours', label: 'Logged hours', icon: <Clock className="w-5 h-5" weight="bold" /> },
              { to: '/volunteer/rank-progress', label: 'Rank trail', icon: <ChartLineUp className="w-5 h-5" weight="bold" /> },
              { to: '/volunteer/certificates', label: 'Certificates', icon: <Certificate className="w-5 h-5" weight="bold" /> },
            ],
          },
          {
            title: 'Identity',
            items: [
              { to: '/volunteer/id-card', label: 'Volunteer ID pass', icon: <IdentificationCard className="w-5 h-5" weight="bold" /> },
              { to: '/volunteer/profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" weight="bold" /> },
            ],
          },
        ];

      case 'team_lead':
        return [
          {
            title: 'Field dispatch',
            items: [
              { to: '/team-lead/home', label: 'Dispatch desk', icon: <House className="w-5 h-5" weight="bold" /> },
              { to: '/team-lead/activities', label: 'My activities', icon: <Calendar className="w-5 h-5" weight="bold" /> },
              {
                to: '/team-lead/approve-hours',
                label: 'Approve hours',
                icon: <Clock className="w-5 h-5" weight="bold" />,
                badgeCount: badgeCounts.hoursWaiting,
                badgeVariant: 'teamlead',
              },
              { to: '/team-lead/create-activity', label: 'Create activity', icon: <PlusCircle className="w-5 h-5" weight="bold" /> },
            ],
          },
          {
            title: 'Coordination',
            items: [
              { to: '/team-lead/ratings', label: 'Rate volunteers', icon: <Star className="w-5 h-5" weight="bold" /> },
              { to: '/team-lead/recommend-promotion', label: 'Recommend promotion', icon: <ChartLineUp className="w-5 h-5" weight="bold" /> },
              { to: '/team-lead/announcements', label: 'Announcements', icon: <Megaphone className="w-5 h-5" weight="bold" /> },
            ],
          },
        ];

      case 'manager':
        return [
          {
            title: 'Operations',
            items: [
              { to: '/manager/dashboard', label: 'Operations desk', icon: <House className="w-5 h-5" weight="bold" /> },
              {
                to: '/manager/applications',
                label: 'Application queue',
                icon: <ClipboardText className="w-5 h-5" weight="bold" />,
                badgeCount: badgeCounts.applicationsWaiting,
                badgeVariant: 'manager',
                module: 'applications',
                action: 'view',
              },
              {
                to: '/manager/register-volunteer',
                label: 'Register volunteer',
                icon: <UserPlus className="w-5 h-5" weight="bold" />,
                module: 'volunteers',
                action: 'create',
              },
              {
                to: '/manager/promotions',
                label: 'Promotions',
                icon: <ChartLineUp className="w-5 h-5" weight="bold" />,
                badgeCount: badgeCounts.promotionsWaiting,
                badgeVariant: 'manager',
                module: 'promotions',
                action: 'approve',
              },
              { to: '/manager/activities', label: 'All activities', icon: <Calendar className="w-5 h-5" weight="bold" />, module: 'activities', action: 'view' },
            ],
          },
          {
            title: 'Community and impact',
            items: [
              { to: '/manager/volunteers', label: 'Volunteer directory', icon: <UsersThree className="w-5 h-5" weight="bold" />, module: 'volunteers', action: 'view' },
              { to: '/manager/feedback', label: 'Feedback inbox', icon: <ChatCircleText className="w-5 h-5" weight="bold" />, module: 'volunteers', action: 'view' },
              { to: '/manager/reports', label: 'Reports', icon: <ChartBar className="w-5 h-5" weight="bold" />, module: 'reports', action: 'view' },
              { to: '/manager/announcements', label: 'Announcements', icon: <Megaphone className="w-5 h-5" weight="bold" />, module: 'announcements', action: 'create' },
            ],
          },
        ];

      case 'finance':
        return [
          {
            title: 'Settlement ledger',
            items: [
              { to: '/finance/overview', label: 'Finance desk', icon: <House className="w-5 h-5" weight="bold" /> },
              { to: '/finance/payments', label: 'All payments', icon: <Money className="w-5 h-5" weight="bold" />, module: 'payments', action: 'view' },
              {
                to: '/finance/needs-review',
                label: 'Review queue',
                icon: <ArrowsClockwise className="w-5 h-5" weight="bold" />,
                badgeCount: badgeCounts.needsReview,
                badgeVariant: 'finance',
                module: 'payments',
                action: 'verify',
              },
              { to: '/finance/receipts-refunds', label: 'Receipts and refunds', icon: <Scroll className="w-5 h-5" weight="bold" />, module: 'payments', action: 'view' },
              { to: '/finance/reports', label: 'Financial reports', icon: <ChartBar className="w-5 h-5" weight="bold" />, module: 'reports', action: 'view' },
            ],
          },
        ];

      case 'admin':
        return [
          {
            title: 'Platform desk',
            items: [
              { to: '/admin/overview', label: 'Admin home', icon: <House className="w-5 h-5" weight="bold" /> },
              { to: '/admin/organisation', label: 'Organisation units', icon: <Buildings className="w-5 h-5" weight="bold" />, module: 'organisation', action: 'view' },
              { to: '/admin/roles-permissions', label: 'Roles and permissions', icon: <ShieldCheck className="w-5 h-5" weight="bold" />, module: 'settings', action: 'view' },
              { to: '/admin/settings', label: 'Settings and emails', icon: <Gear className="w-5 h-5" weight="bold" />, module: 'settings', action: 'edit' },
              { to: '/admin/rank-rules', label: 'Rank rules', icon: <ChartLineUp className="w-5 h-5" weight="bold" />, module: 'settings', action: 'edit' },
            ],
          },
          {
            title: 'Management and history',
            items: [
              { to: '/admin/accounts', label: 'Accounts and roles', icon: <UsersThree className="w-5 h-5" weight="bold" />, module: 'accounts', action: 'edit' },
              { to: '/admin/activity-history', label: 'Activity history', icon: <Scroll className="w-5 h-5" weight="bold" />, module: 'settings', action: 'view' },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const navGroups = getNavGroups()
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => !item.module || can(user, item.module, item.action || 'view')),
    }))
    .filter((g) => g.items.length > 0);
  const effectiveCollapsed = isCollapsed && !isMobileDrawer;

  return (
    <aside
      className={`h-full bg-[#F7F8FA] flex flex-col justify-between select-none ${
        effectiveCollapsed ? 'w-[72px]' : 'w-[264px]'
      } transition-[width] duration-200 ease-in-out`}
    >
      {/* Top Header Section */}
      <div className="shrink-0 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              navigate('/');
              onCloseMobileDrawer?.();
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <span className="font-display font-black text-2xl tracking-tight text-ink-primary group-hover:opacity-80 transition-opacity">
              VTS
            </span>
          </button>

          {!isMobileDrawer && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-[8px] text-ink-tertiary hover:text-ink-primary hover:bg-[#F1F3F6] transition-colors cursor-pointer"
              title={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar to rail'}
              aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <SidebarSimple className="w-4 h-4" weight="bold" />
            </button>
          )}
        </div>

        {/* Role Marker Block */}
        {!effectiveCollapsed ? (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-[10px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] text-[13px]">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: roleMeta.color }}
            />
            <span className="font-semibold text-ink-primary truncate">
              {roleMeta.label}
            </span>
          </div>
        ) : (
          <div className="mt-3 flex justify-center">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: roleMeta.color }}
              title={roleMeta.label}
            />
          </div>
        )}
      </div>

      {/* Nav Items List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!effectiveCollapsed && group.title && (
              <div className="px-3 pb-1 text-[13px] font-semibold text-ink-tertiary">
                {group.title}
              </div>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to || (item.to !== `/${user.role === 'team_lead' ? 'team-lead' : user.role}/home` && item.to !== `/${user.role === 'team_lead' ? 'team-lead' : user.role}/dashboard` && location.pathname.startsWith(item.to + '/'));

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => onCloseMobileDrawer?.()}
                    aria-current={isActive ? 'page' : undefined}
                    title={effectiveCollapsed ? item.label : undefined}
                    className={({ isActive: linkActive }) => {
                      const active = linkActive || isActive;
                      return `relative flex items-center min-h-[44px] rounded-[6px] text-[13px] font-sans font-medium transition-all cursor-pointer ${
                        effectiveCollapsed
                          ? 'justify-center px-2'
                          : 'gap-3 px-3'
                      } ${
                        active
                          ? 'font-bold text-ink-primary'
                          : 'text-ink-secondary hover:text-ink-primary hover:bg-canvas-subdued/80'
                      }`;
                    }}
                    style={({ isActive: linkActive }) => {
                      const active = linkActive || isActive;
                      return active
                        ? {
                            backgroundColor: `${roleMeta.color}14`,
                          }
                        : {};
                    }}
                  >
                    <span className="shrink-0">{item.icon}</span>

                    {!effectiveCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {/* Live Count Badge */}
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      !effectiveCollapsed ? (
                        <span
                          className={`font-mono text-[13px] font-bold px-2 py-0.5 rounded-full ${
                            item.badgeVariant === 'teamlead'
                              ? 'bg-role-teamlead text-white'
                              : item.badgeVariant === 'manager'
                              ? 'bg-role-manager text-white'
                              : item.badgeVariant === 'finance'
                              ? 'bg-[#784E0B] text-white'
                              : 'bg-ink-primary text-white'
                          } `}
                        >
                          {item.badgeCount}
                        </span>
                      ) : (
                        <span
                          className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                            item.badgeVariant === 'teamlead'
                              ? 'bg-role-teamlead'
                              : item.badgeVariant === 'manager'
                              ? 'bg-role-manager'
                              : item.badgeVariant === 'finance'
                              ? 'bg-[#784E0B]'
                              : 'bg-ink-primary'
                          } `}
                        />
                      )
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer Section */}
      <div className="shrink-0 p-3 space-y-2 bg-[#F7F8FA]">
        {/* Admin Preview Emails shortcut */}
        {user.role === 'admin' && onOpenEmailInbox && (
          <button
            onClick={() => {
              onOpenEmailInbox();
              onCloseMobileDrawer?.();
            }}
            className={`w-full flex items-center min-h-[44px] rounded-[10px] bg-white text-ink-primary text-[13px] font-semibold hover:bg-[#F1F3F6] shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors cursor-pointer ${
              effectiveCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
            } `}
            title="Preview transactional emails"
          >
            <Envelope className="w-4 h-4 text-ink-secondary" weight="bold" />
            {!effectiveCollapsed && <span>Preview emails</span>}
          </button>
        )}

        {/* Compact Trail Progress for Volunteer and Team Lead */}
        {!effectiveCollapsed && (user.role === 'volunteer' || user.role === 'team_lead') && (
          <div className="bg-white p-3 rounded-[12px] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <TrailMeter
              variant="compact"
              currentHours={user.role === 'team_lead' ? 120 : (profile?.rank === 'senior_volunteer' || profile?.rank === 'senior_member' ? 52.5 : 16.5)}
              currentRank={profile?.rank || 'volunteer'}
            />
          </div>
        )}

        {/* User Profile Block */}
        <div
          className={`flex items-center rounded-[12px] bg-white p-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${
            effectiveCollapsed ? 'justify-center' : 'justify-between'
          } `}
        >
          <button
            onClick={() => {
              onOpenPhotoModal();
              onCloseMobileDrawer?.();
            }}
            className="flex items-center gap-2.5 text-left truncate cursor-pointer hover:opacity-85 transition-opacity"
            title="Update portrait photo"
          >
            <div className="relative shrink-0">
              <Avatar
                name={displayName}
                photoUrl={profile?.photoUrl}
                avatarUrl={user?.avatarUrl || profile?.avatarUrl}
                size="sm"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: roleMeta.color }}
              />
            </div>

            {!effectiveCollapsed && (
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-ink-primary block text-[13px] truncate leading-tight">
                  {displayName}
                </span>
                <span className="text-[13px] text-ink-secondary block truncate">
                  {profile?.rank ? formatRank(profile.rank) : formatRole(user.role)}
                </span>
              </div>
            )}
          </button>

          {!effectiveCollapsed && (
            <button
              onClick={() => {
                onSignOut();
                onCloseMobileDrawer?.();
              }}
              className="p-1.5 text-ink-tertiary hover:text-red-600 rounded-[6px] hover:bg-[#F1F3F6] transition-colors cursor-pointer shrink-0"
              title="Sign out"
              aria-label="Sign out"
            >
              <SignOut className="w-4 h-4" weight="bold" />
            </button>
          )}
        </div>

        {/* Collapsed Rail Sign Out Icon */}
        {effectiveCollapsed && (
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center min-h-[44px] rounded-[8px] text-ink-secondary hover:text-red-600 hover:bg-[#F1F3F6] transition-colors cursor-pointer"
            title="Sign out"
            aria-label="Sign out"
          >
            <SignOut className="w-4 h-4" weight="bold" />
          </button>
        )}
      </div>
    </aside>
  );
};

