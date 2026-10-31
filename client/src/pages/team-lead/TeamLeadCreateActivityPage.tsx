import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { ActivityType, Rank } from '../../types';
import { Input, Select, Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { ArrowLeft, Plus } from '@phosphor-icons/react';

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'field_task', label: 'Field Task (Community Service)' },
  { value: 'event', label: 'Civic Event / Marshalling' },
  { value: 'project', label: 'Special Project / Workshop' },
  { value: 'shift', label: 'Logistics / Clinic Shift' },
  { value: 'training', label: 'Qualification Training' },
];

const AREA_OPTIONS = [
  { value: 'Addis Ababa', label: 'Addis Ababa' },
  { value: 'Adama', label: 'Adama' },
  { value: 'Bishoftu', label: 'Bishoftu' },
  { value: 'Hawassa', label: 'Hawassa' },
  { value: 'Bahir Dar', label: 'Bahir Dar' },
];

export const TeamLeadCreateActivityPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('field_task');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('2026-11-15T09:00');
  const [endsAt, setEndsAt] = useState('2026-11-15T13:00');
  const [area, setArea] = useState('Addis Ababa');
  const [place, setPlace] = useState('');
  const [capacity, setCapacity] = useState('20');
  const [minRank, setMinRank] = useState<string>('none');
  const [skills, setSkills] = useState('Logistics, Field Safety');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) return;
    if (!title.trim() || !place.trim() || !description.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      await api.createActivity(
        {
          title: title.trim(),
          type,
          description: description.trim(),
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
          area,
          place: place.trim(),
          capacity: parseInt(capacity) || 15,
          minRank: minRank === 'none' ? undefined : (minRank as Rank),
          skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        },
        user.id,
        profile?.fullName || user.username
      );

      toast.success('New volunteer activity published and open for enrollment.');
      navigate('/team-lead/activities');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not create activity.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to my activities</span>
      </button>

      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          COMMUNITY ORGANIZING
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Create Volunteer Activity
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Publish a new field assignment, establish capacity, and generate an on-site check-in code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-border bg-canvas-raised p-6 md:p-8 space-y-6 shadow-subtle">
        {errorMessage && (
          <div className="p-3 border border-civic-rust bg-civic-rustLight text-civic-rust text-xs leading-normal font-sans">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Activity Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Kazanchis Neighborhood Community Tree Nursery"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Activity Type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={ACTIVITY_TYPES}
              required
            />
            <Select
              label="City / Operational Hub"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              options={AREA_OPTIONS}
              required
            />
          </div>

          <Input
            label="Specific Location / Venue"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="e.g. Kazanchis Park Gate 3, Kirkos Subcity"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
            />
            <Input
              label="End Date & Time"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Volunteer Capacity (Spots)"
              type="number"
              min="1"
              max="150"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
            <Select
              label="Minimum Required Rank"
              value={minRank}
              onChange={(e) => setMinRank(e.target.value)}
              options={[
                { value: 'none', label: 'Open to All Members' },
                { value: 'senior_member', label: 'Senior Member or Higher' },
                { value: 'team_lead', label: 'Team Lead Only' },
              ]}
            />
          </div>

          <Input
            label="Skills Needed (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. First Aid, Logistics, Construction Support"
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Detailed Description & Volunteer Instructions
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clear details on what volunteers will do, equipment provided, and check-in station location..."
              className="w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border border-border p-3 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/team-lead/activities')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Publish Activity
          </Button>
        </div>
      </form>
    </div>
  );
};

