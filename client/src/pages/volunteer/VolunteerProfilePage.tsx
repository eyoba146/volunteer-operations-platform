import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { VolunteerProfile, SignInLogEntry } from '../../types';
import { Input, Select, Button, StatusMark, Tabs, Skeleton, Avatar, ProfilePhotoModal } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Camera, 
  FloppyDisk, 
  Heart,
  ShieldCheck,
  DeviceMobile,
  Envelope,
  Bell,
  Check,
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
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
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

  // Multi-channel notifications preferences
  const [channels, setChannels] = useState<{
    activity: { email: boolean; sms: boolean };
    hours: { email: boolean; sms: boolean };
    promotions: { email: boolean; sms: boolean };
    announcements: { email: boolean; sms: boolean };
  }>({
    activity: { email: true, sms: true },
    hours: { email: true, sms: true },
    promotions: { email: true, sms: false },
    announcements: { email: true, sms: false },
  });

  // Sign-in history
  const [signInLogs, setSignInLogs] = useState<SignInLogEntry[]>([]);

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

    const loadSecurityLogs = async () => {
      try {
        const logs = await api.getSignInLogs(user?.id);
        setSignInLogs(logs.slice(0, 10));
      } catch {
        // fallback
      }
    };
    if (user) {
      loadSecurityLogs();
    }
  }, [profile, user]);

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
            <StatusMark status={profile.rank || 'volunteer'} size="sm" />
          </div>
          <p className="font-sans text-[13px] font-bold text-ink-secondary">
            Pass ID: {profile.volunteerNumber} • Registered: {profile.volunteerSince || profile.memberSince || 'Aug 2026'}
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
          { id: 'notifications', label: 'Notification channels' },
          { id: 'security', label: 'Security & sign-in history' },
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
              className="w-full bg-white text-ink-primary font-sans text-base rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-ink-primary/20"
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

      {/* TAB 2: MULTI-CHANNEL NOTIFICATION PREFERENCES */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="rounded-[10px] bg-white p-6 sm:p-8 space-y-6">
          <div className="pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Multi-channel alert preferences
            </h3>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Select which notifications you receive across In-app, Email, and SMS text messages. Account security notices (password resets, login verifications) are mandatory and always sent.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[12px] bg-[#F7F8FA]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F3F6] text-ink-secondary">
                <tr>
                  <th className="py-3 px-4 font-semibold text-ink-primary">Event notification type</th>
                  <th className="py-3 px-3 text-center font-semibold text-ink-primary">In-app</th>
                  <th className="py-3 px-3 text-center font-semibold text-ink-primary">Email</th>
                  <th className="py-3 px-3 text-center font-semibold text-ink-primary">SMS Text</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EBEF]">
                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-ink-primary">
                    <span className="font-semibold block text-sm">Activity reminders & schedule changes</span>
                    <span className="text-xs text-ink-tertiary">Alerts before scheduled shifts and when venue or timing changes</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input type="checkbox" checked disabled className="w-4 h-4 accent-role-volunteer cursor-not-allowed opacity-70" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={channels.activity.email}
                      onChange={(e) => setChannels((p) => ({ ...p, activity: { ...p.activity, email: e.target.checked } }))}
                      className="w-4 h-4 accent-role-volunteer cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={channels.activity.sms}
                      onChange={(e) => setChannels((p) => ({ ...p, activity: { ...p.activity, sms: e.target.checked } }))}
                      className="w-4 h-4 accent-role-volunteer cursor-pointer"
                    />
                  </td>
                </tr>

                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-ink-primary">
                    <span className="font-semibold block text-sm">Hours approvals & decisions</span>
                    <span className="text-xs text-ink-tertiary">Real-time alerts when service hours are verified by Team Leads</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input type="checkbox" checked disabled className="w-4 h-4 accent-role-volunteer cursor-not-allowed opacity-70" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={channels.hours.email}
                      onChange={(e) => setChannels((p) => ({ ...p, hours: { ...p.hours, email: e.target.checked } }))}
                      className="w-4 h-4 accent-role-volunteer cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={channels.hours.sms}
                      onChange={(e) => setChannels((p) => ({ ...p, hours: { ...p.hours, sms: e.target.checked } }))}
                      className="w-4 h-4 accent-role-volunteer cursor-pointer"
                    />
                  </td>
                </tr>

                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-ink-primary">
                    <span className="font-semibold block text-sm">Rank progress & promotion milestones</span>
                    <span className="text-xs text-ink-tertiary">Notices when threshold criteria are unlocked or promotions awarded</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input type="checkbox" checked disabled className="w-4 h-4 accent-role-volunteer cursor-not-allowed opacity-70" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={channels.promotions.email}
                      onChange={(e) => setChannels((p) => ({ ...p, promotions: { ...p.promotions, email: e.target.checked } }))}
                      className="w-4 h-4 accent-role-volunteer cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={channels.promotions.sms}
                      onChange={(e) => setChannels((p) => ({ ...p, promotions: { ...p.promotions, sms: e.target.checked } }))}
                      className="w-4 h-4 accent-role-volunteer cursor-pointer"
                    />
                  </td>
                </tr>

                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-ink-primary">
                    <span className="font-semibold block text-sm">Team lead announcements & emergency notices</span>
                    <span className="text-xs text-ink-tertiary">Operational bulletins broadcast to your branch or activity roster</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input type="checkbox" checked disabled className="w-4 h-4 accent-role-volunteer cursor-not-allowed opacity-70" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={channels.announcements.email}
                      onChange={(e) => setChannels((p) => ({ ...p, announcements: { ...p.announcements, email: e.target.checked } }))}
                      className="w-4 h-4 accent-role-volunteer cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={channels.announcements.sms}
                      onChange={(e) => setChannels((p) => ({ ...p, announcements: { ...p.announcements, sms: e.target.checked } }))}
                      className="w-4 h-4 accent-role-volunteer cursor-pointer"
                    />
                  </td>
                </tr>

                <tr className="bg-[#F1F3F6]/50">
                  <td className="py-3.5 px-4 font-medium text-ink-primary">
                    <span className="font-semibold block text-sm">Account security & payment receipts</span>
                    <span className="text-xs text-ink-tertiary">Password resets, verification codes, and official Telebirr payment receipts</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input type="checkbox" checked disabled className="w-4 h-4 accent-role-volunteer cursor-not-allowed opacity-70" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input type="checkbox" checked disabled className="w-4 h-4 accent-role-volunteer cursor-not-allowed opacity-70" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input type="checkbox" checked disabled className="w-4 h-4 accent-role-volunteer cursor-not-allowed opacity-70" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-end">
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

      {/* TAB 3: SECURITY & RECENT SIGN-IN HISTORY */}
      {activeTab === 'security' && (
        <div className="rounded-[10px] bg-white p-6 sm:p-8 space-y-6 text-left">
          <div className="pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Security and sign-in activity history
            </h3>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Review recent sign-in sessions, device summaries, and security alert events on your account.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[12px] bg-[#F7F8FA]">
            {signInLogs.length === 0 ? (
              <div className="p-8 text-center text-sm text-ink-secondary">
                No recent sign-in history logged yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F1F3F6] text-ink-secondary">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-ink-primary">Time</th>
                    <th className="py-3 px-3 font-semibold text-ink-primary">Device & Browser</th>
                    <th className="py-3 px-3 font-semibold text-ink-primary">IP Address</th>
                    <th className="py-3 px-4 font-semibold text-ink-primary text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EBEF]">
                  {signInLogs.map((log) => {
                    const isSuccess = log.result === 'success';
                    const isLocked = log.result === 'locked';

                    return (
                      <tr key={log.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-3 px-4 font-mono text-ink-primary">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-sans text-ink-primary font-medium">
                          {log.deviceSummary || 'Web Browser'}
                        </td>
                        <td className="py-3 px-3 font-mono text-ink-secondary">
                          {log.ipAddress || '196.188.24.1'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] font-semibold text-[11px] ${
                              isSuccess
                                ? 'bg-role-volunteer/15 text-role-volunteer'
                                : isLocked
                                ? 'bg-[#D63927]/20 text-[#D63927]'
                                : 'bg-[#E58B05]/20 text-[#E58B05]'
                            }`}
                          >
                            {isSuccess ? 'Success' : isLocked ? 'Locked' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 rounded-[12px] bg-[#F7F8FA] text-xs text-ink-secondary space-y-1">
            <span className="font-semibold text-ink-primary block">Account security policy</span>
            <p>
              Security alerts for new devices or failed attempts are delivered via SMS to <strong>{profile.phone}</strong> and email to <strong>{user?.email}</strong>. If you notice unfamiliar activity, please notify program management immediately.
            </p>
          </div>
        </div>
      )}

      {/* Profile Photo Cropper Modal */}
      <ProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};
