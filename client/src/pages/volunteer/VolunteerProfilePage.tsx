import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { VolunteerProfile } from '../../types';
import { Input, Select, Button, StatusMark, Avatar, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { FloppyDisk, UserCircle, Phone, MapPin, Heart } from '@phosphor-icons/react';

const ETHIOPIAN_AREAS = [
  { value: 'Bole, Addis Ababa', label: 'Bole, Addis Ababa' },
  { value: 'Kazanchis, Addis Ababa', label: 'Kazanchis, Addis Ababa' },
  { value: 'Piassa, Addis Ababa', label: 'Piassa, Addis Ababa' },
  { value: 'Arada, Addis Ababa', label: 'Arada, Addis Ababa' },
  { value: 'Lideta, Addis Ababa', label: 'Lideta, Addis Ababa' },
  { value: 'Yeka, Addis Ababa', label: 'Yeka, Addis Ababa' },
  { value: 'Adama, Oromia', label: 'Adama, Oromia' },
  { value: 'Bishoftu, Oromia', label: 'Bishoftu, Oromia' },
  { value: 'Hawassa, Sidama', label: 'Hawassa, Sidama' },
  { value: 'Bahir Dar, Amhara', label: 'Bahir Dar, Amhara' },
];

export const VolunteerProfilePage: React.FC = () => {
  const { user, profile, refreshUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Bole, Addis Ababa');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');
  const [skills, setSkills] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRel, setContactRel] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
      setArea(profile.area || 'Bole, Addis Ababa');
      setBio(profile.bio || '');
      setLanguages(profile.languages?.join(', ') || '');
      setSkills(profile.skills?.join(', ') || '');
      if (profile.emergencyContact) {
        setContactName(profile.emergencyContact.name || '');
        setContactRel(profile.emergencyContact.relationship || '');
        setContactPhone(profile.emergencyContact.phone || '');
      }
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await api.updateProfile(user.id, {
        fullName,
        phone,
        area,
        bio,
        languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        emergencyContact: {
          name: contactName,
          relationship: contactRel,
          phone: contactPhone,
        },
      });
      await refreshUser();
      toast.success('Your profile details have been saved.');
    } catch (err: any) {
      toast.error(err.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          REGISTRY PROFILE
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Volunteer Profile & Settings
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Update your contact information, service area, and emergency contact details.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="border border-border bg-canvas-raised p-6 flex flex-col sm:flex-row items-center gap-6 shadow-subtle">
        <Avatar
          name={profile.fullName}
          photoUrl={profile.photoUrl}
          rank={profile.rank}
          size="xl"
          showRankBadge
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="font-serif text-2xl font-bold text-ink-primary">
              {profile.fullName}
            </h2>
            <StatusMark status={profile.rank || 'member'} size="sm" />
          </div>
          <p className="font-mono text-xs text-ink-tertiary">
            ID: {profile.volunteerNumber} • Registered: {profile.memberSince || '2026-08'}
          </p>
          <p className="font-sans text-xs text-ink-secondary">
            Username: <span className="font-mono">{user?.username}</span> • Email: <span className="font-mono">{user?.email}</span>
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="border border-border bg-canvas-raised p-6 md:p-8 space-y-6 shadow-subtle">
        <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
          Contact & Regional Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Mobile Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Service Area / City"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            options={ETHIOPIAN_AREAS}
            required
          />
          <Input
            label="Languages Spoken"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="e.g. Amharic, English, Afaan Oromo"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Bio & Community Background
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border border-border p-2.5 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
          />
        </div>

        <Input
          label="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. First Aid, Logistics, Community Outreach"
        />

        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-serif text-base font-semibold text-ink-primary flex items-center gap-2">
            <Heart className="w-4 h-4 text-civic-rust" weight="fill" />
            <span>Emergency Contact Person</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Contact Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <Input
              label="Relationship"
              value={contactRel}
              onChange={(e) => setContactRel(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
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
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

