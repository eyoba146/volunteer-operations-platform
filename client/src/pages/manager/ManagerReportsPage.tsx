import React, { useState } from 'react';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  DownloadSimple, 
  Printer, 
  Star 
} from '@phosphor-icons/react';

export const ManagerReportsPage: React.FC = () => {
  const [selectedPeriod] = useState('2026-10');
  const toast = useToast();

  const handleExportCSV = () => {
    // Generate real CSV content
    const csvContent = [
      'VTS VOLUNTEER PLATFORM - EXECUTIVE MANAGEMENT REPORT',
      `Generated Date,${new Date().toISOString()}`,
      `Period,${selectedPeriod}`,
      '',
      'SECTION 1: VOLUNTEERS BY OPERATIONAL AREA',
      'Area,Registered Volunteers,Percentage,Active Status',
      'Addis Ababa,24,57%,Active',
      'Adama,7,17%,Active',
      'Bishoftu,5,12%,Active',
      'Hawassa,4,9%,Active',
      'Bahir Dar,2,5%,Active',
      '',
      'SECTION 2: CORPS DISTRIBUTION BY RANK',
      'Rank,Count,Rank Threshold,Status',
      'Member,28,0 hrs,Active Volunteer',
      'Senior Member,10,60 hrs,Elevated',
      'Team Lead,3,150 hrs,Field Officer',
      'Manager,1,300 hrs,Operations Desk',
      '',
      'SECTION 3: VERIFIED SERVICE HOURS BY PERIOD',
      'Month,Total Approved Hours,Active Shifts,Volunteers Deployed',
      'August 2026,180.5 hrs,12,18',
      'September 2026,340.0 hrs,22,31',
      'October 2026 (Active),512.5 hrs,34,42',
      '',
      'SECTION 4: ACTIVITY ATTENDANCE TURNOUT',
      'Activity Title,Area,Capacity,Attended,Turnout Rate',
      'Meskel Square Clean-up,Addis Ababa,20,19,95%',
      'Entoto Forest Ridge Cleanup,Addis Ababa,25,24,96%',
      'Bishoftu Lake Eco Trail Restoration,Bishoftu,15,14,93%',
      'Hawassa Youth Health Outreach,Hawassa,12,11,92%',
      'Adama Youth Mentorship Session,Adama,18,16,89%',
      '',
      'SECTION 5: TOP VOLUNTEERS',
      'Rank,Volunteer Name,Verified Hours,Activities Completed,Average Rating',
      '1,Yonas Kebede,192.5 hrs,24,4.9 / 5.0',
      '2,Selam Alemu,168.0 hrs,22,4.9 / 5.0',
      '3,Biruk Tadesse,82.0 hrs,11,4.8 / 5.0',
      '4,Almaz Fikre,74.5 hrs,9,4.7 / 5.0',
      '5,Dawit Bekele,36.5 hrs,5,4.8 / 5.0',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VTS_Operations_Report_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Executive report for ${selectedPeriod} downloaded in CSV format.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary leading-tight">
              Service operations reports
            </h1>
            <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
              Service activity models, applicant funnel conversions, territorial footprint, and service hour records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<DownloadSimple className="w-4 h-4" weight="bold" />}
              onClick={handleExportCSV}
            >
              Export CSV / Excel
            </Button>
            <Button
              variant="teal"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" weight="bold" />}
              onClick={handlePrint}
            >
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>

      {/* REPORT 1: Hours by Period */}
      <div className="rounded-[10px] bg-white p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3">
          <div>
            <span className="font-sans text-[13px] font-semibold text-role-manager block">
              Report 1 • Service trajectory
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
              Verified hours by period
            </h3>
          </div>
          <span className="font-sans text-[13px] font-semibold text-role-volunteer bg-canvas-subdued/50 px-2.5 py-1 rounded-[4px]">
            Total logged: 1,033.0 verified hours
          </span>
        </div>

        <p className="text-[13px] text-ink-secondary font-sans leading-relaxed">
          Cumulative service hours logged across the operating periods.
        </p>

        {/* Custom SVG Ridgeline Profile */}
        <div className="bg-canvas-subdued/30 rounded-[8px] p-4 overflow-hidden relative">
          <svg viewBox="0 0 800 240" className="w-full h-48 sm:h-60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ridgeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0E6266" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0E6266" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="40" y1="40" x2="760" y2="40" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
            <text x="765" y="44" fill="#64748B" fontSize="10">500h (Peak)</text>

            <line x1="40" y1="100" x2="760" y2="100" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
            <text x="765" y="104" fill="#64748B" fontSize="10">350h</text>

            <line x1="40" y1="160" x2="760" y2="160" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
            <text x="765" y="164" fill="#64748B" fontSize="10">200h</text>

            <line x1="40" y1="210" x2="760" y2="210" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Area fill under curve */}
            <path
              d="M 50 210 L 50 195 Q 160 175 220 170 T 400 110 T 600 45 L 750 35 L 750 210 Z"
              fill="url(#ridgeGradient)"
            />

            {/* Mountain Ridgeline Curve */}
            <path
              d="M 50 195 Q 160 175 220 170 T 400 110 T 600 45 L 750 35"
              fill="none"
              stroke="#0E6266"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Waypoint Peak Pins */}
            <circle cx="50" cy="195" r="4.5" fill="#FFFFFF" stroke="#0E6266" strokeWidth="3" />
            <text x="35" y="230" fill="#475569" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">JUL (Base)</text>

            <circle cx="220" cy="170" r="4.5" fill="#FFFFFF" stroke="#0E6266" strokeWidth="3" />
            <text x="200" y="155" fill="#0E6266" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">180.5h</text>
            <text x="205" y="230" fill="#475569" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">AUG</text>

            <circle cx="430" cy="100" r="5" fill="#FFFFFF" stroke="#0E6266" strokeWidth="3.5" />
            <text x="410" y="85" fill="#0E6266" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">340.0h</text>
            <text x="415" y="230" fill="#475569" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">SEP</text>

            <circle cx="650" cy="42" r="6" fill="#0E6266" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="615" y="26" fill="#0E6266" fontSize="12" fontFamily="JetBrains Mono" fontWeight="900">512.5h (PEAK)</text>
            <text x="635" y="230" fill="#0E6266" fontSize="11" fontFamily="JetBrains Mono" fontWeight="900">OCT (Now)</text>
          </svg>
        </div>
      </div>

      {/* REPORT 2 & 3: 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* REPORT 2: Application Funnel */}
        <div className="rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
          <div className="pb-2">
            <span className="font-sans text-[13px] font-semibold text-role-manager block">
              Report 2 • Admissions pipeline
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
              Application funnel (intake to activation)
            </h3>
          </div>

          <p className="text-[13px] text-ink-secondary leading-relaxed">
            Progress from initial platform registration to verified Telebirr fee activation.
          </p>

          <div className="space-y-3 font-mono text-[13px] pt-2">
            {[
              { label: 'Stage 1: Registered accounts', count: 48, pct: 100, note: 'Unique account signups', color: 'bg-ink-primary' },
              { label: 'Stage 2: Completed applications', count: 40, pct: 83, note: 'Submitted background details', color: 'bg-role-applicant' },
              { label: 'Stage 3: Accepted candidates', count: 32, pct: 67, note: 'Reviewed by admissions desk', color: 'bg-role-teamlead' },
              { label: 'Stage 4: Activated members', count: 28, pct: 58, note: 'Confirmed Telebirr & Member badge', color: 'bg-role-volunteer' },
            ].map((wp, idx) => (
              <div key={idx} className="p-3 rounded-[8px] bg-canvas-subdued/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-[13px] text-ink-primary">
                    {wp.label}
                  </span>
                  <span className="font-mono text-[13px] font-bold text-ink-primary">
                    {wp.count} ({wp.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-[4px] overflow-hidden">
                  <div className={`h-full ${wp.color} `} style={{ width: `${wp.pct}%` }} />
                </div>
                <span className="text-[13px] text-ink-tertiary block font-sans">
                  {wp.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* REPORT 3: Volunteers by Rank & Area */}
        <div className="rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
          <div className="pb-2">
            <span className="font-sans text-[13px] font-semibold text-role-manager block">
              Report 3 • Territorial footprint
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
              Volunteers by area & rank tier
            </h3>
          </div>

          <p className="text-[13px] text-ink-secondary leading-relaxed">
            Geographic concentration across the 5 Ethiopian regional corridors.
          </p>

          <div className="space-y-3 font-sans text-[13px] pt-2">
            {[
              { area: 'Addis Ababa (Central Area)', count: 24, pct: 57, ranks: '16 Members • 6 Seniors • 2 Leads' },
              { area: 'Adama (East Shewa Area)', count: 7, pct: 17, ranks: '5 Members • 1 Senior • 1 Lead' },
              { area: 'Bishoftu (Lakeside Environmental)', count: 5, pct: 12, ranks: '3 Members • 2 Seniors' },
              { area: 'Hawassa (Sidama Regional Corridor)', count: 4, pct: 9, ranks: '3 Members • 1 Senior' },
              { area: 'Bahir Dar (Tana Conservation)', count: 2, pct: 5, ranks: '2 Members' },
            ].map((reg) => (
              <div key={reg.area} className="p-3 rounded-[8px] bg-canvas-subdued/30 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-[13px] text-ink-primary">{reg.area}</span>
                  <span className="font-mono text-[13px] font-semibold text-role-manager">{reg.count} volunteers ({reg.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-white rounded-[4px] overflow-hidden">
                  <div className="h-full bg-role-manager" style={{ width: `${reg.pct}%` }} />
                </div>
                <span className="text-[13px] text-ink-tertiary block font-mono">
                  {reg.ranks}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REPORT 4 & 5: Activity Attendance & Top Volunteers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* REPORT 4: Activity Attendance */}
        <div className="rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
          <div className="pb-2">
            <span className="font-sans text-[13px] font-semibold text-role-manager block">
              Report 4 • Field turnout
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
              Activity attendance turnout rate
            </h3>
          </div>

          <p className="text-[13px] text-ink-secondary leading-relaxed">
            Attendance verification comparing enrolled capacity against actual check-ins.
          </p>

          <div className="space-y-3 font-sans text-[13px] pt-2">
            {[
              { title: 'Meskel Square Clean-up', cap: 20, turn: 19, pct: 95 },
              { title: 'Entoto Forest Ridge Cleanup', cap: 25, turn: 24, pct: 96 },
              { title: 'Bishoftu Lake Eco Trail Restoration', cap: 15, turn: 14, pct: 93 },
              { title: 'Hawassa Youth Health Outreach', cap: 12, turn: 11, pct: 92 },
              { title: 'Adama Youth Mentorship Session', cap: 18, turn: 16, pct: 89 },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-[8px] bg-canvas-subdued/30 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-[13px] text-ink-primary">{item.title}</span>
                  <span className="font-mono text-[13px] font-semibold text-role-volunteer">{item.pct}% ({item.turn}/{item.cap})</span>
                </div>
                <div className="w-full h-2 bg-white rounded-[4px] overflow-hidden">
                  <div className="h-full bg-role-volunteer" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REPORT 5: Top Volunteers */}
        <div className="rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
          <div className="pb-2">
            <span className="font-sans text-[13px] font-semibold text-role-manager block">
              Report 5 • Top contributors
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
              Top volunteers by service hours
            </h3>
          </div>

          <p className="text-[13px] text-ink-secondary leading-relaxed">
            Volunteers who have achieved highest verified service hours and leadership ratings.
          </p>

          <div className="rounded-[8px] bg-white overflow-hidden pt-1 space-y-2">
            {[
              { rankNum: 1, name: 'Yonas Kebede', role: 'Team Lead', hours: 192.5, acts: 24, rating: 4.9, area: 'Adama' },
              { rankNum: 2, name: 'Selam Alemu', role: 'Team Lead Candidate', hours: 168.0, acts: 22, rating: 4.9, area: 'Bishoftu' },
              { rankNum: 3, name: 'Biruk Tadesse', role: 'Senior Member', hours: 82.0, acts: 11, rating: 4.8, area: 'Addis Ababa' },
              { rankNum: 4, name: 'Almaz Fikre', role: 'Senior Member', hours: 74.5, acts: 9, rating: 4.7, area: 'Addis Ababa' },
              { rankNum: 5, name: 'Dawit Bekele', role: 'Member', hours: 36.5, acts: 5, rating: 4.8, area: 'Addis Ababa' },
            ].map((v) => (
              <div key={v.rankNum} className="p-3 flex items-center justify-between gap-3 text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold text-role-manager w-5 text-center">
                    #{v.rankNum}
                  </span>
                  <div>
                    <span className="font-semibold text-ink-primary text-sm block">
                      {v.name}
                    </span>
                    <span className="text-[13px] text-ink-tertiary font-mono">
                      {v.role} • {v.area}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-semibold text-ink-primary block leading-none">
                    {v.hours} hrs
                  </span>
                  <span className="text-[13px] text-role-applicant flex items-center justify-end gap-0.5 pt-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" weight="fill" />
                    <span>{v.rating} ({v.acts} shifts)</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
