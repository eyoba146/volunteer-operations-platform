import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  MapPin,
  Sparkle,
} from '@phosphor-icons/react';
import { Button, TrailLine, TicketPass } from '../../components/ui';

interface RankDetail {
  id: string;
  name: string;
  hours: string;
  activities: string;
  rating: string;
  course: string;
  roleColor: string;
  badge: string;
  summary: string;
  unlocks: string[];
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeRankIndex, setActiveRankIndex] = useState(0);

  const RANKS: RankDetail[] = [
    {
      id: 'member',
      name: 'Member',
      hours: '0 hrs',
      activities: '0 activities',
      rating: 'None required',
      course: 'None required',
      roleColor: '#1E824C',
      badge: 'Starting rank',
      summary:
        'Activated immediately upon one-time Telebirr payment. You receive your volunteer ID pass and can sign up for community field projects.',
      unlocks: [
        'Digital volunteer ID pass with QR code',
        'Enroll in open field activities',
        'Log service hours with check-in codes',
        'Access personal attendance record',
      ],
    },
    {
      id: 'senior_member',
      name: 'Senior Member',
      hours: '50 hrs',
      activities: '5 activities',
      rating: '4.0 minimum rating',
      course: 'Safety and community ethics orientation',
      roleColor: '#D97706',
      badge: 'Experienced volunteer',
      summary:
        'Experienced volunteers who demonstrate commitment on the ground. Unlocks group facilitation and activity proposal submissions.',
      unlocks: [
        'Lead small volunteer activity groups',
        'Propose new activities for manager review',
        'Download verified digital service certificate',
        'Mentor incoming volunteer members',
      ],
    },
    {
      id: 'team_lead',
      name: 'Team Lead',
      hours: '150 hrs',
      activities: '15 activities',
      rating: '4.5 minimum rating',
      course: 'Field leadership workshop',
      roleColor: '#D63927',
      badge: 'Field coordinator',
      summary:
        'Field coordinators who organize activities on site, supervise rosters, verify attendance, and endorse volunteers for advancement.',
      unlocks: [
        'Create and publish field activities',
        'Generate attendance check-in codes',
        'Approve or decline logged volunteer hours',
        'Recommend active volunteers for promotion',
      ],
    },
    {
      id: 'manager',
      name: 'Manager',
      hours: '300 hrs',
      activities: '30 activities',
      rating: '4.8 minimum rating',
      course: 'Advanced project management and team lead endorsement',
      roleColor: '#0E6266',
      badge: 'Program leadership',
      summary:
        'Operations leaders who evaluate candidate applications, decide promotions, organize regional programs, and review operational reports.',
      unlocks: [
        'Review incoming applicant queue and make admission decisions',
        'Approve promotion requests to Senior Member, Lead, and Manager',
        'Oversee city-wide schedules and volunteer rosters',
        'Export activity and financial reports',
      ],
    },
  ];

  const JOIN_STEPS = [
    {
      num: '01',
      title: 'Create your account',
      detail:
        'Register in one minute with your name, phone number, and email. Confirm with a quick 6-digit verification code.',
    },
    {
      num: '02',
      title: 'Complete your application',
      detail:
        'Tell us about your background, skills, and areas of interest—from environmental care to health aid, logistics, or youth tutoring.',
    },
    {
      num: '03',
      title: 'Pay once via Telebirr',
      detail:
        'A one-time registration fee of ETB 200 covers your digital volunteer ID pass with instant confirmation.',
    },
    {
      num: '04',
      title: 'Join activities and log hours',
      detail:
        'Check in at local activities with your code or QR, have your hours verified by team leads, and advance through the ranks.',
    },
  ];

  const FEATURED_ACTIVITY = {
    title: 'Meskel Square community clean-up',
    city: 'Addis Ababa',
    date: 'Saturday, Nov 14 • 8:00 AM',
    spots: '24 spots remaining',
    tag: 'Environment',
    description:
      'Join our city environmental team for a morning waste sorting and square maintenance project. Equipment and gloves provided on site.',
    hours: '4 hours credit',
  };

  const STRIP_ACTIVITIES = [
    {
      title: 'Hawassa lake shore cleanup',
      city: 'Hawassa',
      date: 'Saturday, Nov 21 • 7:30 AM',
      spots: '18 spots left',
      tag: 'Water sanitation',
      variant: 'volunteer' as const,
      widthClass: 'min-w-[280px] max-w-[320px]',
    },
    {
      title: 'Entoto forest trail maintenance',
      city: 'Addis Ababa',
      date: 'Sunday, Nov 22 • 9:00 AM',
      spots: '12 spots left',
      tag: 'Trail care',
      variant: 'teamlead' as const,
      widthClass: 'min-w-[320px] max-w-[360px]',
    },
    {
      title: 'Adama youth center book sorting',
      city: 'Adama',
      date: 'Saturday, Nov 28 • 10:00 AM',
      spots: '30 spots left',
      tag: 'Education',
      variant: 'applicant' as const,
      widthClass: 'min-w-[290px] max-w-[330px]',
    },
    {
      title: 'Bahir Dar community tree planting',
      city: 'Bahir Dar',
      date: 'Saturday, Dec 05 • 8:30 AM',
      spots: '40 spots left',
      tag: 'Reforestation',
      variant: 'manager' as const,
      widthClass: 'min-w-[300px] max-w-[340px]',
    },
  ];

  const currentRank = RANKS[activeRankIndex];

  return (
    <div className="space-y-0 text-ink-primary">
      {/* 1. HERO: Saffron Field with High-Contrast Editorial Typography */}
      <section className="bg-role-applicant text-ink-primary border-b border-[#D5DAE1] pt-12 md:pt-20 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/40 border border-ink-primary/20 rounded-[6px] text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-ink-primary" />
            <span>Volunteer Tracking System</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.02] max-w-4xl text-ink-primary">
            Your time counts. <br />
            <span className="inline-block bg-ink-primary text-white px-3 py-0.5 rounded-[6px] mt-1">
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-6">
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
        <div className="bg-white border border-[#D5DAE1] rounded-[10px] p-6">
          <TrailLine
            waypoints={RANKS.map((r, i) => ({
              id: r.id,
              label: r.name,
              altitude: r.hours,
              isCompleted: i <= activeRankIndex,
              isCurrent: i === activeRankIndex,
            }))}
            currentWaypointIndex={activeRankIndex}
            strokeColor={currentRank.roleColor}
            onSelectWaypoint={(idx) => setActiveRankIndex(idx)}
          />

          {/* Interactive Rank Selector Buttons for Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#D5DAE1] mt-4">
            {RANKS.map((r, idx) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRankIndex(idx)}
                className={`py-2 px-3 text-left rounded-[8px] border transition-all text-sm ${
                  activeRankIndex === idx
                    ? 'border-ink-primary bg-canvas-subdued font-bold text-ink-primary shadow-sm'
                    : 'border-transparent text-ink-secondary hover:text-ink-primary hover:bg-canvas-subdued/50'
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
        </div>

        {/* Single Comprehensive Detail Card for Active Rank */}
        <div className="bg-white border border-[#D5DAE1] rounded-[10px] p-6 sm:p-8">
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

              <div className="pt-2 border-t border-[#D5DAE1] space-y-2.5 text-sm">
                <div className="flex justify-between py-1 border-b border-[#D5DAE1]/60">
                  <span className="text-ink-secondary">Service hours</span>
                  <span className="font-bold text-ink-primary">{currentRank.hours}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D5DAE1]/60">
                  <span className="text-ink-secondary">Completed activities</span>
                  <span className="font-bold text-ink-primary">{currentRank.activities}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D5DAE1]/60">
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
            <div className="lg:col-span-7 bg-canvas-subdued rounded-[8px] p-6 border border-[#D5DAE1] space-y-4">
              <div className="flex items-center gap-2 text-ink-primary font-bold text-base">
                <Sparkle className="w-5 h-5 text-role-applicant" weight="fill" />
                <span>Verified capabilities unlocked at this rank</span>
              </div>

              <div className="space-y-3">
                {currentRank.unlocks.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-[6px] border border-[#D5DAE1]">
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
                  className="text-sm font-bold text-ink-primary hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Apply to begin with Member status</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW TO JOIN: Vertical Numbered Timeline (NO boxes) */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D5DAE1]">
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
            {JOIN_STEPS.map((step, idx) => (
              <div
                key={step.num}
                className="flex items-start gap-6 pb-8 border-b border-[#D5DAE1] last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-role-applicant" />
                  <span className="font-display text-4xl sm:text-5xl font-black text-ink-primary leading-none">
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
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D5DAE1] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-6">
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
            className="text-sm font-bold text-ink-primary hover:underline inline-flex items-center gap-1.5"
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

                <div className="space-y-1.5 pt-2 border-t border-[#D5DAE1]">
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
      <section className="bg-white border-t border-[#D5DAE1] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-canvas-subdued border border-[#D5DAE1] rounded-[6px] text-[13px] font-semibold text-ink-secondary">
            <span>Verified community service</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ink-primary">
            Ready to hit the trail?
          </h2>

          <p className="text-base sm:text-lg text-ink-secondary max-w-xl mx-auto leading-relaxed">
            Create your account in 60 seconds. Join your local volunteer team in Addis Ababa, Adama, Hawassa, or Bahir Dar.
          </p>

          {/* Action Buttons: High Contrast, Exactly One Black Button, NO white-on-white text */}
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
  );
};
