import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Notification } from '../../types';
import { EmptyState, Skeleton, Button } from '../../components/ui';
import { Bell, Check, ArrowSquareOut } from '@phosphor-icons/react';
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
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="row" />
        <Skeleton variant="row" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            MESSAGING & ALERTS
          </span>
          <h1 className="font-serif text-2xl font-bold text-ink-primary">
            Applicant Notifications
          </h1>
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6" />}
          title="No alerts right now"
          description="When your application status changes or payment is confirmed, you will receive notifications here."
          actionLabel="View Application Status"
          onAction={() => navigate('/applicant/status')}
        />
      ) : (
        <div className="border border-border bg-canvas-raised divide-y divide-border">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition-colors flex items-start gap-4 ${
                !notif.readAt ? 'bg-canvas-subdued/60 font-medium' : 'bg-canvas-raised'
              }`}
            >
              <div className="w-8 h-8 border border-border bg-canvas-subdued flex items-center justify-center shrink-0 text-ink-secondary mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1 text-left">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-sans text-sm font-bold text-ink-primary">
                    {notif.title}
                  </h4>
                  <span className="font-mono text-[11px] text-ink-tertiary">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                  {notif.body}
                </p>
                {notif.link && (
                  <div className="pt-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate(notif.link!)}
                      rightIcon={<ArrowSquareOut className="w-3.5 h-3.5" />}
                    >
                      View details
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

