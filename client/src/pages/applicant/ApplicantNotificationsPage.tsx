import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Notification } from '../../types';
import { EmptyState, Skeleton, Button, JourneyLog, JourneyItem, PageShell, PageHeader } from '../../components/ui';
import { Bell, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const ApplicantNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadNotifs = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const list = await api.getNotificationsForUser(user.id);
      setNotifications(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await api.markAllNotificationsAsRead(user.id);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
    );
  };

  if (isLoading) {
    return (
      <PageShell page="applicant/notifications" signature="JourneyLog">
        <div className="space-y-4 max-w-3xl mx-auto">
          <Skeleton variant="text" className="h-10 w-1/3" />
          <Skeleton variant="row" />
          <Skeleton variant="row" />
        </div>
      </PageShell>
    );
  }

  const journeyItems: JourneyItem[] = notifications.map((n) => ({
    id: n.id,
    date: n.createdAt,
    title: n.title,
    subtitle: n.body,
    status: n.readAt ? 'approved' : 'waiting',
    statusLabel: n.readAt ? 'Read' : 'New notice',
    details: n.link
      ? {
          fields: [
            { label: 'Action link', value: n.link },
            { label: 'Received on', value: new Date(n.createdAt).toLocaleDateString() },
          ],
        }
      : undefined,
  }));

  return (
    <PageShell page="applicant/notifications" signature="JourneyLog">
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title="Notifications"
          description="Application review alerts, admissions notices, and payment updates."
          action={
            notifications.length > 0 ? (
              <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
            ) : undefined
          }
        />

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-8 h-8" />}
            title="No alerts right now"
            description="When your application status changes or admissions sends you a message, you will receive updates here."
            actionLabel="View application status"
            onAction={() => navigate('/applicant/status')}
          />
        ) : (
          <JourneyLog
            items={journeyItems}
            leadSummary={`${notifications.length} notices recorded along your admissions trail.`}
          />
        )}
      </div>
    </PageShell>
  );
};
