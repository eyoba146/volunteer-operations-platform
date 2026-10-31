import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Announcement, Activity, Rank } from '../../types';
import { Input, Select, Button, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Megaphone, Plus, Trash, UsersThree, PushPin } from '@phosphor-icons/react';

export const ManagerAnnouncementsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [audienceType, setAudienceType] = useState<'all' | 'rank' | 'area' | 'activity'>('all');
  const [selectedRank, setSelectedRank] = useState<Rank>('member');
  const [selectedArea, setSelectedArea] = useState('Addis Ababa');
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [annList, actList] = await Promise.all([
        api.getAnnouncements('all'),
        api.getAllActivities(),
      ]);
      setAnnouncements(annList);
      setActivities(actList);
      if (actList.length > 0 && !selectedActivityId) {
        setSelectedActivityId(actList[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !body.trim()) return;

    let targetAudience = 'all';
    if (audienceType === 'rank') {
      targetAudience = `rank:${selectedRank}`;
    } else if (audienceType === 'area') {
      targetAudience = `area:${selectedArea}`;
    } else if (audienceType === 'activity') {
      const act = activities.find((a) => a.id === selectedActivityId);
      targetAudience = `activity:${act?.title || selectedActivityId}`;
    }

    setIsSubmitting(true);
    try {
      await api.createAnnouncement({
        authorId: user.id,
        authorName: profile?.fullName || user.username,
        authorRole: 'Program Manager',
        audience: targetAudience,
        title: title.trim(),
        body: body.trim(),
        pinned,
      });

      toast.success('Notice published to the selected volunteer audience.');
      setTitle('');
      setBody('');
      setPinned(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not post announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAudienceLabel = (aud: string) => {
    if (aud === 'all') return 'Everyone (All Volunteers)';
    if (aud.startsWith('rank:')) return `Rank: ${aud.replace('rank:', '').replace('_', ' ').toUpperCase()}`;
    if (aud.startsWith('area:')) return `Area: ${aud.replace('area:', '')}`;
    if (aud.startsWith('activity:')) return `Roster: ${aud.replace('activity:', '')}`;
    return aud.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-role-manager uppercase tracking-tight block">
              Program Broadcast Dispatch
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-ink-primary leading-none">
              Notices & Broadcasts
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Publish urgent notices to everyone, a specific rank tier, an operating area, or a single activity roster.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Post Form */}
        <div
          className="lg:col-span-2 border-2 border-ink-primary bg-white p-6 space-y-4 shadow-ticket h-fit"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="border-b-2 border-border pb-2">
            <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
              Compose Notice
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Audience Type Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-tight text-ink-primary">
                Target Audience
              </label>
              <Select
                value={audienceType}
                onChange={(e) => setAudienceType(e.target.value as any)}
                options={[
                  { value: 'all', label: 'Everyone (All Volunteers)' },
                  { value: 'rank', label: 'Target by Rank' },
                  { value: 'area', label: 'Target by Operating Area' },
                  { value: 'activity', label: 'Target Activity Roster' },
                ]}
              />
            </div>

            {/* Dynamic Audience Sub-Selector */}
            {audienceType === 'rank' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-tight text-ink-primary">
                  Select Rank
                </label>
                <Select
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(e.target.value as Rank)}
                  options={[
                    { value: 'member', label: 'Members' },
                    { value: 'senior_member', label: 'Senior Members' },
                    { value: 'team_lead', label: 'Team Leads' },
                  ]}
                />
              </div>
            )}

            {audienceType === 'area' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-tight text-ink-primary">
                  Select Area
                </label>
                <Select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  options={[
                    { value: 'Addis Ababa', label: 'Addis Ababa' },
                    { value: 'Adama', label: 'Adama' },
                    { value: 'Bishoftu', label: 'Bishoftu' },
                    { value: 'Hawassa', label: 'Hawassa' },
                    { value: 'Bahir Dar', label: 'Bahir Dar' },
                  ]}
                />
              </div>
            )}

            {audienceType === 'activity' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-tight text-ink-primary">
                  Select Activity Roster
                </label>
                <Select
                  value={selectedActivityId}
                  onChange={(e) => setSelectedActivityId(e.target.value)}
                  options={activities.map((a) => ({
                    value: a.id,
                    label: `${a.title} (${a.area})`,
                  }))}
                />
              </div>
            )}

            <Input
              label="Notice Headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weather Advisory: Entoto Shift"
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-tight text-ink-primary">
                Notice Content
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your broadcast update here..."
                className="w-full bg-white text-ink-primary font-sans text-xs border-2 border-ink-primary p-2.5 focus:ring-1 focus:ring-ink-primary outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinned"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-ink-primary text-role-manager focus:ring-role-manager"
              />
              <label htmlFor="pinned" className="text-xs font-semibold text-ink-primary cursor-pointer">
                Pin notice to top of volunteer feed
              </label>
            </div>

            <Button
              type="submit"
              variant="teal"
              className="w-full"
              isLoading={isSubmitting}
              leftIcon={<Plus className="w-4 h-4" weight="bold" />}
            >
              Broadcast Notice
            </Button>
          </form>
        </div>

        {/* Announcements Stream */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink-primary pb-2">
            <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
              Active Broadcasts ({announcements.length})
            </h3>
          </div>

          {announcements.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="w-8 h-8 text-ink-tertiary" />}
              title="No active broadcasts"
              description="Published announcements will appear here and in volunteer dashboards."
            />
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="border-2 border-ink-primary bg-white p-5 space-y-3 shadow-ticket"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 border-b border-border pb-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {ann.pinned && (
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-amber-400 text-black uppercase flex items-center gap-1">
                            <PushPin className="w-3 h-3" weight="fill" /> PINNED
                          </span>
                        )}
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-canvas-subdued border border-border text-ink-primary uppercase">
                          {getAudienceLabel(ann.audience)}
                        </span>
                      </div>
                      <h4 className="font-display text-xl font-black uppercase text-ink-primary mt-1">
                        {ann.title}
                      </h4>
                    </div>

                    <span className="font-mono text-[10px] text-ink-tertiary whitespace-nowrap">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-ink-secondary leading-relaxed whitespace-pre-wrap">
                    {ann.body}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] font-mono text-ink-tertiary">
                    <span>Broadcast by: <strong>{ann.authorName}</strong> ({ann.authorRole})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
