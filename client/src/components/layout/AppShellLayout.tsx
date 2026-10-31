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
          { to: '/applicant/status', label: 'My Status', icon: <ClipboardText className="w-4 h-4" weight="bold" /> },
          { to: '/applicant/apply', label: 'Enrollment', icon: <UserIcon className="w-4 h-4" weight="bold" /> },
          { to: '/applicant/payment', label: 'Telebirr Payment', icon: <Money className="w-4 h-4" weight="bold" /> },
          { to: '/applicant/notifications', label: 'Messages', icon: <Bell className="w-4 h-4" weight="bold" /> },
        ];

      case 'volunteer':
        return [
          { to: '/volunteer/home', label: 'Home', icon: <House className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/activities', label: 'Activities', icon: <Calendar className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/my-activities', label: 'My Roster', icon: <ClipboardText className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/check-in', label: 'Check-In', icon: <QrCode className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/hours', label: 'Hours', icon: <Clock className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/rank-progress', label: 'Trail Rank', icon: <ChartLineUp className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/certificates', label: 'Passes', icon: <Certificate className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/id-card', label: 'ID Pass', icon: <IdentificationCard className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" weight="bold" /> },
        ];

      case 'team_lead':
        return [
          { to: '/team-lead/home', label: 'Dispatch', icon: <House className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/approve-hours', label: 'Approve Hours', icon: <CheckCircle className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/activities', label: 'Field Roster', icon: <Calendar className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/create-activity', label: 'New Activity', icon: <PlusCircle className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/ratings', label: 'Rate Tasks', icon: <Star className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/recommend-promotion', label: 'Promote', icon: <ChartLineUp className="w-4 h-4" weight="bold" /> },
          { to: '/team-lead/announcements', label: 'Announce', icon: <Megaphone className="w-4 h-4" weight="bold" /> },
          { to: '/volunteer/home', label: 'Volunteer View', icon: <UserIcon className="w-4 h-4" weight="bold" /> },
        ];

      case 'manager':
        return [
          { to: '/manager/dashboard', label: 'Overview', icon: <ChartBar className="w-4 h-4" weight="bold" /> },
          { to: '/manager/applications', label: 'Review Applications', icon: <ClipboardText className="w-4 h-4" weight="bold" /> },
          { to: '/manager/volunteers', label: 'Volunteers', icon: <UsersThree className="w-4 h-4" weight="bold" /> },
          { to: '/manager/promotions', label: 'Promotion Board', icon: <ChartLineUp className="w-4 h-4" weight="bold" /> },
          { to: '/manager/reports', label: 'Reports', icon: <Scroll className="w-4 h-4" weight="bold" /> },
        ];

      case 'finance':
        return [
          { to: '/finance/overview', label: 'Treasury', icon: <ChartBar className="w-4 h-4" weight="bold" /> },
          { to: '/finance/payments', label: 'Transactions', icon: <Money className="w-4 h-4" weight="bold" /> },
          { to: '/finance/needs-review', label: 'Needs Review', icon: <ArrowsClockwise className="w-4 h-4" weight="bold" /> },
          { to: '/finance/receipts-refunds', label: 'Receipts & Refunds', icon: <Scroll className="w-4 h-4" weight="bold" /> },
          { to: '/finance/reports', label: 'Audit Export', icon: <ClipboardText className="w-4 h-4" weight="bold" /> },
        ];

      case 'admin':
        return [
          { to: '/admin/overview', label: 'System Overview', icon: <ChartBar className="w-4 h-4" weight="bold" /> },
          { to: '/admin/settings', label: 'Configuration', icon: <Gear className="w-4 h-4" weight="bold" /> },
          { to: '/admin/rank-rules', label: 'Altitude Rules', icon: <ChartLineUp className="w-4 h-4" weight="bold" /> },
          { to: '/admin/accounts', label: 'Users & Roles', icon: <UsersThree className="w-4 h-4" weight="bold" /> },
          { to: '/admin/activity-history', label: 'Audit Trail', icon: <Scroll className="w-4 h-4" weight="bold" /> },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Role dot styling
  const getRoleDot = () => {
    switch (user?.role) {
      case 'applicant': return 'bg-role-applicant';
      case 'volunteer': return 'bg-role-volunteer';
      case 'team_lead': return 'bg-role-teamlead';
      case 'manager': return 'bg-role-manager';
      case 'finance': return 'bg-lime-500';
      case 'admin': return 'bg-slate-700';
      default: return 'bg-brand';
    }
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'applicant': return 'Applicant';
      case 'volunteer': return 'Volunteer';
      case 'team_lead': return 'Team Lead';
      case 'manager': return 'Manager';
      case 'finance': return 'Finance Desk';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/70 to-white text-slate-900 flex flex-col font-sans selection:bg-brand/15 selection:text-brand">
      {/* CLEAN TOP BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo & Role Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-[14px] bg-brand text-white flex items-center justify-center font-display font-extrabold text-xl shadow-pill transition-transform hover:scale-105 cursor-pointer"
            >
              V
            </button>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-slate-900 tracking-tight hidden xs:inline">
                VTS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                <span className={`w-2 h-2 rounded-full ${getRoleDot()}`} />
                <span>{getRoleBadge()}</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right User & Utility Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Preview emails button */}
            <button
              onClick={() => setEmailInboxOpen(true)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Preview Emails"
            >
              <Envelope className="w-5 h-5" />
            </button>

            {/* Reset seed demo */}
            <button
              onClick={handleResetData}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset Demo Data"
            >
              <ArrowClockwise className="w-5 h-5" />
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <Avatar
                name={profile?.fullName || user?.username || 'User'}
                photoUrl={profile?.photoUrl}
                size="sm"
              />
              <span className="font-sans text-xs font-semibold text-slate-800 hidden sm:inline max-w-[120px] truncate">
                {profile?.fullName || user?.username}
              </span>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <SignOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* MOBILE FLOATING PILL DOCK */}
      <div className="lg:hidden fixed bottom-5 inset-x-4 max-w-sm mx-auto z-40 bg-white/95 backdrop-blur-md rounded-full shadow-dock border border-slate-200/80 p-1.5 flex items-center justify-around">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`p-2 rounded-full flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                isActive ? 'text-brand font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-sans font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 rounded-full flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          {mobileDrawerOpen ? <X className="w-4 h-4" weight="bold" /> : <List className="w-4 h-4" weight="bold" />}
          <span className="text-[10px] font-sans font-medium">More</span>
        </button>
      </div>

      {/* MOBILE FULL DRAWER MODAL */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-[28px] shadow-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-display text-xl font-bold text-slate-900 leading-tight block">
                  {profile?.fullName || user?.username}
                </span>
                <span className="font-sans text-xs text-slate-500">
                  Role: {getRoleBadge()}
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" weight="bold" />
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
                  className="p-3 text-left rounded-[14px] bg-slate-50 hover:bg-slate-100 flex items-center gap-2.5 transition-colors font-sans text-xs font-semibold text-slate-800"
                >
                  <span className="text-brand">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
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
