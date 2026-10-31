import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldWarning, ArrowLeft, House } from '@phosphor-icons/react';
import { Button } from '../../components/ui';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getRoleHome = () => {
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
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full border border-border bg-canvas-raised p-8 md:p-10 shadow-subtle space-y-5">
        <div className="w-12 h-12 mx-auto border border-border bg-canvas-subdued flex items-center justify-center text-civic-rust">
          <ShieldWarning className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            Access Notice
          </span>
          <h1 className="font-serif text-2xl font-bold text-ink-primary">
            You do not have access to this page
          </h1>
          <p className="font-sans text-sm text-ink-secondary leading-relaxed">
            This area is reserved for specific roles within the volunteer program. Your account is signed in as an active {user?.role.replace('_', ' ') || 'member'}.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
          <Button
            variant="primary"
            leftIcon={<House className="w-4 h-4" />}
            onClick={() => navigate(getRoleHome())}
          >
            Go to my workspace
          </Button>
        </div>
      </div>
    </div>
  );
};

