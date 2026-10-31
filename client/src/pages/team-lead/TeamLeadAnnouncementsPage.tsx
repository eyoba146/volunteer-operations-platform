import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Announcement } from '../../types';
import { Input, Button, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Megaphone, Plus } from '@phosphor-icons/react';

export const TeamLeadAnnouncementsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getAnnouncements('team_lead');
      setAnnouncements(list);
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

    setIsSubmitting(true);
    try {
      await api.createAnnouncement({
        authorId: user.id,
        authorName: profile?.fullName || user.username,
        authorRole: 'Team Lead',
        audience: 'all',
        title: title.trim(),
        body: body.trim(),
      });
      toast.success('Announcement broadcast to volunteers.');
      setTitle('');
      setBody('');
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Top Header */}
      <div className="border-b-2 border-border pb-5">
        <span className="font-sans text-xs font-bold text-role-teamlead tracking-tight block">
          Team Dispatch & Notices
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-ink-primary leading-none mt-1">
          Broadcast Field Notices
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
          Publish field updates, weather alerts, equipment requirements, or roster reminders to your volunteers.
        </p>
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
            <h3 className="font-display text-2xl font-black text-ink-primary">
              Post New Notice
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Notice Headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bring safety boots for clean-up"
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-ink-primary">
                Message Content
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write clear instructions for volunteers..."
                className="w-full bg-canvas text-ink-primary font-sans text-xs border-2 border-ink-primary p-2.5 focus:outline-none focus:ring-2 focus:ring-role-teamlead"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              isLoading={isSubmitting}
              leftIcon={<Plus className="w-4 h-4" weight="bold" />}
            >
              Broadcast Notice
            </Button>
          </form>
        </div>

        {/* Existing Notices Feed */}
        <div className="lg:col-span-3 border-2 border-ink-primary bg-white shadow-ticket divide-y-2 divide-border">
          <div className="p-4 bg-canvas border-b-2 border-ink-primary font-display text-xl font-black text-ink-primary">
            Recent Announcements Stream
          </div>

          {announcements.length === 0 ? (
            <div className="p-8 text-center font-sans text-xs text-ink-secondary">
              No announcements published yet.
            </div>
          ) : (
            announcements.map((anc) => (
              <div key={anc.id} className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-ink-tertiary">
                  <span className="font-bold text-role-teamlead">
                    {anc.authorName} ({anc.authorRole})
                  </span>
                  <span>{new Date(anc.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-display text-2xl font-black text-ink-primary leading-tight">
                  {anc.title}
                </h4>
                <p className="font-sans text-xs text-ink-secondary leading-relaxed whitespace-pre-line">
                  {anc.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
