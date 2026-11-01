import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageShell,
  Button,
  TrailLine,
  TicketPass,
  Raised,
  Panel,
  TopoBackdrop,
} from '../../components/ui';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Users,
  Clock,
  Sparkle,
} from '@phosphor-icons/react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeRankIndex, setActiveRankIndex] = useState(0);

  const RANKS = [
    {
      id: 'member',
      name: 'Member',
      hours: '0 hrs',
      activities: '1 activity',
      rating: 'No minimum',
      course: 'Volunteer Orientation',
      roleColor: '#D97706',
      badge: 'Member',
      summary:
        'The starting waypoint on the trail. Complete your registration, receive your digital volunteer pass, and join your first community project.',
      unlocks: [
        'Personal Volunteer Pass and QR verification code',
        'Enrollment in all public field and logistics activities',
        'Record of verified volunteer service hours',
        'Eligibility for community training workshops',
      ],
    },
    {
      id: 'senior_member',
      name: 'Senior Member',
      hours: '30 hrs',
      activities: '5 activities',
      rating: '4.2 stars',
      course: 'Field Safety & First Aid',
      roleColor: '#16A34A',
      badge: 'Senior Member',
      summary:
        'A dedicated waypoint reached through consistent service. Senior members take on priority tasks, mentor newcomers, and assist with activity logistics.',
      unlocks: [
        'Priority enrollment for high-demand community initiatives',
        'Senior Member service certificate',
        'Eligibility to co-lead activity check-in stations',
        'Mentorship recognition on volunteer record',
      ],
    },
    {
      id: 'team_lead',
      name: 'Team Lead',
      hours: '75 hrs',
      activities: '12 activities',
      rating: '4.5 stars',
      course: 'Team Leadership & Coordination',
      roleColor: '#DC2626',
      badge: 'Team Lead',
      summary:
        'An operational leadership waypoint. Team Leads create activities, supervise field rosters, verify participant attendance, and recommend outstanding volunteers.',
      unlocks: [
        'Creation and scheduling of field activities and workshops',
        'Direct check-in roster management and session code issuance',
        'Single and bulk service hours approval authority',
        'Authority to submit promotion recommendations',
      ],
    },
    {
      id: 'manager',
      name: 'Manager',
      hours: '150 hrs',
      activities: '25 activities',
      rating: '4.8 stars',
      course: 'Operations & Community Strategy',
      roleColor: '#0D9488',
      badge: 'Manager',
      summary:
        'The summit waypoint for program directors. Managers oversee all applications, approve promotions, direct regional activities, and analyze impact reports.',
      unlocks: [
        'Full review and decision authority on new applicant queues',
        'Final approval authority on Team Lead promotion recommendations',
        'Regional activity oversight across all program cities',
        'Comprehensive operational reporting and export capabilities',
      ],
    },
  ];

  const JOIN_STEPS = [
    {
      num: '01',
      title: 'Create your account',
      detail:
        'Provide your basic contact details and area. Your account is created in 60 seconds with no complex requirements.',
    },
    {
      num: '02',
      title: 'Submit your volunteer application',
      detail:
        'Share your skills, availability, and residential area. A program manager will review your submission promptly.',
    },
    {
      num: '03',
      title: 'Receive your verified pass',
      detail:
        'Upon acceptance, complete your one-time registration pass. You immediately become an active Member with your QR pass.',
    },
    {
      num: '04',
      title: 'Join activities and log hours',
      detail:
        'Browse open community activities in your city, check in with the 4-digit code, and watch your hours count toward higher ranks.',
    },
  ];

  const FEATURED_ACTIVITY = {
    title: 'Meskel Square Community Clean-up & Waste Sort',
    city: 'Addis Ababa',
    date: 'Today · 8:00 AM – 12:00 PM',
    spots: '18 of 25 spots filled',
    hours: '4.0 verified hours',
    description:
      'Quarterly beautification and waste segregation initiative around Meskel Square and the Exhibition Center.',
  };

  const STRIP_ACTIVITIES = [
    {
      title: 'Bole High School Digital Literacy Mentoring',
      tag: 'Youth & Education',
      city: 'Addis Ababa',
      date: 'Today · 1:30 PM – 5:00 PM',
      spots: '12 of 15 spots filled',
      variant: 'applicant' as const,
      widthClass: 'min-w-[280px] max-w-[320px]',
    },
    {
      title: 'Entoto Park Mountain Trail Tree Planting',
      tag: 'Environment',
      city: 'Addis Ababa',
      date: 'Next Saturday · 8:00 AM – 1:00 PM',
      spots: '24 of 30 spots filled',
      variant: 'teamlead' as const,
      widthClass: 'min-w-[320px] max-w-[360px]',
    },
    {
      title: 'Bishoftu Clean Water Facility Support',
      tag: 'Public Health',
      city: 'Bishoftu',
      date: 'Next Sunday · 9:00 AM – 3:00 PM',
      spots: '8 of 20 spots filled',
      variant: 'manager' as const,
      widthClass: 'min-w-[290px] max-w-[330px]',
    },
    {
      title: 'Adama Youth Center Library Organization',
      tag: 'Community Education',
      city: 'Adama',
      date: 'In 2 weeks · 9:00 AM – 1:00 PM',
      spots: '15 of 20 spots filled',
      variant: 'volunteer' as const,
      widthClass: 'min-w-[300px] max-w-[340px]',
    },
  ];

  const currentRank = RANKS[activeRankIndex];

  return (
    <PageShell page="public/home" signature="TopoBackdrop, TrailMeter, TicketCard">
      <div className="space-y-0 text-ink-primary">
        {/* 1. HERO: Saffron Field with High-Contrast Editorial Typography */}
        <section className="relative overflow-hidden bg-role-applicant text-ink-primary border-b border-[#EDEFF2] pt-12 md:pt-20 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
          <TopoBackdrop color="#111111" opacity={0.06} />
          <div className="relative z-10 max-w-7xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/70 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-ink-primary" />
              <span>Volunteer Tracking System</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.02] max-w-4xl text-ink-primary">
              Your time counts. <br />
              <span className="inline-block bg-ink-primary text-white px-3 py-0.5 rounded-[8px] mt-1">
                Now it shows.
              </span>
            </h1>

            <p className="font-sans text-lg sm:text-xl text-ink-primary font-medium max-w-2xl leading-relaxed">
              Volunteering is a journey up a trail. Check in at field projects, earn verified hours, and advance from Member to Manager.
            </p>

            {/* Action Row: Maximum ONE primary black button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
              >
                Start your trail
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/check-certificate')}
                leftIcon={<ShieldCheck className="w-5 h-5 text-role-volunteer" weight="bold" />}
              >
                Verify a certificate
              </Button>
            </div>

            {/* Trail Line */}
            <div className="pt-6">
              <TrailLine
                currentWaypointIndex={1}
                strokeColor="#111111"
                showLabels={false}
                className="opacity-90 py-2"
              />
            </div>
          </div>
        </section>

        {/* 2. THE TRAIL RANKS: Interactive Waypoint with Single Rich Detail Panel (NO 4-box row) */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EDEFF2] pb-6">
            <div className="space-y-1">
              <span className="text-sm font-bold text-ink-secondary">
                Four stages of advancement
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary">
                Ranks and verified milestones
              </h2>
            </div>
            <p className="text-sm sm:text-base text-ink-secondary max-w-md leading-relaxed">
              Select a rank along the trail to see what it requires and the verified capabilities it unlocks.
            </p>
          </div>

          {/* Interactive Waypoint Trail Line */}
          <Raised padding="md">
            <TrailLine
              waypoints={RANKS.map((r, i) => ({
                id: r.id,
                label: r.name,
                threshold: r.hours,
                isCompleted: i <= activeRankIndex,
                isCurrent: i === activeRankIndex,
              }))}
              currentWaypointIndex={activeRankIndex}
              strokeColor={currentRank.roleColor}
              onSelectWaypoint={(idx) => setActiveRankIndex(idx)}
            />

            {/* Interactive Rank Selector Buttons for Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#EDEFF2] mt-4">
              {RANKS.map((r, idx) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActiveRankIndex(idx)}
                  className={`py-2 px-3 text-left rounded-[8px] border-none transition-all text-sm cursor-pointer ${
                    activeRankIndex === idx
                      ? 'bg-[#F1F3F6] font-bold text-ink-primary'
                      : 'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: r.roleColor }}
                    />
                    <span>{r.name}</span>
                  </div>
                  <div className="text-[13px] font-normal text-ink-secondary mt-0.5">
                    {r.hours}
                  </div>
                </button>
              ))}
            </div>
          </Raised>

          {/* Single Comprehensive Detail Card for Active Rank */}
          <Raised padding="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Rank Identity & Thresholds */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-[4px] text-[13px] font-bold text-white"
                    style={{ backgroundColor: currentRank.roleColor }}
                  >
                    {currentRank.badge}
                  </span>
                  <span className="text-sm font-semibold text-ink-secondary">
                    Stage {activeRankIndex + 1} of 4
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
                  {currentRank.name}
                </h3>

                <p className="text-base text-ink-secondary leading-relaxed">
                  {currentRank.summary}
                </p>

                <div className="pt-2 border-t border-[#EDEFF2] space-y-2.5 text-sm">
                  <div className="flex justify-between py-1 border-b border-[#EDEFF2]">
                    <span className="text-ink-secondary">Service hours</span>
                    <span className="font-bold text-ink-primary">{currentRank.hours}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EDEFF2]">
                    <span className="text-ink-secondary">Completed activities</span>
                    <span className="font-bold text-ink-primary">{currentRank.activities}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EDEFF2]">
                    <span className="text-ink-secondary">Participant rating</span>
                    <span className="font-bold text-ink-primary">{currentRank.rating}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-secondary">Training requirement</span>
                    <span className="font-semibold text-ink-primary text-right max-w-[200px]">
                      {currentRank.course}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Verified Unlocked Capabilities */}
              <Panel padding="md" className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-ink-primary font-bold text-base">
                  <Sparkle className="w-5 h-5 text-role-applicant" weight="fill" />
                  <span>Verified capabilities unlocked at this rank</span>
                </div>

                <div className="space-y-3">
                  {currentRank.unlocks.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-[8px] border-none">
                      <CheckCircle className="w-5 h-5 text-role-volunteer shrink-0 mt-0.5" weight="fill" />
                      <div>
                        <p className="text-sm font-semibold text-ink-primary">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-sm font-bold text-ink-primary hover:underline inline-flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
                  >
                    <span>Apply to begin with Member status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Panel>
            </div>
          </Raised>
        </section>

        {/* 3. HOW TO JOIN: Vertical Numbered Timeline (NO boxes) */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#EDEFF2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3 sticky top-24">
              <span className="text-sm font-bold text-ink-secondary">
                Simple onboarding
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary">
                How to join the volunteer platform
              </h2>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
                Every step is clear and straightforward. No physical bureaucracy, no duplicate paperwork.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
                >
                  Start registration
                </Button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8 pl-0 lg:pl-6">
              {JOIN_STEPS.map((step) => (
                <div
                  key={step.num}
                  className="flex items-start gap-6 pb-8 border-b border-[#EDEFF2] last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-role-applicant" />
                    <span className="font-display text-4xl sm:text-5xl font-bold text-ink-primary leading-none">
                      {step.num}
                    </span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. UPCOMING ACTIVITIES: One Featured Ticket + Horizontal Scrolling Strip */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#EDEFF2] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EDEFF2] pb-6">
            <div className="space-y-1">
              <span className="text-sm font-bold text-ink-secondary">
                Community fieldwork
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary">
                Upcoming field activities
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-sm font-bold text-ink-primary hover:underline inline-flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
            >
              <span>Browse all activities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Featured Ticket + Horizontal Strip Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* One Large Featured Ticket Pass */}
            <div className="lg:col-span-5 flex flex-col">
              <TicketPass
                variant="volunteer"
                title={FEATURED_ACTIVITY.title}
                subtitle="Featured activity"
                badge={FEATURED_ACTIVITY.city}
                stubCode="ACT-FEATURED"
                className="h-full flex flex-col justify-between"
                onClick={() => navigate('/register')}
              >
                <div className="space-y-3">
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {FEATURED_ACTIVITY.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[#EDEFF2]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
                      <Calendar className="w-4 h-4 text-role-teamlead" weight="bold" />
                      <span>{FEATURED_ACTIVITY.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-secondary">
                      <Users className="w-4 h-4 text-role-volunteer" weight="bold" />
                      <span>{FEATURED_ACTIVITY.spots}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-secondary">
                      <Clock className="w-4 h-4 text-ink-primary" weight="bold" />
                      <span>{FEATURED_ACTIVITY.hours}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-sm font-bold text-ink-primary hover:underline inline-flex items-center gap-1">
                      Sign up for this activity <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </TicketPass>
            </div>

            {/* Horizontal Scrolling Strip of Tickets with Varied Widths */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="text-sm font-semibold text-ink-secondary mb-2 flex items-center justify-between">
                <span>More upcoming opportunities</span>
                <span className="text-[13px] text-ink-secondary">Scroll right →</span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar">
                {STRIP_ACTIVITIES.map((act) => (
                  <div key={act.title} className={`${act.widthClass} shrink-0`}>
                    <TicketPass
                      variant={act.variant}
                      title={act.title}
                      subtitle={act.tag}
                      badge={act.city}
                      stubCode="ACT-2026"
                      onClick={() => navigate('/register')}
                    >
                      <div className="space-y-2 pt-1 text-[13px]">
                        <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
                          <Calendar className="w-4 h-4 text-role-teamlead shrink-0" weight="bold" />
                          <span className="truncate">{act.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-ink-secondary">
                          <Users className="w-4 h-4 text-role-volunteer shrink-0" weight="bold" />
                          <span>{act.spots}</span>
                        </div>
                      </div>
                    </TicketPass>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. CLOSING CALL TO ACTION: Light Surface with High-Contrast Primary & Secondary Buttons */}
        <section className="bg-white border-t border-[#EDEFF2] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F1F3F6] rounded-full text-[13px] font-semibold text-ink-secondary">
              <span>Verified community service</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ink-primary">
              Ready to hit the trail?
            </h2>

            <p className="text-base sm:text-lg text-ink-secondary max-w-xl mx-auto leading-relaxed">
              Create your account in 60 seconds. Join your local volunteer team in Addis Ababa, Adama, Hawassa, or Bahir Dar.
            </p>

            {/* Action Buttons: High Contrast, Exactly One Black Button */}
            <div className="pt-3 flex flex-wrap justify-center items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
              >
                Join as volunteer
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/sign-in')}
              >
                Sign in to your account
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
};
