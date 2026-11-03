import React, { useState } from 'react';
import { ShieldCheck, Star, Sparkle, Trophy } from '@phosphor-icons/react';

export type ApplicantStage = 'applied' | 'reviewed' | 'accepted' | 'paid' | 'volunteer' | 'member';

export interface TrailMeterProps {
  currentHours?: number;
  currentRank?: 'volunteer' | 'senior_volunteer' | 'team_lead' | 'manager' | 'member' | 'senior_member';
  avatarUrl?: string;
  userName?: string;
  variant?: 'full' | 'compact' | 'summit';
  className?: string;
  mode?: 'rank' | 'applicant';
  applicantStage?: ApplicantStage;
}

interface Station {
  id: string;
  title: string;
  hours: number;
  perks: string;
}

const RANK_STATIONS: Station[] = [
  { id: 'volunteer', title: 'Volunteer', hours: 0, perks: 'Access to community volunteer activities & digital ID pass' },
  { id: 'senior_volunteer', title: 'Senior Volunteer', hours: 40, perks: 'Eligible for complex projects & specialized field tasks' },
  { id: 'team_lead', title: 'Team Lead', hours: 100, perks: 'Lead squads, verify roster attendance & approve service hours' },
  { id: 'manager', title: 'Manager', hours: 250, perks: 'Full operations desk, review applications & manage territory' },
];

const APPLICANT_STATIONS: Station[] = [
  { id: 'applied', title: 'Applied', hours: 0, perks: 'Application form and background submitted' },
  { id: 'reviewed', title: 'Reviewed', hours: 1, perks: 'Admissions team evaluates regional volunteer intake' },
  { id: 'accepted', title: 'Accepted', hours: 2, perks: 'Offer letter issued; Telebirr activation unlocked' },
  { id: 'paid', title: 'Paid', hours: 3, perks: 'ETB 200 fee verified and receipt confirmed' },
  { id: 'volunteer', title: 'Volunteer', hours: 4, perks: 'Volunteer ID pass active; open activities accessible' },
];

