import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  CheckCircle,
  PlusCircle,
  Star,
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
  List,
  X,
  MagnifyingGlass,
  ArrowClockwise,
  ChatCircleText,
  Camera,
} from '@phosphor-icons/react';
import { Avatar, StatusMark, Button, ProfilePhotoModal } from '../ui';
import { DemoEmailInbox } from '../demo/DemoEmailInbox';
import { store } from '../../api';
import { useToast } from '../ui/ToastContext';

interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export const AppShellLayout: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast.info('You have signed out of your account.');
    navigate('/sign-in');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to initial seed state?')) {
      store.resetAll();
      window.location.reload();
    }
  };

  const displayName =
    profile?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    user?.username ||
    'Volunteer';

  // Role metadata: color marker & label
  const roleMeta = {
    applicant: {
      color: '#E58B05',
      label: 'Applicant desk',
    },
    volunteer: {
      color: '#1E824C',
      label: 'Volunteer trail',
    },
    team_lead: {
      color: '#D63927',
      label: 'Team lead dispatch',
    },
    manager: {
      color: '#0E6266',
      label: 'Operations desk',
    },
    finance: {
      color: '#111315',
      label: 'Finance desk',
    },
    admin: {
      color: '#202328',
      label: 'Admin home',
    },
  }[user?.role || 'volunteer'];

  // Navigation links based on user role (all in sentence case)
  const getNavItems = (): NavItemConfig[] => {
    if (!user) return [];

    switch (user.role) {
      case 'applicant':
        return [
          { to: '/applicant/status', label: 'My status', icon: <ClipboardText className="w-4 h-4" weight="bold" /> },
          { to: '/applicant/apply', label: 'Application form', icon: <UserIcon className="w-4 h-4" weight="bold" /> },
          { to: '/applicant/payment', label: 'Telebirr payment', icon: <Money className="w-4 h-4" weight="bold" /> },
          { to: '/applicant/notifications', label: 'Messages', icon: <Bell className="w-4 h-4" weight="bold" /> },
        ];

      case 'volunteer':
        return [
          { to: '/volunteer/home', label: 'Trail home', icon: <House className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/activities', label: 'Activities', icon: <Calendar className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/my-activities', label: 'My roster', icon: <ClipboardText className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/check-in', label: 'Check-in', icon: <QrCode className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/hours', label: 'Logged hours', icon: <Clock className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/rank-progress', label: 'Rank trail', icon: <ChartLineUp className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/certificates', label: 'Certificates', icon: <Certificate className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/id-card', label: 'Volunteer ID pass', icon: <IdentificationCard className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" weight="bold" /> },
        ];

      case 'team_lead':
        return [
          { to: '/team-lead/home', label: 'Dispatch desk', icon: <House className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/activities', label: 'My activities', icon: <Calendar className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/check-in-code', label: 'Check-in code', icon: <QrCode className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/approve-hours', label: 'Approve hours', icon: <Clock className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/volunteers', label: 'Volunteer directory', icon: <UsersThree className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" weight="bold" /> },
        ];

      case 'manager':
        return [
          { to: '/manager/dashboard', label: 'Operations desk', icon: <House className="w-4 h-4" weight="bold" /> },
          { to: '/manager/applications', label: 'Application queue', icon: <ClipboardText className="w-4 h-4" weight="bold" /> },
          { to: '/manager/promotions', label: 'Promotions', icon: <ChartLineUp className="w-4 h-4" weight="bold" /> },
          { to: '/manager/activities', label: 'All activities', icon: <Calendar className="w-4 h-4" weight="bold" /> },
          { to: '/manager/volunteers', label: 'Volunteer directory', icon: <UsersThree className="w-4 h-4" weight="bold" /> },
          { to: '/manager/feedback', label: 'Feedback inbox', icon: <ChatCircleText className="w-4 h-4" weight="bold" /> },
          { to: '/manager/reports', label: 'Reports', icon: <ChartBar className="w-4 h-4" weight="bold" /> },
          { to: '/manager/announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" weight="bold" /> },
        ];

      case 'finance':
        return [
          { to: '/finance/overview', label: 'Finance desk', icon: <House className="w-4 h-4" weight="bold" /> },
          { to: '/finance/payments', label: 'All payments', icon: <Money className="w-4 h-4" weight="bold" /> },
          { to: '/finance/needs-review', label: 'Review queue', icon: <ArrowsClockwise className="w-4 h-4" weight="bold" /> },
          { to: '/finance/receipts-refunds', label: 'Receipts and refunds', icon: <Scroll className="w-4 h-4" weight="bold" /> },
        ];

      case 'admin':
        return [
          { to: '/admin/overview', label: 'Admin home', icon: <House className="w-4 h-4" weight="bold" /> },
          { to: '/admin/settings', label: 'Settings and emails', icon: <Gear className="w-4 h-4" weight="bold" /> },
          { to: '/admin/rank-rules', label: 'Rank rules', icon: <ChartLineUp className="w-4 h-4" weight="bold" /> },
          { to: '/admin/accounts', label: 'Accounts and roles', icon: <UsersThree className="w-4 h-4" weight="bold" /> },
          { to: '/admin/activity-history', label: 'Activity history', icon: <Scroll className="w-4 h-4" weight="bold" /> },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans">
      {/* LIGHT TOP BAR WITH 1PX BORDER (Rule 2: No dark bars at the top) */}
      <header className="sticky top-0 z-40 bg-white text-ink-primary border-b border-[#D5DAE1] select-none shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand + Role Marker */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="font-display text-xl sm:text-2xl font-black tracking-tight text-ink-primary cursor-pointer hover:opacity-80 transition-opacity"
            >
              VTS
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-canvas-subdued border border-[#D5DAE1] text-[13px] font-semibold text-ink-secondary hidden sm:flex">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: roleMeta.color }}
              />
              <span>{roleMeta.label}</span>
            </div>
          </div>

          {/* Desktop Horizontal Navigation Links with Role-Colored Active Underline */}
          <nav className="hidden lg:flex items-center gap-1 h-full overflow-x-auto no-scrollbar mx-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) =>
                  isActive
                    ? {
                        borderBottomWidth: '2px',
                        borderBottomColor: roleMeta.color,
                        color: '#111111',
                        fontWeight: 700,
                      }
                    : undefined
                }
                className={({ isActive }) =>
                  `px-3 h-full flex items-center gap-1.5 font-sans text-[13px] tracking-tight transition-colors border-b-2 ${
                    isActive
                      ? ''
                      : 'border-transparent text-ink-secondary hover:text-ink-primary hover:border-[#D5DAE1]'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Top Right Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Preview Emails Simulator Trigger (Visible ONLY for Admin as per Rule 5) */}
            {user?.role === 'admin' && (
              <button
                onClick={() => setEmailInboxOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold rounded-[6px] border border-[#D5DAE1] hover:bg-canvas-subdued text-ink-primary transition-all cursor-pointer"
                title="Preview transactional emails"
              >
                <Envelope className="w-4 h-4 text-ink-secondary" weight="bold" />
                <span className="hidden md:inline">Preview emails</span>
              </button>
            )}

            {/* User Profile Portrait & Info */}
            <div className="flex items-center gap-2 pl-1">
              <button
                onClick={() => setPhotoModalOpen(true)}
                className="flex items-center gap-2 p-1 rounded-[6px] border border-[#D5DAE1] hover:bg-canvas-subdued transition-all cursor-pointer"
                title="Click to update profile photo"
              >
                <div className="relative">
                  <Avatar
                    name={displayName}
                    photoUrl={profile?.photoUrl}
                    avatarUrl={user?.avatarUrl || profile?.avatarUrl}
                    size="sm"
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: roleMeta.color }}
                  />
                </div>
                <span className="font-sans text-[13px] font-semibold text-ink-primary hidden sm:inline pr-1">
                  {displayName}
                </span>
              </button>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-[6px] border border-[#D5DAE1] hover:bg-canvas-subdued text-ink-secondary hover:text-role-teamlead transition-all cursor-pointer"
                title="Sign out"
              >
                <SignOut className="w-4 h-4" weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* MOBILE FLOATING DOCK (Clean, Light, Toned-Down) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-white border border-[#D5DAE1] rounded-[10px] p-1.5 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`p-2 flex flex-col items-center gap-0.5 cursor-pointer transition-colors rounded-[6px] ${
                isActive ? 'text-ink-primary font-bold bg-canvas-subdued' : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {item.icon}
              <span className="text-[13px] font-sans tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 flex flex-col items-center gap-0.5 text-ink-secondary hover:text-ink-primary cursor-pointer rounded-[6px]"
        >
          {mobileDrawerOpen ? <X className="w-4 h-4" weight="bold" /> : <List className="w-4 h-4" weight="bold" />}
          <span className="text-[13px] font-sans tracking-tight">Menu</span>
        </button>
      </div>

      {/* MOBILE FULL DRAWER MODAL */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 flex flex-col justify-end">
          <div className="bg-white border-t border-[#D5DAE1] rounded-t-[16px] p-6 space-y-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#D5DAE1] pb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  name={displayName}
                  photoUrl={profile?.photoUrl}
                  avatarUrl={user?.avatarUrl || profile?.avatarUrl}
                  size="md"
                />
                <div>
                  <span className="font-display text-lg font-bold text-ink-primary leading-tight block">
                    {displayName}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: roleMeta.color }}
                    />
                    <span className="font-sans text-[13px] text-ink-secondary font-medium">
                      {roleMeta.label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-[6px] border border-[#D5DAE1] hover:bg-canvas-subdued cursor-pointer"
              >
                <X className="w-5 h-5" weight="bold" />
              </button>
            </div>

            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.to}
                  onClick={() => {
                    navigate(item.to);
                    setMobileDrawerOpen(false);
                  }}
                  className="p-3 text-left border border-[#D5DAE1] hover:bg-canvas-subdued bg-white rounded-[8px] flex items-center gap-2.5 transition-colors font-sans text-[13px] font-semibold"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#D5DAE1] flex items-center justify-between gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setPhotoModalOpen(true);
                }}
                leftIcon={<Camera className="w-4 h-4" weight="bold" />}
              >
                Photo
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetData}
                leftIcon={<ArrowClockwise className="w-4 h-4" weight="bold" />}
              >
                Reset demo
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleSignOut}
                leftIcon={<SignOut className="w-4 h-4" weight="bold" />}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Photo Modal */}
      <ProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
      />

      {/* Demo Email Preview Inbox (Only opens if triggered) */}
      <DemoEmailInbox
        isOpen={emailInboxOpen}
        onClose={() => setEmailInboxOpen(false)}
      />
    </div>
  );
};
