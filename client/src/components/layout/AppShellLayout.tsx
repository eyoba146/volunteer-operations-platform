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
} from '@phosphor-icons/react';
import { Avatar, StatusMark, Button } from '../ui';
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

  // Generate navigation links based on user role
  const getNavItems = (): NavItemConfig[] => {
    if (!user) return [];

    switch (user.role) {
      case 'applicant':
        return [
          { to: '/applicant/status', label: 'My Status', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
          { to: '/applicant/apply', label: 'Application Form', icon: <UserIcon className="w-5 h-5" weight="bold" /> },
          { to: '/applicant/payment', label: 'Telebirr Payment', icon: <Money className="w-5 h-5" weight="bold" /> },
          { to: '/applicant/notifications', label: 'Messages', icon: <Bell className="w-5 h-5" weight="bold" /> },
        ];

      case 'volunteer':
        return [
          { to: '/volunteer/home', label: 'Trail Home', icon: <House className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/activities', label: 'Activities', icon: <Calendar className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/my-activities', label: 'My Roster', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/check-in', label: 'Check-In', icon: <QrCode className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/hours', label: 'Logged Hours', icon: <Clock className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/rank-progress', label: 'Rank Trail', icon: <ChartLineUp className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/certificates', label: 'Certificates', icon: <Certificate className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/id-card', label: 'ID Pass', icon: <IdentificationCard className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" weight="bold" /> },
        ];

      case 'team_lead':
        return [
          { to: '/team-lead/home', label: 'Lead Dispatch', icon: <House className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/approve-hours', label: 'Approve Hours', icon: <CheckCircle className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/activities', label: 'Lead Roster', icon: <Calendar className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/create-activity', label: 'New Activity', icon: <PlusCircle className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/ratings', label: 'Rate Work', icon: <Star className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/recommend-promotion', label: 'Recommend', icon: <ChartLineUp className="w-5 h-5" weight="bold" /> },
          { to: '/team-lead/announcements', label: 'Announcements', icon: <Megaphone className="w-5 h-5" weight="bold" /> },
          { to: '/volunteer/home', label: 'Volunteer View', icon: <UserIcon className="w-5 h-5" weight="bold" /> },
        ];

      case 'manager':
        return [
          { to: '/manager/dashboard', label: 'Overview', icon: <ChartBar className="w-5 h-5" weight="bold" /> },
          { to: '/manager/applications', label: 'Applicants', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
          { to: '/manager/volunteers', label: 'Volunteers', icon: <UsersThree className="w-5 h-5" weight="bold" /> },
          { to: '/manager/activities', label: 'Activities', icon: <Calendar className="w-5 h-5" weight="bold" /> },
          { to: '/manager/promotions', label: 'Promotions', icon: <ChartLineUp className="w-5 h-5" weight="bold" /> },
          { to: '/manager/announcements', label: 'Post Notice', icon: <Megaphone className="w-5 h-5" weight="bold" /> },
          { to: '/manager/feedback', label: 'Feedback', icon: <ChatCircleText className="w-5 h-5" weight="bold" /> },
          { to: '/manager/reports', label: 'Reports', icon: <Scroll className="w-5 h-5" weight="bold" /> },
        ];

      case 'finance':
        return [
          { to: '/finance/overview', label: 'Overview', icon: <ChartBar className="w-5 h-5" weight="bold" /> },
          { to: '/finance/payments', label: 'Telebirr Ledger', icon: <Money className="w-5 h-5" weight="bold" /> },
          { to: '/finance/needs-review', label: 'Needs Review', icon: <ArrowsClockwise className="w-5 h-5" weight="bold" /> },
          { to: '/finance/receipts-refunds', label: 'Receipts & Refunds', icon: <Scroll className="w-5 h-5" weight="bold" /> },
          { to: '/finance/reports', label: 'Export Ledger', icon: <ClipboardText className="w-5 h-5" weight="bold" /> },
        ];

      case 'admin':
        return [
          { to: '/admin/overview', label: 'System Overview', icon: <ChartBar className="w-5 h-5" weight="bold" /> },
          { to: '/admin/settings', label: 'Fee Settings', icon: <Gear className="w-5 h-5" weight="bold" /> },
          { to: '/admin/rank-rules', label: 'Rank Rules', icon: <ChartLineUp className="w-5 h-5" weight="bold" /> },
          { to: '/admin/accounts', label: 'Accounts', icon: <UsersThree className="w-5 h-5" weight="bold" /> },
          { to: '/admin/activity-history', label: 'System History', icon: <Scroll className="w-5 h-5" weight="bold" /> },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Role Dominant Header Styling
  const roleStyles = {
    applicant: {
      bar: 'bg-role-applicant text-ink-primary border-b-2 border-black',
      tag: 'bg-ink-primary text-white',
      activeTab: 'border-b-4 border-ink-primary text-ink-primary bg-white/30',
      inactiveTab: 'text-ink-primary/80 hover:text-ink-primary hover:bg-white/20',
      label: 'Applicant Desk',
    },
    volunteer: {
      bar: 'bg-role-volunteer text-white border-b-2 border-black',
      tag: 'bg-white text-role-volunteer font-bold',
      activeTab: 'border-b-4 border-white text-white bg-black/15 font-bold',
      inactiveTab: 'text-white/80 hover:text-white hover:bg-black/10',
      label: 'Volunteer Trail',
    },
    team_lead: {
      bar: 'bg-role-teamlead text-white border-b-2 border-black',
      tag: 'bg-white text-role-teamlead font-bold',
      activeTab: 'border-b-4 border-white text-white bg-black/15 font-bold',
      inactiveTab: 'text-white/80 hover:text-white hover:bg-black/10',
      label: 'Team Lead Dispatch',
    },
    manager: {
      bar: 'bg-role-manager text-white border-b-2 border-black',
      tag: 'bg-white text-role-manager font-bold',
      activeTab: 'border-b-4 border-white text-white bg-black/15 font-bold',
      inactiveTab: 'text-white/80 hover:text-white hover:bg-black/10',
      label: 'Manager Operations',
    },
    finance: {
      bar: 'bg-role-finance text-role-financeAccent border-b-2 border-role-financeAccent',
      tag: 'bg-role-financeAccent text-ink-primary font-bold',
      activeTab: 'border-b-4 border-role-financeAccent text-role-financeAccent bg-white/5 font-bold',
      inactiveTab: 'text-gray-300 hover:text-white hover:bg-white/5',
      label: 'Telebirr Finance Audit',
    },
    admin: {
      bar: 'bg-role-admin text-white border-b-2 border-black',
      tag: 'bg-amber-400 text-black font-bold',
      activeTab: 'border-b-4 border-amber-400 text-amber-400 bg-white/5 font-bold',
      inactiveTab: 'text-gray-300 hover:text-white hover:bg-white/5',
      label: 'System Governance',
    },
  }[user?.role || 'volunteer'];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans">
      {/* DESKTOP SLIM TOP RAIL (Dominant Role Field, NO dark sidebar) */}
      <header className={`sticky top-0 z-40 select-none shadow-md ${roleStyles.bar}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand + Role Identifier */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="font-display text-2xl font-black tracking-tight uppercase cursor-pointer hover:opacity-80 transition-opacity"
            >
              VTS
            </button>
            <span className="font-mono text-xs px-2 py-0.5 rounded-none font-bold uppercase tracking-wider hidden sm:inline-block shadow-sm">
              {roleStyles.label}
            </span>
          </div>

          {/* Desktop Horizontal Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 h-full overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 h-full flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-tight transition-all duration-150 ${
                    isActive ? roleStyles.activeTab : roleStyles.inactiveTab
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Top Right Utilities */}
          <div className="flex items-center gap-2">
            {/* Preview Emails Simulator Trigger */}
            <button
              onClick={() => setEmailInboxOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border border-current hover:bg-white/20 transition-colors cursor-pointer"
              title="Preview simulated transactional emails"
            >
              <Envelope className="w-4 h-4" weight="bold" />
              <span className="hidden md:inline">Preview Emails</span>
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-2 pl-2">
              <span className="font-sans text-xs font-bold hidden sm:inline">
                {profile?.fullName || user?.username}
              </span>
              <button
                onClick={handleSignOut}
                className="p-1.5 border border-current hover:bg-white/20 transition-colors cursor-pointer"
                title="Sign Out"
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

      {/* MOBILE FLOATING DOCK (Bottom Pinned) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-ink-primary text-white border-2 border-black p-2 flex items-center justify-around shadow-dock">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`p-2 flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                isActive ? 'text-role-applicant font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-sans tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 flex flex-col items-center gap-0.5 text-gray-300 hover:text-white cursor-pointer"
        >
          {mobileDrawerOpen ? <X className="w-5 h-5" weight="bold" /> : <List className="w-5 h-5" weight="bold" />}
          <span className="text-[10px] font-sans tracking-tight">Menu</span>
        </button>
      </div>

      {/* MOBILE FULL DRAWER MODAL */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white border-t-4 border-ink-primary p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b-2 border-ink-primary pb-4">
              <div>
                <span className="font-display text-2xl font-black uppercase text-ink-primary leading-none block">
                  {profile?.fullName || user?.username}
                </span>
                <span className="font-sans text-xs font-bold text-ink-secondary">
                  Role: {user?.role.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 border-2 border-ink-primary hover:bg-canvas-subdued cursor-pointer"
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
                  className="p-3 text-left border border-border hover:border-ink-primary bg-canvas-subdued/50 hover:bg-white flex items-center gap-2.5 transition-colors font-sans text-xs font-bold"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetData}
                leftIcon={<ArrowClockwise className="w-4 h-4" weight="bold" />}
              >
                Reset Demo
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleSignOut}
                leftIcon={<SignOut className="w-4 h-4" weight="bold" />}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Email Preview Inbox */}
      <DemoEmailInbox
        isOpen={emailInboxOpen}
        onClose={() => setEmailInboxOpen(false)}
      />
    </div>
  );
};
