import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { VolunteerProfile } from '../../types';
import { Input, Select, Button, StatusMark, Tabs, Skeleton, Avatar, ProfilePhotoModal } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Camera, 
  FloppyDisk, 
  Heart
} from '@phosphor-icons/react';

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
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Profile fields
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [area, setArea] = useState(profile?.area || 'Bole, Addis Ababa');
  const [languages, setLanguages] = useState(profile?.languages?.join(', ') || 'Amharic, English');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState(profile?.skills?.join(', ') || '');

  // Emergency contact
  const [contactName, setContactName] = useState(profile?.emergencyContact?.name || '');
  const [contactRel, setContactRel] = useState(profile?.emergencyContact?.relationship || 'Parent');
  const [contactPhone, setContactPhone] = useState(profile?.emergencyContact?.phone || '');

  // Notifications
  const [notifyActivityReminders, setNotifyActivityReminders] = useState(true);
  const [notifyHoursDecisions, setNotifyHoursDecisions] = useState(true);
  const [notifyPromotionUpdates, setNotifyPromotionUpdates] = useState(true);
  const [notifyCommunityNotices, setNotifyCommunityNotices] = useState(true);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setPhone(profile.phone);
      setArea(profile.area);
      setLanguages(profile.languages?.join(', ') || 'Amharic, English');
      setBio(profile.bio || '');
      setSkills(profile.skills?.join(', ') || '');
      if (profile.emergencyContact) {
        setContactName(profile.emergencyContact.name);
        setContactRel(profile.emergencyContact.relationship);
        setContactPhone(profile.emergencyContact.phone);
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
        languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
        bio,
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

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notification preferences updated successfully.');
    }, 300);
  };

  if (!profile) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton variant="text" className="h-10 w-1/3" />
        <Skeleton variant="rect" className="h-48" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="pb-5">
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary leading-tight mt-1">
          Volunteer profile and settings
        </h1>
        <p className="font-sans text-sm text-ink-secondary mt-1">
          Manage your personal information, duty location, emergency contact, and communication alerts.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-[10px] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
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
            Change photo
          </Button>
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              {profile.fullName}
            </h2>
            <StatusMark status={profile.rank || 'member'} size="sm" />
          </div>
          <p className="font-sans text-[13px] font-bold text-ink-secondary">
            Pass ID: {profile.volunteerNumber} • Registered: {profile.memberSince || 'Aug 2026'}
          </p>
          <p className="font-sans text-[13px] text-ink-secondary">
            Username: <span className="font-bold text-ink-primary">{user?.username}</span> • Email: <span className="font-bold text-ink-primary">{user?.email}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'profile', label: 'Personal information' },
          { id: 'notifications', label: 'Notification settings' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* TAB 1: PROFILE DETAILS FORM */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="rounded-[10px] bg-white p-6 sm:p-8 space-y-6">
          <div className="pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Contact and community area details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full legal name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Mobile phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Community area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              options={ETHIOPIAN_AREAS}
              required
            />
            <Input
              label="Languages spoken"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g. Amharic, English, Afaan Oromo"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-bold text-ink-primary">
              Volunteer bio and experience
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white text-ink-primary font-sans text-base rounded-[8px] p-2.5 focus:border-ink-primary"
            />
          </div>

          <Input
            label="Key skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. First Aid, Logistics, Construction Support"
          />

          {/* Emergency Contact */}
          <div className="space-y-4 pt-4">
            <h4 className="font-display text-xl font-bold text-ink-primary flex items-center gap-2">
              <Heart className="w-5 h-5 text-role-teamlead" weight="fill" />
              <span>Emergency contact person</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Contact name"
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
                label="Emergency phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              leftIcon={<FloppyDisk className="w-4 h-4" weight="bold" />}
            >
              Save profile changes
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: NOTIFICATION PREFERENCES */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="rounded-[10px] bg-white p-6 sm:p-8 space-y-6">
          <div className="pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Email and alert preferences
            </h3>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Select which notifications you want to receive. Account security notices (password resets, verification codes) are always sent.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 pt-3 first:pt-0 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyActivityReminders}
                onChange={(e) => setNotifyActivityReminders(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-role-volunteer cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-sans text-sm font-bold text-ink-primary block">
                  Activity reminders and schedule changes
                </span>
                <span className="font-sans text-[13px] text-ink-secondary block">
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
                  Hours approvals and decision notices
                </span>
                <span className="font-sans text-[13px] text-ink-secondary block">
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
                  Rank milestones and promotion announcements
                </span>
                <span className="font-sans text-[13px] text-ink-secondary block">
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
                  Team lead bulletins and general notices
                </span>
                <span className="font-sans text-[13px] text-ink-secondary block">
                  Notices broadcast to all volunteers by Team Leads and Program Managers.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              leftIcon={<FloppyDisk className="w-4 h-4" weight="bold" />}
            >
              Save notification preferences
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
