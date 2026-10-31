import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Input, Select, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  FloppyDisk, 
  Check, 
  Camera, 
  UploadSimple, 
  Trash, 
  IdentificationCard, 
  User, 
  ShieldCheck 
} from '@phosphor-icons/react';

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

const SAMPLE_PROFILE_PHOTOS = [
  {
    name: 'Sample Portrait A',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sample Portrait B',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sample Portrait C',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
];

const SAMPLE_ID_PHOTOS = [
  {
    name: 'National ID Card (Addis Ababa)',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80',
  },
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
  const [languages, setLanguages] = useState('Amharic, English');
  
  // Photos
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [idPhotoUrl, setIdPhotoUrl] = useState<string>('');

  // Skills & Schedule
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Community Outreach', 'First Aid']);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(['Saturday mornings']);

  // Motivation & Emergency
  const [motivation, setMotivation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRel, setContactRel] = useState('Parent');
  const [contactPhone, setContactPhone] = useState('+251 9');
  const [formError, setFormError] = useState('');

  // Auto-save storage key
  const storageKey = user ? `vts_app_draft_${user.id}` : 'vts_app_draft';

  useEffect(() => {
    const loadDraft = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // First check server store
        const app = await api.getMyApplication(user.id);
        const savedLocal = localStorage.getItem(storageKey);
        const localData = savedLocal ? JSON.parse(savedLocal) : null;

        const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
        const d = localData || app?.formData;
        if (d) {
          setFullName(d.fullName || userFullName);
          setPhone(d.phone || user.phone || '+251 9');
          setDateOfBirth(d.dateOfBirth || '2001-01-01');
          setArea(d.area || 'Bole, Addis Ababa');
          setLanguages(d.languages?.join(', ') || 'Amharic, English');
          setPhotoUrl(d.photoUrl || user.avatarUrl || '');
          setIdPhotoUrl(d.idPhotoUrl || '');
          setSelectedSkills(d.skills || ['Community Outreach']);
          setSelectedAvailability(d.availability || ['Saturday mornings']);
          setMotivation(d.motivation || '');
          if (d.emergencyContact) {
            setContactName(d.emergencyContact.name || '');
            setContactRel(d.emergencyContact.relationship || 'Parent');
            setContactPhone(d.emergencyContact.phone || '+251 9');
          }
        } else {
          setFullName(userFullName);
          if (user.phone) setPhone(user.phone);
          if (user.avatarUrl) setPhotoUrl(user.avatarUrl);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadDraft();
  }, [user, storageKey]);

  const constructFormData = () => ({
    fullName,
    phone,
    dateOfBirth,
    area,
    languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
    photoUrl,
    idPhotoUrl,
    skills: selectedSkills,
    availability: selectedAvailability,
    motivation,
    emergencyContact: {
      name: contactName,
      relationship: contactRel,
      phone: contactPhone,
    },
  });

  // Save to localStorage and store
  const handleSaveDraft = async () => {
    if (!user) return;
    setIsSaving(true);
    const data = constructFormData();
    localStorage.setItem(storageKey, JSON.stringify(data));
    try {
      await api.saveApplicationDraft(user.id, data);
      toast.info('Your application progress has been saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'photo' | 'id') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'photo') {
        setPhotoUrl(result);
        toast.success('Profile photo uploaded.');
      } else {
        setIdPhotoUrl(result);
        toast.success('ID document uploaded.');
      }
    };
    reader.readAsDataURL(file);
  };

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

    if (!motivation.trim()) {
      setFormError('Please provide a short statement about why you want to volunteer.');
      return;
    }

    setIsSaving(true);
    try {
      const data = constructFormData();
      await api.submitApplication(user.id, data);
      localStorage.removeItem(storageKey);
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
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton variant="text" className="h-10 w-1/3" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Personal & Region' },
    { num: 2, title: 'Photos (Optional)' },
    { num: 3, title: 'Skills & Schedule' },
    { num: 4, title: 'Motivation & Contact' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b-2 border-ink-primary pb-5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink-primary leading-none">
              Volunteer Application
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Step {currentStep} of 4 • Your progress saves automatically as you complete each section.
            </p>
          </div>
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
        </div>
      </div>

      {/* Step Waypoint Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-border pb-4">
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`text-left p-3 border transition-colors cursor-pointer ${
                isActive
                  ? 'border-ink-primary bg-white shadow-sm'
                  : isDone
                  ? 'border-role-volunteer bg-role-volunteerLight/50 text-role-volunteer'
                  : 'border-border bg-canvas-subdued/50 text-ink-tertiary hover:bg-canvas-subdued'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-black block leading-none">
                  0{s.num}
                </span>
                {isDone && <Check className="w-4 h-4 text-role-volunteer" weight="bold" />}
              </div>
              <span className="font-sans text-xs font-semibold block mt-1 truncate text-ink-primary">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {formError && (
        <div className="p-4 border-2 border-role-teamlead bg-role-teamleadLight text-role-teamlead text-xs leading-normal font-sans font-semibold">
          {formError}
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="border-2 border-ink-primary bg-white p-6 md:p-8 space-y-6 shadow-ticket"
      >
        {/* Step 1: Personal & Regional */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-border pb-3">
              <h2 className="font-display text-2xl font-black uppercase text-ink-primary">
                1. Personal Details & Service Area
              </h2>
              <p className="font-sans text-xs text-ink-secondary">
                Basic contact and location information for activity placement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Hana Tesfaye Wolde"
                hint="As it appears on your Kebele or National ID."
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
                hint="Where you plan to volunteer most often."
                required
              />
            </div>

            <Input
              label="Languages Spoken"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g. Amharic, English, Afaan Oromo"
              hint="List languages separated by commas."
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
                Next: Photo Uploads
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Photo & ID Uploads */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-border pb-3">
              <h2 className="font-display text-2xl font-black uppercase text-ink-primary">
                2. Photos & Identification (Optional)
              </h2>
              <p className="font-sans text-xs text-ink-secondary">
                Upload your profile picture for your volunteer ID pass and optional ID document.
              </p>
            </div>

            {/* Profile Photo */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink-primary">
                Volunteer Profile Headshot
              </label>
              <p className="text-xs text-ink-secondary">
                This image appears on your volunteer badge and roster check-in pass.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-border bg-canvas-subdued flex items-center justify-center shrink-0 overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-ink-tertiary" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-primary text-white text-xs font-semibold cursor-pointer hover:bg-black">
                      <UploadSimple className="w-4 h-4" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'photo')}
                      />
                    </label>

                    {photoUrl && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setPhotoUrl('')}
                        leftIcon={<Trash className="w-3.5 h-3.5" />}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Simulator Presets */}
                  <div className="pt-1">
                    <span className="text-[11px] font-sans text-ink-tertiary block">
                      Quick demo portraits:
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {SAMPLE_PROFILE_PHOTOS.map((p, idx) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setPhotoUrl(p.url)}
                          className="px-2 py-1 text-[11px] border border-border bg-canvas-subdued hover:bg-canvas-raised font-sans text-ink-secondary"
                        >
                          Sample {String.fromCharCode(65 + idx)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kebele / National ID Card */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-primary">
                    Kebele or National ID Card (Optional)
                  </label>
                  <p className="text-xs text-ink-secondary">
                    Visible strictly to Program Managers for identity verification. Never shared publicly.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-role-volunteer bg-role-volunteerLight px-2 py-0.5 border border-role-volunteer">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Private</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-32 h-20 border-2 border-dashed border-border bg-canvas-subdued flex items-center justify-center shrink-0 overflow-hidden">
                  {idPhotoUrl ? (
                    <img src={idPhotoUrl} alt="ID Document Preview" className="w-full h-full object-cover" />
                  ) : (
                    <IdentificationCard className="w-8 h-8 text-ink-tertiary" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-primary text-white text-xs font-semibold cursor-pointer hover:bg-black">
                      <UploadSimple className="w-4 h-4" />
                      <span>Upload ID Document</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'id')}
                      />
                    </label>

                    {idPhotoUrl && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setIdPhotoUrl('')}
                        leftIcon={<Trash className="w-3.5 h-3.5" />}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIdPhotoUrl(SAMPLE_ID_PHOTOS[0].url)}
                      className="px-2 py-1 text-[11px] border border-border bg-canvas-subdued hover:bg-canvas-raised font-sans text-ink-secondary"
                    >
                      Use Sample Kebele ID Card
                    </button>
                  </div>
                </div>
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
                Next: Skills & Schedule
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Skills & Availability */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-border pb-3">
              <h2 className="font-display text-2xl font-black uppercase text-ink-primary">
                3. Skills Offered & Availability
              </h2>
              <p className="font-sans text-xs text-ink-secondary">
                Select the activities and times that match your volunteering goals.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink-primary">
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
                      className={`text-left p-3 text-xs font-sans border transition-colors cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-ink-primary bg-canvas-inset font-bold text-ink-primary shadow-sm'
                          : 'border-border bg-canvas-subdued/50 hover:bg-canvas-subdued text-ink-secondary'
                      }`}
                    >
                      <span className="truncate">{skill}</span>
                      {isChecked && <Check className="w-4 h-4 text-role-volunteer shrink-0" weight="bold" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <label className="block text-xs font-bold text-ink-primary">
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
                      className={`text-left p-3 text-xs font-sans border transition-colors cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-ink-primary bg-canvas-inset font-bold text-ink-primary shadow-sm'
                          : 'border-border bg-canvas-subdued/50 hover:bg-canvas-subdued text-ink-secondary'
                      }`}
                    >
                      <span>{item}</span>
                      {isChecked && <Check className="w-4 h-4 text-role-volunteer shrink-0" weight="bold" />}
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
                onClick={() => setCurrentStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back: Photos
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(4)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Motivation & Contact
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Motivation & Emergency Contact */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-border pb-3">
              <h2 className="font-display text-2xl font-black uppercase text-ink-primary">
                4. Service Motivation & Emergency Contact
              </h2>
              <p className="font-sans text-xs text-ink-secondary">
                Tell us why you want to volunteer and who to call during field activities.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink-primary">
                Why do you wish to join the volunteer program?
              </label>
              <textarea
                rows={4}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Describe your motivation, community background, or causes you care about..."
                className="w-full bg-white text-ink-primary font-sans text-sm border-2 border-border p-3 focus:border-ink-primary outline-none"
                required
              />
            </div>

            <div className="space-y-4 pt-3 border-t border-border">
              <div>
                <h3 className="font-display text-xl font-black uppercase text-ink-primary">
                  Emergency Contact Details
                </h3>
                <p className="font-sans text-xs text-ink-secondary">
                  Contact person reachable in the event of any field incident.
                </p>
              </div>

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
                  placeholder="e.g. Parent, Spouse, Sibling"
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

            {/* Review Summary */}
            <div className="p-4 bg-canvas-subdued border border-border space-y-2 text-xs font-sans">
              <span className="font-bold text-ink-primary block">
                Submission Confirmation Summary:
              </span>
              <p className="text-ink-secondary">
                Submitting this application creates your candidate file in the Admissions queue. Once accepted by a Program Manager, you will receive an invitation to activate your membership with a one-time Telebirr registration fee of ETB 200.
              </p>
            </div>

            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCurrentStep(3)}
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
