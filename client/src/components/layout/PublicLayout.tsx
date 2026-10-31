import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Envelope, SignOut, ArrowRight, MagnifyingGlass, House, User, Compass } from '@phosphor-icons/react';
import { Button } from '../ui';
import { DemoEmailInbox } from '../demo/DemoEmailInbox';

export const PublicLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getWorkspacePath = () => {
    if (!user) return '/sign-in';
    switch (user.role) {
      case 'applicant':
        return '/applicant/status';
      case 'volunteer':
        return '/volunteer/home';
      case 'team_lead':
        return '/team-lead/home';
      case 'manager':
        return '/manager/dashboard';
      case 'finance':
        return '/finance/overview';
      case 'admin':
        return '/admin/overview';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/60 to-white text-slate-900 flex flex-col font-sans selection:bg-brand/15 selection:text-brand">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group select-none shrink-0">
            <div className="w-10 h-10 rounded-[14px] bg-brand text-white flex items-center justify-center font-display font-extrabold text-xl shadow-pill transition-transform group-hover:scale-105">
              V
            </div>
            <div>
              <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight leading-none block">
                VTS
              </span>
              <span className="font-sans text-xs text-slate-500 mt-0.5 block">
                Volunteer Tracking
              </span>
            </div>
          </Link>

          {/* Search Pill Bar (Desktop) */}
          <div
            onClick={() => navigate('/sign-in')}
            className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 text-xs text-slate-500 cursor-pointer transition-colors max-w-xs w-full"
          >
            <MagnifyingGlass className="w-4 h-4 text-slate-400" />
            <span className="flex-1">Search activities or volunteers...</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-400 shadow-2xs">
              Ctrl K
            </kbd>
          </div>

          {/* Right Navigation & Utility Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/check-certificate"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100/60 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" weight="bold" />
              <span>Verify Pass</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate(getWorkspacePath())}
                  rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
                >
                  Workspace
                </Button>
                <button
                  onClick={() => signOut()}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <SignOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/sign-in')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
                >
                  Join
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Soft Footer */}
      <footer className="border-t border-slate-100 bg-white text-slate-900 py-16 mt-20">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="space-y-1.5 max-w-md">
              <span className="font-display text-2xl font-extrabold text-slate-900 tracking-tight block">
                Volunteer Tracking System
              </span>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                A clean platform where volunteer service is recorded, recognized, and advanced.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm font-medium">
              <Link to="/check-certificate" className="text-slate-600 hover:text-slate-900 transition-colors">
                Verify Pass
              </Link>
              <Link to="/sign-in" className="text-slate-600 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-slate-600 hover:text-slate-900 transition-colors">
                Join as Volunteer
              </Link>
              <button
                onClick={() => setEmailInboxOpen(true)}
                className="text-brand font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Envelope className="w-4 h-4" weight="bold" />
                <span>Preview emails</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans">
            <div>
              &copy; {new Date().getFullYear()} Volunteer Tracking System. Built for Ethiopian community impact.
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <span>Addis Ababa</span>
              <span>•</span>
              <span>Adama</span>
              <span>•</span>
              <span>Hawassa</span>
              <span>•</span>
              <span>Bahir Dar</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Pill Dock on Mobile */}
      <nav className="md:hidden fixed bottom-5 inset-x-4 max-w-sm mx-auto z-40 bg-white/95 backdrop-blur-md rounded-full shadow-dock border border-slate-200/80 p-1.5 flex items-center justify-around">
        <Link
          to="/"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            location.pathname === '/' ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <House className="w-4 h-4" weight="bold" />
          <span>Home</span>
        </Link>
        <Link
          to="/check-certificate"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            location.pathname === '/check-certificate' ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" weight="bold" />
          <span>Verify</span>
        </Link>
        <Link
          to={user ? getWorkspacePath() : '/sign-in'}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            location.pathname.startsWith('/sign-in') || location.pathname.startsWith('/volunteer')
              ? 'bg-brand text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" weight="bold" />
          <span>{user ? 'Portal' : 'Sign In'}</span>
        </Link>
      </nav>

      {/* Demo Email Inbox Modal */}
      <DemoEmailInbox
        isOpen={emailInboxOpen}
        onClose={() => setEmailInboxOpen(false)}
      />
    </div>
  );
};
