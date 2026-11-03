import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment, Assignment } from '../../types';
import { Tabs, StatusMark, Button, Skeleton, EmptyState, TicketCard, PageShell, SheetModal } from '../../components/ui';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  QrCode,
  ArrowRight,
  UserCheck,
  CheckCircle,
  XCircle,
  FolderSimple,
} from '@phosphor-icons/react';

export const VolunteerMyActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Decline Assignment Modal
  const [decliningAssignment, setDecliningAssignment] = useState<Assignment | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [enrs, acts, asgns] = await Promise.all([
        api.getEnrollmentsForUser(user.id),
        api.getAllActivities(),
        api.getAssignments({ volunteerId: user.id }),
      ]);
      setEnrollments(enrs);
      setActivities(acts);
      setAssignments(asgns);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAccept = async (asgnId: string) => {
    try {
      await api.respondToAssignment(asgnId, 'accept');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningAssignment) return;

    setIsSubmittingResponse(true);
    try {
      await api.respondToAssignment(decliningAssignment.id, 'decline', declineReason.trim() || undefined);
      setDecliningAssignment(null);
      setDeclineReason('');
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  if (isLoading) {
    return (
      <PageShell page="volunteer/my-activities" signature="TicketCard">
        <div className="space-y-6">
          <Skeleton variant="text" className="h-8 w-1/3" />
          <Skeleton variant="rect" className="h-28 rounded-[10px]" />
          <Skeleton variant="rect" className="h-28 rounded-[10px]" />
        </div>
      </PageShell>
    );
  }

  const enrolledActivities = enrollments
    .map((enr) => {
      const act = activities.find((a) => a.id === enr.activityId);
      return act ? { activity: act, enrollment: enr } : null;
    })
    .filter(Boolean) as Array<{ activity: Activity; enrollment: Enrollment }>;

  const upcoming = enrolledActivities.filter(
    (item) => item.enrollment.status === 'joined'
  );

  const waiting = enrolledActivities.filter(
    (item) => item.enrollment.status === 'waiting'
  );

  const past = enrolledActivities.filter(
    (item) =>
      item.enrollment.status === 'attended' ||
      item.activity.status === 'completed'
  );

  const currentList =
    activeTab === 'upcoming' ? upcoming : activeTab === 'waiting' ? waiting : past;

  const pendingAssignments = assignments.filter((a) => a.status === 'assigned');
  const activeAssignments = assignments.filter((a) => a.status === 'accepted');

  return (
    <PageShell page="volunteer/my-activities" signature="TicketCard">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight">
            My volunteer roster
          </h1>
          <p className="font-sans text-sm text-ink-secondary">
            Official project assignments, manager deployments, and registered field activity shifts.
          </p>
        </div>

        {/* Section 1: Staff-Assigned Deployments (Requirement 2) */}
        {assignments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="font-display font-bold text-xl text-ink-primary">
                  Staff-assigned deployments ({assignments.length})
                </h2>
                <p className="font-sans text-xs text-ink-secondary">
                  Special program assignments directed by territory managers.
                </p>
              </div>
            </div>

            <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-3">
              {assignments.map((asgn) => {
                const targetTitle = asgn.projectName || asgn.activityTitle || 'Community Service Charter';
                const isPending = asgn.status === 'assigned';

                return (
                  <div
                    key={asgn.id}
                    className="p-5 rounded-[12px] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Requirement 2: Prominent "Assigned by Marta Girma" badge */}
                        <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-[6px] bg-[#0E6266]/10 text-[#0E6266]">
                          Assigned by {asgn.assignedByName || 'Manager'}
                        </span>
                        <StatusMark
                          status={
                            asgn.status === 'accepted' || asgn.status === 'completed'
                              ? 'approved'
                              : asgn.status === 'declined'
                              ? 'declined'
                              : 'waiting'
                          }
                          label={asgn.status}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="font-display font-bold text-lg text-ink-primary">
                          {targetTitle}
                        </div>
                        <div className="font-sans text-xs text-ink-secondary space-y-0.5">
                          <div>
                            Branch: <span className="font-medium text-ink-primary">{asgn.branchName || 'Local Branch'}</span> • Supervisor: <span className="font-medium text-ink-primary">{asgn.supervisorName || 'Team Lead'}</span>
                          </div>
                          <div>
                            Timeline: {asgn.startDate} {asgn.endDate ? `to ${asgn.endDate}` : '(Ongoing)'}
                          </div>
                          {asgn.notes && (
                            <div className="text-ink-secondary pt-0.5">
                              Role note: "{asgn.notes}"
                            </div>
                          )}
                          {asgn.declineReason && (
                            <div className="text-red-600 font-medium pt-0.5">
                              Decline reason: {asgn.declineReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions for Pending Assignment */}
                    {isPending ? (
                      <div className="flex items-center gap-2 self-start md:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setDecliningAssignment(asgn);
                            setDeclineReason('');
                          }}
                          className="px-3.5 py-2 rounded-[8px] bg-[#F1F3F6] text-xs font-sans font-semibold text-ink-secondary hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          Decline
                        </button>
                        <Button
                          variant="primary"
                          onClick={() => handleAccept(asgn.id)}
                          className="inline-flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" weight="bold" />
                          <span>Accept assignment</span>
                        </Button>
                      </div>
                    ) : asgn.status === 'accepted' ? (
                      <div className="p-2.5 rounded-[8px] bg-emerald-50 text-emerald-800 text-xs font-sans font-medium self-start md:self-auto flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" weight="bold" />
                        <span>Accepted • On active squad</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Registered Activity Shifts */}
        <div className="space-y-4 pt-2">
          <div className="space-y-0.5">
            <h2 className="font-display font-bold text-xl text-ink-primary">
              Registered activity shifts
            </h2>
            <p className="font-sans text-xs text-ink-secondary">
              Community shifts you have voluntarily enrolled in.
            </p>
          </div>

          <Tabs
            tabs={[
              { id: 'upcoming', label: 'Upcoming & active', count: upcoming.length },
              { id: 'waiting', label: 'Waiting list', count: waiting.length },
              { id: 'past', label: 'Past & attended', count: past.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {currentList.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon className="w-8 h-8 text-ink-secondary" weight="bold" />}
              title={
                activeTab === 'upcoming'
                  ? 'No upcoming registered shifts'
                  : activeTab === 'waiting'
                  ? 'No waiting list enrollments'
                  : 'No past activity records'
              }
              description={
                activeTab === 'upcoming'
                  ? 'You have not joined any upcoming activities yet. Browse open opportunities across your branch.'
                  : activeTab === 'waiting'
                  ? 'You are not currently waiting for spots in any full activities.'
                  : 'Activities you attend and check into will be recorded here.'
              }
              actionLabel="Browse available activities"
              onAction={() => navigate('/volunteer/activities')}
            />
          ) : (
            <div className="space-y-4">
              {currentList.map(({ activity, enrollment }) => (
                <TicketCard
                  key={enrollment.id}
                  activity={activity}
                  enrolledStatus={
                    enrollment.status === 'joined'
                      ? 'Enrolled'
                      : enrollment.status === 'waiting'
                      ? 'Waiting list'
                      : 'Attended'
                  }
                  actionSlot={
                    enrollment.status === 'joined' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<QrCode className="w-3.5 h-3.5 text-role-volunteer" weight="bold" />}
                        onClick={() => navigate('/volunteer/check-in')}
                      >
                        Check-in code
                      </Button>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Decline Reason Modal */}
        {decliningAssignment && (
          <SheetModal
            isOpen={!!decliningAssignment}
            onClose={() => setDecliningAssignment(null)}
            title="Decline project assignment"
            subtitle={`Let Manager ${decliningAssignment.assignedByName || 'Marta Girma'} know why you are unable to take this assignment.`}
          >
            <form onSubmit={handleDeclineSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Reason for declining *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. University final exams clash with the field schedule..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#1E824C]/30 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDecliningAssignment(null)}
                  className="px-4 py-2 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px]"
                >
                  Cancel
                </button>
                <Button variant="primary" type="submit" disabled={isSubmittingResponse}>
                  {isSubmittingResponse ? 'Submitting...' : 'Confirm decline'}
                </Button>
              </div>
            </form>
          </SheetModal>
        )}
      </div>
    </PageShell>
  );
};
