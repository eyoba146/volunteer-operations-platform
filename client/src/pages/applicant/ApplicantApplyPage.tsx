import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Input, Select, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { ArrowLeft, ArrowRight, FloppyDisk, Check } from '@phosphor-icons/react';

const ETHIOPIAN_AREAS = [
  { value: 'Bole, Addis Ababa', label: 'Bole, Addis Ababa' },
  { value: 'Kazanchis, Addis Ababa', label: 'Kazanchis, Addis Ababa' },
  { value: 'Piassa, Addis Ababa', label: 'Piassa, Addis Ababa' },
  { value: 'Arada, Addis Ababa', label: 'Arada, Addis Ababa' },
  { value: 'Lideta, Addis Ababa', label: 'Lideta, Addis Ababa' },
  { value: 'Yeka, Addis Ababa', label: 'Yeka, Addis Ababa' },
  { value: 'Adama, Oromia', label: 'Adama, Oromia' },
  { value: 'Bishoftu, Oromia', label: 'Bishoftu, Oromia' },
  { value: 'Hawassa, Sidama', label: 'Hawassa, Sidama' },
  { value: 'Bahir Dar, Amhara', label: 'Bahir Dar, Amhara' },
];

const SKILLS_LIST = [
  'First Aid',
  'Community Outreach',
  'Event Coordination',
  'Documentation',
  'Logistics',
  'Teaching',
  'Health Education',
  'Tree Planting',
  'Carpentry',
  'IT Support',
  'Childcare',
  'Field Safety',
];

const AVAILABILITY_OPTIONS = [
  'Saturday mornings',
  'Sunday afternoons',
  'Weekday evenings',
  'Full weekends',
  'Flexible emergency response',
];

