import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Notification } from '../../types';
import { EmptyState, Skeleton, Button } from '../../components/ui';
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
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton variant="text" className="h-10 w-1/3" />
        <Skeleton variant="row" />
        <Skeleton variant="row" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D5DAE1] pb-5 gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary leading-tight">
            Notifications
          </h1>
          <p className="font-sans text-sm text-ink-secondary mt-1">
            Application review alerts, admissions notices, and payment updates.
          </p>
        </div>
        {notifications.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title="No alerts right now"
          description="When your application status changes or admissions sends you a message, you will receive updates here."
          actionLabel="View application status"
          onAction={() => navigate('/applicant/status')}
        />
      ) : (
        <div className="border border-[#D5DAE1] rounded-[10px] bg-white divide-y divide-[#D5DAE1] overflow-hidden">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 transition-colors flex items-start gap-4 ${
                !notif.readAt ? 'bg-role-applicantLight/30 font-medium' : 'bg-white'
              }`}
            >
              <div className="w-10 h-10 border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued flex items-center justify-center shrink-0 text-ink-primary mt-0.5">
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-1 text-left">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-ink-primary">
                    {notif.title}
                  </h3>
                  <span className="font-sans text-[13px] text-ink-secondary">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                  {notif.body}
                </p>
                {notif.link && (
                  <div className="pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(notif.link!)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Open
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
