import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { VolunteerCard, Button, Skeleton } from '../../components/ui';
import { Printer, DownloadSimple, ShieldCheck } from '@phosphor-icons/react';

export const VolunteerIdCardPage: React.FC = () => {
  const { profile, user, isLoading } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-sm mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  if (!profile) {
    return <div>Profile could not be loaded.</div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 text-center space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          OFFICIAL CREDENTIAL
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Volunteer ID Card
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Carry this digital or printed credential during all in-person assignments and check-in desks.
        </p>
      </div>

      {/* Centered ID Card */}
      <div className="flex justify-center">
        <VolunteerCard profile={profile} />
      </div>

      {/* Print / Download Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={handlePrint}
        >
          Print Physical Credential
        </Button>
        <Button
          variant="secondary"
          leftIcon={<DownloadSimple className="w-4 h-4" />}
          onClick={handlePrint}
        >
          Save as PDF
        </Button>
      </div>
    </div>
  );
};