export const ApplicantApplyPage: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [dateOfBirth, setDateOfBirth] = useState('2001-01-01');
  const [area, setArea] = useState('Bole, Addis Ababa');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Community Outreach', 'First Aid']);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(['Saturday mornings']);
  const [motivation, setMotivation] = useState('');
  const [languages, setLanguages] = useState('Amharic, English');
  const [contactName, setContactName] = useState('');
  const [contactRel, setContactRel] = useState('Parent');
  const [contactPhone, setContactPhone] = useState('+251 9');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const loadDraft = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const app = await api.getMyApplication(user.id);
        if (app?.formData) {
          const d = app.formData;
          setFullName(d.fullName || '');
          setPhone(d.phone || '+251 9');
          setDateOfBirth(d.dateOfBirth || '2001-01-01');
          setArea(d.area || 'Bole, Addis Ababa');
          setSelectedSkills(d.skills || []);
          setSelectedAvailability(d.availability || []);
          setMotivation(d.motivation || '');
          setLanguages(d.languages?.join(', ') || 'Amharic, English');
          if (d.emergencyContact) {
            setContactName(d.emergencyContact.name || '');
            setContactRel(d.emergencyContact.relationship || 'Parent');
            setContactPhone(d.emergencyContact.phone || '+251 9');
          }
        } else {
          setFullName(user.username);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadDraft();
  }, [user]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleAvailability = (item: string) => {
    if (selectedAvailability.includes(item)) {
      setSelectedAvailability(selectedAvailability.filter((a) => a !== item));
    } else {
      setSelectedAvailability([...selectedAvailability, item]);
    }
  };

  const constructFormData = () => ({
    fullName,
    phone,
    dateOfBirth,
    area,
    skills: selectedSkills,
    availability: selectedAvailability,
    motivation,
    languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
    emergencyContact: {
      name: contactName,
      relationship: contactRel,
      phone: contactPhone,
    },
  });

  const handleSaveDraft = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await api.saveApplicationDraft(user.id, constructFormData());
      toast.info('Your application progress has been saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!user) return;

    // Age validation (must be 18 or older as per A7)
    const birthYear = new Date(dateOfBirth).getFullYear();
    const currentYear = 2026;
    if (currentYear - birthYear < 18) {
      setFormError('Volunteers must be 18 years of age or older to participate.');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !contactName.trim() || !contactPhone.trim()) {
      setFormError('Please fill all required personal and emergency contact fields.');
      return;
    }

    if (selectedSkills.length === 0) {
      setFormError('Please select at least one skill or interest.');
      return;
    }

    setIsSaving(true);
    try {
      await api.submitApplication(user.id, constructFormData());
      toast.success('Your volunteer application has been submitted for review!');
      navigate('/applicant/status');
    } catch (err: any) {
      setFormError(err.message || 'We could not submit your application.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          VOLUNTEER ENROLLMENT FORM
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Volunteer Application
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Step {currentStep} of 3 • Take your time; your progress saves automatically.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-3 gap-2 border-b border-border pb-4">
        {[
          { num: 1, label: 'Personal & Regional' },
          { num: 2, label: 'Skills & Schedule' },
          { num: 3, label: 'Motivation & Contact' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setCurrentStep(s.num)}
            className={`text-left p-3 border transition-colors cursor-pointer ${
              currentStep === s.num
                ? 'border-ink-primary bg-canvas-raised font-bold text-ink-primary'
                : currentStep > s.num
                ? 'border-border bg-canvas-subdued text-civic-green'
                : 'border-border/60 bg-canvas-subdued/40 text-ink-tertiary'
            }`}
          >
            <span className="font-mono text-xs block">
              [ 0{s.num} ] {currentStep > s.num && '✓'}
            </span>
            <span className="text-xs truncate block">{s.label}</span>
          </button>
        ))}
      </div>

      {formError && (
        <div className="p-3 border border-civic-rust bg-civic-rustLight text-civic-rust text-xs leading-normal font-sans">
          {formError}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="border border-border bg-canvas-raised p-6 md:p-8 space-y-6 shadow-subtle">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
              1. Personal Identification & Service Area
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Hana Tesfaye Wolde"
                hint="As it appears on your kebele or national ID card."
                required
              />

              <Input
                label="Primary Mobile Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 91 123 4567"
                hint="Used for activity check-in codes and Telebirr."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                hint="Volunteers must be 18 years or older."
                required
              />

              <Select
                label="Primary Service Region / Subcity"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                options={ETHIOPIAN_AREAS}
                hint="Where you plan to attend activities most often."
                required
              />
            </div>

            <Input
              label="Languages Spoken"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g. Amharic, English, Afaan Oromo"
              hint="Comma separated list."
            />

            <div className="pt-4 flex items-center justify-between border-t border-border">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSaveDraft}
                isLoading={isSaving}
                leftIcon={<FloppyDisk className="w-4 h-4" />}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Skills & Schedule
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
              2. Skills Offered & Availability
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Select Your Skills & Capacities (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SKILLS_LIST.map((skill) => {
                  const isChecked = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-left p-2.5 text-xs font-sans border transition-colors cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-ink-primary bg-canvas-inset font-semibold text-ink-primary'
                          : 'border-border bg-canvas-subdued/50 hover:bg-canvas-subdued text-ink-secondary'
                      }`}
                    >
                      <span className="truncate">{skill}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-civic-green shrink-0" weight="bold" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-border">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Typical Availability Windows
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABILITY_OPTIONS.map((item) => {
                  const isChecked = selectedAvailability.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAvailability(item)}
                      className={`text-left p-2.5 text-xs font-sans border transition-colors cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-ink-primary bg-canvas-inset font-semibold text-ink-primary'
                          : 'border-border bg-canvas-subdued/50 hover:bg-canvas-subdued text-ink-secondary'
                      }`}
                    >
                      <span>{item}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-civic-green shrink-0" weight="bold" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCurrentStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back: Personal Details
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(3)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Motivation & Contact
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
              3. Service Motivation & Emergency Contact
            </h3>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Why do you wish to join the VTS Volunteer Corps?
              </label>
              <textarea
                rows={4}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Describe your motivation, community background, or causes you care about..."
                className="w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border border-border p-3 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
                required
              />
            </div>

            <div className="space-y-4 pt-2 border-t border-border">
              <h4 className="font-serif text-base font-semibold text-ink-primary">
                Emergency Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Contact Person Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Tesfaye Wolde"
                  required
                />
                <Input
                  label="Relationship"
                  value={contactRel}
                  onChange={(e) => setContactRel(e.target.value)}
                  placeholder="e.g. Father, Spouse, Sister"
                  required
                />
                <Input
                  label="Emergency Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+251 91 765 4321"
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCurrentStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back: Skills
              </Button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveDraft}
                  isLoading={isSaving}
                  leftIcon={<FloppyDisk className="w-4 h-4" />}
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Send My Application
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
