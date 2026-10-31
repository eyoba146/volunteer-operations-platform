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
      toast.success('Announcement broadcast to volunteer team.');
      setTitle('');
      setBody('');
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          TEAM DISPATCH & NOTICES
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Publish Field Announcements
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Broadcast essential briefing notes, safety reminders, or schedule changes to volunteers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Post Announcement Form */}
        <div className="lg:col-span-2 border border-border bg-canvas-raised p-6 space-y-4 h-fit">
          <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
            Post New Notice
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Notice Headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bring work boots for Saturday's clean-up"
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Notice Body
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write clear instructions for volunteers..."
                className="w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border border-border p-2.5 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Broadcast Notice
            </Button>
          </form>
        </div>

        {/* Existing Announcements Feed */}
        <div className="lg:col-span-3 border border-border bg-canvas-raised divide-y divide-border">
          <div className="p-4 bg-canvas-subdued border-b border-border font-serif font-bold text-sm text-ink-primary">
            Recent Announcements Stream
          </div>
          {announcements.map((anc) => (
            <div key={anc.id} className="p-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-tertiary">
                <span>By {anc.authorName} ({anc.authorRole})</span>
                <span>{new Date(anc.createdAt).toLocaleDateString()}</span>
              </div>
              <h4 className="font-sans text-base font-bold text-ink-primary">
                {anc.title}
              </h4>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed whitespace-pre-line">
                {anc.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

