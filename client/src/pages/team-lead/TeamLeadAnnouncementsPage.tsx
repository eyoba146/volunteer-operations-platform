import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Announcement } from '../../types';
import { Input, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Plus } from '@phosphor-icons/react';

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
        <Skeleton variant="rect" className="h-64 rounded-[10px]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="border-b border-[#D5DAE1] pb-4">
        <span className="font-sans text-[13px] font-semibold text-role-teamlead block">
          Team dispatch & notices
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
          Broadcast field notices
        </h1>
        <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
          Publish field updates, weather alerts, equipment requirements, or roster reminders to your volunteers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Post Form */}
        <div className="lg:col-span-2 border border-[#D5DAE1] rounded-[10px] bg-white p-6 space-y-4 shadow-sm h-fit">
          <div className="border-b border-[#D5DAE1] pb-2">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Post new notice
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Notice headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bring safety boots for clean-up"
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-[13px] font-medium text-ink-primary">
                Message content
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write clear instructions for volunteers..."
                className="w-full bg-white text-ink-primary font-sans text-[13px] border-[1.5px] border-[#475569] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-role-teamlead"
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
              Broadcast notice
            </Button>
          </form>
        </div>

        {/* Existing Notices Feed */}
        <div className="lg:col-span-3 border border-[#D5DAE1] rounded-[10px] bg-white shadow-sm divide-y divide-[#D5DAE1] overflow-hidden">
          <div className="p-4 bg-canvas-subdued/30 border-b border-[#D5DAE1] font-display text-lg font-bold text-ink-primary">
            Recent announcements stream
          </div>

          {announcements.length === 0 ? (
            <div className="p-8 text-center font-sans text-[13px] text-ink-secondary">
              No announcements published yet.
            </div>
          ) : (
            announcements.map((anc) => (
              <div key={anc.id} className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[13px] font-mono text-ink-tertiary">
                  <span className="font-semibold text-role-teamlead">
                    {anc.authorName} ({anc.authorRole})
                  </span>
                  <span>{new Date(anc.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-display text-xl font-bold text-ink-primary leading-tight">
                  {anc.title}
                </h4>
                <p className="font-sans text-[13px] text-ink-secondary leading-relaxed whitespace-pre-line">
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
