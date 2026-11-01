import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldWarning, ArrowLeft, House } from '@phosphor-icons/react';
import { PageShell, Button, Raised } from '../../components/ui';

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
    <PageShell page="public/unauthorized" signature="none:system-notice">
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <Raised className="max-w-md w-full p-8 md:p-10 space-y-6">
          <div className="w-14 h-14 mx-auto bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
            <ShieldWarning className="w-7 h-7" weight="bold" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-primary">
              Access restricted
            </h1>
            <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
              This area is reserved for specific roles within the volunteer program. Your account is signed in as an active {user?.role.replace('_', ' ') || 'member'}.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft className="w-4 h-4" weight="bold" />}
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>
            <Button
              variant="primary"
              leftIcon={<House className="w-4 h-4" weight="bold" />}
              onClick={() => navigate(getRoleHome())}
            >
              Open my space
            </Button>
          </div>
        </Raised>
      </div>
    </PageShell>
  );
};