export const TrailMeter: React.FC<TrailMeterProps> = ({
  currentHours = 0,
  currentRank = 'member',
  avatarUrl,
  userName = 'Volunteer',
  variant = 'full',
  className = '',
  mode = 'rank',
  applicantStage = 'applied',
}) => {
  const [activeTooltip, setActiveTooltip] = useState<Station | null>(null);

  const isApplicant = mode === 'applicant';
  const stations = isApplicant ? APPLICANT_STATIONS : RANK_STATIONS;

  // Applicant progress calculation
  const applicantIndex = APPLICANT_STATIONS.findIndex((s) => s.id === applicantStage);
  const applicantPct = applicantIndex >= 0 ? (applicantIndex / (APPLICANT_STATIONS.length - 1)) * 100 : 0;

  // Maximum scale is 250 hrs for rank
  const maxHours = 250;
  const clampedHours = Math.min(Math.max(currentHours, 0), maxHours);

  // Station positions on a 0..100 percentage scale
  // Volunteer: 0%, Senior Volunteer: 30%, Team Lead: 65%, Manager: 100%
  const getStationPercent = (h: number) => {
    if (isApplicant) {
      return (h / (APPLICANT_STATIONS.length - 1)) * 100;
    }
    if (h <= 0) return 0;
    if (h <= 40) return (h / 40) * 30;
    if (h <= 100) return 30 + ((h - 40) / 60) * 35;
    return 65 + ((h - 100) / 150) * 35;
  };

  const progressPercent = isApplicant ? applicantPct : getStationPercent(clampedHours);

  // Determine next milestone
  let nextStation: Station | null = null;
  let hoursNeeded = 0;
  let calloutText = '';

  if (isApplicant) {
    const nextIdx = Math.min(applicantIndex + 1, APPLICANT_STATIONS.length - 1);
    nextStation = APPLICANT_STATIONS[nextIdx];
    if (applicantStage === 'applied') calloutText = 'Application in admissions review';
    else if (applicantStage === 'reviewed') calloutText = 'Reviewed • Decision pending';
    else if (applicantStage === 'accepted') calloutText = 'Accepted • Ready for Telebirr';
    else if (applicantStage === 'paid') calloutText = 'Payment verified • Pass ready';
    else calloutText = 'Active volunteer on the trail';
  } else {
    if (clampedHours < 40) {
      nextStation = RANK_STATIONS[1];
      hoursNeeded = Math.round((40 - clampedHours) * 10) / 10;
    } else if (clampedHours < 100) {
      nextStation = RANK_STATIONS[2];
      hoursNeeded = Math.round((100 - clampedHours) * 10) / 10;
    } else if (clampedHours < 250) {
      nextStation = RANK_STATIONS[3];
      hoursNeeded = Math.round((250 - clampedHours) * 10) / 10;
    }
    calloutText = nextStation
      ? `${hoursNeeded} hrs to ${nextStation.title}`
      : 'Trail summit reached';
  }

  // Compact single-line variant (used in sidebar footer or small panels)
  if (variant === 'compact') {
    return (
      <div className={`space-y-2 select-none ${className} `}>
        <div className="flex items-center justify-between text-[13px] font-sans">
          <span className="font-semibold text-ink-primary truncate">
            {calloutText}
          </span>
          <span className="font-mono text-ink-secondary shrink-0">
            {isApplicant ? `${applicantIndex + 1} / 5` : `${clampedHours}h / 250h`}
          </span>
        </div>

        {/* Slim Route Line */}
        <div className="relative h-2 w-full bg-[#E5E8EB] rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-role-volunteer rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[13px] font-mono text-ink-tertiary">
          {stations.map((s) => (
            <span key={s.id}>{s.title}</span>
          ))}
        </div>
      </div>
    );
  }

  // Summit celebration variant
  if (!isApplicant && (variant === 'summit' || currentRank === 'manager' || clampedHours >= 250)) {
    return (
      <div className={`p-6 rounded-[16px] bg-[#F7F8FA] flex flex-col sm:flex-row items-center gap-6 ${className} `}>
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-role-volunteer flex items-center justify-center shrink-0">
          <Trophy className="w-8 h-8" weight="fill" />
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-sans text-[13px] font-bold px-2 py-0.5 bg-role-volunteer text-white rounded-[4px]">
              Summit achieved
            </span>
            <span className="font-mono text-[13px] text-ink-secondary font-semibold">
              {clampedHours} verified hours
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-ink-primary">
            Highest operational rank unlocked
          </h3>
          <p className="font-sans text-[13px] text-ink-secondary leading-relaxed">
            All 4 rank thresholds completed along the service trail. Eligible for program territory management and governance.
          </p>
        </div>
      </div>
    );
  }

  // Full Hero Variant
  return (
    <div className={`relative pt-12 pb-6 px-2 select-none ${className} `}>
      {/* Route SVG Canvas */}
      <div className="relative w-full h-12 flex items-center">
        {/* Background track (dashed upcoming drawn as SVG) */}
        <svg className="absolute left-0 right-0 w-full h-1 pointer-events-none">
          <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="#CBD2DA" strokeDasharray="4 4" strokeWidth="1" />
        </svg>

        {/* Completed solid path */}
        <div
          className="absolute left-0 h-1 bg-role-volunteer transition-all duration-500 rounded-l-full"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Stations */}
        {stations.map((station, idx) => {
          const stPct = isApplicant ? (idx / (stations.length - 1)) * 100 : getStationPercent(station.hours);
          const isReached = isApplicant ? idx <= applicantIndex : clampedHours >= station.hours;
          const isNext = isApplicant ? idx === applicantIndex + 1 : nextStation?.id === station.id;

          return (
            <div
              key={station.id}
              className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer group"
              style={{ left: `${stPct}%` }}
              onMouseEnter={() => setActiveTooltip(station)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip(station === activeTooltip ? null : station)}
            >
              {/* Station Node Marker */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isReached
                    ? 'bg-role-volunteer text-white border-none'
                    : isNext
                    ? 'bg-emerald-100 text-role-volunteer border-none'
                    : 'bg-[#E5E8EB] text-ink-tertiary border-none'
                } `}
              >
                {!isApplicant && (station.id === 'volunteer' || station.id === 'member') && <span className="w-2 h-2 rounded-full bg-current" />}
                {!isApplicant && (station.id === 'senior_volunteer' || station.id === 'senior_member') && <Star className="w-3 h-3" weight="fill" />}
                {!isApplicant && station.id === 'team_lead' && <ShieldCheck className="w-3.5 h-3.5" weight="fill" />}
                {!isApplicant && station.id === 'manager' && <Sparkle className="w-3.5 h-3.5" weight="fill" />}
                {isApplicant && <span className="w-2 h-2 rounded-full bg-current" />}
              </div>

              {/* Station Label */}
              <div className="mt-2 text-center whitespace-nowrap">
                <span
                  className={`block text-[13px] font-sans font-semibold ${
                    isReached ? 'text-ink-primary' : 'text-ink-tertiary'
                  } `}
                >
                  {station.title}
                </span>
                <span className="block font-mono text-[13px] text-ink-tertiary">
                  {isApplicant ? `Step ${idx + 1}` : `${station.hours}h`}
                </span>
              </div>
            </div>
          );
        })}

        {/* Progress Pin & Callout Pill */}
        <div
          className="absolute -translate-x-1/2 -top-10 flex flex-col items-center pointer-events-none transition-all duration-500 z-10"
          style={{ left: `${progressPercent}%` }}
        >
          {/* Callout Pill */}
          <div className="bg-ink-primary text-white px-2.5 py-1 rounded-[6px] text-[13px] font-sans font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.15)] whitespace-nowrap flex items-center gap-1.5">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-role-volunteer" />
            )}
            <span>{calloutText}</span>
          </div>

          {/* Pointer Triangle drawn as SVG */}
          <svg className="w-2 h-1 fill-ink-primary -mt-0.5" viewBox="0 0 8 4">
            <polygon points="0,0 8,0 4,4" />
          </svg>
        </div>
      </div>

      {/* Popover Tooltip for Stations */}
      {activeTooltip && (
        <div className="mt-8 p-3 rounded-[12px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.15)] max-w-sm mx-auto text-center space-y-1 animate-in fade-in duration-150">
          <div className="flex items-center justify-center gap-2">
            <span className="font-display font-bold text-ink-primary text-[14px]">
              {activeTooltip.title}
            </span>
            <span className="font-mono text-[13px] text-role-volunteer font-semibold">
              {isApplicant ? `Waypoint ${activeTooltip.hours + 1}` : `${activeTooltip.hours} service hours`}
            </span>
          </div>
          <p className="font-sans text-[13px] text-ink-secondary leading-normal">
            {activeTooltip.perks}
          </p>
        </div>
      )}
    </div>
  );
};
