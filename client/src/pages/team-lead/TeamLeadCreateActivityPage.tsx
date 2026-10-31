import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { ActivityType, Rank } from '../../types';
import { Input, Select, Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { ArrowLeft, Plus, Warning } from '@phosphor-icons/react';

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'field_task', label: 'Field task (community service)' },
  { value: 'event', label: 'Event marshalling / coordination' },
  { value: 'project', label: 'Community special project' },
  { value: 'shift', label: 'Logistics shift' },
  { value: 'training', label: 'Orientation & training' },
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
  const [skills, setSkills] = useState('Logistics, Field safety');
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
        onClick={() => navigate('/team-lead/activities')}
        className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" weight="bold" />
        <span>Back to my activities</span>
      </button>

      {/* Header */}
      <div className="border-b border-[#D5DAE1] pb-4">
        <span className="font-sans text-[13px] font-semibold text-role-teamlead block">
          Assignment publisher
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
          Create volunteer activity
        </h1>
        <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
          Publish a new field assignment, set volunteer capacity, and generate an on-site check-in pin.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-6 shadow-sm"
      >
        {errorMessage && (
          <div className="p-3 border border-role-teamlead/30 rounded-[8px] bg-role-teamleadLight/20 text-role-teamlead text-[13px] font-sans font-medium flex items-center gap-2">
            <Warning className="w-4 h-4 shrink-0" weight="bold" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Activity title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Kazanchis Neighborhood Tree Planting"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Activity type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={ACTIVITY_TYPES}
              required
            />
            <Select
              label="City / community area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              options={AREA_OPTIONS}
              required
            />
          </div>

          <Input
            label="Specific location / venue"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="e.g. Kazanchis Youth Center Main Plaza"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start date & time"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
            />
            <Input
              label="End date & time"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Volunteer capacity (spots)"
              type="number"
              min="1"
              max="150"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
            <Select
              label="Minimum rank required"
              value={minRank}
              onChange={(e) => setMinRank(e.target.value)}
              options={[
                { value: 'none', label: 'Open to all volunteers' },
                { value: 'member', label: 'Member' },
                { value: 'senior_member', label: 'Senior member' },
              ]}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-medium text-ink-primary">
              Activity description & objective
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the mission goals, what volunteers will do, and what to bring..."
              className="w-full bg-white text-ink-primary font-sans text-[13px] border-[1.5px] border-[#475569] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-role-teamlead"
              required
            />
          </div>

          <Input
            label="Key skills required (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Field safety, logistics, first aid"
          />
        </div>

        <div className="pt-4 border-t border-[#D5DAE1] flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            leftIcon={<Plus className="w-4 h-4" weight="bold" />}
          >
            Publish activity roster
          </Button>
        </div>
      </form>
    </div>
  );
};
