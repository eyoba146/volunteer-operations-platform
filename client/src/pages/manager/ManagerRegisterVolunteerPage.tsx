import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { OrgUnit } from '../../types';
import { Button, Input, Select, Skeleton, TopoBackdrop } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { can } from '../../utils/permissions';
import {
  UserPlus,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  UploadSimple,
  ShieldCheck,
  Check,
  X,
  FileText,
  Buildings,
} from '@phosphor-icons/react';

const COMMON_SKILLS = [
  'Community Outreach',
  'First Aid',
  'Tree Planting',
  'Youth Mentorship',
  'Event Logistics',
  'Translation',
  'Digital Skills',
  'Teaching',
];

const AVAILABILITY_OPTIONS = [
  'Weekday mornings',
  'Weekday afternoons',
  'Weekend mornings',
  'Weekend afternoons',
  'Flexible',
];

const LANGUAGE_OPTIONS = ['Amharic', 'Oromo', 'Tigrigna', 'English', 'Somali'];

export const ManagerRegisterVolunteerPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    userName: string;
    email: string;
    phone: string;
    appId: string;
  } | null>(null);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2001-05-15');

  // Org Assignment
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');

  // Skills & Preferences
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Community Outreach']);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(['Weekend mornings']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Amharic', 'English']);
  const [motivation, setMotivation] = useState('Enthusiastic to serve local community through staff assisted registration.');

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Parent');
  const [emergencyPhone, setEmergencyPhone] = useState('+251 9');

  // Documents & Consent
  const [simulatedIdPhoto, setSimulatedIdPhoto] = useState(false);
  const [simulatedPersonalPhoto, setSimulatedPersonalPhoto] = useState(false);
  const [agreedToRegister, setAgreedToRegister] = useState(false);

  useEffect(() => {
    const loadUnits = async () => {
      setIsLoading(true);
      try {
        const units = await api.getOrgUnits();
        setOrgUnits(units);

        // Pre-fill manager's area / branch
        const defaultArea = units.find((u) => u.id === user?.areaId) || units.find((u) => u.type === 'area');
        if (defaultArea) {
          setSelectedAreaId(defaultArea.id);
          const defaultBranch = units.find((u) => u.parentId === defaultArea.id) || units.find((u) => u.type === 'branch');
          if (defaultBranch) {
            setSelectedBranchId(defaultBranch.id);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadUnits();
  }, [user]);

  // Derived available branches based on chosen area
  const availableAreas = orgUnits.filter((u) => u.type === 'area' && u.status === 'active');
  const availableBranches = orgUnits.filter(
    (u) => u.type === 'branch' && u.parentId === selectedAreaId && u.status === 'active'
  );

  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    const branches = orgUnits.filter((u) => u.type === 'branch' && u.parentId === areaId);
    if (branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    } else {
      setSelectedBranchId('');
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleAvailability = (item: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        toast.error('First name and last name are required');
        return false;
      }
      if (!phone.trim() || phone.trim().length < 10) {
        toast.error('A valid telephone number is required');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        toast.error('A valid email address is required');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!selectedAreaId || !selectedBranchId) {
        toast.error('Please assign both an operational area and a local branch');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (selectedSkills.length === 0) {
        toast.error('Please select at least one skill or area of interest');
        return false;
      }
      if (!emergencyName.trim() || !emergencyPhone.trim()) {
        toast.error('Emergency contact name and phone are required');
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!agreedToRegister) {
        toast.error('Confirmation of person agreement is mandatory');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const areaUnit = orgUnits.find((u) => u.id === selectedAreaId);
      const branchUnit = orgUnits.find((u) => u.id === selectedBranchId);

      const result = await api.registerVolunteerAssisted({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        dateOfBirth,
        areaId: selectedAreaId,
        areaName: areaUnit?.name || 'Addis Ababa',
        branchId: selectedBranchId,
        branchName: branchUnit?.name || 'Kirkos Branch',
        skills: selectedSkills,
        availability: selectedAvailability,
        languages: selectedLanguages,
        motivation: motivation.trim(),
        emergencyContact: {
          name: emergencyName.trim(),
          relationship: emergencyRelation,
          phone: emergencyPhone.trim(),
        },
        consentAgreed: agreedToRegister,
        photoUrl: simulatedPersonalPhoto ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' : undefined,
        idPhotoUrl: simulatedIdPhoto ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=250' : undefined,
      });

      setSubmittedResult({
        userName: `${firstName} ${lastName}`,
        email: email.trim(),
        phone: phone.trim(),
        appId: result.application.id,
      });
      toast.success(`Registered ${firstName} ${lastName}! Invitation sent.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to register volunteer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setSubmittedResult(null);
    setCurrentStep(1);
    setFirstName('');
    setLastName('');
    setPhone('+251 9');
    setEmail('');
    setSimulatedIdPhoto(false);
    setSimulatedPersonalPhoto(false);
    setAgreedToRegister(false);
  };

  // Permission check
  const isAllowed = can(user, 'volunteers', 'create');
  if (!isAllowed) {
    return (
      <div className="p-8 rounded-[16px] bg-[#F7F8FA] text-center space-y-4 max-w-lg mx-auto mt-12" data-page="manager-register-volunteer">
        <ShieldCheck className="w-12 h-12 text-[#D63927] mx-auto" />
        <h2 className="text-xl font-bold text-ink-primary">Access not permitted</h2>
        <p className="text-sm text-ink-secondary">
          Your account role does not have permission to register volunteers assisted by staff. Please contact an administrator.
        </p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Return to previous page
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6" data-page="manager-register-volunteer" data-signature="trail-grid">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-44" />
        <Skeleton variant="rect" className="h-80" />
      </div>
    );
  }

  // Success Moment Screen
  if (submittedResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 text-left py-6" data-page="manager-register-volunteer" data-signature="trail-grid">
        <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-role-volunteer/15 text-role-volunteer flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" weight="bold" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-bold text-2xl text-ink-primary">
              Volunteer registered successfully
            </h1>
            <p className="text-sm text-ink-secondary max-w-md mx-auto">
              <strong>{submittedResult.userName}</strong> has been registered with staff-assisted verification.
            </p>
          </div>

          <div className="p-4 rounded-[12px] bg-[#F7F8FA] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-ink-secondary">Applicant Name:</span>
              <span className="font-semibold text-ink-primary">{submittedResult.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Assigned Branch:</span>
              <span className="font-semibold text-ink-primary">
                {orgUnits.find((u) => u.id === selectedBranchId)?.name || 'Kirkos Branch'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Application Reference:</span>
              <span className="font-mono font-semibold text-ink-primary">{submittedResult.appId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Intake Source:</span>
              <span className="font-semibold text-role-manager">Staff-assisted ({user?.firstName} {user?.lastName})</span>
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-[#EBF5FB] text-left text-xs text-[#1B4F72] space-y-1">
            <p className="font-semibold">Next steps for activation:</p>
            <p>
              An invitation email and SMS have been dispatched to <strong>{submittedResult.email}</strong>. 
              The registration fee (ETB 200) can now be completed via Telebirr or recorded in Finance desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={handleRegisterAnother}
              className="w-full sm:w-auto"
            >
              Register another person
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/manager/applications')}
              className="w-full sm:w-auto bg-[#0E6266] hover:bg-[#09474A] text-white"
            >
              View in application queue
              <ArrowRight className="w-4 h-4 ml-2 inline-block" weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto" data-page="manager-register-volunteer" data-signature="trail-grid">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-6">
        <TopoBackdrop color="#0E6266" opacity={0.05} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink-primary">
              Register a volunteer (Staff-assisted)
            </h1>
            <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
              In-person intake form for candidates who need assisted registration. Creates an unverified profile and dispatches account invitation.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#E8F8F5] text-xs font-semibold text-[#0E6266]">
              <Buildings className="w-4 h-4" weight="bold" />
              <span>Assisted intake</span>
            </span>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="relative z-10 grid grid-cols-4 gap-2 pt-2">
          {[
            { num: 1, label: 'Personal' },
            { num: 2, label: 'Branch' },
            { num: 3, label: 'Skills' },
            { num: 4, label: 'Consent' },
          ].map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-[10px] text-center transition-all ${
                  isCurrent
                    ? 'bg-[#0E6266] text-white'
                    : isDone
                    ? 'bg-role-volunteer/15 text-role-volunteer'
                    : 'bg-[#F7F8FA] text-ink-tertiary'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider">
                  Step {s.num}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Step Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-[16px] bg-[#F7F8FA] space-y-6">
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-ink-primary">
              Step 1: Personal details
            </h2>
            <p className="text-xs text-ink-secondary">
              Enter official legal name and contact details matching government-issued identification.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  First name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Almaz, Yohannes"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Last name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tadesse, Bekele"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Telephone (Phone / Telebirr) *
                </label>
                <input
                  type="text"
                  placeholder="+251 91 100 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Email address *
                </label>
                <input
                  type="email"
                  placeholder="volunteer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Date of birth *
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Organisation & Branch Assignment */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-ink-primary">
              Step 2: Organisation and branch assignment
            </h2>
            <p className="text-xs text-ink-secondary">
              Assign the volunteer to their operational area and local community branch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Regional area *
                </label>
                <select
                  value={selectedAreaId}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                >
                  {availableAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Local branch *
                </label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                >
                  {availableBranches.length === 0 ? (
                    <option value="">No branches in this area</option>
                  ) : (
                    availableBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} ({branch.code})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="p-4 rounded-[12px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] text-xs text-ink-secondary space-y-1">
              <span className="font-semibold text-ink-primary">Boundary note:</span>
              <p>
                The volunteer will be rostered for community service activities hosted within this branch and regional area.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Skills, Availability & Emergency Contact */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-ink-primary">
              Step 3: Background, skills, and emergency contact
            </h2>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
                Service skills & interests *
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#0E6266] text-white'
                          : 'bg-white text-ink-secondary hover:bg-[#E8EBEF]'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
                General availability
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY_OPTIONS.map((item) => {
                  const isSelected = selectedAvailability.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAvailability(item)}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#111315] text-white'
                          : 'bg-white text-ink-secondary hover:bg-[#E8EBEF]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
                Languages spoken
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#111315] text-white'
                          : 'bg-white text-ink-secondary hover:bg-[#E8EBEF]'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider mb-3">
                Emergency contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Contact full name *"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-[10px] text-xs text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                    required
                  />
                </div>
                <div>
                  <select
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-[10px] text-xs text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Contact phone *"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-[10px] text-xs text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)] font-mono"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Document Verification & In-Person Agreement */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-ink-primary">
              Step 4: Identification verification and consent agreement
            </h2>
            <p className="text-xs text-ink-secondary">
              Confirm physical documentation presented by the volunteer and check mandatory consent.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ID Photo Simulation */}
              <div className="p-4 rounded-[12px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-primary">Kebele / National ID</span>
                  <button
                    type="button"
                    onClick={() => setSimulatedIdPhoto(!simulatedIdPhoto)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-[6px] transition-colors cursor-pointer ${
                      simulatedIdPhoto
                        ? 'bg-role-volunteer/15 text-role-volunteer'
                        : 'bg-[#F1F3F6] text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    {simulatedIdPhoto ? 'Verified (Attached)' : 'Attach simulated scan'}
                  </button>
                </div>
                <div className="h-24 rounded-[8px] bg-[#F7F8FA] flex flex-col items-center justify-center text-xs text-ink-tertiary">
                  <UploadSimple className="w-5 h-5 mb-1 text-ink-tertiary" />
                  <span>{simulatedIdPhoto ? 'ID document attached' : 'No document attached'}</span>
                </div>
              </div>

              {/* Personal Photo Simulation */}
              <div className="p-4 rounded-[12px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-primary">Passport-size Photo</span>
                  <button
                    type="button"
                    onClick={() => setSimulatedPersonalPhoto(!simulatedPersonalPhoto)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-[6px] transition-colors cursor-pointer ${
                      simulatedPersonalPhoto
                        ? 'bg-role-volunteer/15 text-role-volunteer'
                        : 'bg-[#F1F3F6] text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    {simulatedPersonalPhoto ? 'Verified (Attached)' : 'Attach simulated photo'}
                  </button>
                </div>
                <div className="h-24 rounded-[8px] bg-[#F7F8FA] flex flex-col items-center justify-center text-xs text-ink-tertiary">
                  <UploadSimple className="w-5 h-5 mb-1 text-ink-tertiary" />
                  <span>{simulatedPersonalPhoto ? 'Photo verified' : 'No photo attached'}</span>
                </div>
              </div>
            </div>

            {/* Mandatory Agreement Checkbox */}
            <div className="p-4 rounded-[12px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToRegister}
                  onChange={(e) => setAgreedToRegister(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-[#0E6266] focus:ring-[#0E6266] cursor-pointer"
                  required
                />
                <div className="text-xs text-ink-primary">
                  <span className="font-semibold block text-sm">
                    This person agreed to be registered
                  </span>
                  <span className="text-ink-secondary mt-0.5 block leading-relaxed">
                    I confirm that the applicant has physically requested registration, provided valid identification, and consented to the VTS Volunteer Corps service agreement and community standards.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Form Controls */}
        <div className="pt-4 flex items-center justify-between">
          {currentStep > 1 ? (
            <Button variant="secondary" onClick={handleBack} disabled={isSubmitting}>
              <ArrowLeft className="w-4 h-4 mr-1.5 inline-block" weight="bold" />
              Previous step
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              className="bg-[#0E6266] hover:bg-[#09474A] text-white"
            >
              Continue to step {currentStep + 1}
              <ArrowRight className="w-4 h-4 ml-1.5 inline-block" weight="bold" />
            </Button>
          ) : (
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || !agreedToRegister}
              className="bg-[#0E6266] hover:bg-[#09474A] text-white"
            >
              {isSubmitting ? 'Registering...' : 'Complete volunteer intake'}
              <Check className="w-4 h-4 ml-1.5 inline-block" weight="bold" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
