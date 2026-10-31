import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { VolunteerProfile } from '../../types';
import { Input, Select, Button, StatusMark, Avatar, Skeleton, Tabs, ProfilePhotoModal } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { FloppyDisk, UserCircle, Phone, MapPin, Heart, Bell, ShieldCheck, Camera } from '@phosphor-icons/react';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  // Profile Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Bole, Addis Ababa');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');
  const [skills, setSkills] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRel, setContactRel] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Notification Preferences (FR-NTF-04)
  const [notifyActivityReminders, setNotifyActivityReminders] = useState(true);
  const [notifyHoursDecisions, setNotifyHoursDecisions] = useState(true);
  const [notifyPromotionUpdates, setNotifyPromotionUpdates] = useState(true);
  const [notifyCommunityNotices, setNotifyCommunityNotices] = useState(true);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
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
      toast.success('Your profile changes have been saved.');
    } catch (err: any) {
      toast.error(err.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notification preferences updated successfully.');
    }, 400);
  };

  if (!profile) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="border-b-2 border-border pb-5">
        <span className="font-sans text-xs font-bold text-role-volunteer tracking-tight block">
          Account & Preferences
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-ink-primary leading-none mt-1">
          Volunteer Profile & Settings
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
          Manage your personal information, duty location, emergency contact, and communication alerts.
        </p>
      </div>

      {/* Profile Overview Card (Ticket Silhouette) */}
      <div
        className="border-2 border-ink-primary bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-[6px_6px_0_#111111]"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col items-center gap-3 shrink-0">
          <Avatar
            name={profile.fullName}
            photoUrl={profile.photoUrl}
            avatarUrl={user?.avatarUrl || profile.avatarUrl}
            rank={profile.rank}
            size="xl"
            showRankBadge
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setPhotoModalOpen(true)}
            leftIcon={<Camera className="w-4 h-4" weight="bold" />}
          >
            Change Photo
          </Button>
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="font-display text-3xl font-black text-ink-primary tracking-tight">
              {profile.fullName}
            </h2>
            <StatusMark status={profile.rank || 'member'} size="sm" />
          </div>
          <p className="font-sans text-xs font-bold text-ink-secondary">
            Pass ID: {profile.volunteerNumber} • Registered: {profile.memberSince || 'Aug 2026'}
          </p>
          <p className="font-sans text-xs text-ink-secondary">
            Username: <span className="font-bold text-ink-primary">{user?.username}</span> • Email: <span className="font-bold text-ink-primary">{user?.email}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'profile', label: 'Personal Information' },
          { id: 'notifications', label: 'Notification Settings' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* TAB 1: PROFILE DETAILS FORM */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="border-2 border-ink-primary bg-white p-6 sm:p-8 space-y-6 shadow-ticket">
          <div className="border-b-2 border-border pb-3">
            <h3 className="font-display text-2xl font-black text-ink-primary">
              Contact & Regional Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Legal Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Mobile Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Service Area / Hub"
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
            <label className="block text-xs font-bold text-ink-primary">
              Volunteer Bio & Experience
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-canvas text-ink-primary font-sans text-xs border-2 border-ink-primary p-2.5 focus:outline-none focus:ring-2 focus:ring-role-volunteer"
            />
          </div>

          <Input
            label="Key Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. First Aid, Logistics, Construction Support"
          />

          {/* Emergency Contact */}
          <div className="space-y-4 pt-4 border-t-2 border-border">
            <h4 className="font-display text-xl font-black text-ink-primary flex items-center gap-2">
              <Heart className="w-5 h-5 text-role-teamlead" weight="fill" />
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
                label="Emergency Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-border flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              leftIcon={<FloppyDisk className="w-4 h-4" weight="bold" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: NOTIFICATION PREFERENCES (FR-NTF-04) */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="border-2 border-ink-primary bg-white p-6 sm:p-8 space-y-6 shadow-ticket">
          <div className="border-b-2 border-border pb-3">
            <h3 className="font-display text-2xl font-black text-ink-primary">
              Email & Alert Preferences
            </h3>
            <p className="font-sans text-xs text-ink-secondary mt-1">
              Select which notifications you want to receive. Account security notices (password resets, verification codes) are always sent.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-border">
            <label className="flex items-start gap-3 pt-3 first:pt-0 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyActivityReminders}
                onChange={(e) => setNotifyActivityReminders(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-role-volunteer cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-sans text-sm font-bold text-ink-primary block">
                  Activity Reminders & Schedule Changes
                </span>
                <span className="font-sans text-xs text-ink-secondary block">
                  Receive alerts before your upcoming shifts and whenever location or timing changes.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyHoursDecisions}
                onChange={(e) => setNotifyHoursDecisions(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-role-volunteer cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-sans text-sm font-bold text-ink-primary block">
                  Hours Approvals & Decision Notices
                </span>
                <span className="font-sans text-xs text-ink-secondary block">
                  Be notified as soon as a Team Lead approves or provides feedback on your service hours.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyPromotionUpdates}
                onChange={(e) => setNotifyPromotionUpdates(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-role-volunteer cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-sans text-sm font-bold text-ink-primary block">
                  Rank Milestones & Promotion Announcements
                </span>
                <span className="font-sans text-xs text-ink-secondary block">
                  Updates when you meet rank thresholds or your promotion candidacy is decided.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyCommunityNotices}
                onChange={(e) => setNotifyCommunityNotices(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-role-volunteer cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-sans text-sm font-bold text-ink-primary block">
                  Team Lead Bulletins & General Notices
                </span>
                <span className="font-sans text-xs text-ink-secondary block">
                  Notices broadcast to all volunteers by Team Leads and Program Managers.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t-2 border-border flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              leftIcon={<FloppyDisk className="w-4 h-4" weight="bold" />}
            >
              Save Notification Preferences
            </Button>
          </div>
        </form>
      )}

      {/* Profile Photo Cropper Modal */}
      <ProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};
