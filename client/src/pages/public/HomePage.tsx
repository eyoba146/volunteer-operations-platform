import React, { useState } from 'react';
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
  MagnifyingGlass,
  Sparkle,
} from '@phosphor-icons/react';
import { Button, TrailLine, TicketPass } from '../../components/ui';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const RANKS_TRAIL = [
    {
      altitude: 'Basecamp • 0 hrs',
      title: 'Member',
      badge: 'Level 1',
      dotColor: 'bg-emerald-500',
      desc: 'Pay once via Telebirr. Unlock your volunteer ID pass, join upcoming activities, and record attendance with check-in codes.',
      unlocks: ['Volunteer ID Pass', 'Activity Roster Access', 'Duty Insurance'],
    },
    {
      altitude: 'Elevation 60m • 60 hrs',
      title: 'Senior Member',
      badge: 'Level 2',
      dotColor: 'bg-teal-500',
      desc: 'Complete 8 activities with a 4.0+ rating and take the safety workshop. Unlocks specialized tasks and peer mentorship.',
      unlocks: ['Field Leadership Prep', 'Senior Volunteer Pin', 'Specialized Projects'],
    },
    {
      altitude: 'Elevation 150m • 150 hrs',
      title: 'Team Lead',
      badge: 'Level 3',
      dotColor: 'bg-rose-500',
      desc: 'Lead field crews. Organize activities, generate 4-digit check-in pins, verify attendance hours, and rate volunteer work.',
      unlocks: ['Create & Run Activities', 'Approve Volunteer Hours', 'Recommend Promotions'],
    },
    {
      altitude: 'Summit 300m • 300 hrs',
      title: 'Manager',
      badge: 'Summit',
      dotColor: 'bg-slate-900',
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
      title: 'Pick Your Skills',
      detail: 'Choose your interests—from environmental planting to logistics, first aid, or youth tutoring.',
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
      tag: 'Reforestation',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. CALM HERO SECTION */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-6">
        <div className="max-w-[1120px] mx-auto space-y-8 text-center sm:text-left">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-brand" />
              <span>A cleaner way to volunteer</span>
            </span>

            <h1 className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
              Your time counts.<br />
              <span className="text-brand">Now it shows.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl">
              Join local activities across Ethiopia, check in with a 4-digit code, and climb the volunteer trail from Basecamp to Summit.
            </p>
          </div>

          {/* Pill Search & Activity Finder Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative w-full max-w-md bg-white rounded-full shadow-soft border border-slate-200/90 p-1.5 flex items-center">
              <MagnifyingGlass className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find an activity or city..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/sign-in')}
                className="shrink-0"
              >
                Search
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
                className="w-full sm:w-auto"
              >
                Join as Volunteer
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/check-certificate')}
                className="w-full sm:w-auto"
              >
                Verify Pass
              </Button>
            </div>
          </div>

          {/* Animated Trail Drawing through Hero */}
          <div className="pt-6">
            <TrailLine
              waypoints={[
                { id: '1', label: 'Register', altitude: 'Step 1', isCompleted: true },
                { id: '2', label: 'Member', altitude: '0 hrs', isCompleted: true },
                { id: '3', label: 'Senior', altitude: '60 hrs', isCurrent: true },
                { id: '4', label: 'Team Lead', altitude: '150 hrs' },
                { id: '5', label: 'Manager', altitude: '300 hrs' },
              ]}
              currentWaypointIndex={2}
            />
          </div>
        </div>
      </section>

      {/* 2. THE FOUR RANKS AS TRAIL WAYPOINTS */}
      <section className="px-4 sm:px-6">
        <div className="max-w-[1120px] mx-auto space-y-12">
          <div className="max-w-xl space-y-2">
            <span className="font-sans text-xs font-semibold text-brand block">
              Ascending Ranks
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              The four stages of service.
            </h2>
            <p className="font-sans text-sm text-slate-500 leading-relaxed">
              Every hour is recorded by your Team Lead and pushes your path closer to the next milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RANKS_TRAIL.map((rank, i) => (
              <div
                key={rank.title}
                className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-8 space-y-5 hover:shadow-soft-hover transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${rank.dotColor}`} />
                    <span className="font-sans text-xs font-semibold text-slate-500">
                      {rank.altitude}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {rank.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                    {rank.title}
                  </h3>
                  <p className="font-sans text-sm text-slate-500 leading-relaxed">
                    {rank.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">
                    What this rank unlocks:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {rank.unlocks.map((u) => (
                      <span
                        key={u}
                        className="text-xs px-3 py-1 rounded-full bg-slate-50 text-slate-600 font-medium"
                      >
                        ✓ {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FOUR STEPS TO JOIN (FLAT TINTED TILES) */}
      <section className="px-4 sm:px-6">
        <div className="max-w-[1120px] mx-auto space-y-12">
          <div className="max-w-xl space-y-2">
            <span className="font-sans text-xs font-semibold text-brand block">
              Getting Started
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Join in four plain steps.
            </h2>
            <p className="font-sans text-sm text-slate-500 leading-relaxed">
              No long orientation or endless forms. Sign up, verify your email, pay once, and start helping.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {JOIN_STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-slate-50 rounded-[20px] p-6 space-y-4 hover:bg-slate-100/70 transition-colors"
              >
                <span className="font-display text-3xl font-extrabold text-brand block">
                  {step.num}
                </span>
                <div className="space-y-1.5">
                  <h4 className="font-sans text-base font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UPCOMING ACTIVITIES AS TICKET PASSES */}
      <section className="px-4 sm:px-6">
        <div className="max-w-[1120px] mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-xl space-y-2">
              <span className="font-sans text-xs font-semibold text-brand block">
                Upcoming Duties
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Community assignments near you.
              </h2>
              <p className="font-sans text-sm text-slate-500">
                Join field work organized and supervised by verified Team Leads.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/sign-in')}
              rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
            >
              Browse All Activities
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {UPCOMING_ACTIVITIES.map((act) => (
              <TicketPass
                key={act.title}
                title={act.title}
                subtitle={act.tag}
                meta={`${act.city} • ${act.date}`}
                badge={act.spots}
                stubCode="AA-2026"
                onClick={() => navigate('/sign-in')}
              >
                <div className="space-y-2 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{act.city} Central Hub</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>4.0 verified hours awarded</span>
                  </div>
                </div>
              </TicketPass>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLOSING CALL TO ACTION BAND */}
      <section className="px-4 sm:px-6 pb-12">
        <div className="max-w-[1120px] mx-auto bg-slate-900 rounded-[28px] p-8 sm:p-14 text-white text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-8 shadow-soft">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to climb the trail?
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
              Create your account in 2 minutes. Pay your one-time ETB 200 fee, get your volunteer pass, and start serving.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
              className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 shadow-pill"
            >
              Join as Volunteer
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/sign-in')}
              className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 shadow-none"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
