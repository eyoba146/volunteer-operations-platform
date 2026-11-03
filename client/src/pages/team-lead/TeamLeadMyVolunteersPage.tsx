import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageShell, StatusMark, Avatar, Button } from '../../components/ui';
import { TopoBackdrop } from '../../components/signature/TopoBackdrop';
import {
  UsersThree,
  Clock,
  Calendar,
  CheckCircle,
  Star,
  ChartLineUp,
  ArrowRight,
  ShieldCheck,
} from '@phosphor-icons/react';
import { getSupervisedVolunteers, SupervisedVolunteerSummary } from '../../api/assignments';
import { store } from '../../api/store';
import { formatRank } from '../../utils/format';

export const TeamLeadMyVolunteersPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [volunteers, setVolunteers] = useState<SupervisedVolunteerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const list = await getSupervisedVolunteers(currentUser.id);
      setVolunteers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id]);

  return (
    <PageShell page="team-lead/my-volunteers" signature="TopoBackdrop">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Editorial Header */}
        <div className="space-y-1">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
            My volunteers
          </h1>
          <p className="font-sans text-base text-ink-secondary">
            Volunteers assigned to your squad and supervision across branch project initiatives.
          </p>
        </div>

        {/* Volunteers Roster */}
        {loading ? (
          <div className="p-12 text-center text-sm font-sans text-ink-secondary">
            Loading supervised roster...
          </div>
        ) : volunteers.length === 0 ? (
          <div className="p-12 rounded-[16px] bg-[#F7F8FA] text-center space-y-3">
            <UsersThree className="w-10 h-10 mx-auto text-ink-secondary/50" weight="bold" />
            <div className="font-display font-bold text-lg text-ink-primary">
              No volunteers currently supervised
            </div>
            <p className="font-sans text-sm text-ink-secondary max-w-md mx-auto">
              When a Manager assigns volunteers to your branch projects or activities, they will appear here with their service hours and rosters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {volunteers.map(({ user, profile, activeAssignments, completedAssignmentsCount, approvedHours }) => {
              const fullName = profile?.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
              const rank = profile?.rank || 'volunteer';

              return (
                <div
                  key={user.id}
                  className="rounded-[16px] bg-[#F7F8FA] p-6 space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={fullName}
                          avatarUrl={profile?.avatarUrl}
                          size="md"
                          rank={rank}
                        />
                        <div>
                          <h2 className="font-display font-bold text-lg text-ink-primary">
                            {fullName}
                          </h2>
                          <div className="font-sans text-xs text-ink-secondary">
                            {formatRank(rank)} • {profile?.branchName || user.branchName || 'Local Branch'}
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-[8px] bg-white text-right">
                        <div className="font-display font-bold text-base text-ink-primary">
                          {approvedHours} hrs
                        </div>
                        <div className="font-sans text-[11px] text-ink-secondary">
                          Approved
                        </div>
                      </div>
                    </div>

                    {/* Active Assignments */}
                    <div className="space-y-2">
                      <div className="font-sans text-xs font-semibold text-ink-secondary">
                        Active Project Deployments ({activeAssignments.length})
                      </div>
                      {activeAssignments.length === 0 ? (
                        <div className="p-3 rounded-[8px] bg-white text-xs font-sans text-ink-secondary">
                          No active deployments currently underway.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {activeAssignments.map((asgn) => (
                            <div
                              key={asgn.id}
                              className="p-3 rounded-[8px] bg-white flex items-center justify-between text-xs font-sans"
                            >
                              <div className="space-y-0.5">
                                <div className="font-semibold text-ink-primary">
                                  {asgn.projectName || asgn.activityTitle || 'Field Project'}
                                </div>
                                <div className="text-ink-secondary">
                                  Started: {asgn.startDate} • Assigned by {asgn.assignedByName || 'Manager'}
                                </div>
                              </div>
                              <StatusMark
                                status={asgn.status === 'accepted' ? 'approved' : 'waiting'}
                                label={asgn.status}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-sans text-ink-secondary">
                      {completedAssignmentsCount} completed assignments
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/team-lead/approve-hours"
                        className="px-3 py-1.5 rounded-[6px] bg-[#F1F3F6] text-xs font-sans font-semibold text-ink-primary hover:bg-[#E8EBEF] transition-colors"
                      >
                        Hours
                      </Link>
                      <Link
                        to="/team-lead/recommend-promotion"
                        className="px-3 py-1.5 rounded-[6px] bg-[#F1F3F6] text-xs font-sans font-semibold text-ink-primary hover:bg-[#E8EBEF] transition-colors inline-flex items-center gap-1"
                      >
                        <ChartLineUp className="w-3 h-3" weight="bold" />
                        <span>Nominate</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
};
