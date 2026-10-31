import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Sparkle,
  TrendUp,
} from '@phosphor-icons/react';
import { Button, TrailLine, TicketPass, StatNumber } from '../../components/ui';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const RANKS_TRAIL = [
    {
      altitude: '0 hrs',
      title: 'Member',
      badge: 'Basecamp',
      color: 'bg-role-volunteer text-white',
      desc: 'Pay once via Telebirr. Unlock your volunteer ID pass, join upcoming activities, and record attendance with short check-in codes.',
      unlocks: ['Official Volunteer ID Pass', 'Activity Roster Access', 'Duty Insurance Coverage'],
    },
    {
      altitude: '60 hrs',
      title: 'Senior Member',
      badge: 'Elevation 60m',
      color: 'bg-amber-600 text-white',
      desc: 'Complete 8 activities with a 4.0+ rating and take the safety workshop. Unlocks specialized tasks and peer mentorship.',
      unlocks: ['Field Leadership Prep', 'Senior Volunteer Pin', 'Specialized Projects'],
    },
    {
      altitude: '150 hrs',
      title: 'Team Lead',
      badge: 'Elevation 150m',
      color: 'bg-role-teamlead text-white',
      desc: 'Lead field crews. Organize activities, generate 4-digit check-in pins, verify attendance hours, and rate volunteer work.',
      unlocks: ['Create & Run Activities', 'Approve Volunteer Hours', 'Recommend Promotions'],
    },
    {
      altitude: '300 hrs',
      title: 'Manager',
      badge: 'Summit 300m',
      color: 'bg-role-manager text-white',
      desc: 'Summit the trail. Review incoming applicants, decide promotion boards, schedule regional programs, and guide city coordinators.',
      unlocks: ['Approve Promotions', 'Applicant Review Board', 'Regional Program Planning'],
    },
  ];

  const JOIN_STEPS = [
    {
      num: '01',
      title: 'Sign Up Fast',
      detail: 'Register with your email and confirm your 6-digit verification code. No long paperwork.',
    },
    {
      num: '02',
      title: 'Tell Us Your Skills',
      detail: 'Pick your interests—from environmental planting to logistics, first aid, or youth tutoring.',
    },
    {
      num: '03',
      title: 'Pay Once via Telebirr',
      detail: 'A one-time ETB 200 fee covers your duty insurance and printable volunteer ID pass.',
    },
    {
      num: '04',
      title: 'Hit the Trail',
      detail: 'Show up at field activities, enter your check-in code, and watch your hours climb automatically.',
    },
  ];

  const UPCOMING_ACTIVITIES = [
    {
      title: 'Meskel Square Clean-up & Waste Audit',
      city: 'Addis Ababa',
      date: 'Sat, Oct 31 • 8:00 AM',
      spots: '25 spots left',
      variant: 'volunteer' as const,
      tag: 'Environment',
    },
    {
      title: 'Hawassa Lake Shore Plastic Clearance',
      city: 'Hawassa',
      date: 'Sat, Nov 07 • 7:30 AM',
      spots: '18 spots left',
      variant: 'applicant' as const,
      tag: 'Water Care',
    },
    {
      title: 'Entoto Ridge Mountain Trail Care',
      city: 'Addis Ababa',
      date: 'Sun, Nov 15 • 9:00 AM',
      spots: '12 spots left',
      variant: 'teamlead' as const,
      tag: 'Trail Restoration',
    },
    {
      title: 'Adama Youth Center Library Sorting',
      city: 'Adama',
      date: 'Sat, Nov 21 • 10:00 AM',
      spots: '30 spots left',
      variant: 'manager' as const,
      tag: 'Education',
    },
  ];

  return (
    <div className="space-y-0 selection:bg-black selection:text-white">
      {/* 1. HERO: Full-Bleed Saffron Field with Giant Cropped Condensed Headline */}
      <section className="relative bg-role-applicant text-ink-primary overflow-hidden border-b-4 border-ink-primary pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Top Tagline */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-ink-primary" />
            <span className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight">
              Volunteer Tracking System
            </span>
          </div>

          {/* Giant Condensed Headline Cropped/Bleeding Edge */}
          <div className="overflow-visible">
            <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter uppercase leading-[0.88] max-w-5xl">
              YOUR TIME COUNTS. <br />
              <span className="text-white drop-shadow-sm">NOW IT SHOWS.</span>
            </h1>
          </div>

          <p className="font-sans text-lg sm:text-2xl text-ink-primary font-medium max-w-2xl leading-snug pt-2">
            Volunteering is a journey up a trail. Check in at field projects, earn verified hours, and climb four ranks from Member to Manager.
          </p>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              size="xl"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
            >
              Start Your Trail
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => navigate('/check-certificate')}
              leftIcon={<ShieldCheck className="w-5 h-5 text-role-volunteer" weight="bold" />}
            >
              Verify Certificate
            </Button>
          </div>
        </div>

        {/* Trail Line Drawing Across Hero Base */}
        <div className="max-w-7xl mx-auto mt-8 relative z-10">
          <TrailLine
            currentWaypointIndex={1}
            strokeColor="#111315"
            showLabels={false}
            className="opacity-90"
          />
        </div>
      </section>

      {/* 2. THE ASCENDING TRAIL: 4 Ranks as Waypoints on a Mountain Route */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-ink-primary pb-6">
          <div>
            <span className="font-sans text-xs font-bold text-ink-tertiary uppercase tracking-wider block">
              Ascending Ranks
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none mt-1">
              The Four Altitude Stations
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-ink-secondary max-w-md">
            Rank is not a title; it is altitude earned through hours on the ground and verified by team leads.
          </p>
        </div>

        {/* Route Line Across All 4 Ranks */}
        <div className="hidden md:block">
          <TrailLine
            waypoints={[
              { id: '1', label: 'Member', altitude: '0 hrs • Basecamp' },
              { id: '2', label: 'Senior Member', altitude: '60 hrs • 8 Acts' },
              { id: '3', label: 'Team Lead', altitude: '150 hrs • 20 Acts' },
              { id: '4', label: 'Manager', altitude: '300 hrs • Summit' },
            ]}
            currentWaypointIndex={3}
            strokeColor="#1E824C"
          />
        </div>

        {/* 4 Ticket-Styled Rank Passes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {RANKS_TRAIL.map((rank, idx) => (
            <div
              key={rank.title}
              className="bg-white border-2 border-ink-primary shadow-ticket p-6 space-y-5 flex flex-col justify-between hover:-translate-y-1 transition-transform"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-black text-ink-primary">
                    0{idx + 1}
                  </span>
                  <span className={`font-mono text-xs px-2 py-0.5 font-bold ${rank.color}`}>
                    {rank.altitude}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-3xl font-black uppercase text-ink-primary leading-tight">
                    {rank.title}
                  </h3>
                  <span className="font-sans text-xs font-bold text-ink-tertiary">
                    {rank.badge}
                  </span>
                </div>

                <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                  {rank.desc}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-border space-y-2">
                <span className="font-sans text-[11px] font-bold text-ink-primary uppercase tracking-tight block">
                  What this unlocks:
                </span>
                <ul className="space-y-1">
                  {rank.unlocks.map((u) => (
                    <li key={u} className="font-sans text-xs text-ink-secondary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-ink-primary shrink-0" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PINNED HORIZONTAL TRACK: 4 Steps to Join */}
      <section className="bg-canvas-subdued border-y-2 border-ink-primary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-ink-tertiary uppercase tracking-wider block">
              How To Join
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
              Four Steps. Zero Friction.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {JOIN_STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white border-2 border-ink-primary p-6 space-y-4"
              >
                <span className="font-display text-6xl font-black text-role-applicant leading-none block">
                  {step.num}
                </span>
                <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STAGGERED RAIL: Upcoming Activities as Tickets */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-6">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-ink-tertiary uppercase tracking-wider block">
              Ready To Volunteer
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
              Upcoming Field Activities
            </h2>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/register')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Browse All Activities
          </Button>
        </div>

        {/* Staggered Grid of Ticket Passes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UPCOMING_ACTIVITIES.map((act) => (
            <TicketPass
              key={act.title}
              variant={act.variant}
              title={act.title}
              subtitle={act.tag}
              badge={act.city}
              stubCode="ACT-2026"
              onClick={() => navigate('/register')}
            >
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-ink-primary">
                  <Calendar className="w-4 h-4 text-role-teamlead" weight="bold" />
                  <span>{act.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-secondary">
                  <Users className="w-4 h-4 text-role-volunteer" weight="bold" />
                  <span>{act.spots}</span>
                </div>
              </div>
            </TicketPass>
          ))}
        </div>
      </section>

      {/* 5. BOLD CLOSING BAND: Black & Saffron High-Contrast Field */}
      <section className="bg-ink-primary text-white border-t-4 border-role-applicant py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="font-mono text-xs px-3 py-1 bg-role-applicant text-ink-primary font-bold uppercase tracking-wider inline-block">
            One Community • Verified Service
          </span>
          <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-none">
            Ready to hit the trail?
          </h2>
          <p className="font-sans text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create your account in 60 seconds. Join your local volunteer team in Addis Ababa, Adama, Hawassa, or Bahir Dar.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button
              variant="saffron"
              size="xl"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
            >
              Join as Volunteer
            </Button>
            <Button
              variant="secondary"
              size="xl"
              className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-ink-primary"
              onClick={() => navigate('/sign-in')}
            >
              Sign In to Your Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
