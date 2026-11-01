import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { VolunteerCard, Button, Skeleton } from '../../components/ui';
import { Printer, DownloadSimple } from '@phosphor-icons/react';

export const VolunteerIdCardPage: React.FC = () => {
  const { profile, isLoading } = useAuth();

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
    return <div className="text-sm font-sans text-ink-secondary">Profile could not be loaded.</div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-5 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
          Volunteer ID pass
        </h1>
        <p className="font-sans text-sm text-ink-secondary mt-1">
          Present this verified pass during check-in desks and field assignments.
        </p>
      </div>

      {/* Centered ID Card (Chamfered Ticket Pass with QR) */}
      <div className="flex justify-center">
        <VolunteerCard profile={profile} />
      </div>

      {/* Print / Download Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          leftIcon={<Printer className="w-4 h-4" weight="bold" />}
          onClick={handlePrint}
        >
          Print physical pass
        </Button>
        <Button
          variant="secondary"
          leftIcon={<DownloadSimple className="w-4 h-4" weight="bold" />}
          onClick={handlePrint}
        >
          Save as PDF
        </Button>
      </div>
    </div>
  );
};
