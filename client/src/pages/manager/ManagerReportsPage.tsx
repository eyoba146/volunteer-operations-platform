import React, { useState } from 'react';
import { Button, StatusMark } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { DownloadSimple, Printer, ChartBar, UsersThree, Clock, Scroll } from '@phosphor-icons/react';

export const ManagerReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-10');
  const toast = useToast();

  const handleExport = (format: 'pdf' | 'csv') => {
    toast.success(`Export generated in ${format.toUpperCase()} format with active filters.`);
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            GOVERNANCE METRICS & ANALYTICS
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Program Reports & Intelligence
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Aggregated audit summaries for company leadership, municipal partners, and donor reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<DownloadSimple className="w-4 h-4" />}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => handleExport('pdf')}
          >
            Print PDF Report
          </Button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Volunteers by Area */}
        <div className="border border-border bg-canvas-raised p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
            Active Corps Distribution by City
          </h3>

          <div className="space-y-3 font-sans text-xs">
            {[
              { city: 'Addis Ababa (Bole, Kazanchis, Piassa, Lideta, Arada)', count: 24, percent: 58 },
              { city: 'Adama (East Shewa Hub)', count: 7, percent: 17 },
              { city: 'Bishoftu (Lakeside Environmental Outpost)', count: 5, percent: 12 },
              { city: 'Hawassa (Sidama Regional Corridor)', count: 4, percent: 9 },
              { city: 'Bahir Dar (Lake Tana Conservation Unit)', count: 2, percent: 4 },
            ].map((item) => (
              <div key={item.city} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-ink-primary">{item.city}</span>
                  <span className="font-mono font-bold text-ink-primary">{item.count} volunteers ({item.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-canvas-inset border border-border">
                  <div className="h-full bg-civic-green" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Funnel */}
        <div className="border border-border bg-canvas-raised p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
            Recruitment Funnel Conversion
          </h3>

          <div className="space-y-3 font-sans text-xs">
            {[
              { stage: '1. Registered Accounts', count: 42, pct: '100%' },
              { stage: '2. Applications Submitted', count: 35, pct: '83%' },
              { stage: '3. Manager Accepted', count: 28, pct: '66%' },
              { stage: '4. Telebirr Fee Confirmed (Activated)', count: 25, pct: '59%' },
              { stage: '5. Qualified to Senior Member', count: 8, pct: '19%' },
            ].map((step) => (
              <div key={step.stage} className="p-3 bg-canvas-subdued border border-border flex items-center justify-between">
                <span className="font-medium text-ink-primary">{step.stage}</span>
                <span className="font-mono font-bold text-ink-primary">{step.count} ({step.pct})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributing Volunteers */}
        <div className="md:col-span-2 border border-border bg-canvas-raised p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
            Honor Roll: Top Volunteer Contributors (Cumulative Service)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-canvas-subdued font-mono uppercase text-ink-tertiary">
                  <th className="p-3">Volunteer</th>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Operating Region</th>
                  <th className="p-3 text-right">Approved Service</th>
                  <th className="p-3 text-right">Activities</th>
                  <th className="p-3 text-right">Performance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                <tr>
                  <td className="p-3 font-bold text-ink-primary">Selam Alemu</td>
                  <td className="p-3"><StatusMark status="senior_member" size="sm" /></td>
                  <td className="p-3 text-ink-secondary">Bishoftu, Oromia</td>
                  <td className="p-3 font-mono font-bold text-civic-green text-right">168 hrs</td>
                  <td className="p-3 font-mono text-right">22</td>
                  <td className="p-3 font-mono text-right font-bold text-[#784E0B]">4.9 / 5.0</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink-primary">Yonas Kebede</td>
                  <td className="p-3"><StatusMark status="team_lead" size="sm" /></td>
                  <td className="p-3 text-ink-secondary">Adama, Oromia</td>
                  <td className="p-3 font-mono font-bold text-civic-green text-right">156 hrs</td>
                  <td className="p-3 font-mono text-right">21</td>
                  <td className="p-3 font-mono text-right font-bold text-[#784E0B]">4.6 / 5.0</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink-primary">Biruk Tadesse</td>
                  <td className="p-3"><StatusMark status="senior_member" size="sm" /></td>
                  <td className="p-3 text-ink-secondary">Hawassa, Sidama</td>
                  <td className="p-3 font-mono font-bold text-civic-green text-right">74 hrs</td>
                  <td className="p-3 font-mono text-right">10</td>
                  <td className="p-3 font-mono text-right font-bold text-[#784E0B]">4.8 / 5.0</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink-primary">Dawit Bekele</td>
                  <td className="p-3"><StatusMark status="member" size="sm" /></td>
                  <td className="p-3 text-ink-secondary">Kazanchis, Addis Ababa</td>
                  <td className="p-3 font-mono font-bold text-civic-green text-right">32 hrs</td>
                  <td className="p-3 font-mono text-right">5</td>
                  <td className="p-3 font-mono text-right font-bold text-[#784E0B]">4.5 / 5.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

