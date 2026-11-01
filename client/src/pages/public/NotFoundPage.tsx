import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, House, ArrowLeft } from '@phosphor-icons/react';
import { PageShell, Button, Raised } from '../../components/ui';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageShell page="public/404" signature="none:not-found">
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <Raised className="max-w-md w-full p-8 md:p-10 space-y-6">
          <div className="w-14 h-14 mx-auto bg-[#F7F8FA] rounded-full flex items-center justify-center text-ink-primary">
            <Compass className="w-7 h-7" weight="bold" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-primary">
              Page not found
            </h1>
            <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
              The page you are looking for does not exist or may have been moved.
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
              onClick={() => navigate('/')}
            >
              Back to home
            </Button>
          </div>
        </Raised>
      </div>
    </PageShell>
  );
};

