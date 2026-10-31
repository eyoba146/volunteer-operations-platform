import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Envelope, UserCircle, SignOut, ArrowRight, Compass } from '@phosphor-icons/react';
import { Button } from '../ui';
import { DemoEmailInbox } from '../demo/DemoEmailInbox';

export const PublicLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans selection:bg-role-applicant selection:text-ink-primary">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-ink-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-ink-primary text-white flex items-center justify-center font-display font-black text-xl sm:text-2xl tracking-tighter group-hover:bg-role-applicant group-hover:text-ink-primary transition-colors">
              VTS
            </div>
            <div>
              <span className="font-display font-black text-lg sm:text-2xl text-ink-primary tracking-tight uppercase leading-none block">
                <span className="hidden sm:inline">Volunteer Tracking System</span>
                <span className="sm:hidden">Volunteer Trail</span>
              </span>
              <span className="font-sans text-[11px] sm:text-xs font-semibold text-ink-secondary hidden xs:block mt-0.5">
                Your time counts.
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/check-certificate"
              className="text-sm font-bold text-ink-secondary hover:text-ink-primary flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-role-volunteer" weight="bold" />
              <span>Verify Certificate</span>
            </Link>
          </nav>

          {/* Right Navigation & Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(getWorkspacePath())}
                >
                  <span className="hidden sm:inline">Go to Workspace</span> ({user.role})
                </Button>
                <button
                  onClick={() => signOut()}
                  className="p-1.5 sm:p-2 text-ink-secondary hover:text-role-teamlead cursor-pointer"
                  title="Sign Out"
                >
                  <SignOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/sign-in')}
                >
                  Sign In
                </Button>
                <Button
                  variant="saffron"
                  size="sm"
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
                >
                  <span className="hidden sm:inline">Join as Volunteer</span>
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
      <footer className="border-t-2 border-ink-primary bg-white text-ink-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-1">
              <span className="font-display text-3xl font-black uppercase text-ink-primary tracking-tight">
                VTS Volunteer Tracking System
              </span>
              <p className="font-sans text-sm text-ink-secondary">
                Where every hour of volunteer service is recorded, recognized, and advanced.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <Link to="/check-certificate" className="text-ink-secondary hover:text-ink-primary">
                Verify a Certificate
              </Link>
              <span className="text-border">•</span>
              <Link to="/sign-in" className="text-ink-secondary hover:text-ink-primary">
                Sign In
              </Link>
              <span className="text-border">•</span>
              <Link to="/register" className="text-ink-secondary hover:text-ink-primary">
                Register
              </Link>
              <span className="text-border">•</span>
              <button
                onClick={() => setEmailInboxOpen(true)}
                className="text-role-applicant font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Envelope className="w-4 h-4" weight="bold" />
                <span>Preview Emails</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-tertiary font-sans">
            <div>
              &copy; {new Date().getFullYear()} Volunteer Tracking System. All rights reserved.
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
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

      {/* Transactional Email Preview Simulator Modal */}
      <DemoEmailInbox
        isOpen={emailInboxOpen}
        onClose={() => setEmailInboxOpen(false)}
      />
    </div>
  );
};
