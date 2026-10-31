import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, SignOut, ArrowRight } from '@phosphor-icons/react';
import { Button } from '../ui';

export const PublicLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const getMySpacePath = () => {
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
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans selection:bg-role-applicant selection:text-ink-primary">
      {/* Top Navigation Bar: Light with 1px border */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#D5DAE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-ink-primary text-white flex items-center justify-center font-display font-black text-xl sm:text-2xl rounded-[6px]">
              VTS
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl text-ink-primary tracking-tight leading-none block">
                <span className="hidden sm:inline">Volunteer Tracking System</span>
                <span className="sm:hidden">Volunteer Trail</span>
              </span>
              <span className="font-sans text-[13px] font-medium text-ink-secondary hidden xs:block mt-0.5">
                Your time counts. Now it shows.
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/check-certificate"
              className="text-sm font-semibold text-ink-secondary hover:text-ink-primary flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-role-volunteer" weight="bold" />
              <span>Verify certificate</span>
            </Link>
          </nav>

          {/* Right Navigation & Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(getMySpacePath())}
                >
                  <span>Open my space</span>
                </Button>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-ink-secondary hover:text-role-teamlead cursor-pointer rounded-[6px] border border-transparent hover:border-[#D5DAE1]"
                  title="Sign out"
                >
                  <SignOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/sign-in')}
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
                >
                  <span className="hidden sm:inline">Join as volunteer</span>
                  <span className="sm:hidden">Join</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D5DAE1] bg-white text-ink-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#D5DAE1] pb-8">
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold text-ink-primary tracking-tight">
                Volunteer Tracking System
              </span>
              <p className="font-sans text-sm text-ink-secondary">
                Where every hour of volunteer service is recorded, verified, and recognized.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <Link to="/check-certificate" className="text-ink-secondary hover:text-ink-primary">
                Verify a certificate
              </Link>
              <span className="text-ink-tertiary/40">•</span>
              <Link to="/sign-in" className="text-ink-secondary hover:text-ink-primary">
                Sign in
              </Link>
              <span className="text-ink-tertiary/40">•</span>
              <Link to="/register" className="text-ink-secondary hover:text-ink-primary">
                Register
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-ink-secondary font-sans">
            <div>
              &copy; {new Date().getFullYear()} Volunteer Tracking System. All rights reserved.
            </div>
            <div className="flex items-center gap-3 text-ink-secondary">
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
    </div>
  );
};
