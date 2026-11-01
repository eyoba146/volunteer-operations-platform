import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  List,
  X,
  DotsThreeOutline,
  House,
  ClipboardText,
  Calendar,
  QrCode,
  Clock,
  Money,
  ChartLineUp,
  ArrowsClockwise,
  Gear,
  UsersThree,
  Bell,
} from '@phosphor-icons/react';
import { AppSidebar } from './AppSidebar';
import { ProfilePhotoModal } from '../ui/ProfilePhotoModal';
import { DemoEmailInbox } from '../demo/DemoEmailInbox';
import { useToast } from '../ui/ToastContext';
import * as api from '../../api';

export const AppShellLayout: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vts_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [tabletOverlayOpen, setTabletOverlayOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);

  // Live badge counts
  const [badgeCounts, setBadgeCounts] = useState<{
    hoursWaiting?: number;
    applicationsWaiting?: number;
    promotionsWaiting?: number;
    needsReview?: number;
    unreadNotifications?: number;
  }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Load live counts for badges
  useEffect(() => {
    const loadBadges = async () => {
      try {
        const state = api.store.getState();
        const hoursWaiting = state.hours?.filter((h) => h.status === 'logged').length || 0;
        const applicationsWaiting = state.applications?.filter((a) => a.status === 'submitted' || a.status === 'in_review').length || 0;
        const promotionsWaiting = state.promotions?.filter((p) => p.status === 'recommended' || p.status === 'eligible').length || 0;
        const needsReview = state.payments?.filter((p) => p.status === 'needs_review').length || 0;
        const unreadNotifications = user ? state.notifications?.filter((n) => n.userId === user.id && !n.readAt).length || 0 : 0;

        setBadgeCounts({
          hoursWaiting,
          applicationsWaiting,
          promotionsWaiting,
          needsReview,
          unreadNotifications,
        });
      } catch {
        // Fallback
      }
    };

    loadBadges();
  }, [user, location.pathname]);

  // Persist sidebar collapse preference
  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vts_sidebar_collapsed', next.toString());
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
    setTabletOverlayOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
        setTabletOverlayOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.info('You have signed out of your account.');
    navigate('/sign-in');
  };

  if (!user) {
    return null;
  }

  const roleMeta = {
    applicant: { color: '#E58B05', label: 'Applicant desk' },
    volunteer: { color: '#1E824C', label: 'Volunteer trail' },
    team_lead: { color: '#D63927', label: 'Team lead dispatch' },
    manager: { color: '#0E6266', label: 'Operations desk' },
    finance: { color: '#111315', label: 'Finance desk' },
    admin: { color: '#202328', label: 'Admin home' },
  }[user.role] || { color: '#1E824C', label: 'Volunteer' };

  // Generate breadcrumb and page title based on current path
  const getBreadcrumb = () => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return { root: 'Home', current: '' };

    const fullPathTitles: Record<string, string> = {
      // Applicant
      '/applicant/status': 'My status',
      '/applicant/apply': 'Application form',
      '/applicant/payment': 'Telebirr payment',
      '/applicant/notifications': 'Messages',
      // Volunteer
      '/volunteer/home': 'Trail home',
      '/volunteer/activities': 'Activities',
      '/volunteer/my-activities': 'My roster',
      '/volunteer/check-in': 'Check-in',
      '/volunteer/hours': 'Logged hours',
      '/volunteer/rank-progress': 'Rank trail',
      '/volunteer/certificates': 'Certificates',
      '/volunteer/id-card': 'Volunteer ID pass',
      '/volunteer/profile': 'Profile',
      // Team lead
      '/team-lead/home': 'Dispatch desk',
      '/team-lead/activities': 'My activities',
      '/team-lead/approve-hours': 'Approve hours',
      '/team-lead/create-activity': 'Create activity',
      '/team-lead/ratings': 'Rate volunteers',
      '/team-lead/recommend-promotion': 'Recommend promotion',
      '/team-lead/announcements': 'Announcements',
      // Manager
      '/manager/dashboard': 'Operations desk',
      '/manager/applications': 'Application queue',
      '/manager/promotions': 'Promotions',
      '/manager/activities': 'All activities',
      '/manager/volunteers': 'Volunteer directory',
      '/manager/feedback': 'Feedback inbox',
      '/manager/reports': 'Reports',
      '/manager/announcements': 'Announcements',
      // Finance
      '/finance/overview': 'Finance desk',
      '/finance/payments': 'All payments',
      '/finance/needs-review': 'Review queue',
      '/finance/receipts-refunds': 'Receipts and refunds',
      '/finance/reports': 'Financial reports',
      // Admin
      '/admin/overview': 'Platform overview',
      '/admin/settings': 'Settings and emails',
      '/admin/rank-rules': 'Rank rules',
      '/admin/accounts': 'Accounts and roles',
      '/admin/activity-history': 'Activity history',
    };

    if (fullPathTitles[path]) {
      return {
        root: roleMeta.label,
        current: fullPathTitles[path],
      };
    }

    // Dynamic routes fallback
    if (path.startsWith('/volunteer/activities/')) {
      return {
        root: roleMeta.label,
        current: 'Activity detail',
      };
    }

    const currentKey = parts[parts.length - 1];
    return {
      root: roleMeta.label,
      current: currentKey.replace(/-/g, ' '),
    };
  };

  const breadcrumb = getBreadcrumb();

  // 4 Top Destinations for Mobile Dock per role
  const getMobileDockItems = () => {
    switch (user.role) {
      case 'applicant':
        return [
          { to: '/applicant/status', label: 'Status', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
          { to: '/applicant/apply', label: 'Apply', icon: <House className="w-5 h-5" weight="bold" /> },
          { to: '/applicant/payment', label: 'Payment', icon: <Money className="w-5 h-5" weight="bold" /> },
          { to: '/applicant/notifications', label: 'Messages', icon: <Bell className="w-5 h-5" weight="bold" /> },
        ];
      case 'volunteer':
        return [
          { to: '/volunteer/home', label: 'Home', icon: <House className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/activities', label: 'Activities', icon: <Calendar className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/check-in', label: 'Check-in', icon: <QrCode className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/hours', label: 'Hours', icon: <Clock className="w-5 h-5" weight="bold" /> },
        ];
      case 'team_lead':
        return [
          { to: '/team-lead/home', label: 'Dispatch', icon: <House className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/activities', label: 'Activities', icon: <Calendar className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/approve-hours', label: 'Approve', icon: <Clock className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/create-activity', label: 'Create', icon: <Calendar className="w-5 h-5" weight="bold" /> },
        ];
      case 'manager':
        return [
          { to: '/manager/dashboard', label: 'Dashboard', icon: <House className="w-5 h-5" weight="bold" /> },
          { to: '/manager/applications', label: 'Queue', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
          { to: '/manager/promotions', label: 'Promotions', icon: <ChartLineUp className="w-5 h-5" weight="bold" /> },
          { to: '/manager/activities', label: 'Activities', icon: <Calendar className="w-5 h-5" weight="bold" /> },
        ];
      case 'finance':
        return [
          { to: '/finance/overview', label: 'Overview', icon: <House className="w-5 h-5" weight="bold" /> },
          { to: '/finance/payments', label: 'Payments', icon: <Money className="w-5 h-5" weight="bold" /> },
          { to: '/finance/needs-review', label: 'Review', icon: <ArrowsClockwise className="w-5 h-5" weight="bold" /> },
          { to: '/finance/receipts-refunds', label: 'Receipts', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
        ];
      case 'admin':
        return [
          { to: '/admin/overview', label: 'Overview', icon: <House className="w-5 h-5" weight="bold" /> },
          { to: '/admin/settings', label: 'Settings', icon: <Gear className="w-5 h-5" weight="bold" /> },
          { to: '/admin/rank-rules', label: 'Rules', icon: <ChartLineUp className="w-5 h-5" weight="bold" /> },
          { to: '/admin/accounts', label: 'Accounts', icon: <UsersThree className="w-5 h-5" weight="bold" /> },
        ];
      default:
        return [];
    }
  };

  const mobileDockItems = getMobileDockItems();

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans flex flex-col">
      {/* DESKTOP FIXED SIDEBAR (1024px and up) */}
      <div
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 ${
          isCollapsed ? 'w-[72px]' : 'w-[264px]'
        } transition-[width] duration-200 ease-in-out border-r border-[#D5DAE1]`}
      >
        <AppSidebar
          user={user}
          profile={profile}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onSignOut={handleSignOut}
          onOpenPhotoModal={() => setPhotoModalOpen(true)}
          onOpenEmailInbox={() => setEmailInboxOpen(true)}
          badgeCounts={badgeCounts}
        />
      </div>

      {/* TABLET RAIL (768px to 1023px): Starts as 72px rail, expands as overlay on tap */}
      <div className="hidden md:block lg:hidden fixed top-0 left-0 bottom-0 z-30 w-[72px] border-r border-[#D5DAE1]">
        <AppSidebar
          user={user}
          profile={profile}
          isCollapsed={true}
          onToggleCollapse={() => setTabletOverlayOpen(true)}
          onSignOut={handleSignOut}
          onOpenPhotoModal={() => setPhotoModalOpen(true)}
          onOpenEmailInbox={() => setEmailInboxOpen(true)}
          badgeCounts={badgeCounts}
        />
      </div>

      {/* TABLET EXPANDED OVERLAY */}
      {tabletOverlayOpen && (
        <div className="hidden md:block lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setTabletOverlayOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 w-[264px] bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <AppSidebar
              user={user}
              profile={profile}
              isCollapsed={false}
              onToggleCollapse={() => setTabletOverlayOpen(false)}
              onSignOut={handleSignOut}
              onOpenPhotoModal={() => setPhotoModalOpen(true)}
              onOpenEmailInbox={() => setEmailInboxOpen(true)}
              badgeCounts={badgeCounts}
              onCloseMobileDrawer={() => setTabletOverlayOpen(false)}
            />
          </div>
        </div>
      )}

      {/* PHONE TOP HEADER (under 768px): Hamburger, Brand & Profile */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-[#D5DAE1] px-4 h-14 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-ink-primary hover:bg-canvas-subdued rounded-[6px] transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <List className="w-6 h-6" weight="bold" />
          </button>

          <Link to="/" className="font-display text-xl font-black tracking-tight text-ink-primary">
            VTS
          </Link>

          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: roleMeta.color }}
            title={roleMeta.label}
          />
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'admin' && (
            <button
              onClick={() => setEmailInboxOpen(true)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-secondary hover:text-ink-primary rounded-[6px]"
              title="Preview emails"
            >
              <Bell className="w-5 h-5" weight="bold" />
            </button>
          )}

          <button
            onClick={() => setPhotoModalOpen(true)}
            className="min-h-[44px] flex items-center gap-2 p-1 rounded-[6px] hover:bg-canvas-subdued cursor-pointer"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: roleMeta.color }}
            />
            <span className="text-[13px] font-semibold text-ink-primary truncate max-w-[120px]">
              {profile?.fullName || user.username}
            </span>
          </button>
        </div>
      </header>

      {/* PHONE SLIDE-IN SIDEBAR DRAWER WITH SCRIM */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[6px] text-ink-tertiary hover:text-ink-primary hover:bg-canvas-subdued transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" weight="bold" />
              </button>
            </div>
            <AppSidebar
              user={user}
              profile={profile}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onSignOut={handleSignOut}
              onOpenPhotoModal={() => setPhotoModalOpen(true)}
              onOpenEmailInbox={() => setEmailInboxOpen(true)}
              badgeCounts={badgeCounts}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[padding-left] duration-200 ease-in-out ${
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[264px]'
        } md:pl-[72px]`}
      >
        {/* SLIM PAGE HEADER: Breadcrumb, Title & Quick Actions */}
        <div className="hidden md:block sticky top-0 z-20 bg-white border-b border-[#D5DAE1] px-6 lg:px-8 py-3 select-none">
          <div className="flex items-center justify-between gap-4">
            {/* Breadcrumb & Section indicator */}
            <div className="flex items-center gap-2 text-[13px] text-ink-secondary truncate">
              <span className="font-medium text-ink-tertiary">
                {breadcrumb.root}
              </span>
              <span className="text-ink-tertiary">/</span>
              <span className="font-semibold text-ink-primary truncate">
                {breadcrumb.current}
              </span>
            </div>

            {/* Quick Context & Simulator Trigger */}
            <div className="flex items-center gap-3 shrink-0">
              {user.role === 'admin' && (
                <button
                  onClick={() => setEmailInboxOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#D5DAE1] bg-canvas-subdued/50 hover:bg-canvas-subdued text-[13px] font-semibold text-ink-primary transition-colors cursor-pointer"
                  title="Preview transactional emails"
                >
                  <Bell className="w-4 h-4 text-ink-secondary" weight="bold" />
                  <span>Preview emails</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Outlet */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* PHONE FLOATING BOTTOM DOCK (< 768px): 4 primary destinations + More button */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-white border border-[#D5DAE1] rounded-[12px] p-1.5 flex items-center justify-around shadow-xl">
        {mobileDockItems.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-[8px] cursor-pointer transition-colors ${
                isActive
                  ? 'text-ink-primary font-bold bg-canvas-subdued'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {item.icon}
              <span className="text-[12px] font-sans tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-[8px] text-ink-secondary hover:text-ink-primary cursor-pointer transition-colors"
          aria-label="More navigation options"
        >
          <DotsThreeOutline className="w-5 h-5" weight="bold" />
          <span className="text-[12px] font-sans tracking-tight">More</span>
        </button>
      </div>

      {/* Profile Photo Upload Modal */}
      <ProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
      />

      {/* Demo Email Inbox Modal */}
      <DemoEmailInbox
        isOpen={emailInboxOpen}
        onClose={() => setEmailInboxOpen(false)}
      />
    </div>
  );
};
