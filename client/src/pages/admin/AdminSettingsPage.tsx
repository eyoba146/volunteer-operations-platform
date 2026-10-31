import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Setting } from '../../types';
import { Input, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { FloppyDisk, ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const AdminSettingsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [fee, setFee] = useState('200');
  const [deadline, setDeadline] = useState('7');
  const [programName, setProgramName] = useState('VTS Volunteer Corps');
  const [merchantName, setMerchantName] = useState('VTS Program - Ethio Telecom');
  const [shortcode, setShortcode] = useState('884120');
  const [signatory, setSignatory] = useState('Ruth Mengistu, Program Director');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await api.getSettings();
        setSettings(list);
        list.forEach((s) => {
          if (s.key === 'registration_fee') setFee(s.value.toString());
          if (s.key === 'payment_deadline_days') setDeadline(s.value.toString());
          if (s.key === 'program_name') setProgramName(s.value.toString());
          if (s.key === 'telebirr_merchant_name') setMerchantName(s.value.toString());
          if (s.key === 'telebirr_shortcode') setShortcode(s.value.toString());
          if (s.key === 'certificate_signatory') setSignatory(s.value.toString());
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await Promise.all([
        api.updateSetting('registration_fee', parseFloat(fee) || 200, user.id, profile?.fullName || user.username),
        api.updateSetting('payment_deadline_days', parseInt(deadline) || 7, user.id, profile?.fullName || user.username),
        api.updateSetting('program_name', programName, user.id, profile?.fullName || user.username),
        api.updateSetting('telebirr_merchant_name', merchantName, user.id, profile?.fullName || user.username),
        api.updateSetting('telebirr_shortcode', shortcode, user.id, profile?.fullName || user.username),
        api.updateSetting('certificate_signatory', signatory, user.id, profile?.fullName || user.username),
      ]);

      toast.success('System settings updated and recorded in the activity history.');
    } catch (err: any) {
      toast.error(err.message || 'Could not save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to administration overview</span>
      </button>

      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          SYSTEM PARAMETERS
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Program Configuration & Fees
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Configure parameters governing applicant intake, fee amounts, payment windows, and certificate authority.
        </p>
      </div>

      <form onSubmit={handleSave} className="border border-border bg-canvas-raised p-6 md:p-8 space-y-6 shadow-subtle text-left">
        <div className="space-y-4">
          <Input
            label="Program Name"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Registration Fee (ETB)"
              type="number"
              min="0"
              step="10"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              hint="Fixed one-time fee charged upon acceptance."
              required
            />
            <Input
              label="Payment Window Deadline (Days)"
              type="number"
              min="1"
              max="30"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              hint="Time given to accepted applicants before expiration."
              required
            />
          </div>

          <div className="pt-4 border-t border-border space-y-4">
            <h4 className="font-serif text-base font-bold text-ink-primary">
              Ethio Telecom Telebirr Merchant Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Telebirr Merchant Name"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
              />
              <Input
                label="Telebirr Shortcode"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-4">
            <h4 className="font-serif text-base font-bold text-ink-primary">
              Certificate Authority
            </h4>
            <Input
              label="Signatory Line"
              value={signatory}
              onChange={(e) => setSignatory(e.target.value)}
              hint="Appears on all verified PDF qualifications and ID cards."
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<FloppyDisk className="w-4 h-4" />}
          >
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

